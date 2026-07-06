import { defineMcp } from "@lovable.dev/mcp-js";
import estimateSolarSystem from "./tools/estimate-solar-system";
import listStateSubsidies from "./tools/list-state-subsidies";

export default defineMcp({
  name: "get-a-solar-mcp",
  title: "Get A Solar",
  version: "0.1.0",
  instructions:
    "Tools for Get A Solar, an Indian rooftop-solar bidding platform. Use `list_state_subsidies` to look up state-level solar subsidy rates and `estimate_solar_system` for a quick sizing/cost/savings estimate from a household's monthly electricity bill.",
  tools: [listStateSubsidies, estimateSolarSystem],
});
