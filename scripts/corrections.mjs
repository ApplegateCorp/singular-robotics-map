import { readFileSync, writeFileSync } from "node:fs";
const d = JSON.parse(readFileSync("data/companies.json", "utf8"));
const get = (n) => d.find((c) => c.name.toLowerCase() === n.toLowerCase());

// 1. Geography: our own data governs. PitchBook's value is kept as a reference field only,
//    because PitchBook frequently records legal domicile rather than where the team operates.
const OURS = {
  "InLoop Robotics": "Germany", "Intelligence Factory": "United Kingdom", "Theker": "Portugal",
  "Qualia Studios": "Germany", "120ft Factory": "Germany", "cartken": "Germany",
  "Kinisi Robotics": "United Kingdom", "Progressive Robotics": "Portugal",
  "Telekinesis": "United States", "MAKIINA": "Spain", "Forgis": "Italy",
  "Ci Labs": "United Kingdom", "NPCo": "United Kingdom", "Lute": "France",
  "Exclaim Robotics": "France", "Cota Robotics": "Spain", "N Robotics": "United Kingdom",
  "Flexion": "United Kingdom",
};
let reverted = 0;
for (const [name, ours] of Object.entries(OURS)) {
  const c = get(name);
  if (!c) continue;
  if (c.country !== ours) { c.pb_country = c.country; c.country = ours; reverted++; }
}

// 2. Flexion was met by Eva, early.
const fx = get("Flexion");
if (fx) {
  fx.met = "team"; fx.met_by = "Eva"; fx.met_date = "";
  fx.notes = (fx.notes || "").replace(/\[PitchBook\] \$59M raised and never contacted\. Biggest single gap on the map\./, "").trim();
  fx.notes = ("Met early by Eva, before the Series A. " + fx.notes).trim();
}

// 3. Theker: Lorenzo met them. Met status already team, drop the doubt but keep the size caveat.
const th = get("Theker");
if (th) {
  th.pb_confidence = "high";
  th.met_by = "Lorenzo";
  th.notes = "Met by Lorenzo, Feb 2026. PitchBook records a EUR 85M Series A led by Samsung and CRV at a Barcelona HQ, worth reconciling with what Lorenzo saw.";
}

// 4. N Robotics wound down and the founders went on to start Cell Labs.
const nr = get("N Robotics");
if (nr) {
  nr.notes = "Wound down, PitchBook records an out-of-business event dated 4 Sep 2026. The founding team went on to start Cell Labs.";
}
const cl = get("Cell Labs");
if (cl) {
  cl.notes = ((cl.notes || "") + " Founded by the team behind N Robotics, which wound down in 2026.").trim();
}

writeFileSync("data/companies.json", JSON.stringify(d, null, 2) + "\n");
const m = {}; d.forEach((c) => { m[c.met] = (m[c.met] || 0) + 1; });
console.log("countries reverted to our data:", reverted);
console.log("met status:", m);
console.log("still flagged medium:", d.filter((c) => c.pb_confidence === "medium").map((c) => c.name).join(", "));
