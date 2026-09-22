import { readFileSync, writeFileSync } from "node:fs";
const d = JSON.parse(readFileSync("data/companies.json", "utf8"));
const q = (v) => (v === null || v === undefined || v === "" ? "NULL" : "'" + String(v).replace(/'/g, "''") + "'");
const cols = ["name","url","category","vertical","country","description","met","met_by","met_date",
  "total_raised","last_round","last_round_size","last_round_date","lead_investors","notes","source",
  "pbid","pb_confidence","pb_country"];
const rows = d.map((c) => "  (" + cols.map((k) => {
  let v = c[k] ?? "";
  if (k === "met" && !["augustin","team","none"].includes(v)) v = "none";
  if (k === "met_date" && !v) return "NULL";
  return q(v);
}).join(", ") + ")").join(",\n");
const sql = `-- Singular robotics market map: seed data, ${d.length} companies.
-- Paste into the Supabase SQL editor and run AFTER schema.sql.
-- Safe to re-run: existing rows are updated by name.

insert into public.companies (${cols.join(", ")}) values
${rows}
on conflict (name) do update set
${cols.filter((k) => k !== "name").map((k) => `  ${k} = excluded.${k}`).join(",\n")};
`;
writeFileSync("supabase/seed.sql", sql);
console.log(`wrote supabase/seed.sql (${d.length} rows, ${(sql.length/1024).toFixed(0)} KB)`);
