import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import {
  centralSubsidyRates,
  solarIrradiance,
  stateSubsidies,
  stateTariffs,
} from "@/utils/solarSubsidyData";

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
    const baseCostPerWatt = 55;
    const totalCost = Math.round(systemSize * 1000 * baseCostPerWatt);

    let centralSubsidy =
      systemSize <= 3
        ? systemSize * centralSubsidyRates.upTo3kW
        : 3 * centralSubsidyRates.upTo3kW +
          (systemSize - 3) * centralSubsidyRates.above3kW;
    centralSubsidy = Math.min(Math.round(centralSubsidy), 78000);

    const stateInfo =
      stateSubsidies[state as keyof typeof stateSubsidies] ?? stateSubsidies["Other"];
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
