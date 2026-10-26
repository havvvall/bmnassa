// After the city step: the person chooses what they want to do.
// Find a service needs no account; the wallet and the profile need a sign-in first.
import React from "react";
import { Back } from "../owner/Owner.jsx";
import "./plans.css";

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
    <>
      <div className="top"><Back lang={lang} onClick={() => go("/welcome")} /><span className="grow" /></div>
      <div className="stack">
        <h1>What do you want to do?</h1>
        <p className="sub">You can change this later.</p>
      </div>
      <div className="stack">
        <button type="button" className="choice pl-choice" onClick={() => choose("find")}>
          <span className="pl-info"><b>Find a service near me</b><small>Search trusted services in your city. No account needed.</small></span>
        </button>
        <button type="button" className="choice pl-choice" onClick={() => choose("wallet")}>
          <span className="pl-info"><b>Create a free digital wallet</b><small>Save business cards and call in one tap.</small></span>
        </button>
        <button type="button" className="choice pl-choice" onClick={() => choose("profile")}>
          <span className="pl-info"><b>Create a profile and digital business card</b><small>List your business and order an NFC card.</small></span>
        </button>
        <button type="button" className="choice pl-choice" onClick={() => choose("login")}>
          <span className="pl-info"><b>I already have an account</b><small>Log in with the email you used before.</small></span>
        </button>
      </div>
    </>
  );
}
