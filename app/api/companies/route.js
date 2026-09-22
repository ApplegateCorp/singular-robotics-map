import { NextResponse } from "next/server";
import { serviceClient } from "../../../lib/supabase";
import { EMPTY_COMPANY } from "../../../lib/taxonomy";

const FIELDS = Object.keys(EMPTY_COMPANY);

function sanitise(input) {
  const out = {};
  FIELDS.forEach((k) => { out[k] = typeof input?.[k] === "string" ? input[k].trim() : (input?.[k] ?? ""); });
  if (!["augustin", "team", "none"].includes(out.met)) out.met = "none";
  if (!out.met_date) out.met_date = null;
  return out;
}

export async function GET() {
  const sb = serviceClient();
  if (!sb) return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  const { data, error } = await sb.from("companies").select("*").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ companies: data });
}

export async function POST(req) {
  const sb = serviceClient();
  if (!sb) return NextResponse.json({ error: "Supabase is not configured on the server." }, { status: 500 });

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }

  if (Array.isArray(body?.bulk)) {
    const rows = body.bulk.map(sanitise).filter((r) => r.name);
    if (!rows.length) return NextResponse.json({ error: "No valid companies." }, { status: 400 });
    const { data, error } = await sb.from("companies").upsert(rows, { onConflict: "name" }).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ companies: data });
  }

  const row = sanitise(body);
  if (!row.name) return NextResponse.json({ error: "A name is required." }, { status: 400 });
  const { data, error } = await sb.from("companies").upsert(row, { onConflict: "name" }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ company: data });
}
