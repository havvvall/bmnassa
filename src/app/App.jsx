import React, { useEffect, useRef, useState } from "react";
import "./app.css";
import { t, dirOf, LANGS, FALLBACK_CITIES, cityName } from "./i18n.js";
import {
  normaliseEmail, sendCode, verifyCode, signOut,
  getSession, getMyProfile, updateMyProfile, getCities,
  normalisePhone, prettyPhone, getCategories, getPlaces, getMyBusinesses, createBusiness,
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
    <form onSubmit={submit} style={{ display: "contents" }} noValidate>
      <div className="top"><Back lang={lang} onClick={onBack} /><span className="grow" /><TestTag lang={lang} /></div>
      <div className="stack">
        <h1>{t(lang, "signin_title")}</h1>
        <p className="sub">{t(lang, "signin_sub")}</p>
      </div>
      <div className="stack">
        <label className="label" htmlFor="email">{t(lang, "email_label")}</label>
        <div className={"field ltr" + (err === "email_invalid" ? " invalid" : "")}>
          <input id="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false}
            placeholder="name@gmail.com" dir="ltr"
            value={value} onChange={(e) => { setValue(e.target.value); setErr(""); }} aria-invalid={err === "email_invalid"} aria-describedby="email-err" />
        </div>
        <div id="email-err" className="err" role="alert">{err ? t(lang, err) : ""}</div>
        {detail ? <div className="note ltr" style={{ fontSize: 11 }}>{detail}</div> : null}
      </div>
      <span className="spacer" />
      <p className="note">{t(lang, "privacy")}</p>
      <button type="submit" className="btn" disabled={busy || !value.trim()}>{busy ? t(lang, "loading") : t(lang, "send_code")}</button>
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
        <p className="note">{t(lang, "loading")}</p>
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

function MyBusinesses({ lang, onList }) {
  const [list, setList] = useState(null);
  useEffect(() => { getMyBusinesses().then((r) => setList(r || [])).catch(() => setList([])); }, []);
  if (list === null) return null;
  return (
    <div className="stack">
      <span className="label">{t(lang, "my_business")}</span>
      <div className="panel">
        {list.map((b) => (
          <div className="row" key={b.id}>
            <div className="avatar sm" aria-hidden="true">{bizName(b, lang).trim().charAt(0).toUpperCase() || "B"}</div>
            <span className="v">{bizName(b, lang)}</span>
            <span className={"status " + (b.status || "pending")}>{t(lang, "st_" + (b.status || "pending"))}</span>
          </div>
        ))}
        <button type="button" className="row rowbtn" onClick={onList}>
          <span className="v">{t(lang, list.length ? "list_another" : "list_free")}</span>
          <svg className="flip" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}

function Account({ lang, setLang, profile, setProfile, cityId, onEditName, onSignedOut, onList }) {
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
        <div className="row"><span className="k">{t(lang, "email")}</span><span className="v" style={{ overflowWrap: "anywhere" }}><bdi dir="ltr">{(profile && profile.email) || ""}</bdi></span></div>
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
      <MyBusinesses lang={lang} onList={onList} />
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
  const [email, setEmail] = useState(() => { try { return sessionStorage.getItem("bm_email") || ""; } catch { return ""; } });
  const [profile, setProfile] = useState(null);
  const [booting, setBooting] = useState(true);
  const [sentBiz, setSentBiz] = useState(null);

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
        if (p) {
          if (p.language && p.language !== store.get("bm_lang", "")) setLang(p.language);
          if (!p.full_name) go("/name", true);
          else if (!["/list", "/account"].includes(here)) go("/account", true);
        } else if (!["/welcome", "/signin", "/verify"].includes(here)) {
          // Someone opened "List your business" before signing in: come back to it afterwards
          if (here === "/list") { try { sessionStorage.setItem("bm_after", "/list"); } catch { /* ignore */ } }
          go(store.get("bm_city", "") ? "/signin" : "/welcome", true);
        } else if (here === "/verify" && !email) {
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
    let after = "/account";
    try { after = sessionStorage.getItem("bm_after") || "/account"; sessionStorage.removeItem("bm_after"); } catch { /* ignore */ }
    if (p && !p.full_name) { try { sessionStorage.setItem("bm_after", after); } catch { /* ignore */ } }
    go(p && p.full_name ? after : "/name", true);
  };

  let screen;
  if (path === "/verify" && email) {
    screen = <Verify lang={lang} email={email} onVerified={afterVerify} onChangeEmail={() => go("/signin")} />;
  } else if (path === "/signin") {
    screen = <SignIn lang={lang} email={email} setEmail={rememberEmail} onSent={() => go("/verify")} onBack={() => go("/welcome")} />;
  } else if (path === "/name" && profile) {
    screen = <NameStep lang={lang} profile={profile} onSaved={(row) => {
      if (row) setProfile(row);
      let after = "/account";
      try { after = sessionStorage.getItem("bm_after") || "/account"; sessionStorage.removeItem("bm_after"); } catch { /* ignore */ }
      go(after, true);
    }} />;
  } else if (path === "/list" && profile) {
    screen = <ListBusiness lang={lang} profile={profile} onBack={() => go("/account")} onSent={(b) => { setSentBiz(b); go("/list/sent", true); }} />;
  } else if (path === "/list/sent" && profile && sentBiz) {
    screen = <Sent lang={lang} business={sentBiz} onDone={() => go("/account", true)} />;
  } else if ((path === "/account" || path.startsWith("/list")) && profile) {
    screen = (
      <Account lang={lang} setLang={setLang} profile={profile} setProfile={setProfile} cityId={city}
        onEditName={() => go("/name")} onSignedOut={() => { setProfile(null); go("/signin", true); }}
        onList={() => go("/list")} />
    );
  } else {
    screen = <Welcome lang={lang} setLang={setLang} city={city} setCity={setCity} onDone={() => go(profile ? "/account" : "/signin")} />;
  }

  return <main className="app" dir={dirOf(lang)} lang={lang === "ku" ? "ckb" : lang}>{screen}</main>;
}
