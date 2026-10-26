import { THEMES, getThemeChoice, setThemeChoice, applyTheme } from "./theme.js";
import React, { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { haptic } from "./motion.js";
import "./app.css";
import { SkelRows } from "./Skeleton.jsx";

applyTheme();

// Android: a short vibration when a main button is pressed (iPhones only show the press)
document.addEventListener("pointerdown", (e) => {
  const el = e.target && e.target.closest && e.target.closest(".btn:not(.ghost):not([disabled]), .b-act, .sc-shutter, .b-nav button");
  if (el) haptic(10);
}, { passive: true });
import Team from "./team/Team.jsx";
import { Home, Results, Card, BizPage, BottomNav } from "./browse/Browse.jsx";
import { Dashboard, EditPage } from "./owner/Owner.jsx";
import Studio from "./card/Studio.jsx";
import OrderNfc from "./owner/OrderNfc.jsx";
import { ReviewsPage, RatePage } from "./reviews/Reviews.jsx";
import { WalletPage } from "./wallet/Wallet.jsx";
import { ScanPage, EditScanPage } from "./scan/Scan.jsx";
import { Welcome } from "./welcome/Welcome.jsx";
import { PathChooser } from "./plans/PathChooser.jsx";
import { PlanChooser } from "./plans/PlanChooser.jsx";
import { Icon } from "./browse/icons.jsx";
import "./account.css";
import { t, dirOf, LANGS, FALLBACK_CITIES, cityName } from "./i18n.js";
import {
  normaliseEmail, sendCode, verifyCode, signOut,
  getSession, getMyProfile, updateMyProfile, getCities,
  normalisePhone, prettyPhone, getCategories, getPlaces, getMyBusinesses, createBusiness, getStats,
  getDailyViews, getMyReviews, getWallet,
} from "./api.js";

// ---------- small helpers ----------

// Words used by the app itself; any other single word is a business page name (bmnassa.com/azad-cooling)
const APP_WORDS = new Set(["", "home", "welcome", "signin", "verify", "name", "account", "list", "team", "search", "c",
  "admin", "register", "stand", "invitation", "brand", "wallet", "scan", "my", "path", "plans"]);

function businessPath(path) {
  const m = /^\/([a-z0-9][a-z0-9-]{0,60})(\/card|\/reviews|\/rate)?\/?$/i.exec(path || "");
  if (!m || APP_WORDS.has(m[1].toLowerCase())) return null;
  const part = (m[2] || "").slice(1);
  return { handle: m[1].toLowerCase(), card: part === "card", part };
}
const isBusinessPath = (p) => !!businessPath(p);

const store = {
  get(k, d) { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};

// Screens cross-fade and rise a little when they change (View Transitions, where the browser has them).
// The card screen has its own slide-up, the camera opens straight away, and Reduce motion keeps it to a quick fade.
function transition(from, to, dir, apply) {
  const own = (p) => /\/card$/.test(p) || p === "/scan" || p.startsWith("/team");
  if (!document.startViewTransition || from === to || own(from) || own(to) || document.hidden) { apply(); return; }
  document.documentElement.dataset.nav = dir;
  try {
    document.startViewTransition(() => flushSync(apply));
  } catch {
    apply();
  }
}

function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    let shown = window.location.pathname;
    const on = () => {
      const to = window.location.pathname;
      transition(shown, to, "back", () => setPath(to));
      shown = to;
    };
    window.addEventListener("popstate", on);
    return () => window.removeEventListener("popstate", on);
  }, []);
  const go = (p, replace) => {
    if (p === window.location.pathname + window.location.search + window.location.hash) return;
    const from = window.location.pathname;
    transition(from, p.split(/[?#]/)[0], "forward", () => {
      window.history[replace ? "replaceState" : "pushState"]({}, "", p);
      // The screen is chosen by the path alone; "?q=…" and "#hours" are read by the screen itself
      setPath(window.location.pathname);
      window.scrollTo(0, 0);
    });
  };
  return [path, go];
}

function errorKey(e) {
  const c = String((e && e.code) || "");
  if (c === "network") return "send_failed";
  if ((e && e.status === 429) || /rate_limit/.test(c)) return "too_many";
  if (/provider_disabled|email_provider|signups? not allowed|otp_disabled/i.test(c + " " + (e && e.message))) return "not_ready";
  return "send_failed";
}

// While testing, show the technical reason under the message so problems can be fixed quickly.
function errorDetail(e) {
  if (!e) return "";
  return [e.status, e.code, e.message].filter(Boolean).join(" · ");
}

const Back = ({ onClick, lang }) => (
  <button type="button" className="rbtn" aria-label={t(lang, "back")} onClick={onClick}>
    <svg className="flip" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
  </button>
);

const TestTag = ({ lang }) => <span className="tag">{t(lang, "test_version")}</span>;

// ---------- screens ----------

