import MarketMap from "../components/MarketMap";
import { getCompanies } from "../lib/data";
import { supabaseConfigured } from "../lib/supabase";

export const dynamic = "force-dynamic";

export default async function Page() {
  const companies = await getCompanies();
  return <MarketMap initial={companies} live={supabaseConfigured} />;
}
