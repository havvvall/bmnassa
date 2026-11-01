// The plan chooser: three steps, each one a tap. Tapping an option goes straight to the next step.
// 1) NFC card  2) profile  3) duration. The plan name is shown as the choices are made.
import React, { useState } from "react";
import { Back } from "../owner/Owner.jsx";
import { fmtIQD } from "./plans.js";
import "./plans.css";

// the plan each NFC choice leads to (prices in IQD, same as the plans it replaces)
const NFC = {
  none: { label: "No NFC card", plan: "Bmnassa Profile", id: "profile", card: false, year: 15000, perm: 30000 },
  bmnassa: { label: "Bmnassa NFC", plan: "Standard", id: "standard", card: true, year: 20000, perm: 40000 },
  custom: { label: "Custom NFC card", plan: "Silver", id: "silver", card: true, year: 35000, perm: 70000 },
};

export function PlanChooser({ lang, go }) {
  const [step, setStep] = useState(1);
  const [nfc, setNfc] = useState(null);
  const [prof, setProf] = useState(null);

  const plan = nfc ? NFC[nfc] : null;

  // what has been picked so far, shown on each step
  const picked = [nfc && NFC[nfc].label, prof && "Bmnassa profile"].filter(Boolean);

  const back = () => {
    if (step === 1) { go("/path"); return; }
    if (step === 2) { setNfc(null); setStep(1); return; }
    setProf(null); setStep(2);
  };

  const chooseNfc = (k) => { setNfc(k); setStep(2); };
  const chooseProf = (k) => { setProf(k); setStep(3); };

  const chooseDur = (d) => {
    const price = d === "year" ? plan.year : plan.perm;
    try {
      sessionStorage.setItem("bm_plan", JSON.stringify({ id: plan.id, name: plan.plan, dur: d, price, card: plan.card }));
    } catch { /* ignore */ }
    go("/list");
  };

  return (
    <>
      <div className="top"><Back lang={lang} onClick={back} /><span className="grow" /></div>

      {step === 1 ? (
        <>
          <div className="stack">
            <h1>Do you want an NFC card?</h1>
            <p className="sub">A card you can tap on a phone to share your business.</p>
          </div>
          <div className="stack">
            {Object.keys(NFC).map((k) => (
              <button key={k} type="button" className="choice pl-choice" onClick={() => chooseNfc(k)}>
                <span className="pl-info"><b>{NFC[k].label}</b><small>{k === "none" ? "Digital profile only" : k === "bmnassa" ? "Our standard card, ready to order" : "Your own design and colours"}</small></span>
                <span className="pl-amt">{fmtIQD(NFC[k].year)}<i>IQD / year</i></span>
              </button>
            ))}
          </div>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <div className="stack">
            <p className="label">{picked.join(" · ")}</p>
            <h1>Choose your profile</h1>
            <p className="sub">Both include a digital swipeable card on your phone.</p>
          </div>
          <div className="stack">
            <button type="button" className="choice pl-choice" onClick={() => chooseProf("bmnassa")}>
              <span className="pl-info"><b>Bmnassa profile</b><small>Includes a digital swipeable card</small></span>
            </button>
            <div className="choice pl-choice pl-soon" aria-disabled="true">
              <span className="pl-info"><b>Custom profile</b><small>Includes a digital swipeable card</small></span>
              <span className="pl-pill">Soon</span>
            </div>
          </div>
        </>
      ) : null}

      {step === 3 ? (
        <>
          <div className="stack">
            <p className="label">{picked.join(" · ")}</p>
            <h1>How long do you want it?</h1>
            <p className="sub">Plan: <b>{plan.plan}</b></p>
          </div>
          <div className="stack">
            <button type="button" className="choice pl-choice" onClick={() => chooseDur("year")}>
              <span className="pl-info"><b>1 year</b><small>Listed for one year</small></span>
              <span className="pl-amt">{fmtIQD(plan.year)}<i>IQD</i></span>
            </button>
            <button type="button" className="choice pl-choice" onClick={() => chooseDur("perm")}>
              <span className="pl-info"><b>Permanent</b><small>Pay once, listed permanently</small></span>
              <span className="pl-amt">{fmtIQD(plan.perm)}<i>IQD</i></span>
            </button>
          </div>
        </>
      ) : null}
    </>
  );
}
