// The plan chooser: one screen with three groups (NFC card, profile, duration).
// The header shows the plan name and total as the choices are made; "Get <plan>" saves the choice.
import React, { useState, useEffect } from "react";
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
// one colour per plan (same as the prototype); the unchosen state uses the default gold
export const COLORS = {
  Basic: { main: "#4cc3a0", soft: "#e6f8f3", deep: "#0f6b57" },
  Smart: { main: "#5b9cf0", soft: "#e8f1fe", deep: "#1d4f9e" },
  Standard: { main: "#8b8fe8", soft: "#eeeefd", deep: "#3d40a8" },
  Gold: { main: "#f5c33b", soft: "#fff6d6", deep: "#8a6a10" },
  Silver: { main: "#b9c1cc", soft: "#f0f2f5", deep: "#4b5563" },
  Premium: { main: "#c05fb0", soft: "#fbeaf6", deep: "#7a2a6c" },
};
// what each plan includes (shown when the info icon is tapped)
const INCLUDES = {
  Basic: ["Listed in Bmnassa categories", "Business profile page", "Call and WhatsApp buttons", "Customer reviews", "Digital swipeable card on your phone", "No NFC card"],
  Smart: ["Listed in Bmnassa categories", "Custom profile page design", "Call and WhatsApp buttons", "Customer reviews", "Digital swipeable card on your phone", "No NFC card"],
  Standard: ["Bmnassa NFC card, ready to order", "Business profile page", "Call and WhatsApp buttons", "Listed in Bmnassa categories", "Digital swipeable card on your phone"],
  Gold: ["Bmnassa NFC card, ready to order", "Custom profile with portfolio", "Designed with our team", "Call and WhatsApp buttons", "Listed in Bmnassa categories", "Digital swipeable card on your phone"],
  Silver: ["Custom NFC card, your own design", "Business profile page", "Call and WhatsApp buttons", "Listed in Bmnassa categories", "Digital swipeable card on your phone"],
  Premium: ["Custom NFC card, your own design", "Custom profile with portfolio", "Designed with our team", "Call and WhatsApp buttons", "Listed in Bmnassa categories", "Digital swipeable card on your phone"],
};
const DEFAULT_COLOR = { main: "#f5c33b", soft: "#fffaec", deep: "#15171a" };

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

function Group({ label, value, items, selected, onPick, group }) {
  return (
    <div className="pl-group">
      <div className="pl-glabel"><span>{label}</span><em>{value || ""}</em></div>
      <div className={"pl-opts " + (items.length === 3 ? "three" : "two")}>
        {items.map((o) => (
          <button key={o.v} type="button" data-custom={group === "prof" && o.v === "custom" ? "1" : undefined} className={"pl-opt" + (selected === o.v ? " sel" : "")} onClick={() => onPick(o.v)}>
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
  const [open, setOpen] = useState(false);

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
    go("/plan/setup");
  };

  const complete = !!(plan && dur);
  // the app-style header only shows before any choice is made
  const pristine = !nfc && !prof && !dur;
  // the info panel only exists once all three choices are made, and closes when a choice changes
  useEffect(() => { if (!complete) setOpen(false); }, [complete]);
  const items = plan ? [...INCLUDES[plan.name], dur === "year" ? "Listed for one year" : "Listed permanently"] : [];

  const c = plan ? COLORS[plan.name] : DEFAULT_COLOR;
  const soon = prof === "custom";
  const vars = { "--main": c.main, "--soft": c.soft, "--deep": c.deep };

  return (
    <div className={"pl-screen" + (soon ? " soonp" : "")} style={vars}>
      <div className="top"><Back lang={lang} onClick={() => go("/path")} /><span className="grow" />{pristine ? <img className="logo" src="/brand/logo-ink.svg" alt="Bmnassa" /> : null}</div>
      {pristine ? (
        <div className="stack pl-title">
          <h1>Choose your plan</h1>
          <p className="sub">Pick a card, a profile and a duration.</p>
        </div>
      ) : null}
      {complete || soon ? (
        <div className={"pl-head" + (open ? " open" : "")}>
          <div className="pl-top">
            <span className="pl-kicker">{soon ? "Coming soon" : "Digital card"}</span>
            {complete ? (
              <button type="button" className="pl-info" aria-label="What is included" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
                <svg className="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 7.5v.5" /></svg>
                <svg className="i-close" viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17" /></svg>
              </button>
            ) : null}
          </div>
          {complete ? <span className="pl-name">{name}</span> : null}
          <span className="pl-total"><small>Total</small>{price ? <b>{fmtIQD(price)} IQD</b> : <b>—</b>}</span>
          {complete ? (
            <div className="pl-more"><div className="pl-moreIn">
              <p className="pl-more-t">{name} includes</p>
              <ul className="pl-list">{items.map((t) => <li key={t}>{t}</li>)}</ul>
            </div></div>
          ) : null}
        </div>
      ) : null}

      <Group group="nfc" label="NFC card" value={nfcLabel} items={NFC} selected={nfc} onPick={setNfc} />
      <Group group="prof" label="Profile" value={profLabel} items={PROFILE} selected={prof} onPick={setProf} />
      <Group group="dur" label="Duration" value={durLabel} items={DURATION} selected={dur} onPick={setDur} />

      <button type="button" className={"pl-get" + (soon ? " soon" : "")} disabled={!plan || !dur || soon} onClick={get}>
        {soon ? "Coming soon" : plan && dur ? <>Get {name}</> : "Choose your options"}
      </button>
    </div>
  );
}
