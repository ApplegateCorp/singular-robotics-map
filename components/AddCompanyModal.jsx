"use client";

import { useState } from "react";
import { CATEGORIES, EMPTY_COMPANY, MET_STATES } from "../lib/taxonomy";

export default function AddCompanyModal({ onClose, onAdded, live }) {
  const [form, setForm] = useState({ ...EMPTY_COMPANY });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setErr("A name is required.");
    setBusy(true);
    setErr("");
    try {
      if (live) {
        const res = await fetch("/api/companies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Save failed");
        onAdded(json.company);
      } else {
        onAdded({ ...form, id: `local-${Date.now()}` });
      }
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <form className="modal" onSubmit={submit}>
        <h3>Add a company</h3>
        <p className="hint">
          Put it in the right section and it shows up for everyone. If you have met them, say so and
          who, that is what drives the colour.
        </p>
        <div className="fgrid">
          <div className="f"><label>Name</label><input value={form.name} onChange={set("name")} placeholder="Acme Robotics" /></div>
          <div className="f"><label>Website</label><input value={form.url} onChange={set("url")} placeholder="https://acme.com" /></div>
          <div className="f">
            <label>Section</label>
            <select value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="f"><label>Vertical</label><input value={form.vertical} onChange={set("vertical")} placeholder="Warehouse" /></div>
          <div className="f"><label>Country</label><input value={form.country} onChange={set("country")} placeholder="Germany" /></div>
          <div className="f">
            <label>Met status</label>
            <select value={form.met} onChange={set("met")}>
              {Object.entries(MET_STATES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div className="f"><label>Met by</label><input value={form.met_by} onChange={set("met_by")} placeholder="Augustin, Lorenzo" /></div>
          <div className="f"><label>Met on</label><input type="date" value={form.met_date} onChange={set("met_date")} /></div>
          <div className="f"><label>Total raised</label><input value={form.total_raised} onChange={set("total_raised")} placeholder="$42M" /></div>
          <div className="f"><label>Last round</label><input value={form.last_round} onChange={set("last_round")} placeholder="Series A" /></div>
          <div className="f"><label>Last round size</label><input value={form.last_round_size} onChange={set("last_round_size")} placeholder="$18M" /></div>
          <div className="f"><label>Last round date</label><input value={form.last_round_date} onChange={set("last_round_date")} placeholder="Feb 2026" /></div>
          <div className="f full"><label>Lead investors</label><input value={form.lead_investors} onChange={set("lead_investors")} placeholder="Balderton, Creandum" /></div>
          <div className="f full"><label>One-line description</label><input value={form.description} onChange={set("description")} placeholder="What they actually do" /></div>
          <div className="f full"><label>Notes</label><textarea value={form.notes} onChange={set("notes")} placeholder="Unit economics, traction, why they matter or why we passed" /></div>
        </div>
        {err && <p className="err">{err}</p>}
        {!live && <p className="hint" style={{ marginTop: 14, marginBottom: 0 }}>Supabase is not configured, so this stays in your browser only.</p>}
        <div className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary" disabled={busy}>{busy ? "Saving..." : "Add company"}</button>
        </div>
      </form>
    </>
  );
}
