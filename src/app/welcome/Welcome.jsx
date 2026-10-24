// First open: a dark stage of floating Bmnassa cards, then a curved panel with the welcome, language and two buttons.
// "Get started" slides the panel up to choose a city; "Sign in" goes straight to signing in.
import React, { useEffect, useState } from "react";
import { t, LANGS, FALLBACK_CITIES, cityName } from "../i18n.js";
import { getCities } from "../api.js";
import { haptic } from "../motion.js";
import "./welcome.css";


export function Welcome({ lang, setLang, city, setCity, onDone, onSignIn }) {
  const [step, setStep] = useState("hello");
  const [cities, setCities] = useState(FALLBACK_CITIES);
  useEffect(() => { getCities().then((rows) => { if (rows && rows.length) setCities(rows); }).catch(() => {}); }, []);
  const start = () => { haptic(10); setStep("city"); };
  return (
    <div className={"wl step-" + step}>
      <div className="wl-stage" aria-hidden="true">
        <div className="wl-glow" />
        <div className="wl-sky">
          <div className="wl-pan">
            <img src="/brand/kurdistan-skyline.webp" alt="" draggable="false" />
            <img src="/brand/kurdistan-skyline.webp" alt="" draggable="false" />
          </div>
        </div>
        <div className="wl-brand">
          <img className="wl-word" src="/brand/logo-silver.svg" alt="" />
          <span className="wl-tag">{t(lang, "tagline")}</span>
        </div>
      </div>

      <div className="wl-panel">
        <svg className="wl-curve" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40 C 110 0, 290 0, 400 40 Z" /></svg>
        {step === "hello" ? (
          <div className="wl-body" key="hello">
            <div className="wl-langs" role="group" aria-label={t(lang, "choose_lang")}>
              {LANGS.map((l) => (
                <button key={l.id} type="button" dir={l.dir} aria-pressed={lang === l.id} onClick={() => setLang(l.id)}>{l.label}</button>
              ))}
            </div>
            <h1 className="wl-h1">{t(lang, "wl_title")}</h1>
            <p className="wl-sub">{t(lang, "wl_sub1")}<br />{t(lang, "wl_sub2")}</p>
            <button type="button" className="wl-btn dark" onClick={start}>{t(lang, "wl_start")}</button>
            <button type="button" className="wl-btn line" onClick={onSignIn}>{t(lang, "signin_title")}</button>
            <span className="wl-foot">{t(lang, "region")}</span>
          </div>
        ) : (
          <div className="wl-body" key="city">
            <h1 className="wl-h2">{t(lang, "wl_city")}</h1>
            <p className="wl-sub">{t(lang, "wl_city_sub")}</p>
            <div className="wl-cities" role="group" aria-label={t(lang, "choose_city")}>
              {cities.map((c) => (
                <button key={c.id} type="button" disabled={!c.live} aria-pressed={city === c.id} onClick={() => { if (c.live) { haptic(8); setCity(c.id); } }}>
                  <span>{cityName(c, lang)}</span>
                  {c.live ? <i className="wl-tick" aria-hidden="true">{city === c.id ? "✓" : ""}</i> : <small>{t(lang, "coming_soon")}</small>}
                </button>
              ))}
            </div>
            <button type="button" className="wl-btn dark" disabled={!city} onClick={onDone}>{t(lang, "continue")}</button>
            <button type="button" className="wl-back" onClick={() => setStep("hello")}>{t(lang, "back")}</button>
          </div>
        )}
      </div>
    </div>
  );
}
