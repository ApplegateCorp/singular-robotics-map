export const CATEGORIES = [
  {
    id: "hardware",
    label: "Hardware manufacturers",
    blurb: "Own the robot. Defensibility has to hold against Chinese hardware.",
  },
  {
    id: "components",
    label: "Components, actuation and safety",
    blurb: "Actuators, sensing, safety compute. Picks and shovels below the robot.",
  },
  {
    id: "models",
    label: "Foundation models and autonomy",
    blurb: "The brain. Backbone is commoditising, the action layer and data are not.",
  },
  {
    id: "data",
    label: "Data, simulation and evaluation",
    blurb: "The scarce asset. Real-world interaction data, sim, and proof that it works.",
  },
  {
    id: "deployment",
    label: "Deployment, fleet and integration",
    blurb: "The deployment channel. Where the flywheel either compounds or does not.",
  },
  {
    id: "applications",
    label: "Applications and operators",
    blurb: "End-to-end plays that integrate and operate. The other viable VC case.",
  },
];

export const MET_STATES = {
  augustin: { label: "I met them", color: "#3B82F6" },
  team: { label: "Team met them", color: "#4E7A1A" },
  none: { label: "Not met", color: "#C0392B" },
};

export const EMPTY_COMPANY = {
  name: "",
  url: "",
  category: "applications",
  vertical: "",
  country: "",
  description: "",
  met: "none",
  met_by: "",
  met_date: "",
  total_raised: "",
  last_round: "",
  last_round_size: "",
  last_round_date: "",
  lead_investors: "",
  notes: "",
  source: "manual",
  pbid: "",
  pb_confidence: "not_checked",
  pb_country: "",
};
