// Loads data/companies.json into Supabase. Run once after creating the table:
//   npm run seed
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  console.error("Set them in .env.local, or inline: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed");
  process.exit(1);
}

const rows = JSON.parse(readFileSync(join(here, "..", "data", "companies.json"), "utf8")).map((c) => ({
  name: c.name,
  url: c.url || "",
  category: c.category || "applications",
  vertical: c.vertical || "",
  country: c.country || "",
  description: c.description || "",
  met: ["augustin", "team", "none"].includes(c.met) ? c.met : "none",
  met_by: c.met_by || "",
  met_date: c.met_date || null,
  total_raised: c.total_raised || "",
  last_round: c.last_round || "",
  last_round_size: c.last_round_size || "",
  last_round_date: c.last_round_date || "",
  lead_investors: c.lead_investors || "",
  notes: c.notes || "",
  source: c.source || "seed",
  pbid: c.pbid || "",
  pb_confidence: c.pb_confidence || "not_checked",
  pb_country: c.pb_country || "",
}));

const sb = createClient(url, key, { auth: { persistSession: false } });
const { data, error } = await sb.from("companies").upsert(rows, { onConflict: "name" }).select("name");

if (error) { console.error("Seed failed:", error.message); process.exit(1); }
console.log(`Seeded ${data.length} companies.`);
