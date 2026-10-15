import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseConfigured = Boolean(url && anon);

// Next.js caches fetch() responses on the server by default. Without this, the
// map keeps serving a stale snapshot of the database after companies are added or edited.
const noStoreFetch = (input, init = {}) => fetch(input, { ...init, cache: "no-store" });

export function publicClient() {
  if (!supabaseConfigured) return null;
  return createClient(url, anon, { global: { fetch: noStoreFetch } });
}

export function serviceClient() {
  if (!url || !service) return null;
  return createClient(url, service, { auth: { persistSession: false }, global: { fetch: noStoreFetch } });
}
