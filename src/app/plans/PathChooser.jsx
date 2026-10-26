// After the city step: the person chooses what they want to do, laid out like the home screen's bento tiles.
// Search and wallet are free; the profile needs a sign-in first; an existing account logs in.
import React from "react";
import { Back } from "../owner/Owner.jsx";
import { Icon } from "../browse/icons.jsx";
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
      <div className="h-bento pa-bento">
        <button type="button" className="h-big bm-arrive" style={{ "--i": 0 }} onClick={() => choose("find")}>
          <small>Free</small>
          <b>Search for a service</b>
          <span className="h-near">Find trusted services in your city <Icon name="chevron" size={14} className="flip" /></span>
          <i aria-hidden="true"><Icon name="search" size={84} stroke={1.2} /></i>
        </button>
        <button type="button" className="h-med bm-arrive" style={{ "--i": 1 }} onClick={() => choose("wallet")}>
          <Icon name="wallet" size={22} />
          <b>Create a wallet</b>
          <small>Free. Save cards</small>
        </button>
        <button type="button" className="h-med bm-arrive" style={{ "--i": 2 }} onClick={() => choose("profile")}>
          <Icon name="user" size={22} />
          <b>Create a profile</b>
          <small>List your business</small>
        </button>
      </div>
      <button type="button" className="b-search pa-login bm-arrive" style={{ "--i": 3 }} onClick={() => choose("login")}>
        <Icon name="key" size={19} /> <span>I already have an account</span>
      </button>
    </>
  );
}
