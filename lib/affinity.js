import table from "../data/affinity.json";
import labelTable from "../data/labels.json";

const RANK = { none: 0, team: 1, augustin: 2 };

// Internal labels (pre-emption target, hot team, can't reach), keyed by lowercase company name.
export const LABELS = [
  { id: "Pre-emption target", color: "#E8B931" },
  { id: "Hot team", color: "#FF6B3D" },
  { id: "Can't reach", color: "#9AA0A6" },
];
export const LABEL_COLOR = Object.fromEntries(LABELS.map((l) => [l.id, l.color]));

// Attach the Affinity snapshot and labels to a company and reconcile its met status.
// Met status only ever goes up: a meeting found in Affinity upgrades the colour,
// but a meeting we know about from Granola is never downgraded because Affinity missed it.
export function withAffinity(c) {
  const key = (c.name || "").toLowerCase().trim();
  const labels = labelTable[key] || [];
  const a = table[key] || null;
  if (!a) return { ...c, labels, aff: null };
  const met = (RANK[a.met] ?? 0) > (RANK[c.met] ?? 0) ? a.met : c.met;
  const names = new Set(
    [c.met_by, a.met_by].join(",").split(",").map((s) => s.trim()).filter(Boolean)
  );
  return { ...c, met, met_by: [...names].join(", "), labels, aff: a };
}

export const AFFINITY_STATUSES = [
  "Active", "First Call", "Contacted", "To Do", "Nurture", "To Reject", "Passed", "Inactive",
  "Not in Prospects", "Not in Affinity",
];
