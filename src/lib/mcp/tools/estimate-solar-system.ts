import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const centralSubsidyRates = { upTo3kW: 14588, above3kW: 7294 };

const stateSubsidies: Record<string, { rate: number; maxAmount: number }> = {
  'Andhra Pradesh': { rate: 0.30, maxAmount: 20000 },
  'Assam': { rate: 0.30, maxAmount: 30000 },
  'Bihar': { rate: 0.50, maxAmount: 75000 },
  'Chhattisgarh': { rate: 0.20, maxAmount: 20000 },
  'Delhi': { rate: 0.20, maxAmount: 30000 },
  'Gujarat': { rate: 0.50, maxAmount: 20000 },
  'Haryana': { rate: 0.40, maxAmount: 40000 },
  'Himachal Pradesh': { rate: 0.30, maxAmount: 10000 },
  'Jharkhand': { rate: 0.50, maxAmount: 75000 },
  'Karnataka': { rate: 0.20, maxAmount: 20000 },
  'Kerala': { rate: 0.30, maxAmount: 15000 },
  'Madhya Pradesh': { rate: 0.30, maxAmount: 30000 },
  'Maharashtra': { rate: 0.25, maxAmount: 25000 },
  'Odisha': { rate: 0.30, maxAmount: 30000 },
  'Punjab': { rate: 0.30, maxAmount: 30000 },
  'Rajasthan': { rate: 0.30, maxAmount: 30000 },
  'Tamil Nadu': { rate: 0.25, maxAmount: 20000 },
  'Telangana': { rate: 0.20, maxAmount: 20000 },
  'Uttar Pradesh': { rate: 0.15, maxAmount: 30000 },
  'Uttarakhand': { rate: 0.40, maxAmount: 40000 },
  'West Bengal': { rate: 0.30, maxAmount: 30000 },
  'Other': { rate: 0.00, maxAmount: 0 },
};

const solarIrradiance: Record<string, number> = {
  'Andhra Pradesh': 5.7, 'Assam': 4.5, 'Bihar': 5.0, 'Chhattisgarh': 5.5,
  'Delhi': 5.2, 'Gujarat': 6.0, 'Haryana': 5.4, 'Himachal Pradesh': 4.8,
  'Jharkhand': 5.2, 'Karnataka': 5.8, 'Kerala': 5.0, 'Madhya Pradesh': 5.6,
  'Maharashtra': 5.5, 'Odisha': 5.3, 'Punjab': 5.1, 'Rajasthan': 6.5,
  'Tamil Nadu': 5.5, 'Telangana': 5.6, 'Uttar Pradesh': 5.0, 'Uttarakhand': 5.3,
  'West Bengal': 4.8, 'Other': 5.2,
};

const stateTariffs: Record<string, number> = {
  'Andhra Pradesh': 5.5, 'Assam': 5.8, 'Bihar': 5.0, 'Chhattisgarh': 4.5,
  'Delhi': 5.0, 'Gujarat': 4.5, 'Haryana': 6.0, 'Himachal Pradesh': 4.0,
  'Jharkhand': 5.5, 'Karnataka': 6.5, 'Kerala': 5.5, 'Madhya Pradesh': 6.0,
  'Maharashtra': 8.0, 'Odisha': 5.0, 'Punjab': 5.5, 'Rajasthan': 7.0,
  'Tamil Nadu': 4.5, 'Telangana': 6.0, 'Uttar Pradesh': 5.5, 'Uttarakhand': 4.5,
  'West Bengal': 6.5, 'Other': 5.5,
};

const PANEL_WATTAGE = 0.4;
const SYSTEM_EFFICIENCY = 0.85;

export default defineTool({
  name: "estimate_solar_system",
  title: "Estimate rooftop solar system",
  description:
    "Quick estimate of solar system size (kW), cost, central + state subsidy, and year-1 monthly savings for a household in India.",
  inputSchema: {
    monthly_bill_inr: z
      .number()
      .positive()
      .describe("Average monthly electricity bill in INR."),
    state: z.string().describe("Indian state (e.g. 'Karnataka'). Use 'Other' if unknown."),
    shading_percent: z
      .number()
      .min(0)
      .max(100)
      .default(10)
      .describe("Estimated rooftop shading percentage (0-100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ monthly_bill_inr, state, shading_percent }) => {
    const tariff = stateTariffs[state] ?? stateTariffs["Other"];
    const irradiance = solarIrradiance[state] ?? solarIrradiance["Other"];
    const shadingFactor = (100 - shading_percent) / 100;

    const monthlyConsumption = monthly_bill_inr / tariff;
    const dailyConsumption = monthlyConsumption / 30;
    const systemSize =
      Math.round((dailyConsumption / (irradiance * shadingFactor * SYSTEM_EFFICIENCY)) * 100) / 100;

    const panels = Math.ceil(systemSize / PANEL_WATTAGE);
    const totalCost = Math.round(systemSize * 1000 * 55);

    let centralSubsidy =
      systemSize <= 3
        ? systemSize * centralSubsidyRates.upTo3kW
        : 3 * centralSubsidyRates.upTo3kW +
          (systemSize - 3) * centralSubsidyRates.above3kW;
    centralSubsidy = Math.min(Math.round(centralSubsidy), 78000);

    const stateInfo = stateSubsidies[state] ?? stateSubsidies["Other"];
    const stateSubsidy =
      stateInfo.rate > 0
        ? Math.min(Math.round(totalCost * stateInfo.rate), stateInfo.maxAmount)
        : 0;

    const finalCost = totalCost - centralSubsidy - stateSubsidy;
    const annualGeneration = Math.round(
      systemSize * irradiance * 365 * shadingFactor * SYSTEM_EFFICIENCY,
    );
    const monthlySavings = Math.round(
      Math.min(monthly_bill_inr * 0.85, (annualGeneration / 12) * tariff),
    );

    const result = {
      system_size_kw: systemSize,
      panels,
      estimated_cost_inr: totalCost,
      central_subsidy_inr: centralSubsidy,
      state_subsidy_inr: stateSubsidy,
      final_cost_inr: finalCost,
      annual_generation_kwh: annualGeneration,
      monthly_savings_inr: monthlySavings,
      assumed_tariff_inr_per_kwh: tariff,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
