"use client";

import { useState } from "react";
import { EMPTY_COMPANY } from "../lib/taxonomy";

const PROMPT = `You have access to my Granola meeting notes. Go through every meeting I attended in the last 12 months and find every robotics, physical AI, embodied AI, automation, autonomous systems or drone COMPANY I met with. Exclude VC funds, investors, LPs and internal meetings.

Return ONLY a JSON array, no prose before or after, no markdown fences. One object per company, using exactly these keys:

[
  {
    "name": "Company name",
    "url": "https://company.com",
    "category": "hardware | components | models | data | deployment | applications",
    "vertical": "Warehouse | Manufacturing | Humanoid | Defence | Maritime | Retail | Infrastructure | ...",
    "country": "Germany",
    "description": "One sentence on what they actually do.",
    "met": "team",
    "met_by": "YOUR FULL NAME",
    "met_date": "2026-03-14",
    "notes": "Traction, unit economics, why they matter, or why you passed.",
    "source": "granola"
  }
]

Category definitions:
- hardware: builds the robot itself
- components: actuators, sensors, safety compute, subsystems
- models: foundation models, VLAs, autonomy software
- data: data collection, simulation, evaluation, benchmarking
- deployment: fleet management, integration, teleoperation, robot programming
- applications: end-to-end operators solving a specific vertical problem

Always set "met" to "team" and "met_by" to your own name. Use "" for anything you genuinely do not know, never invent a fact. Send the resulting JSON to Augustin.`;

export default function ImportModal({ onClose, onImported, live }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setErr("Could not copy, select the text manually.");
    }
  }

  async function submit(e) {
    e.preventDefault();
    setErr(""); setOk("");
    let parsed;
    try {
      parsed = JSON.parse(text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim());
    } catch {
      return setErr("That is not valid JSON. Paste the array exactly as Claude returned it.");
    }
    if (!Array.isArray(parsed)) return setErr("Expected a JSON array of companies.");
    const clean = parsed
      .filter((c) => c && typeof c.name === "string" && c.name.trim())
      .map((c, i) => ({ ...EMPTY_COMPANY, ...c, id: c.id ?? `import-${Date.now()}-${i}`, source: c.source || "granola" }));
    if (!clean.length) return setErr("No companies with a name found in that JSON.");

    setBusy(true);
    try {
      if (live) {
        const res = await fetch("/api/companies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bulk: clean }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Import failed");
        setOk(`Imported ${json.companies.length} companies.`);
        onImported(json.companies);
      } else {
        setOk(`Loaded ${clean.length} companies into this session.`);
        onImported(clean);
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
        <h3>Import companies from a teammate's Granola</h3>
        <p className="hint">
          Two steps. Send a colleague the prompt below, they run it on their own Claude with Granola
          connected, then paste the JSON they send back into the box.
        </p>

        <div className="f full" style={{ marginBottom: 16 }}>
          <label>Step 1 &middot; the prompt to send them</label>
          <textarea readOnly value={PROMPT} style={{ minHeight: 150, fontSize: 11, lineHeight: 1.5, color: "var(--grey3)" }} />
          <button type="button" onClick={copyPrompt} style={{ alignSelf: "flex-start", marginTop: 6 }}>
            {copied ? "Copied" : "Copy prompt"}
          </button>
        </div>

        <div className="f full">
          <label>Step 2 &middot; paste their JSON here</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='[{"name": "Acme Robotics", "category": "hardware", ...}]'
            style={{ minHeight: 140, fontSize: 11 }}
          />
        </div>

        {err && <p className="err">{err}</p>}
        {ok && <p className="ok">{ok}</p>}
        <div className="modal-actions">
          <button type="button" onClick={onClose}>Close</button>
          <button type="submit" className="primary" disabled={busy || !text.trim()}>
            {busy ? "Importing..." : "Import"}
          </button>
        </div>
      </form>
    </>
  );
}
