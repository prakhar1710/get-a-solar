import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const stateSubsidies: Record<string, { rate: number; maxAmount: number; description: string }> = {
  'Andhra Pradesh': { rate: 0.30, maxAmount: 20000, description: '30% up to ₹20,000' },
  'Assam': { rate: 0.30, maxAmount: 30000, description: '30% up to ₹30,000' },
  'Bihar': { rate: 0.50, maxAmount: 75000, description: '50% up to ₹75,000' },
  'Chhattisgarh': { rate: 0.20, maxAmount: 20000, description: '20% up to ₹20,000' },
  'Delhi': { rate: 0.20, maxAmount: 30000, description: '₹2,000 per kW up to ₹30,000' },
  'Gujarat': { rate: 0.50, maxAmount: 20000, description: '₹10,000 per kW up to 2kW' },
  'Haryana': { rate: 0.40, maxAmount: 40000, description: '40% up to ₹40,000' },
  'Himachal Pradesh': { rate: 0.30, maxAmount: 10000, description: '30% up to ₹10,000' },
  'Jharkhand': { rate: 0.50, maxAmount: 75000, description: '50% up to ₹75,000' },
  'Karnataka': { rate: 0.20, maxAmount: 20000, description: '20% up to ₹20,000' },
  'Kerala': { rate: 0.30, maxAmount: 15000, description: '30% up to ₹15,000' },
  'Madhya Pradesh': { rate: 0.30, maxAmount: 30000, description: '30% up to ₹30,000' },
  'Maharashtra': { rate: 0.25, maxAmount: 25000, description: '₹10,000 per kW up to 2.5kW' },
  'Odisha': { rate: 0.30, maxAmount: 30000, description: '30% up to ₹30,000' },
  'Punjab': { rate: 0.30, maxAmount: 30000, description: '30% up to ₹30,000' },
  'Rajasthan': { rate: 0.30, maxAmount: 30000, description: '30% up to ₹30,000' },
  'Tamil Nadu': { rate: 0.25, maxAmount: 20000, description: '25% up to ₹20,000' },
  'Telangana': { rate: 0.20, maxAmount: 20000, description: '20% up to ₹20,000' },
  'Uttar Pradesh': { rate: 0.15, maxAmount: 30000, description: '₹15,000 per kW up to 2kW' },
  'Uttarakhand': { rate: 0.40, maxAmount: 40000, description: '40% up to ₹40,000' },
  'West Bengal': { rate: 0.30, maxAmount: 30000, description: '30% up to ₹30,000' },
};

export default defineTool({
  name: "list_state_subsidies",
  title: "List Indian state solar subsidies",
  description:
    "List rooftop-solar subsidy rates and caps for Indian states supported by Get A Solar. Optionally filter to one state.",
  inputSchema: {
    state: z
      .string()
      .optional()
      .describe("Optional Indian state name (e.g. 'Karnataka'). Omit for all states."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ state }) => {
    const entries = Object.entries(stateSubsidies).map(([name, info]) => ({
      state: name,
      rate_percent: Math.round(info.rate * 100),
      max_amount_inr: info.maxAmount,
      description: info.description,
    }));

    const results = state
      ? entries.filter((e) => e.state.toLowerCase() === state.toLowerCase())
      : entries;

    if (state && results.length === 0) {
      return {
        content: [{ type: "text", text: `No subsidy info found for state: ${state}` }],
        isError: true,
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      structuredContent: { subsidies: results },
    };
  },
});
