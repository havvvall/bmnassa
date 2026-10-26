// After the city step: the person chooses what they want to do.
// Find a service needs no account; the wallet and the profile need a sign-in first.
import React from "react";
import "./plans.css";

export function PathChooser({ go, signedIn }) {
  const choose = (target) => {
    if (target === "find") { go("/home"); return; }
    const dest = target === "wallet" ? "/wallet" : "/plans";
    if (signedIn) { go(dest); return; }
    try { sessionStorage.setItem("bm_after", dest); } catch { /* ignore */ }
    go("/signin");
  };
  return (
    <div className="pl-page">
      <div className="pl-top">
        <small>Bmnassa</small>
        <h1>What do you want to do?</h1>
        <p>You can change this later.</p>
      </div>
      <div className="pl-paths">
        <button type="button" className="pl-path" onClick={() => choose("find")}>
          <b>Find a service near me</b>
          <small>Search trusted services in your city. No account needed.</small>
        </button>
        <button type="button" className="pl-path" onClick={() => choose("wallet")}>
          <b>Create a free digital wallet</b>
          <small>Save business cards and call in one tap.</small>
        </button>
        <button type="button" className="pl-path" onClick={() => choose("profile")}>
          <b>Create a profile and digital business card</b>
          <small>List your business and order an NFC card.</small>
        </button>
      </div>
      <button type="button" className="pl-back" onClick={() => go("/welcome")}>Back</button>
    </div>
  );
}
