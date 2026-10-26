// After the city step: the person chooses what they want to do.
// Four equal tiles fill the screen under the heading. Search and wallet are free; the profile needs a sign-in first; an existing account logs in.
import React from "react";
import { Back } from "../owner/Owner.jsx";
import { Icon } from "../browse/icons.jsx";
import "./plans.css";

const TILES = [
  { key: "find", kind: "gold", icon: "search", title: "Search for a service", sub: "Find trusted services in your city", free: true },
  { key: "wallet", kind: "mint", icon: "wallet", title: "Create a wallet", sub: "Save business cards and call in one tap", free: true },
  { key: "profile", kind: "sky", icon: "user", title: "Create a profile", sub: "List your business and order a card" },
  { key: "login", kind: "ink", icon: "key", title: "I already have an account", sub: "Log in with your email" },
];

export function PathChooser({ lang, go, signedIn }) {
  const choose = (target) => {
    if (target === "find") { go("/home"); return; }
    if (target === "login") {
      if (signedIn) { go("/home"); return; }
      try { sessionStorage.setItem("bm_after", "/home"); } catch { /* ignore */ }
      go("/signin");
      return;
    }
    const dest = target === "wallet" ? "/wallet" : "/plans";
    if (signedIn) { go(dest); return; }
    try { sessionStorage.setItem("bm_after", dest); } catch { /* ignore */ }
    go("/signin");
  };
  return (
    <div className="pa-page">
      <div className="top"><Back lang={lang} onClick={() => go("/welcome")} /><span className="grow" /></div>
      <div className="stack">
        <h1>What do you want to do?</h1>
        <p className="sub">You can change this later.</p>
      </div>
      <div className="pa-grid">
        {TILES.map((t, i) => (
          <button key={t.key} type="button" className={"pa-tile pa-" + t.kind + " bm-arrive"} style={{ "--i": i }} onClick={() => choose(t.key)}>
            <span className="pa-top">
              <span className="pa-chip"><Icon name={t.icon} size={22} stroke={2} /></span>
              {t.free ? <span className="pa-free">Free</span> : null}
            </span>
            <span className="pa-text">
              <b>{t.title}</b>
              <small>{t.sub}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
