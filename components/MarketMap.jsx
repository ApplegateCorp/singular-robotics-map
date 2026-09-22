"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, MET_STATES } from "../lib/taxonomy";
import CompanyDrawer from "./CompanyDrawer";
import AddCompanyModal from "./AddCompanyModal";
import ImportModal from "./ImportModal";

const MET_COLOR = { augustin: "var(--met-self)", team: "var(--met-team)", none: "var(--met-none)" };

export default function MarketMap({ initial, live }) {
  const [companies, setCompanies] = useState(initial);
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("");
  const [vertical, setVertical] = useState("");
  const [hidden, setHidden] = useState({});
  const [onlyVerify, setOnlyVerify] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const countries = useMemo(
    () => [...new Set(companies.map((c) => c.country).filter(Boolean))].sort(),
    [companies]
  );
  const verticals = useMemo(
    () => [...new Set(companies.map((c) => c.vertical).filter(Boolean))].sort(),
    [companies]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return companies.filter((c) => {
      if (hidden[c.met]) return false;
      if (onlyVerify && c.pb_confidence !== "medium") return false;
      if (country && c.country !== country) return false;
      if (vertical && c.vertical !== vertical) return false;
      if (!needle) return true;
      return [c.name, c.description, c.country, c.vertical, c.notes, c.lead_investors]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [companies, q, country, vertical, hidden, onlyVerify]);

  const counts = useMemo(() => {
    const t = { augustin: 0, team: 0, none: 0 };
    companies.forEach((c) => { if (t[c.met] !== undefined) t[c.met] += 1; });
    return t;
  }, [companies]);

  function onAdded(company) {
    setCompanies((prev) => [...prev, company]);
    setShowAdd(false);
  }
  function onImported(list) {
    setCompanies((prev) => {
      const byName = new Map(prev.map((c) => [c.name.toLowerCase().trim(), c]));
      list.forEach((c) => byName.set(c.name.toLowerCase().trim(), c));
      return [...byName.values()];
    });
    setShowImport(false);
  }

  return (
    <div className="wrap">
      <header className="masthead">
        <div className="smark">S.</div>
        <div>
          <h1>Robotics and physical AI market map</h1>
          <p className="sub">
            Every company in the value chain, coloured by whether we have actually spoken to them.
            Red is the gap list: that is the point of this page.
          </p>
        </div>
        <div className="mast-actions">
          <button onClick={() => setShowImport(true)}>Import from Granola</button>
          <button className="primary" onClick={() => setShowAdd(true)}>Add a company</button>
        </div>
      </header>

      <div className="toolbar">
        <input
          className="search"
          type="text"
          placeholder="Search name, thesis, investor, note..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">All countries</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={vertical} onChange={(e) => setVertical(e.target.value)}>
          <option value="">All verticals</option>
          {verticals.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <button
          className={onlyVerify ? "primary" : ""}
          onClick={() => setOnlyVerify((v) => !v)}
          title="Companies whose PitchBook match is uncertain"
        >
          Needs verification
        </button>
        {(q || country || vertical || onlyVerify) && (
          <button className="ghost" onClick={() => { setQ(""); setCountry(""); setVertical(""); setOnlyVerify(false); }}>
            Clear
          </button>
        )}
        <div className="legend">
          {Object.entries(MET_STATES).map(([key, s]) => (
            <span
              key={key}
              className={`lg ${hidden[key] ? "off" : ""}`}
              onClick={() => setHidden((h) => ({ ...h, [key]: !h[key] }))}
              title="Click to show or hide"
            >
              <span className="swatch" style={{ borderColor: MET_COLOR[key] }} />
              {s.label} <span className="n">{counts[key]}</span>
            </span>
          ))}
        </div>
      </div>

      {CATEGORIES.map((cat) => {
        const items = filtered
          .filter((c) => c.category === cat.id)
          .sort((a, b) => a.name.localeCompare(b.name));
        if (!items.length) return null;
        return (
          <section className="section" key={cat.id}>
            <div className="bar" />
            <div className="sec-head">
              <h2>{cat.label}</h2>
              <span className="count">{items.length}</span>
            </div>
            <p className="sec-blurb">{cat.blurb}</p>
            <div className="grid">
              {items.map((c) => (
                <button
                  className="card"
                  key={c.id ?? c.name}
                  style={{ borderLeftColor: MET_COLOR[c.met] ?? MET_COLOR.none }}
                  onClick={() => setSelected(c)}
                >
                  <span className="cname">{c.name}</span>
                  <span className="cmeta">
                    {[c.country, c.vertical].filter(Boolean).join(" · ")}
                  </span>
                  <span className="cdesc">{c.description}</span>
                  <span className="cfoot">
                    {c.total_raised ? <span className="raised">{c.total_raised} raised</span> : null}
                    {c.last_round ? <span>{c.last_round}</span> : null}
                    {c.pb_confidence === "medium" ? <span title="PitchBook match uncertain" style={{ color: "var(--met-none)" }}>verify</span> : null}
                  </span>
                </button>
              ))}
            </div>
          </section>
        );
      })}

      {!filtered.length && (
        <p className="sub" style={{ marginTop: 40 }}>Nothing matches those filters.</p>
      )}

      {!live && (
        <div className="notice">
          Running on the bundled seed file. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in Vercel, then run <code>npm run seed</code>,
          and additions will persist for the whole team instead of only this browser session.
        </div>
      )}

      <div className="foot">
        <span>
          {companies.length} companies &middot; {companies.filter((c) => c.total_raised || c.last_round).length} with PitchBook funding data &middot;{" "}
          {companies.filter((c) => c.pb_confidence === "medium").length} matches to verify
        </span>
        <span>Singular Capital Partners &middot; Confidential</span>
      </div>

      {selected && <CompanyDrawer company={selected} onClose={() => setSelected(null)} />}
      {showAdd && <AddCompanyModal onClose={() => setShowAdd(false)} onAdded={onAdded} live={live} />}
      {showImport && <ImportModal onClose={() => setShowImport(false)} onImported={onImported} live={live} />}
    </div>
  );
}
