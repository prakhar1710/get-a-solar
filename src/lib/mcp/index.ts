import { auth, defineMcp } from "@lovable.dev/mcp-js";
import estimateSolarSystem from "./tools/estimate-solar-system";
import listStateSubsidies from "./tools/list-state-subsidies";

const SUPABASE_URL = "https://vlkbfkfbpsawgusyabzt.supabase.co";

export default defineMcp({
  name: "get-a-solar-mcp",
  title: "Get A Solar",
  version: "0.1.0",
  instructions:
    "Tools for Get A Solar, an Indian rooftop-solar bidding platform. Use `list_state_subsidies` to look up state-level solar subsidy rates and `estimate_solar_system` for a quick sizing/cost/savings estimate from a household's monthly electricity bill.",
  auth: auth.oauth.issuer({
    issuer: `${SUPABASE_URL}/auth/v1`,
    acceptedAudiences: "authenticated",
    jwksUri: `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
  }),
  tools: [listStateSubsidies, estimateSolarSystem],
});
