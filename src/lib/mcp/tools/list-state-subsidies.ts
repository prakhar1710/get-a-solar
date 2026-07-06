import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { stateSubsidies } from "@/utils/solarSubsidyData";

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
