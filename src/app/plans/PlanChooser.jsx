// The plan chooser: one screen with three groups (NFC card, profile, duration).
// The header shows the plan name and total as the choices are made; "Get <plan>" saves the choice.
import React, { useState } from "react";
import { Back } from "../owner/Owner.jsx";
import { fmtIQD } from "./plans.js";
import "./plans.css";

const NFC = [
  { v: "none", t: "No card", d: "Profile only", icon: <svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2.5" /><path d="M4 19L20 5" /></svg> },
  { v: "bmnassa", t: "Bmnassa NFC", d: "Standard card", icon: <svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2.5" /><path d="M10 10.5a2.5 2.5 0 0 1 0 3M12.8 9a4.8 4.8 0 0 1 0 6" /></svg> },
  { v: "custom", t: "Custom NFC", d: "Your design", icon: <svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="10" rx="2.2" /><path d="M19.5 9.2l1.3 1.3-4.6 4.6-1.9.6.6-1.9z" /></svg> },
];
const PROFILE = [
  { v: "bmnassa", t: "Bmnassa profile", d: "Includes a digital swipeable card", icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.6" /><path d="M5 20c.8-3.4 3.6-5.2 7-5.2s6.2 1.8 7 5.2" /></svg> },
  { v: "custom", t: "Custom profile", d: "Includes a digital swipeable card", icon: <svg viewBox="0 0 24 24"><circle cx="10.5" cy="8.5" r="3.6" /><path d="M3.5 20c.8-3.4 3.4-5.2 7-5.2 1.3 0 2.5.3 3.4.8" /><path d="M19.5 9.2l1.3 1.3-4.6 4.6-1.9.6.6-1.9z" /></svg> },
];
const DURATION = [
  { v: "year", t: "1 year", d: "Listed for one year", icon: <svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4M12 13.5v4M10.5 15.5L12 13.5" /></svg> },
  { v: "perm", t: "Permanent", d: "Pay once, listed forever", icon: <svg viewBox="0 0 24 24"><path d="M12 12c-1.8-2.6-3.4-4-5.4-4a4 4 0 0 0 0 8c2 0 3.6-1.4 5.4-4zm0 0c1.8 2.6 3.4 4 5.4 4a4 4 0 0 0 0-8c-2 0-3.6 1.4-5.4 4z" /></svg> },
];

// plan for each NFC + profile combination; prices in IQD (same as the prototype)
const PLANS = {
  "none|bmnassa": { name: "Basic", id: "profile", card: false, year: 15000, perm: 30000 },
  "none|custom": { name: "Smart", id: "smart", card: false, year: 25000, perm: 50000 },
  "bmnassa|bmnassa": { name: "Standard", id: "standard", card: true, year: 20000, perm: 40000 },
  "bmnassa|custom": { name: "Gold", id: "gold", card: true, year: 45000, perm: 70000 },
  "custom|bmnassa": { name: "Silver", id: "silver", card: true, year: 35000, perm: 70000 },
  "custom|custom": { name: "Premium", id: "premium", card: true, year: 60000, perm: 95000 },
};

const Tick = () => (
  <span className="pl-tick"><svg viewBox="0 0 12 12"><path d="M2 6.5l2.5 2.5L10 3.5" /></svg></span>
);

function Group({ label, value, items, selected, onPick }) {
  return (
    <div className="pl-group">
      <div className="pl-glabel"><span>{label}</span><em>{value || ""}</em></div>
      <div className="pl-opts">
        {items.map((o) => (
          <button key={o.v} type="button" className={"pl-opt" + (selected === o.v ? " sel" : "")} onClick={() => onPick(o.v)}>
            {selected === o.v ? <Tick /> : null}
            <span className="pl-circ">{o.icon}</span>
            <span className="pl-t">{o.t}</span>
            <span className="pl-d">{o.d}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function PlanChooser({ lang, go }) {
  const [nfc, setNfc] = useState(null);
  const [prof, setProf] = useState(null);
  const [dur, setDur] = useState(null);

  const plan = nfc && prof ? PLANS[nfc + "|" + prof] : null;
  const price = plan && dur ? (dur === "year" ? plan.year : plan.perm) : null;
  const name = plan ? plan.name + (dur === "perm" ? "+" : "") : "";
  const nfcLabel = nfc ? NFC.find((o) => o.v === nfc).t : "";
  const profLabel = prof ? PROFILE.find((o) => o.v === prof).t : "";
  const durLabel = dur ? DURATION.find((o) => o.v === dur).t : "";

  const get = () => {
    if (!plan || !dur) return;
    try {
      sessionStorage.setItem("bm_plan", JSON.stringify({ id: plan.id, name: plan.name, dur, price, card: plan.card }));
    } catch { /* ignore */ }
    go("/list");
  };

  return (
    <>
      <div className="top"><Back lang={lang} onClick={() => go("/path")} /><span className="grow" /></div>

      <div className={"pl-head" + (plan && dur ? " full" : "")}>
        <span className="pl-kicker">{plan ? "Your plan" : "Choose a plan"}</span>
        <span className="pl-name">{plan ? name : "—"}</span>
        <span className="pl-total">{price ? <>{fmtIQD(price)}<i>IQD</i></> : <i>Total</i>}</span>
      </div>

      <Group label="NFC card" value={nfcLabel} items={NFC} selected={nfc} onPick={setNfc} />
      <Group label="Profile" value={profLabel} items={PROFILE} selected={prof} onPick={setProf} />
      <Group label="Duration" value={durLabel} items={DURATION} selected={dur} onPick={setDur} />

      <button type="button" className="pl-get" disabled={!plan || !dur} onClick={get}>
        {plan && dur ? <>Get {name}</> : "Choose your options"}
      </button>
    </>
  );
}
