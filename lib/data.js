import seed from "../data/companies.json";
import { publicClient, supabaseConfigured } from "./supabase";

function normalise(c, i) {
  return {
    id: c.id ?? `seed-${i}`,
    name: c.name ?? "",
    url: c.url ?? "",
    category: c.category ?? "applications",
    vertical: c.vertical ?? "",
    country: c.country ?? "",
    description: c.description ?? "",
    met: c.met ?? "none",
    met_by: c.met_by ?? "",
    met_date: c.met_date ?? "",
    total_raised: c.total_raised ?? "",
    last_round: c.last_round ?? "",
    last_round_size: c.last_round_size ?? "",
    last_round_date: c.last_round_date ?? "",
    lead_investors: c.lead_investors ?? "",
    notes: c.notes ?? "",
    source: c.source ?? "seed",
    pbid: c.pbid ?? "",
    pb_confidence: c.pb_confidence ?? "not_checked",
    pb_country: c.pb_country ?? "",
  };
}

export async function getCompanies() {
  if (supabaseConfigured) {
    try {
      const sb = publicClient();
      const { data, error } = await sb.from("companies").select("*").order("name");
      if (!error && data && data.length) return data.map(normalise);
    } catch (e) {
      // fall through to the bundled seed
    }
  }
  return seed.map(normalise);
}
