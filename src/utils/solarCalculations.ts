
import { centralSubsidyRates, stateSubsidies, solarIrradiance, stateTariffs, rooftopCostMultiplier, panelAreaByRoofType } from './solarSubsidyData';
import { SolarCalculationResult } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export interface CalculationInputs {
  monthlyBill: number;
  rooftopArea: number;
  location: string;
  shadingLevel: number;
  electricityRate: number;
  rooftopType: string;
  dailyPowerCuts: string;
}

const PANEL_WATTAGE = 0.4; // 400W panels in kW
const SYSTEM_EFFICIENCY = 0.85;
const DEGRADATION_RATE = 0.005; // 0.5% per year
const ESCALATION_RATE = 0.05; // 5% electricity price increase per year
const CO2_FACTOR = 0.82; // kg CO2 per kWh displaced
const SYSTEM_LIFETIME = 25;

export const calculateSolarSystem = async (inputs: CalculationInputs): Promise<SolarCalculationResult> => {
  const { monthlyBill, rooftopArea, location, shadingLevel, electricityRate, rooftopType, dailyPowerCuts } = inputs;

  // Use user-provided electricity rate (or state default)
  const tariff = electricityRate || stateTariffs[location] || 5.5;

  // Monthly consumption in kWh
  const monthlyConsumption = monthlyBill / tariff;
  const dailyConsumption = monthlyConsumption / 30;

  // Solar irradiance for location
  const irradiance = solarIrradiance[location] || 5.2;

  // Shading & efficiency
  const shadingFactor = (100 - shadingLevel) / 100;

  // Required system size (kW)
  let systemSize = Math.round((dailyConsumption / (irradiance * shadingFactor * SYSTEM_EFFICIENCY)) * 100) / 100;

  // Cap system size by available rooftop area
  const sqFtPerPanel = panelAreaByRoofType[rooftopType] || 20;
  const maxPanels = Math.floor(rooftopArea / sqFtPerPanel);
  const maxSystemSize = maxPanels * PANEL_WATTAGE;

  const wasCapped = systemSize > maxSystemSize;
  if (wasCapped) {
    systemSize = Math.round(maxSystemSize * 100) / 100;
  }

  // Panels
  const panels = Math.ceil(systemSize / PANEL_WATTAGE);
  const requiredArea = panels * sqFtPerPanel;

  // Capacity utilization (% of roof used)
  const capacityUtilization = Math.round((requiredArea / rooftopArea) * 100);

  // System type based on power cuts, not roof area
  let systemType = 'Grid-tied';
  if (dailyPowerCuts === '3-4' || dailyPowerCuts === '5+') {
    systemType = 'Grid-tied with Battery Backup';
  } else if (dailyPowerCuts === '1-2') {
    systemType = 'Grid-tied (Battery Optional)';
  }

  // Cost calculation with rooftop type multiplier
  const baseCostPerWatt = systemType.includes('Battery Backup') ? 70 : 55;
  const costMultiplier = rooftopCostMultiplier[rooftopType] || 1.0;
  const totalCost = Math.round(systemSize * 1000 * baseCostPerWatt * costMultiplier);

  // Central Government Subsidy (MNRE)
  let centralSubsidy = 0;
  if (systemSize <= 3) {
    centralSubsidy = systemSize * centralSubsidyRates.upTo3kW;
  } else {
    centralSubsidy = (3 * centralSubsidyRates.upTo3kW) + ((systemSize - 3) * centralSubsidyRates.above3kW);
  }
  centralSubsidy = Math.min(Math.round(centralSubsidy), 78000);

  // State Subsidy
  const stateSubsidyInfo = stateSubsidies[location as keyof typeof stateSubsidies] || stateSubsidies['Other'];
  let stateSubsidy = 0;
  if (stateSubsidyInfo.rate > 0) {
    stateSubsidy = Math.min(Math.round(totalCost * stateSubsidyInfo.rate), stateSubsidyInfo.maxAmount);
  }

  const totalSubsidy = centralSubsidy + stateSubsidy;
  const finalCost = totalCost - totalSubsidy;

  // Annual energy generation (kWh) — year 1
  const annualGeneration = Math.round(systemSize * irradiance * 365 * shadingFactor * SYSTEM_EFFICIENCY);

  // Year-1 monthly savings
  const monthlySavings = Math.round(Math.min(monthlyBill * 0.85, (annualGeneration / 12) * tariff));

  // 25-year lifetime savings with degradation & tariff escalation
  let lifetimeSavings = 0;
  let cumulativeSavings = 0;
  let paybackYear = SYSTEM_LIFETIME; // default if never pays back

  for (let year = 1; year <= SYSTEM_LIFETIME; year++) {
    const degradationFactor = Math.pow(1 - DEGRADATION_RATE, year - 1);
    const yearGeneration = annualGeneration * degradationFactor;
    const yearTariff = tariff * Math.pow(1 + ESCALATION_RATE, year - 1);
    const yearSavings = yearGeneration * yearTariff;
    lifetimeSavings += yearSavings;
    cumulativeSavings += yearSavings;

    if (cumulativeSavings >= finalCost && paybackYear === SYSTEM_LIFETIME) {
      // Interpolate for fractional year
      const prevCumulative = cumulativeSavings - yearSavings;
      const remaining = finalCost - prevCumulative;
      paybackYear = Math.round(((year - 1) + remaining / yearSavings) * 10) / 10;
    }
  }

  const lifetimeSavings25yr = Math.round(lifetimeSavings);
  const paybackPeriod = paybackYear;

  // CO2 offset (tonnes per year, year 1)
  const co2OffsetPerYear = Math.round((annualGeneration * CO2_FACTOR) / 1000 * 10) / 10;

  // Optional AI enhancement
  try {
    const { data: aiData } = await supabase.functions.invoke('solar-analysis', {
      body: {
        calculationResult: {
          systemSize, estimatedCost: totalCost, centralSubsidy, stateSubsidy,
          totalSubsidy, finalCost, monthlySavings, paybackPeriod,
          rooftopArea: requiredArea, systemType, panels,
          annualGeneration, lifetimeSavings25yr, co2OffsetPerYear, capacityUtilization
        },
        location, monthlyBill, rooftopArea, shadingLevel
      }
    });
    if (aiData?.analysis) {
      console.log('Enhanced calculations with AI insights');
    }
  } catch (error) {
    console.warn('AI enhancement failed, using standard calculations:', error);
  }

  return {
    systemSize,
    estimatedCost: totalCost,
    centralSubsidy,
    stateSubsidy,
    totalSubsidy,
    finalCost,
    monthlySavings,
    paybackPeriod,
    rooftopArea: requiredArea,
    systemType,
    panels,
    annualGeneration,
    lifetimeSavings25yr,
    co2OffsetPerYear,
    capacityUtilization
  };
};
