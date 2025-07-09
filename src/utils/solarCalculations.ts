
import { centralSubsidyRates, stateSubsidies, solarIrradiance } from './solarSubsidyData';
import { SolarCalculationResult } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export interface CalculationInputs {
  monthlyBill: number;
  rooftopArea: number;
  location: string;
  shadingLevel: number;
}

export const calculateSolarSystem = async (inputs: CalculationInputs): Promise<SolarCalculationResult> => {
  const { monthlyBill, rooftopArea, location, shadingLevel } = inputs;
  
  // Calculate daily energy consumption (kWh)
  const averageUnitsPerMonth = monthlyBill / 6; // Assuming ₹6 per unit
  const dailyConsumption = averageUnitsPerMonth / 30;
  
  // Get solar irradiance for the location
  const irradiance = solarIrradiance[location as keyof typeof solarIrradiance] || 5.2;
  
  // Account for shading and efficiency losses
  const shadingFactor = (100 - shadingLevel) / 100;
  const systemEfficiency = 0.85; // 85% system efficiency
  
  // Calculate required system size (kW)
  const systemSize = Math.round((dailyConsumption / (irradiance * shadingFactor * systemEfficiency)) * 100) / 100;
  
  // Calculate number of panels (assuming 400W panels)
  const panelWattage = 0.4; // 400W panels
  const panels = Math.ceil(systemSize / panelWattage);
  
  // Calculate required rooftop area (assuming 20 sq ft per panel)
  const requiredArea = panels * 20;
  
  // Determine system type based on rooftop area availability
  let systemType = 'Grid-tied';
  if (requiredArea > rooftopArea * 0.8) {
    systemType = 'Grid-tied with Battery Backup';
  }
  
  // Cost calculation (₹50-70 per watt depending on system type)
  const costPerWatt = systemType.includes('Battery') ? 70 : 55;
  const totalCost = systemSize * 1000 * costPerWatt;
  
  // Calculate Central Government Subsidy (MNRE)
  let centralSubsidy = 0;
  if (systemSize <= 3) {
    centralSubsidy = systemSize * centralSubsidyRates.upTo3kW;
  } else {
    centralSubsidy = (3 * centralSubsidyRates.upTo3kW) + ((systemSize - 3) * centralSubsidyRates.above3kW);
  }
  // Cap central subsidy at ₹78,000 for residential systems
  centralSubsidy = Math.min(centralSubsidy, 78000);
  
  // Calculate State Subsidy
  const stateSubsidyInfo = stateSubsidies[location as keyof typeof stateSubsidies] || stateSubsidies['Other'];
  let stateSubsidy = 0;
  if (stateSubsidyInfo.rate > 0) {
    stateSubsidy = Math.min(totalCost * stateSubsidyInfo.rate, stateSubsidyInfo.maxAmount);
  }
  
  const totalSubsidy = centralSubsidy + stateSubsidy;
  const finalCost = totalCost - totalSubsidy;
  
  // Calculate savings and payback
  let monthlySavings = Math.min(monthlyBill * 0.8, averageUnitsPerMonth * 6); // 80% bill reduction max
  let paybackPeriod = Math.round((finalCost / (monthlySavings * 12)) * 10) / 10;
  
  // Get AI-enhanced calculations from Gemini
  try {
    const { data: aiData } = await supabase.functions.invoke('solar-analysis', {
      body: {
        calculationResult: {
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
          panels
        },
        location,
        monthlyBill,
        rooftopArea,
        shadingLevel
      }
    });
    
    // If AI provides better calculations, use those
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
    panels
  };
};
