import table from "../data/affinity.json";

const RANK = { none: 0, team: 1, augustin: 2 };

// Attach the Affinity snapshot to a company and reconcile its met status.
// Met status only ever goes up: a meeting found in Affinity upgrades the colour,
// but a meeting we know about from Granola is never downgraded because Affinity missed it.
export function withAffinity(c) {
  const a = table[(c.name || "").toLowerCase().trim()] || null;
  if (!a) return { ...c, aff: null };
  const met = (RANK[a.met] ?? 0) > (RANK[c.met] ?? 0) ? a.met : c.met;
  const names = new Set(
    [c.met_by, a.met_by].join(",").split(",").map((s) => s.trim()).filter(Boolean)
  );
  return { ...c, met, met_by: [...names].join(", "), aff: a };
}

export const AFFINITY_STATUSES = [
  "Active", "First Call", "Contacted", "To Do", "Nurture", "To Reject", "Passed", "Inactive",
  "Not in Prospects", "Not in Affinity",
];
