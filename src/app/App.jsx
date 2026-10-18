import React, { useEffect, useRef, useState } from "react";
import "./app.css";
import { t, dirOf, LANGS, FALLBACK_CITIES, cityName } from "./i18n.js";
import {
  OTP_CHANNEL, normalisePhone, prettyPhone, sendCode, verifyCode, signOut,
  getSession, getMyProfile, updateMyProfile, getCities,
} from "./api.js";

// ---------- small helpers ----------

const store = {
  get(k, d) { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};

function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const on = () => setPath(window.location.pathname);
    window.addEventListener("popstate", on);
    return () => window.removeEventListener("popstate", on);
  }, []);
  const go = (p, replace) => {
    if (p === window.location.pathname) return;
    window.history[replace ? "replaceState" : "pushState"]({}, "", p);
    setPath(p);
    window.scrollTo(0, 0);
  };
  return [path, go];
}

function errorKey(e) {
  const c = String((e && e.code) || "");
  if (c === "network") return "send_failed";
  if ((e && e.status === 429) || /rate_limit/.test(c)) return "too_many";
  if (/phone_provider_disabled|unsupported phone provider/i.test(c + " " + (e && e.message))) return "not_ready";
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

function Welcome({ lang, setLang, city, setCity, onDone }) {
  const [cities, setCities] = useState(FALLBACK_CITIES);
  useEffect(() => {
    getCities().then((rows) => { if (rows && rows.length) setCities(rows); }).catch(() => {});
  }, []);
  return (
    <>
      <div className="top"><img className="logo" src="/brand/logo-ink.svg" alt="Bmnassa" /><span className="grow" /><TestTag lang={lang} /></div>
      <div className="stack">
        <h1>{t(lang, "welcome")}</h1>
        <p className="sub">{t(lang, "welcome_sub")}</p>
      </div>
      <div className="stack" role="group" aria-label={t(lang, "choose_lang")}>
        <span className="label">{t(lang, "choose_lang")}</span>
        {LANGS.map((l) => (
          <button key={l.id} type="button" className="choice" aria-pressed={lang === l.id} onClick={() => setLang(l.id)} dir={l.dir}>
            <span>{l.label}</span>{lang === l.id && <span className="tick">✓</span>}
          </button>
        ))}
      </div>
      <div className="stack" role="group" aria-label={t(lang, "choose_city")}>
        <span className="label">{t(lang, "choose_city")}</span>
        {cities.map((c) => (
          <button key={c.id} type="button" className="choice" disabled={!c.live} aria-pressed={city === c.id} onClick={() => c.live && setCity(c.id)}>
            <span>{cityName(c, lang)}</span>
            {c.live ? (city === c.id && <span className="tick">✓</span>) : <span className="soon">{t(lang, "coming_soon")}</span>}
          </button>
        ))}
      </div>
      <p className="note">{t(lang, "change_later")}</p>
      <span className="spacer" />
      <button type="button" className="btn" disabled={!city} onClick={onDone}>{t(lang, "continue")}</button>
    </>
  );
}

function SignIn({ lang, phone, setPhone, onSent, onBack }) {
  const [value, setValue] = useState(phone ? prettyPhone(phone).replace("+964 ", "0") : "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [detail, setDetail] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    const p = normalisePhone(value);
    if (!p) { setErr("phone_invalid"); return; }
    setBusy(true); setErr(""); setDetail("");
    try {
      await sendCode(p, OTP_CHANNEL);
      setPhone(p);
      onSent(OTP_CHANNEL);
    } catch (ex) {
      setErr(errorKey(ex));
      setDetail(errorDetail(ex));
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} style={{ display: "contents" }} noValidate>
      <div className="top"><Back lang={lang} onClick={onBack} /><span className="grow" /><TestTag lang={lang} /></div>
      <div className="stack">
        <h1>{t(lang, "signin_title")}</h1>
        <p className="sub">{t(lang, "signin_sub")}</p>
      </div>
      <div className="stack">
        <label className="label" htmlFor="phone">{t(lang, "phone_label")}</label>
        <div className={"field ltr" + (err === "phone_invalid" ? " invalid" : "")}>
          <span className="prefix">+964</span>
          <input id="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="0770 123 4567"
            value={value} onChange={(e) => { setValue(e.target.value); setErr(""); }} aria-invalid={err === "phone_invalid"} aria-describedby="phone-err" />
        </div>
        <div id="phone-err" className="err" role="alert">{err ? t(lang, err) : ""}</div>
        {detail ? <div className="note ltr" style={{ fontSize: 11 }}>{detail}</div> : null}
      </div>
      <span className="spacer" />
      <p className="note">{t(lang, "privacy")}</p>
      <button type="submit" className="btn" disabled={busy || !value.trim()}>{busy ? t(lang, "loading") : t(lang, "send_code")}</button>
    </form>
  );
}

function Verify({ lang, phone, channel: firstChannel, onVerified, onChangeNumber }) {
  const [code, setCode] = useState("");
  const [channel, setChannel] = useState(firstChannel || OTP_CHANNEL);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [wait, setWait] = useState(30);
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
      await verifyCode(phone, token);
      onVerified();
    } catch (ex) {
      setErr(ex.status === 429 ? "too_many" : ex.code === "network" ? "send_failed" : "code_wrong");
      setCode("");
      inputRef.current && inputRef.current.focus();
    } finally {
      setBusy(false);
    }
  };

  const resend = async (ch) => {
    setErr("");
    try {
      await sendCode(phone, ch);
      setChannel(ch);
      setWait(30);
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

  const mm = `0:${String(Math.max(wait, 0)).padStart(2, "0")}`;
  const other = channel === "whatsapp" ? "sms" : "whatsapp";

  return (
    <>
      <div className="top"><Back lang={lang} onClick={onChangeNumber} /><span className="grow" /><TestTag lang={lang} /></div>
      <div className="stack">
        <h1>{t(lang, "verify_title")}</h1>
        <p className="sub">
          {t(lang, channel === "whatsapp" ? "sent_whatsapp" : "sent_sms")}{" "}
          <b className="ltr">{prettyPhone(phone)}</b>{" "}
          <button type="button" className="link" onClick={onChangeNumber}>{t(lang, "change")}</button>
        </p>
      </div>
      <div className="stack">
        <label className="label" htmlFor="code">{t(lang, "enter_code")}</label>
        <input id="code" ref={inputRef} className="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]*"
          maxLength={6} value={code} onChange={onInput} aria-invalid={!!err} aria-describedby="code-err" disabled={busy} />
        <div id="code-err" className="err" role="alert">{err ? t(lang, err) : ""}</div>
        <p className="note">{t(lang, "autofill")}</p>
      </div>
      <div className="stack" style={{ alignItems: "flex-start" }}>
        <button type="button" className="link" disabled={wait > 0} onClick={() => resend(channel)}>
          {wait > 0 ? t(lang, "resend_in", { s: mm }) : t(lang, "resend")}
        </button>
        {import.meta.env.VITE_OTP_CHANNEL === "whatsapp" || channel === "whatsapp" ? (
          <button type="button" className="link" disabled={wait > 0} onClick={() => resend(other)}>
            {t(lang, other === "sms" ? "by_sms" : "by_whatsapp")}
          </button>
        ) : null}
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

function Account({ lang, setLang, profile, setProfile, cityId, onEditName, onSignedOut }) {
  const [cities, setCities] = useState(FALLBACK_CITIES);
  const [saved, setSaved] = useState(false);
  useEffect(() => { getCities().then((r) => r && r.length && setCities(r)).catch(() => {}); }, []);
  const city = cities.find((c) => c.id === ((profile && profile.city_id) || cityId));
  const name = (profile && profile.full_name) || "";
  const role = (profile && profile.role) || "customer";

  const pickLang = async (l) => {
    setLang(l);
    try {
      const row = await updateMyProfile({ language: l });
      if (row) setProfile(row);
      setSaved(true); setTimeout(() => setSaved(false), 1600);
    } catch { /* the choice still applies on this phone */ }
  };

  return (
    <>
      <div className="top"><h1 className="grow">{t(lang, "account")}</h1><TestTag lang={lang} /></div>
      <div className="me">
        <div className="avatar" aria-hidden="true">{name.trim().charAt(0).toUpperCase() || "B"}</div>
        <div className="stack" style={{ gap: 4, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 20, fontWeight: 800 }}>{name}</span>
          <span><span className="role">{t(lang, "role_" + role)}</span></span>
        </div>
        <button type="button" className="link" onClick={onEditName}>{t(lang, "edit")}</button>
      </div>
      <div className="panel">
        <div className="row"><span className="k">{t(lang, "phone")}</span><span className="v"><bdi dir="ltr">{prettyPhone(profile && profile.phone)}</bdi></span></div>
        <div className="row"><span className="k">{t(lang, "city")}</span><span className="v">{cityName(city, lang)}</span></div>
        <div className="row">
          <span className="k">{t(lang, "language")}</span>
          <div className="seg" role="group" aria-label={t(lang, "language")}>
            {LANGS.map((l) => (
              <button key={l.id} type="button" aria-pressed={lang === l.id} onClick={() => pickLang(l.id)}>{l.label}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="ok" role="status">{saved ? t(lang, "saved") : ""}</div>
      <p className="note">{t(lang, "next_slices")}</p>
      <span className="spacer" />
      <button type="button" className="btn quiet" onClick={async () => { await signOut(); onSignedOut(); }}>{t(lang, "sign_out")}</button>
    </>
  );
}

// ---------- the app ----------

export default function App() {
  const [path, go] = usePath();
  const [lang, setLangState] = useState(() => store.get("bm_lang", "ku"));
  const [city, setCityState] = useState(() => store.get("bm_city", ""));
  const [phone, setPhone] = useState(() => { try { return sessionStorage.getItem("bm_phone") || ""; } catch { return ""; } });
  const [channel, setChannel] = useState(OTP_CHANNEL);
  const [profile, setProfile] = useState(null);
  const [booting, setBooting] = useState(true);

  const setLang = (l) => { setLangState(l); store.set("bm_lang", l); };
  const setCity = (c) => { setCityState(c); store.set("bm_city", c); };
  const rememberPhone = (p) => { setPhone(p); try { sessionStorage.setItem("bm_phone", p); } catch { /* ignore */ } };

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
        if (p) {
          if (p.language && p.language !== store.get("bm_lang", "")) setLang(p.language);
          go(p.full_name ? "/account" : "/name", true);
        } else if (!["/welcome", "/signin", "/verify"].includes(here)) {
          go(store.get("bm_city", "") ? "/signin" : "/welcome", true);
        } else if (here === "/verify" && !phone) {
          go("/signin", true);
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
    go(p && p.full_name ? "/account" : "/name", true);
  };

  let screen;
  if (path === "/verify" && phone) {
    screen = <Verify lang={lang} phone={phone} channel={channel} onVerified={afterVerify} onChangeNumber={() => go("/signin")} />;
  } else if (path === "/signin") {
    screen = <SignIn lang={lang} phone={phone} setPhone={rememberPhone} onSent={(ch) => { setChannel(ch); go("/verify"); }} onBack={() => go("/welcome")} />;
  } else if (path === "/name" && profile) {
    screen = <NameStep lang={lang} profile={profile} onSaved={(row) => { if (row) setProfile(row); go("/account", true); }} />;
  } else if (path === "/account" && profile) {
    screen = (
      <Account lang={lang} setLang={setLang} profile={profile} setProfile={setProfile} cityId={city}
        onEditName={() => go("/name")} onSignedOut={() => { setProfile(null); go("/signin", true); }} />
    );
  } else {
    screen = <Welcome lang={lang} setLang={setLang} city={city} setCity={setCity} onDone={() => go(profile ? "/account" : "/signin")} />;
  }

  return <main className="app" dir={dirOf(lang)} lang={lang === "ku" ? "ckb" : lang}>{screen}</main>;
}
