import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseConfigured = Boolean(url && anon);

export function publicClient() {
  if (!supabaseConfigured) return null;
  return createClient(url, anon);
}

export function serviceClient() {
  if (!url || !service) return null;
  return createClient(url, service, { auth: { persistSession: false } });
}