function Splash({ lang }) {
  return (
    <div className="splash" dir={dirOf(lang)}>
      <img className="logo" src="/brand/logo-silver.svg" alt="Bmnassa" />
      <div className="line">{t(lang, "tagline")}</div>
      <div className="dots" aria-hidden="true"><span /><span /><span /></div>
      <div className="foot">{t(lang, "region")}</div>
    </div>
  );
}

function SignIn({ lang, email, setEmail, onSent, onBack }) {
  const [value, setValue] = useState(email || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [detail, setDetail] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    const m = normaliseEmail(value);
    if (!m) { setErr("email_invalid"); return; }
    setBusy(true); setErr(""); setDetail("");
    try {
      await sendCode(m);
      setEmail(m);
      onSent();
    } catch (ex) {
      setErr(errorKey(ex));
      setDetail(errorDetail(ex));
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="wl si" noValidate>
      <div className="wl-stage si-stage" aria-hidden="true">
        <div className="wl-glow" />
        <div className="wl-brand">
          <img className="wl-word" src="/brand/logo-silver.svg" alt="" />
          <span className="wl-tag">{t(lang, "tagline")}</span>
        </div>
      </div>
      <div className="si-top">
        <Back lang={lang} onClick={onBack} />
        <span className="grow" />
        <TestTag lang={lang} />
      </div>
      <div className="wl-panel">
        <svg className="wl-curve" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40 C 110 0, 290 0, 400 40 Z" /></svg>
        <div className="wl-body si-body">
          <h1 className="wl-h1">{t(lang, "signin_title")}</h1>
          <p className="wl-sub">{t(lang, "signin_sub")}</p>
          <label className="si-label" htmlFor="email">{t(lang, "email_label")}</label>
          <div className={"si-field ltr" + (err === "email_invalid" ? " invalid" : "")}>
            <input id="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false}
              placeholder="name@gmail.com" dir="ltr"
              value={value} onChange={(e) => { setValue(e.target.value); setErr(""); }} aria-invalid={err === "email_invalid"} aria-describedby="email-err" />
          </div>
          <div id="email-err" className="err" role="alert">{err ? t(lang, err) : ""}</div>
          {detail ? <div className="si-note ltr">{detail}</div> : null}
          <p className="si-note">{t(lang, "privacy")}</p>
          <button type="submit" className="wl-btn dark" disabled={busy || !value.trim()}>{busy ? t(lang, "loading") : t(lang, "send_code")}</button>
        </div>
      </div>
    </form>
  );
}

function Verify({ lang, email, onVerified, onChangeEmail }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [wait, setWait] = useState(60);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);
  useEffect(() => {
    if (wait <= 0) return;
    const id = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(id);
  }, [wait]);

  const check = async (token) => {
    setBusy(true); setErr("");
    try {
      await verifyCode(email, token);
      onVerified();
    } catch (ex) {
      setErr(ex.status === 429 ? "too_many" : ex.code === "network" ? "send_failed" : "code_wrong");
      setCode("");
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setErr("");
    try {
      await sendCode(email);
      setWait(60);
    } catch (ex) {
      setErr(errorKey(ex));
    }
  };

  const onInput = (e) => {
    const v = e.target.value
      .replace(/[٠-٩]/g, (c) => "٠١٢٣٤٥٦٧٨٩".indexOf(c))
      .replace(/[۰-۹]/g, (c) => "۰۱۲۳۴۵۶۷۸۹".indexOf(c))
      .replace(/\D/g, "").slice(0, 6);
    setCode(v); setErr("");
    if (v.length === 6 && !busy) check(v);
  };

  const mm = `${Math.floor(Math.max(wait, 0) / 60)}:${String(Math.max(wait, 0) % 60).padStart(2, "0")}`;

  return (
    <>
      <div className="top"><Back lang={lang} onClick={onChangeEmail} /><span className="grow" /><TestTag lang={lang} /></div>
      <div className="stack">
        <h1>{t(lang, "verify_title")}</h1>
        <p className="sub">
          {t(lang, "sent_email")}{" "}
          <b><bdi dir="ltr">{email}</bdi></b>{" "}
          <button type="button" className="link" onClick={onChangeEmail}>{t(lang, "change")}</button>
        </p>
      </div>
      <div className="stack">
        <label className="label" htmlFor="code">{t(lang, "enter_code")}</label>
        <input id="code" ref={inputRef} className="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]*"
          maxLength={6} value={code} onChange={onInput} aria-invalid={!!err} aria-describedby="code-err" disabled={busy} />
        <div id="code-err" className="err" role="alert">{err ? t(lang, err) : ""}</div>
        <p className="note">{t(lang, "spam_hint")}</p>
      </div>
      <div className="stack" style={{ alignItems: "flex-start" }}>
        <button type="button" className="link" disabled={wait > 0} onClick={resend}>
          {wait > 0 ? t(lang, "resend_in", { s: mm }) : t(lang, "resend")}
        </button>
      </div>
      <span className="spacer" />
      <button type="button" className="btn" disabled={busy || code.length !== 6} onClick={() => check(code)}>
        {busy ? t(lang, "loading") : t(lang, "verify")}
      </button>
    </>
  );
}

function NameStep({ lang, profile, onSaved }) {
  const [name, setName] = useState((profile && profile.full_name) || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  const save = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true); setErr(false);
    try {
      const row = await updateMyProfile({ full_name: name.trim() });
      onSaved(row);
    } catch {
      setErr(true);
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={save} style={{ display: "contents" }}>
      <div className="top"><img className="logo" src="/brand/logo-ink.svg" alt="Bmnassa" /><span className="grow" /><TestTag lang={lang} /></div>
      <div className="stack">
        <h1>{t(lang, "name_title")}</h1>
        <p className="sub">{t(lang, "name_sub")}</p>
      </div>
      <div className="stack">
        <label className="label" htmlFor="name">{t(lang, "name_ph")}</label>
        <div className="field"><input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} /></div>
        <div className="err" role="alert">{err ? t(lang, "save_failed") : ""}</div>
      </div>
      <span className="spacer" />
      <button type="submit" className="btn" disabled={busy || !name.trim()}>{busy ? t(lang, "loading") : t(lang, "continue")}</button>
    </form>
  );
}

