// The plan chooser for the profile and card path: three tiers shown as a bento, with a 1 year / Permanent switch.
import React, { useState } from "react";
import { PLANS, WIDE, fmtIQD } from "./plans.js";
import "./plans.css";

export function PlanChooser({ go }) {
  const [dur, setDur] = useState("year");
  const [pick, setPick] = useState("silver");
  const list = PLANS.filter((p) => dur === "year" || p.perm);
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
    <div className="pl-page">
      <div className="pl-top">
        <small>Bmnassa</small>
        <h1>Choose your plan</h1>
      </div>
      <div className="pl-seg" role="group" aria-label="Duration">
        <button type="button" className={dur === "year" ? "on" : ""} aria-pressed={dur === "year"} onClick={() => setDur("year")}>1 year</button>
        <button type="button" className={dur === "perm" ? "on" : ""} aria-pressed={dur === "perm"} onClick={() => setDur("perm")}>Permanent</button>
      </div>
      <div className="pl-grid">
        {list.map((p, i) => {
          const sel = pick === p.id;
          const shown = dur === "perm" ? p.name + "+" : p.name;
          return (
            <button
              type="button"
              key={p.id}
              className={"pl-tile" + (WIDE.includes(i) ? " wide" : "") + (sel ? " sel" : "")}
              aria-pressed={sel}
              onClick={() => setPick(p.id)}
            >
              <span className="pl-meta">
                <span className="pl-tag">{p.tier}</span>
                <b>{shown}</b>
                <small>{p.desc}</small>
              </span>
              <span className="pl-price">{fmtIQD(dur === "year" ? p.year : p.perm)}<i>IQD</i></span>
            </button>
          );
        })}
      </div>
      <div className="pl-foot">
        <p>{dur === "year" ? "Listed in Bmnassa categories for one year" : "Listed in Bmnassa categories permanently"}</p>
        <button type="button" className="pl-cta" onClick={next}>Continue with {name} · {fmtIQD(price)} IQD</button>
        <button type="button" className="pl-back" onClick={() => go("/path")}>Back</button>
      </div>
    </div>
  );
}
