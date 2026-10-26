// The plan chooser for the profile and card path: plans grouped by tier, with a 1 year / Permanent switch.
import React, { useState } from "react";
import { Back } from "../owner/Owner.jsx";
import { PLANS, fmtIQD } from "./plans.js";
import "./plans.css";

// only these plans are open for now (the others stay in plans.js for later)
const OPEN = ["profile", "standard", "silver"];
// coming soon: shown without a price and not selectable; the "+" plans belong to the Permanent tab
const SOON = { year: ["Gold", "Premium"], perm: ["Gold+", "Premium+"] };
const TIERS = ["Basic", "Card", "Premium"];

export function PlanChooser({ lang, go }) {
  const [dur, setDur] = useState("year");
  const [pick, setPick] = useState("silver");
  const chosen = PLANS.find((p) => p.id === pick) || PLANS[2];
  const price = dur === "year" ? chosen.year : chosen.perm;
  const name = chosen.name + (dur === "perm" ? "+" : "");

  const next = () => {
    try {
      sessionStorage.setItem("bm_plan", JSON.stringify({ id: chosen.id, name, dur, price, card: chosen.card }));
    } catch { /* ignore */ }
    go("/list");
  };

  return (
    <>
      <div className="top"><Back lang={lang} onClick={() => go("/path")} /><span className="grow" /></div>
      <div className="stack">
        <h1>Choose your plan</h1>
        <p className="sub">{dur === "year" ? "Listed in Bmnassa categories for one year" : "Listed in Bmnassa categories permanently"}</p>
      </div>
      <div className="pl-seg" role="group" aria-label="Duration">
        <button type="button" aria-pressed={dur === "year"} onClick={() => setDur("year")}>1 year</button>
        <button type="button" aria-pressed={dur === "perm"} onClick={() => setDur("perm")}>Permanent</button>
      </div>
      {TIERS.map((tier) => PLANS.some((p) => p.tier === tier && OPEN.includes(p.id)) && (
        <div className="stack" key={tier}>
          <p className="label">{tier}</p>
          {PLANS.filter((p) => p.tier === tier && OPEN.includes(p.id)).map((p) => {
            const amount = dur === "year" ? p.year : p.perm;
            const shown = dur === "perm" ? p.name + "+" : p.name;
            return (
              <button
                type="button"
                key={p.id}
                className="choice pl-choice"
                aria-pressed={pick === p.id}
                onClick={() => setPick(p.id)}
              >
                <span className="pl-info"><b>{shown}</b><small>{dur === "perm" && p.descPerm ? p.descPerm : p.desc}</small></span>
                <span className="pl-amt">{fmtIQD(amount)}<i>IQD</i></span>
              </button>
            );
          })}
        </div>
      ))}
      <div className="stack">
        <p className="label">Premium</p>
        {SOON[dur].map((n) => (
          <div key={n} className="choice pl-choice pl-soon" aria-disabled="true">
            <span className="pl-info"><b>{n}</b><small>Coming soon</small></span>
            <span className="pl-pill">Soon</span>
          </div>
        ))}
      </div>
      <span className="spacer" />
      <button type="button" className="btn" onClick={next}>Continue with {name} · {fmtIQD(price)} IQD</button>
    </>
  );
}
