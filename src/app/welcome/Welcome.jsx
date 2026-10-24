// First open: a dark stage with a swipeable stack of Bmnassa cards, then a curved panel with the welcome, language and two buttons.
// Swipe the cards (or let them advance on their own); "Get started" slides the panel up to choose a city; "Sign in" goes straight to signing in.
import React, { useEffect, useRef, useState } from "react";
import { t, LANGS, FALLBACK_CITIES, cityName } from "../i18n.js";
import { getCities } from "../api.js";
import { NfcCard, cardSettings } from "../card/CardFaces.jsx";
import { haptic } from "../motion.js";
import "./welcome.css";

// Twelve sample cards for the stack (made-up businesses, never real ones)
const COLORS = ["#1b2a4a", "#0f5c5c", "#5a1a26", "#2b3f6b", "#4a3b12", "#14213d", "#1f4d3a", "#4b2a5c", "#3a2a14", "#0d3b4f", "#5c3a1a", "#2e2e4a"];
const N = COLORS.length;
const PLACEHOLDER = {
  en: ["Your Name", "Your Business", "Your Profession"],
  ku: ["ناوی تۆ", "بزنسەکەت", "پیشەکەت"],
  ar: ["اسمك", "عملك", "مهنتك"],
};

function sampleCard(i, lang) {
  const [name, biz, job] = PLACEHOLDER[lang] || PLACEHOLDER.en;
  const b = {
    id: -(i + 1), handle: "x", phone: "+9647500000000", whatsapp: "+9647500000000", instagram: "x", email: "a@b.c",
    card: { style: "wallet", color: COLORS[i] },
    contact_name: name, name_en: biz, name_ku: biz, name_ar: biz,
  };
  return { b, job };
}

export function Welcome({ lang, setLang, city, setCity, onDone, onSignIn }) {
  const [step, setStep] = useState("hello");
  const [cities, setCities] = useState(FALLBACK_CITIES);
  const [active, setActive] = useState(0);
  const [dragDx, setDragDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);
  const paused = useRef(false);

  useEffect(() => { getCities().then((rows) => { if (rows && rows.length) setCities(rows); }).catch(() => {}); }, []);

  // the stack moves on by itself, unless the person is touching it or prefers less motion
  useEffect(() => {
    if (step !== "hello") return undefined;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = setInterval(() => { if (!paused.current) setActive((a) => (a + 1) % N); }, 3800);
    return () => clearInterval(id);
  }, [step]);

  const onDown = (e) => { drag.current = { x: e.clientX }; paused.current = true; setDragging(true); setDragDx(0); };
  const onMove = (e) => { if (drag.current) setDragDx(e.clientX - drag.current.x); };
  const onUp = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    drag.current = null;
    setDragging(false);
    setDragDx(0);
    paused.current = false;
    if (dx < -40) { haptic(6); setActive((a) => (a + 1) % N); }
    else if (dx > 40) { haptic(6); setActive((a) => (a - 1 + N) % N); }
  };

  const start = () => { haptic(10); setStep("city"); };
  return (
    <div className={"wl step-" + step}>
      <div className="wl-stage">
        <div className="wl-glow" aria-hidden="true" />
        <div className="wl-sky" aria-hidden="true">
          <div className="wl-pan">
            <img src="/brand/kurdistan-skyline.webp" alt="" draggable="false" />
            <img src="/brand/kurdistan-skyline.webp" alt="" draggable="false" />
          </div>
        </div>
        <div
          className="wl-deck"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerLeave={onUp}
        >
          {COLORS.map((_, i) => {
            let d = i - active;
            if (d > N / 2) d -= N;
            if (d < -N / 2) d += N;
            const abs = Math.abs(d);
            const hidden = abs > 2;
            const px = d * 120 + (d === 0 ? dragDx : dragDx * 0.3);
            const { b, job } = sampleCard(i, lang);
            return (
              <div
                key={i}
                className="wl-deck-card wl-fit"
                aria-hidden="true"
                style={{
                  transform: `translate(-50%, -50%) translate3d(${px}px, 0, ${-abs * 70}px) rotateY(${-d * 24}deg) scale(${1 - abs * 0.1})`,
                  opacity: hidden ? 0 : 1 - abs * 0.3,
                  zIndex: 10 - abs,
                  transition: dragging ? "none" : undefined,
                  pointerEvents: "none",
                }}
              >
                <NfcCard b={b} s={cardSettings(b)} lang={lang} cat={{ name_en: job, name_ku: job, name_ar: job }} linksOnly />
              </div>
            );
          })}
        </div>
        <span className="wl-count" aria-hidden="true">{active + 1} / {N}</span>
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
