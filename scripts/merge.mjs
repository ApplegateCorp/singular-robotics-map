import { readFileSync, writeFileSync } from "node:fs";
const companies = JSON.parse(readFileSync("data/companies.json", "utf8"));
const pb = JSON.parse(readFileSync("scripts/pitchbook.json", "utf8"));

const byName = new Map(pb.map(p => [p.name.toLowerCase(), p]));
const out = [];
let matched = 0, notFound = 0, medium = 0, merged = 0;

for (const c of companies) {
  const p = byName.get(c.name.toLowerCase());
  if (!p) { out.push({ ...c, pb_confidence: "not_checked" }); continue; }
  if (p.__merge_into) {
    const target = companies.find(x => x.name === p.__merge_into);
    if (target) { target.notes = ((target.notes || "") + ` Formerly ${c.name}, merged: same PitchBook entity.`).trim(); merged++; continue; }
  }
  const rec = { ...c };
  for (const k of ["total_raised","last_round","last_round_size","last_round_date","lead_investors"]) {
    if (p[k]) rec[k] = p[k];
  }
  if (p.country) rec.country = p.country;
  if (p.description) rec.description = p.description;
  if (p.category) rec.category = p.category;
  if (p.vertical) rec.vertical = p.vertical;
  rec.pbid = p.pbid || "";
  rec.pb_confidence = p.confidence || "not_checked";
  if (p.flag) rec.notes = ((rec.notes || "") + " [PitchBook] " + p.flag).trim();
  if (p.confidence === "high") matched++;
  else if (p.confidence === "medium") { medium++; matched++; }
  else notFound++;
  out.push(rec);
}

writeFileSync("data/companies.json", JSON.stringify(out, null, 2) + "\n");
const withFunding = out.filter(c => c.total_raised || c.last_round).length;
console.log(`records ${out.length} (merged away ${merged})`);
console.log(`pitchbook matched ${matched} (of which medium confidence ${medium}), not found ${notFound}`);
console.log(`records now carrying funding data: ${withFunding}`);
