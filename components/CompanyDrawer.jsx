"use client";

import { CATEGORIES, MET_STATES } from "../lib/taxonomy";

const MET_COLOR = { augustin: "var(--met-self)", team: "var(--met-team)", none: "var(--met-none)" };

function Row({ k, v }) {
  return (
    <div className="row">
      <span className="k">{k}</span>
      <span className={`v ${v ? "" : "empty"}`}>{v || "not filled in yet"}</span>
    </div>
  );
}

export default function CompanyDrawer({ company: c, onClose }) {
  const cat = CATEGORIES.find((x) => x.id === c.category);
  const met = MET_STATES[c.met] ?? MET_STATES.none;
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer">
        <button className="ghost close" onClick={onClose}>Close</button>
        <h3>{c.name}</h3>
        <p className="dsub">{[c.country, c.vertical, cat?.label].filter(Boolean).join(" · ")}</p>
        <span className="pill" style={{ color: MET_COLOR[c.met], borderColor: MET_COLOR[c.met] }}>
          {met.label}
        </span>

        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--grey3)", marginTop: 0 }}>
          {c.description}
        </p>

        <Row k="Website" v={c.url ? <a href={c.url} target="_blank" rel="noreferrer">{c.url.replace(/^https?:\/\//, "")}</a> : ""} />
        <Row k="Total raised" v={c.total_raised} />
        <Row k="Last round" v={[c.last_round, c.last_round_size].filter(Boolean).join(" · ")} />
        <Row k="Last round date" v={c.last_round_date} />
        <Row k="Lead investors" v={c.lead_investors} />
        <Row k="Met by" v={c.met_by} />
        <Row k="Met on" v={c.met_date} />
        <Row k="Source" v={c.source} />
        <Row k="PitchBook ID" v={c.pbid} />
        {c.pb_country ? <Row k="PitchBook HQ" v={`${c.pb_country} (differs from ours, PitchBook often records legal domicile)`} /> : null}

        {c.pb_confidence === "medium" && (
          <p style={{ marginTop: 16, padding: "10px 12px", border: "1px solid var(--line)", borderLeft: "3px solid var(--met-none)", fontSize: 11.5, lineHeight: 1.55, color: "var(--grey2)" }}>
            PitchBook match is uncertain. Verify before quoting these figures.
          </p>
        )}
        {c.pb_confidence === "not_found" && (
          <p style={{ marginTop: 16, padding: "10px 12px", border: "1px solid var(--line)", borderLeft: "3px solid var(--grey1)", fontSize: 11.5, lineHeight: 1.55, color: "var(--grey2)" }}>
            No PitchBook record found. Funding fields are genuinely unknown, not missing.
          </p>
        )}

        {c.notes ? (
          <>
            <p style={{ fontSize: 10.5, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--grey2)", marginTop: 22, marginBottom: 6 }}>
              Notes from our conversations
            </p>
            <p style={{ fontSize: 12.5, lineHeight: 1.65, color: "var(--grey3)", margin: 0 }}>{c.notes}</p>
          </>
        ) : null}
      </aside>
    </>
  );
}