// ---------- slice 2: list your business ----------

const DRAFT_KEY = "bm_list_draft";
const emptyDraft = { name: "", category_id: "", city_id: "", district_id: "", subdistrict_id: "", phone: "", description: "" };

function bizName(b, lang) {
  return (b && (b["name_" + lang] || b.name_en || b.name_ku || b.name_ar)) || "";
}

const Chevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
);

function Pick({ id, label, value, onChange, placeholder, options, lang, disabled, invalid }) {
  return (
    <div className="stack" style={{ gap: 6 }}>
      <label className="label" htmlFor={id}>{label}</label>
      <div className={"field pick" + (invalid ? " invalid" : "") + (disabled ? " off" : "")}>
        <select id={id} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid || undefined}>
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o.id} value={o.id}>{cityName(o, lang)}</option>)}
        </select>
        <Chevron />
      </div>
    </div>
  );
}

function ListBusiness({ lang, profile, onSent, onBack }) {
  const [d, setD] = useState(() => {
    try { return { ...emptyDraft, city_id: (profile && profile.city_id) || "", ...JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}") }; }
    catch { return { ...emptyDraft, city_id: (profile && profile.city_id) || "" }; }
  });
  const [lists, setLists] = useState(null);
  const [loadErr, setLoadErr] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [detail, setDetail] = useState("");
  const [tried, setTried] = useState(false);

  const load = () => {
    setLoadErr(false);
    Promise.all([getCategories(), getCities(), getPlaces()])
      .then(([cats, cities, places]) => setLists({ cats: cats || [], cities: (cities && cities.length ? cities : FALLBACK_CITIES), ...places }))
      .catch(() => setLoadErr(true));
  };
  useEffect(load, []);
  useEffect(() => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch { /* ignore */ } }, [d]);

  const set = (k, v) => {
    setErr("");
    setD((old) => {
      const n = { ...old, [k]: v };
      if (k === "city_id") { n.district_id = ""; n.subdistrict_id = ""; }
      if (k === "district_id") {
        n.subdistrict_id = "";
        const subs = lists ? lists.subdistricts.filter((x) => x.district_id === v) : [];
        if (subs.length === 1) n.subdistrict_id = subs[0].id;
      }
      return n;
    });
  };

  const districts = lists ? lists.districts.filter((x) => x.city_id === d.city_id) : [];
  const subdistricts = lists ? lists.subdistricts.filter((x) => x.district_id === d.district_id) : [];
  const phone = normalisePhone(d.phone);
  const missing = {
    name: !d.name.trim(),
    category_id: !d.category_id, city_id: !d.city_id, district_id: !d.district_id, subdistrict_id: !d.subdistrict_id,
    phone: !phone,
  };

  const submit = async (e) => {
    e.preventDefault();
    setTried(true);
    if (missing.name) { setErr("name_required"); return; }
    if (missing.category_id || missing.city_id || missing.district_id || missing.subdistrict_id) { setErr("pick_required"); return; }
    if (missing.phone) { setErr("biz_phone_invalid"); return; }
    setBusy(true); setErr(""); setDetail("");
    try {
      const row = await createBusiness({
        name: d.name.trim(), description: d.description.trim(), lang,
        category_id: d.category_id, city_id: d.city_id, district_id: d.district_id, subdistrict_id: d.subdistrict_id,
        phone,
      });
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      onSent(row || { name_en: d.name.trim() });
    } catch (ex) {
      setErr("send_biz_failed");
      setDetail(errorDetail(ex));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "contents" }} noValidate>
      <div className="top"><Back lang={lang} onClick={onBack} /><span className="grow" /><TestTag lang={lang} /></div>
      <div className="stack">
        <h1>{t(lang, "list_title")}</h1>
        <p className="sub">{t(lang, "list_sub")}</p>
      </div>

      {loadErr ? (
        <div className="panel" style={{ padding: 16 }}>
          <div className="err">{t(lang, "places_failed")}</div>
          <button type="button" className="link" onClick={load}>{t(lang, "try_again")}</button>
        </div>
      ) : !lists ? (
        <SkelRows n={4} avatar={false} />
      ) : (
        <>
          <div className="stack" style={{ gap: 6 }}>
            <label className="label" htmlFor="bname">{t(lang, "biz_name")}</label>
            <div className={"field" + (tried && missing.name ? " invalid" : "")}>
              <input id="bname" value={d.name} maxLength={80} autoComplete="organization" placeholder={t(lang, "biz_name_ph")}
                onChange={(e) => set("name", e.target.value)} />
            </div>
          </div>
          <Pick id="bcat" label={t(lang, "category")} value={d.category_id} onChange={(v) => set("category_id", v)}
            placeholder={t(lang, "choose_category")} options={lists.cats} lang={lang} invalid={tried && missing.category_id} />
          <Pick id="bcity" label={t(lang, "city")} value={d.city_id} onChange={(v) => set("city_id", v)}
            placeholder={t(lang, "choose_city_first")} options={lists.cities} lang={lang} invalid={tried && missing.city_id} />
          <div className="pair">
            <Pick id="bdist" label={t(lang, "district")} value={d.district_id} onChange={(v) => set("district_id", v)}
              placeholder={t(lang, "choose_district")} options={districts} lang={lang} disabled={!d.city_id} invalid={tried && missing.district_id} />
            <Pick id="bsub" label={t(lang, "subdistrict")} value={d.subdistrict_id} onChange={(v) => set("subdistrict_id", v)}
              placeholder={t(lang, "choose_subdistrict")} options={subdistricts} lang={lang} disabled={!d.district_id} invalid={tried && missing.subdistrict_id} />
          </div>
          <div className="stack" style={{ gap: 6 }}>
            <label className="label" htmlFor="bphone">{t(lang, "biz_phone")}</label>
            <div className={"field ltr" + (tried && missing.phone ? " invalid" : "")}>
              <span className="prefix">+964</span>
              <input id="bphone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="0770 123 4567"
                value={d.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
          </div>
          <div className="stack" style={{ gap: 6 }}>
            <label className="label" htmlFor="bdesc">{t(lang, "description")} <span className="opt">· {t(lang, "optional")}</span></label>
            <div className="field area">
              <textarea id="bdesc" rows={3} maxLength={300} placeholder={t(lang, "desc_ph")}
                value={d.description} onChange={(e) => set("description", e.target.value)} />
            </div>
            <p className="note">{t(lang, "other_langs")}</p>
          </div>
          <div className="err" role="alert">{err ? t(lang, err) : ""}</div>
          {detail ? <div className="note ltr" style={{ fontSize: 11 }}>{detail}</div> : null}
          <span className="spacer" />
          <p className="note">{t(lang, "review_note")}</p>
          <button type="submit" className="btn" disabled={busy}>{busy ? t(lang, "loading") : t(lang, "send_review")}</button>
        </>
      )}
    </form>
  );
}

