// The plan chooser for the profile and card path: plans grouped by tier, with a 1 year / Permanent switch.
import React, { useState } from "react";
import { Back } from "../owner/Owner.jsx";
import { PLANS, fmtIQD } from "./plans.js";
import "./plans.css";

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
      {TIERS.map((tier) => (
        <div className="stack" key={tier}>
          <p className="label">{tier}</p>
          {PLANS.filter((p) => p.tier === tier).map((p) => {
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
                <span className="pl-info"><b>{shown}</b><small>{p.desc}</small></span>
                <span className="pl-amt">{fmtIQD(amount)}<i>IQD</i></span>
              </button>
            );
          })}
        </div>
      ))}
      <span className="spacer" />
      <button type="button" className="btn" onClick={next}>Continue with {name} · {fmtIQD(price)} IQD</button>
    </>
  );
}
