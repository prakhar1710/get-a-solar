// Admin-only backup of all DB tables to a Google Sheet via connector gateway.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";

const TABLES = [
  "profiles",
  "user_roles",
  "projects",
  "bids",
  "vendor_certifications",
  "blog_subscribers",
];

async function sheetsFetch(path: string, init: RequestInit = {}) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const GOOGLE_SHEETS_API_KEY = Deno.env.get("GOOGLE_SHEETS_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
  if (!GOOGLE_SHEETS_API_KEY) throw new Error("GOOGLE_SHEETS_API_KEY not configured");

  const res = await fetch(`${GATEWAY_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GOOGLE_SHEETS_API_KEY,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Sheets API ${res.status}: ${text}`);
  }
  return text ? JSON.parse(text) : {};
}

function toRows(records: Record<string, unknown>[]): unknown[][] {
  if (!records.length) return [["(no rows)"]];
  const headers = Array.from(
    records.reduce((set, r) => {
      Object.keys(r).forEach((k) => set.add(k));
      return set;
    }, new Set<string>()),
  );
  const rows = records.map((r) =>
    headers.map((h) => {
      const v = (r as any)[h];
      if (v === null || v === undefined) return "";
      if (typeof v === "object") return JSON.stringify(v);
      return String(v);
    }),
  );
  return [headers, ...rows];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Manual JWT verification via getClaims
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: claimsData, error: claimsError } = await (userClient.auth as any).getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: isAdminRows, error: roleErr } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (roleErr || !isAdminRows) {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Optional spreadsheetId in body
    let body: { spreadsheetId?: string; title?: string } = {};
    try {
      body = await req.json();
    } catch (_) {}

    const title =
      body.title ||
      `Get A Solar Backup - ${new Date().toISOString().replace("T", " ").slice(0, 19)}`;

    let spreadsheetId = body.spreadsheetId;
    let spreadsheetUrl: string;

    if (!spreadsheetId) {
      // Create new spreadsheet with one sheet per table
      const created = await sheetsFetch(`/spreadsheets`, {
        method: "POST",
        body: JSON.stringify({
          properties: { title },
          sheets: TABLES.map((t) => ({ properties: { title: t } })),
        }),
      });
      spreadsheetId = created.spreadsheetId;
      spreadsheetUrl = created.spreadsheetUrl;
    } else {
      // Ensure sheets exist
      const meta = await sheetsFetch(`/spreadsheets/${spreadsheetId}`);
      spreadsheetUrl = meta.spreadsheetUrl;
      const existing = new Set<string>(
        (meta.sheets || []).map((s: any) => s.properties.title),
      );
      const toAdd = TABLES.filter((t) => !existing.has(t));
      if (toAdd.length) {
        await sheetsFetch(`/spreadsheets/${spreadsheetId}:batchUpdate`, {
          method: "POST",
          body: JSON.stringify({
            requests: toAdd.map((t) => ({
              addSheet: { properties: { title: t } },
            })),
          }),
        });
      }
    }

    const summary: Record<string, number> = {};

    for (const table of TABLES) {
      const { data, error } = await admin.from(table as any).select("*");
      if (error) {
        console.error(`Fetch ${table} failed:`, error.message);
        summary[table] = -1;
        continue;
      }
      const values = toRows((data as any[]) || []);
      summary[table] = (data as any[])?.length ?? 0;

      // Clear sheet first
      await sheetsFetch(
        `/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(table)}:clear`,
        { method: "POST", body: "{}" },
      );
      // Write values
      await sheetsFetch(
        `/spreadsheets/${spreadsheetId}/values/${table}!A1?valueInputOption=RAW`,
        {
          method: "PUT",
          body: JSON.stringify({ range: `${table}!A1`, values }),
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        spreadsheetId,
        spreadsheetUrl,
        summary,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("backup-to-sheets error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