function Sent({ lang, business, onDone }) {
  return (
    <>
      <div className="top"><img className="logo" src="/brand/logo-ink.svg" alt="Bmnassa" /><span className="grow" /><TestTag lang={lang} /></div>
      <div className="sent-mark" aria-hidden="true">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
      </div>
      <div className="stack">
        <h1>{t(lang, "sent_title")}</h1>
        <p className="sub">{t(lang, "sent_sub", { name: bizName(business, lang) })}</p>
      </div>
      <div className="panel">
        <div className="row"><span className="v">{bizName(business, lang)}</span><span className="status pending">{t(lang, "st_pending")}</span></div>
      </div>
      <p className="note">{t(lang, "sent_next")}</p>
      <span className="spacer" />
      <button type="button" className="btn" onClick={onDone}>{t(lang, "to_account")}</button>
    </>
  );
}

function MyBusinesses({ lang, onList, go }) {
  const [list, setList] = useState(null);
  const [views, setViews] = useState({});
  useEffect(() => {
    getMyBusinesses().then((r) => {
      setList(r || []);
      (r || []).filter((b) => b.status === "approved").forEach((b) => {
        getStats(b.id).then((s) => setViews((v) => ({ ...v, [b.id]: s.views }))).catch(() => {});
      });
    }).catch(() => setList([]));
  }, []);
  if (list === null) return null;
  return (
    <div className="stack">
      <span className="label">{t(lang, "my_business")}</span>
      <div className="panel">
        {list.map((b) => (
          <button type="button" className="row rowbtn biz" key={b.id} onClick={() => go("/my/" + b.id)}>
            <div className="avatar sm" aria-hidden="true">{bizName(b, lang).trim().charAt(0).toUpperCase() || "B"}</div>
            <span className="v">
              <bdi>{bizName(b, lang)}</bdi>
              {b.status === "approved"
                ? <small className="okline">{t(lang, "live_views", { n: views[b.id] == null ? "…" : views[b.id] })}</small>
                : null}
            </span>
            {b.status !== "approved" ? <span className={"status " + (b.status || "pending")}>{t(lang, "st_" + (b.status || "pending"))}</span> : null}
            <svg className="flip" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
            {b.status === "rejected" && b.rejection_reason ? <p className="reason">{t(lang, "reason")} {b.rejection_reason}</p> : null}
          </button>
        ))}
        <button type="button" className="row rowbtn" onClick={onList}>
          <span className="v">{t(lang, list.length ? "list_another" : "list_free")}</span>
          <svg className="flip" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}

const HELP_WHATSAPP = "9647701218832";

function AccSheet({ title, onClose, children }) {
  return (
    <div className="b-sheet-wrap" onClick={onClose}>
      <div className="b-sheet" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="b-sheet-head"><b>{title}</b><button type="button" className="link" onClick={onClose}>✕</button></div>
        <div className="stack">{children}</div>
      </div>
    </div>
  );
}

// Owner bento: a greeting, this week's views and calls for your business, tiles for wallet, reviews and NFC cards, then settings
function Account({ lang, setLang, profile, setProfile, cityId, setCity, onEditName, onSignedOut, onList, go }) {
  const [cities, setCities] = useState(FALLBACK_CITIES);
  const [saved, setSaved] = useState(false);
  const [sheet, setSheet] = useState("");
  const [biz, setBiz] = useState(null);
  const [days, setDays] = useState(null);
  const [walletN, setWalletN] = useState(null);
  const [reviews, setReviews] = useState(null);
  useEffect(() => { getCities().then((r) => r && r.length && setCities(r)).catch(() => {}); }, []);
  useEffect(() => {
    getMyBusinesses().then((r) => setBiz(r || [])).catch(() => setBiz([]));
    getWallet().then((r) => setWalletN((r || []).length)).catch(() => setWalletN(0));
    getMyReviews().then(setReviews).catch(() => setReviews([]));
  }, []);
  const live = (biz || []).filter((b) => b.status === "approved");
  const main = live[0] || null;
  useEffect(() => { if (main) getDailyViews(main.id).then(setDays).catch(() => setDays([])); }, [main && main.id]);
  const others = (biz || []).filter((b) => b !== main);
  const city = cities.find((c) => c.id === ((profile && profile.city_id) || cityId));
  const name = (profile && profile.full_name) || "";
  const first = name.trim().split(/\s+/)[0] || "";
  const [theme, setTheme] = useState(getThemeChoice);
  const pickTheme = (v) => { setTheme(v); setThemeChoice(v); };
  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 1600); };
  const pickLang = async (l) => {
    setLang(l);
    try { const row = await updateMyProfile({ language: l }); if (row) setProfile(row); flash(); } catch { /* the choice still applies on this phone */ }
  };
  const pickCity = async (id) => {
    setCity(id); setSheet("");
    try { const row = await updateMyProfile({ city_id: id }); if (row) setProfile(row); flash(); } catch { /* still applies on this phone */ }
  };
  const views = days ? days.reduce((a, d) => a + d.views, 0) : null;
  const calls = days ? days.reduce((a, d) => a + d.calls, 0) : null;
  const peak = days ? Math.max(1, ...days.map((d) => d.views)) : 1;
  const Row = ({ ic, k, v, onClick, href }) => {
    const inner = (<><span className="ac-ic"><Icon name={ic} size={17} /></span><span className="grow">{k}</span>{v ? <em>{v}</em> : null}{onClick || href ? <Icon name="chevron" size={16} className="flip ac-cv" /> : null}</>);
    return href ? <a className="ac-row" href={href} target="_blank" rel="noreferrer">{inner}</a>
      : onClick ? <button type="button" className="ac-row" onClick={onClick}>{inner}</button> : <div className="ac-row">{inner}</div>;
  };
  return (
    <div className="ac">
      <div className="ac-top">
        <h1 className="grow">{first ? t(lang, "hi_name", { name: first }) : t(lang, "account")}</h1>
        <button type="button" className="ac-av" onClick={onEditName} aria-label={t(lang, "edit")}>{name.trim().charAt(0).toUpperCase() || "B"}</button>
      </div>

      <div className="ac-bento">
        {main ? (
          <button type="button" className="ac-hero" onClick={() => go("/my/" + main.id)}>
            <small><bdi>{bizName(main, lang)}</bdi></small>
            <b>{views === null ? "…" : t(lang, "n_views", { n: views })}</b>
            <span>{t(lang, "this_week")}{calls ? " · " + t(lang, "n_calls", { n: calls }) : ""}</span>
            <span className="ac-bars" aria-hidden="true">{(days || Array.from({ length: 7 }, () => ({ views: 0 }))).map((d, i) => <i key={i} style={{ height: Math.max(8, (d.views / peak) * 100) + "%" }} />)}</span>
            <span className="ac-hb">
              <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); go("/my/" + main.id + "/edit"); }}>{t(lang, "edit_page")}</span>
              <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); go("/my/" + main.id + "/card"); }}>{t(lang, "card_studio")}</span>
            </span>
          </button>
        ) : (
          <button type="button" className="ac-hero" onClick={onList}>
            <small>{t(lang, "own_biz")}</small>
            <b className="sm">{t(lang, "ac_list_title")}</b>
            <span>{t(lang, "ac_list_sub")}</span>
            <span className="ac-hb"><span>{t(lang, "list_it_free")}</span></span>
          </button>
        )}
        <button type="button" className="ac-tile" onClick={() => go("/wallet")}>
          <Icon name="wallet" size={20} /><b>{walletN === null ? "…" : walletN}</b><small>{t(lang, "saved_cards")}</small>
        </button>
        <button type="button" className="ac-tile" onClick={() => setSheet("reviews")}>
          <Icon name="star" size={20} /><b>{reviews === null ? "…" : reviews.length}</b><small>{t(lang, "my_reviews")}</small>
        </button>
        {main ? (
          <button type="button" className="ac-tile wide" onClick={() => go("/my/" + main.id + "/nfc")}>
            <Icon name="nfc" size={20} /><span className="grow"><b className="sm">{t(lang, "order_nfc_tile")}</b><small>{t(lang, "order_nfc_sub")}</small></span><Icon name="chevron" size={16} className="flip" />
          </button>
        ) : (
          <button type="button" className="ac-tile wide" onClick={() => go("/scan")}>
            <Icon name="scan" size={20} /><span className="grow"><b className="sm">{t(lang, "scan_tile")}</b><small>{t(lang, "scan_tile_sub")}</small></span><Icon name="chevron" size={16} className="flip" />
          </button>
        )}
      </div>

      {others.length || main ? (
        <div className="ac-list">
          {others.map((b) => (
            <button type="button" key={b.id} className="ac-biz" onClick={() => go("/my/" + b.id)}>
              <span className="ac-bav">{bizName(b, lang).trim().charAt(0).toUpperCase() || "B"}</span>
              <span className="grow"><b><bdi>{bizName(b, lang)}</bdi></b>
                <small className={b.status === "approved" ? "ok" : "wait"}>{b.status === "approved" ? t(lang, "live") : t(lang, "st_" + (b.status || "pending"))}</small></span>
              <Icon name="chevron" size={16} className="flip ac-cv" />
            </button>
          ))}
          <button type="button" className="ac-add" onClick={onList}><Icon name="plus" size={17} /> {t(lang, biz && biz.length ? "list_another" : "list_free")}</button>
        </div>
      ) : null}

      <span className="ac-lab">{t(lang, "settings")}</span>
      <div className="ac-grp">
        <Row ic="pin" k={t(lang, "city")} v={cityName(city, lang)} onClick={() => setSheet("city")} />
        <Row ic="globe" k={t(lang, "language")} v={(LANGS.find((l) => l.id === lang) || {}).label} onClick={() => setSheet("lang")} />
        <Row ic="palette" k={t(lang, "theme")} v={t(lang, "theme_" + theme)} onClick={() => setSheet("look")} />
        <Row ic="mail" k={t(lang, "email")} v={<bdi dir="ltr">{(profile && profile.email) || ""}</bdi>} />
      </div>
      <div className="ac-grp">
        <Row ic="user" k={t(lang, "edit_name")} v={name} onClick={onEditName} />
        <Row ic="chat" k={t(lang, "help_contact")} href={`https://wa.me/${HELP_WHATSAPP}`} />
      </div>
      <div className="ok" role="status">{saved ? t(lang, "saved") : ""}</div>
      <button type="button" className="ac-out" onClick={async () => { await signOut(); onSignedOut(); }}>{t(lang, "sign_out")}</button>
      <div className="ac-foot"><TestTag lang={lang} /></div>
      <div className="b-navspace" />
      <BottomNav lang={lang} active="user" go={go} signedIn />

      {sheet === "city" ? (
        <AccSheet title={t(lang, "city")} onClose={() => setSheet("")}>
          {cities.map((c) => (
            <button key={c.id} type="button" className="choice" disabled={!c.live} aria-pressed={city && city.id === c.id} onClick={() => c.live && pickCity(c.id)}>
              <span>{cityName(c, lang)}</span>{c.live ? (city && city.id === c.id ? <span className="tick">✓</span> : null) : <span className="soon">{t(lang, "coming_soon")}</span>}
            </button>
          ))}
        </AccSheet>
      ) : null}
      {sheet === "lang" ? (
        <AccSheet title={t(lang, "language")} onClose={() => setSheet("")}>
          {LANGS.map((l) => (
            <button key={l.id} type="button" className="choice" dir={l.dir} aria-pressed={lang === l.id} onClick={() => { pickLang(l.id); setSheet(""); }}>
              <span>{l.label}</span>{lang === l.id ? <span className="tick">✓</span> : null}
            </button>
          ))}
        </AccSheet>
      ) : null}
      {sheet === "look" ? (
        <AccSheet title={t(lang, "theme")} onClose={() => setSheet("")}>
          {THEMES.map((v) => (
            <button key={v} type="button" className="choice" aria-pressed={theme === v} onClick={() => pickTheme(v)}>
              <span>{t(lang, "theme_" + v)}</span>{theme === v ? <span className="tick">✓</span> : null}
            </button>
          ))}
          {theme === "auto" ? <p className="note">{t(lang, "theme_auto_note")}</p> : null}
        </AccSheet>
      ) : null}
      {sheet === "reviews" ? (
        <AccSheet title={t(lang, "my_reviews")} onClose={() => setSheet("")}>
          {reviews && reviews.length ? reviews.map((r) => (
            <button key={r.id} type="button" className="choice" onClick={() => r.businesses && go("/" + r.businesses.handle)}>
              <span><bdi>{r.businesses ? bizName(r.businesses, lang) : "—"}</bdi></span>
              <span className="ac-stars">{"★".repeat(r.rating)}<i>{"★".repeat(5 - r.rating)}</i></span>
            </button>
          )) : <p className="note">{t(lang, "my_no_reviews")}</p>}
        </AccSheet>
      ) : null}
    </div>
  );
}

// ---------- the app ----------

export default function App() {
  const [path, go] = usePath();
  const [lang, setLangState] = useState(() => store.get("bm_lang", "ku"));
  const [city, setCityState] = useState(() => store.get("bm_city", ""));
  const [email, setEmail] = useState(() => { try { return sessionStorage.getItem("bm_email") || ""; } catch { return ""; } });
  const [profile, setProfile] = useState(null);
  const [booting, setBooting] = useState(true);
  const [sentBiz, setSentBiz] = useState(null);
  // the back office stays Silver for now; everything else follows the chosen theme
  const inTeam = path.startsWith("/team");
  useEffect(() => {
    if (!inTeam) return undefined;
    document.documentElement.setAttribute("data-theme", "bmnassa");
    return () => { applyTheme(); };
  }, [inTeam]);

  const setLang = (l) => { setLangState(l); store.set("bm_lang", l); };
  const setCity = (c) => { setCityState(c); store.set("bm_city", c); };
  const rememberEmail = (m) => { setEmail(m); try { sessionStorage.setItem("bm_email", m); } catch { /* ignore */ } };

  useEffect(() => {
    document.documentElement.lang = lang === "ku" ? "ckb" : lang;
    document.documentElement.dir = dirOf(lang);
  }, [lang]);

  // Load the signed-in person, then send them to the right screen.
  const loadProfile = async () => {
    try {
      const p = await getMyProfile();
      setProfile(p);
      return p;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const started = Date.now();
    (async () => {
      const p = getSession() ? await loadProfile() : null;
      const wait = Math.max(0, 1200 - (Date.now() - started));
      setTimeout(() => {
        setBooting(false);
        const here = window.location.pathname;
        const hasCity = !!store.get("bm_city", "");
        if (isBusinessPath(here)) {
          // A shared card or page link (NFC tap, QR code): open it straight away
          if (p && p.language && p.language !== store.get("bm_lang", "")) setLang(p.language);
        } else if (p) {
          if (p.language && p.language !== store.get("bm_lang", "")) setLang(p.language);
          if (!p.full_name) go("/name", true);
          else if (["/", "/welcome", "/signin", "/verify"].includes(here)) go("/home", true);
        } else if (["/list", "/team", "/account", "/name", "/list/sent"].includes(here) || here.startsWith("/my/")) {
          // Pages that need an account: sign in first, then come back
          if (here === "/list" || here === "/team" || here.startsWith("/my/")) { try { sessionStorage.setItem("bm_after", here); } catch { /* ignore */ } }
          go(hasCity ? "/signin" : "/welcome", true);
        } else if (here === "/verify" && !email) {
          go("/signin", true);
        } else if (!hasCity && here !== "/welcome" && here !== "/signin") {
          go("/welcome", true);
        } else if (here === "/") {
          go("/home", true);
        }
      }, wait);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (booting) return <Splash lang={lang} />;

  const afterVerify = async () => {
    const p = await loadProfile();
    const fields = {};
    if (p && !p.city_id && city) fields.city_id = city;
    if (p && p.language !== lang) fields.language = lang;
    if (p && Object.keys(fields).length) {
      try { const row = await updateMyProfile(fields); if (row) setProfile(row); } catch { /* not critical */ }
    }
    let after = "/account";
    try { after = sessionStorage.getItem("bm_after") || "/account"; sessionStorage.removeItem("bm_after"); } catch { /* ignore */ }
    if (p && !p.full_name) { try { sessionStorage.setItem("bm_after", after); } catch { /* ignore */ } }
    go(p && p.full_name ? after : "/name", true);
  };

  if (path === "/team" && profile && profile.full_name) {
    return <Team profile={profile} onOpenApp={() => go("/account")} onSignOut={async () => { await signOut(); setProfile(null); go("/signin", true); }} />;
  }

  const back = () => window.history.back();
  const signedIn = !!profile;
  const handleMatch = businessPath(path);
  const query = new URLSearchParams(window.location.search);

  let screen;
  if (handleMatch) {
    const hp = { key: path, lang, handle: handleMatch.handle, go, back, signedIn };
    screen = handleMatch.part === "reviews" ? <ReviewsPage {...hp} />
      : handleMatch.part === "rate" ? <RatePage {...hp} />
      : <BizPage {...hp} />;
  } else if (path === "/home" || path === "/") {
    screen = <Home lang={lang} city={city || "sulaymaniyah"} setCity={setCity} go={go} signedIn={signedIn} />;
  } else if (path === "/scan") {
    screen = <ScanPage key="scan" lang={lang} go={go} back={back} signedIn={signedIn} />;
  } else if (/^\/scan\/edit\/\d+$/.test(path) && profile) {
    screen = <EditScanPage key={path} lang={lang} id={path.split("/")[3]} go={go} back={back} />;
  } else if (path === "/wallet") {
    screen = <WalletPage key="wallet" lang={lang} go={go} signedIn={signedIn} />;
  } else if (path === "/search") {
    screen = <Results key="search" lang={lang} city={city || "sulaymaniyah"} setCity={setCity} go={go} back={back} signedIn={signedIn} search={query.get("q") || ""} />;
  } else if (path.startsWith("/c/")) {
    screen = <Results key={path} lang={lang} city={city || "sulaymaniyah"} setCity={setCity} go={go} back={back} signedIn={signedIn} categoryId={decodeURIComponent(path.slice(3))} />;
  } else if (/^\/my\/\d+\/nfc$/.test(path) && profile) {
    screen = <OrderNfc key={path} lang={lang} id={path.split("/")[2]} go={go} />;
  } else if (/^\/my\/\d+\/card$/.test(path) && profile) {
    screen = <Studio key={path} lang={lang} id={path.split("/")[2]} go={go} />;
  } else if (/^\/my\/\d+\/edit$/.test(path) && profile) {
    screen = <EditPage key={path} lang={lang} id={path.split("/")[2]} go={go} />;
  } else if (/^\/my\/\d+$/.test(path) && profile) {
    screen = <Dashboard key={path} lang={lang} id={path.split("/")[2]} go={go} />;
  } else if (path.startsWith("/my/") && !profile) {
    screen = <SignIn lang={lang} email={email} setEmail={rememberEmail} onSent={() => go("/verify")} onBack={() => go("/home")} />;
  } else if (path === "/verify" && email) {
    screen = <Verify lang={lang} email={email} onVerified={afterVerify} onChangeEmail={() => go("/signin")} />;
  } else if (path === "/signin") {
    screen = <SignIn lang={lang} email={email} setEmail={rememberEmail} onSent={() => go("/verify")} onBack={() => go("/home")} />;
  } else if (path === "/name" && profile) {
    screen = <NameStep lang={lang} profile={profile} onSaved={(row) => {
      if (row) setProfile(row);
      let after = "/account";
      try { after = sessionStorage.getItem("bm_after") || "/account"; sessionStorage.removeItem("bm_after"); } catch { /* ignore */ }
      go(after, true);
    }} />;
  } else if (path === "/list" && profile) {
    screen = <ListBusiness lang={lang} profile={profile} onBack={() => (window.history.length > 1 ? back() : go("/account"))} onSent={(b) => { setSentBiz(b); go("/list/sent", true); }} />;
  } else if (path === "/list/sent" && profile && sentBiz) {
    screen = <Sent lang={lang} business={sentBiz} onDone={() => go("/account", true)} />;
  } else if ((path === "/account" || path.startsWith("/list")) && profile) {
    screen = (
      <Account lang={lang} setLang={setLang} profile={profile} setProfile={setProfile} cityId={city} setCity={setCity}
        onEditName={() => go("/name")} onSignedOut={() => { setProfile(null); go("/home", true); }}
        onList={() => go("/list")} go={go} />
    );
  } else if ((path === "/list" || path === "/account") && !profile) {
    screen = <SignIn lang={lang} email={email} setEmail={rememberEmail} onSent={() => go("/verify")} onBack={() => go("/home")} />;
  } else if (path === "/path") {
    screen = <PathChooser lang={lang} go={go} signedIn={signedIn} />;
  } else if (path === "/plans") {
    screen = profile
      ? <PlanChooser lang={lang} go={go} />
      : <SignIn lang={lang} email={email} setEmail={rememberEmail} onSent={() => go("/verify")} onBack={() => go("/path")} />;
  } else {
    screen = <Welcome lang={lang} setLang={setLang} city={city} setCity={setCity} onDone={() => go("/path")} onSignIn={() => go("/signin")} />;
  }

  return <main className="app" dir={dirOf(lang)} lang={lang === "ku" ? "ckb" : lang}>{screen}</main>;
}
