// Slice 4 · listing: home, results, search, business card and business page.
// Anyone can browse without an account; only live (approved) businesses come back from the database.
import { themeBar } from "../theme.js";
import { calm, ms, ease, flipCard, haptic } from "../motion.js";
import { SkelTiles, SkelRows, SkelPage, Skel } from "../Skeleton.jsx";
import { ReviewsSummary } from "../reviews/Reviews.jsx";
import { SaveToWallet } from "../wallet/Wallet.jsx";
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./browse.css";
import { t, cityName, bizCount, pick, FALLBACK_CITIES } from "../i18n.js";
import { getCategories, getCities, getPlaces, listBusinesses, businessByHandle, prettyPhone, getPhotos, getPrices, photoUrl, track, getWallet, topCalled, scanStats, joinedFromScans } from "../api.js";
import { hoursLines, openState, todayHours, todayIndex, dayName, DAYS } from "../hours.js";
import { CardFront, CardBack, NfcCard, cardSettings, CardLogo, cardPerson } from "../card/CardFaces.jsx";
import { pageSettings, pageLook } from "../pageStyle.js";
import { Icon, categoryIcon } from "./icons.jsx";
import { QRCode, QRErrorCorrectLevel } from "../vendor/qrcode.js";

const BMNASSA_WHATSAPP = "9647701218832";

// ---------- shared data (loaded once per city, kept while the app is open) ----------

const cache = { lists: null, biz: {} };

export function useLists() {
  const [lists, setLists] = useState(cache.lists);
  const [err, setErr] = useState(false);
  const load = () => {
    setErr(false);
    Promise.all([getCategories(), getCities().catch(() => null), getPlaces().catch(() => ({ districts: [], subdistricts: [] }))])
      .then(([cats, cities, places]) => {
        cache.lists = { cats: cats || [], cities: cities && cities.length ? cities : FALLBACK_CITIES, ...places };
        setLists(cache.lists);
      })
      .catch(() => setErr(true));
  };
  useEffect(() => { if (!cache.lists) load(); }, []);
  return [lists, err, load];
}

function useBusinesses(city) {
  const [rows, setRows] = useState(cache.biz[city] || null);
  const [err, setErr] = useState(false);
  const load = () => {
    setErr(false);
    listBusinesses(city).then((r) => { cache.biz[city] = r || []; setRows(cache.biz[city]); }).catch(() => setErr(true));
  };
  useEffect(() => { setRows(cache.biz[city] || null); if (city) load(); }, [city]);
  return [rows, err, load];
}

const byId = (arr) => Object.fromEntries((arr || []).map((x) => [x.id, x]));
const initial = (s) => (String(s || "").trim().charAt(0) || "B").toUpperCase();
const digits = (s) => String(s || "").replace(/\D/g, "");
export const waLink = (phone, text) => `https://wa.me/${digits(phone)}${text ? "?text=" + encodeURIComponent(text) : ""}`;
const pageHost = () => window.location.host.replace(/^www\./, "");

// Turns what an owner typed ("@azad", "instagram.com/azad", "azad.com") into a link and a short label
function socialLinks(b) {
  const clean = (v) => String(v || "").trim();
  const handle = (v) => clean(v).replace(/^https?:\/\/(www\.)?[^/]+\//i, "").replace(/^@/, "").replace(/\/$/, "");
  const out = [];
  if (clean(b.instagram)) out.push(["instagram", "ig", "Instagram", "@" + handle(b.instagram), /^https?:/i.test(b.instagram) ? clean(b.instagram) : `https://instagram.com/${handle(b.instagram)}`]);
  if (clean(b.facebook)) out.push(["facebook", "fb", "Facebook", handle(b.facebook), /^https?:/i.test(b.facebook) ? clean(b.facebook) : `https://facebook.com/${handle(b.facebook)}`]);
  if (clean(b.tiktok)) out.push(["tiktok", "tt", "TikTok", "@" + handle(b.tiktok), /^https?:/i.test(b.tiktok) ? clean(b.tiktok) : `https://www.tiktok.com/@${handle(b.tiktok)}`]);
  if (clean(b.email)) out.push(["mail", "em", "Email", clean(b.email), `mailto:${clean(b.email)}`]);
  if (clean(b.website)) out.push(["globe", "web", "Website", clean(b.website).replace(/^https?:\/\//i, "").replace(/\/$/, ""), /^https?:/i.test(b.website) ? clean(b.website) : `https://${clean(b.website)}`]);
  return out;
}
const directionsUrl = (b) => (b.lat && b.lng ? `https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}` : null);

function sortRows(rows, sort) {
  const r = rows.slice();
  if (sort === "latest") return r.sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
  return r.sort((a, b) =>
    (Number(b.reviews) > 0) - (Number(a.reviews) > 0) || (Number(b.rating) || 0) - (Number(a.rating) || 0)
    || (Number(b.reviews) || 0) - (Number(a.reviews) || 0) || (b.verified === true) - (a.verified === true)
    || String(b.created_at || "").localeCompare(String(a.created_at || "")));
}

function Rating({ b, lang, compact }) {
  const n = Number(b.reviews) || 0;
  if (!n) return <span className="b-new">{t(lang, compact ? "new_badge" : "new_on")}</span>;
  return (
    <span className="b-rate"><Icon name="star" size={13} stroke={0} style={{ fill: "currentColor" }} /> {Number(b.rating || 0).toFixed(1)}
      {compact ? null : <span className="b-muted"> · {t(lang, "reviews_n", { n })}</span>}
    </span>
  );
}

const Tick = () => <span className="b-tick" aria-label="Checked by Bmnassa"><Icon name="check" size={11} stroke={3} /></span>;

// A message at the bottom. ok(text) shows it with a check that draws itself, and a short vibration on Android.
export const ok = (text) => ({ text, ok: true });
export function Toast({ text }) {
  const good = !!text && typeof text === "object";
  const msg = good ? text.text : text;
  useEffect(() => { if (good) haptic(20); }, [text]);
  if (!msg) return null;
  return (
    <div className={"b-toast" + (good ? " ok" : "")} role="status" key={msg}>
      {good ? <span className="bm-check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span> : null}
      <span>{msg}</span>
    </div>
  );
}

export function useToast() {
  const [text, setText] = useState("");
  useEffect(() => { if (!text) return; const id = setTimeout(() => setText(""), 2400); return () => clearTimeout(id); }, [text]);
  return [text, setText];
}

// ---------- bottom navigation ----------

export function BottomNav({ lang, active, go, signedIn }) {
  const [toast, setToast] = useToast();
  const items = [
    ["home", "nav_home", () => go("/home")],
    ["wallet", "nav_wallet", () => go("/wallet")],
    ["scan", "nav_scan", () => go("/scan")],
    ["user", "nav_account", () => go(signedIn ? "/account" : "/signin")],
  ];
  return (
    <>
      <nav className="b-nav" aria-label="Bmnassa">
        {items.map(([icon, key, onClick]) => (
          <button key={key} type="button" className={active === icon ? "on" : ""} onClick={onClick} aria-current={active === icon ? "page" : undefined}>
            <Icon name={icon} size={21} />
            <span>{t(lang, key)}</span>
          </button>
        ))}
      </nav>
      <Toast text={toast} />
    </>
  );
}

// ---------- city picker ----------

function CitySheet({ lang, lists, city, onPick, onClose }) {
  return (
    <div className="b-sheet-wrap" onClick={onClose}>
      <div className="b-sheet" role="dialog" aria-label={t(lang, "choose_city_title")} onClick={(e) => e.stopPropagation()}>
        <div className="b-sheet-head"><b>{t(lang, "choose_city_title")}</b><button type="button" className="link" onClick={onClose}>{t(lang, "close")}</button></div>
        <div className="stack">
          {(lists ? lists.cities : FALLBACK_CITIES).map((c) => (
            <button key={c.id} type="button" className="choice" disabled={!c.live} aria-pressed={city === c.id} onClick={() => c.live && onPick(c.id)}>
              <span>{cityName(c, lang)}</span>
              {c.live ? (city === c.id && <span className="tick">✓</span>) : <span className="soon">{t(lang, "coming_soon")}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- home ----------

const VIEW_KEY = "bm_home_view";

// Soft icon backgrounds for the category tiles (light theme; dark theme uses the surface colour)
const TINTS = ["#e8f0ff", "#e6f6ee", "#fff3d6", "#fde8ec", "#efe8fd", "#e3f4f6", "#fff0e3", "#eef1f4", "#f3f9e4"];

function greeting(lang) {
  const h = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Baghdad" }).format(new Date()));
  return t(lang, h < 12 ? "hi_morning" : h < 17 ? "hi_afternoon" : "hi_evening");
}

// A business card face shrunk to a thumbnail
function MiniCard({ b, cats, lang, w = 72 }) {
  return (
    <span className="h-mini" style={{ width: w, height: w / 1.586 }}>
      <span style={{ transform: `scale(${w / 320})` }}><NfcCard b={b} s={cardSettings(b)} lang={lang} cat={cats[b.category_id]} linksOnly /></span>
    </span>
  );
}

function useWalletPeek(signedIn) {
  const [w, setW] = useState(null);
  useEffect(() => {
    if (!signedIn) { setW(null); return; }
    let alive = true;
    getWallet().then((r) => { if (alive) setW(r || []); }).catch(() => { if (alive) setW([]); });
    return () => { alive = false; };
  }, [signedIn]);
  return w;
}

export function Home({ lang, city, setCity, go, signedIn }) {
  const [lists, listErr, reloadLists] = useLists();
  const [rows] = useBusinesses(city);
  const wallet = useWalletPeek(signedIn);
  const [view, setView] = useState(() => { try { return localStorage.getItem(VIEW_KEY) || "3"; } catch { return "3"; } });
  const [picking, setPicking] = useState(false);
  const setV = (v) => { setView(v); try { localStorage.setItem(VIEW_KEY, v); } catch { /* ignore */ } };

  const cityRow = lists && lists.cities.find((c) => c.id === city);
  const counts = useMemo(() => {
    const m = {};
    (rows || []).forEach((b) => { m[b.category_id] = (m[b.category_id] || 0) + 1; });
    return m;
  }, [rows]);
  const cats = lists ? lists.cats : [];
  const catById = useMemo(() => byId(cats), [cats]);
  const look = useMemo(() => ({ dist: byId(lists && lists.districts), city: byId(lists && lists.cities), sub: byId(lists && lists.subdistricts) }), [lists]);

  // the big tile: the category people called most this week; until there are enough taps, the one with the most businesses
  const [called, setCalled] = useState([]);
  useEffect(() => {
    let alive = true;
    topCalled(city).then((r) => { if (alive) setCalled(r); });
    return () => { alive = false; };
  }, [city]);
  const [scans, setScans] = useState(null);
  const [joinedIds, setJoinedIds] = useState([]);
  const [toast, setToast] = useToast();
  useEffect(() => { let a = true; scanStats().then((n) => { if (a) setScans(n); }); return () => { a = false; }; }, []);
  useEffect(() => { let a = true; joinedFromScans(city).then((r) => { if (a) setJoinedIds(r); }); return () => { a = false; }; }, [city]);
  const joined = joinedIds.map((id) => (rows || []).find((b) => b.id === id)).filter(Boolean);
  const calledCat = called.map((r) => catById[r.category_id]).find((c) => c && counts[c.id]);
  const topCat = useMemo(() => {
    if (calledCat) return calledCat;
    let best = null;
    cats.forEach((c) => { if ((counts[c.id] || 0) > ((best && counts[best.id]) || 0)) best = c; });
    return best;
  }, [cats, counts, calledCat]);
  // the list under the categories: best rated, else newest
  const rated = (rows || []).filter((b) => Number(b.rating) > 0);
  const topList = (rated.length ? rated.slice().sort((x, y) => Number(y.rating) - Number(x.rating) || (y.reviews || 0) - (x.reviews || 0))
    : (rows || []).slice().sort((x, y) => String(y.created_at).localeCompare(String(x.created_at)))).slice(0, 3);
  const walletCards = (wallet || []).filter((x) => x.businesses).slice(0, 2).map((x) => x.businesses);
  const peek = walletCards.length ? walletCards : (rows || []).slice(0, 2);

  return (
    <div className="b-page h-page">
      <div className="b-top">
        <img className="logo" src="/brand/logo-ink.svg" alt="Bmnassa" />
        <span className="grow" />
        <button type="button" className="b-pill" onClick={() => setPicking(true)}>
          <Icon name="pin" size={15} /> {cityName(cityRow, lang) || t(lang, "choose_city")}
        </button>
      </div>

      <div className="h-hello">
        <small>{greeting(lang)}</small>
        <h1>{t(lang, "home_ask")}</h1>
      </div>

      <button type="button" className="b-search" onClick={() => go("/search")}>
        <Icon name="search" size={19} /> <span>{t(lang, "search_ph")}</span>
      </button>

      <div className="h-bento">
        {topCat ? (
          <button type="button" className="h-big bm-arrive" style={{ "--i": 0 }} onClick={() => go("/c/" + topCat.id)}>
            <small>{calledCat ? t(lang, "most_called_week") : t(lang, "most_listed", { city: cityName(cityRow, lang) || "" })}</small>
            <b>{cityName(topCat, lang)}</b>
            <span className="h-near">{t(lang, "n_near", { n: counts[topCat.id] || 0 })} <Icon name="chevron" size={14} className="flip" /></span>
            <i aria-hidden="true"><Icon name={categoryIcon(topCat)} size={84} stroke={1.2} /></i>
          </button>
        ) : <span className="h-big h-skel" />}
        <button type="button" className="h-med bm-arrive" style={{ "--i": 1 }} onClick={() => go("/wallet")}>
          <span className="h-wst" aria-hidden="true">{peek.map((b, i) => <span key={b.id || i} style={{ "--k": i }}><MiniCard b={b} cats={catById} lang={lang} w={92} /></span>)}</span>
          <b>{t(lang, "w_short")}</b>
          <small>{wallet && wallet.length ? (wallet.length === 1 ? t(lang, "wallet_one") : t(lang, "wallet_cards", { n: wallet.length })) : t(lang, "wallet_tile_empty")}</small>
        </button>
        <button type="button" className="h-med bm-arrive" style={{ "--i": 2 }} onClick={() => go("/scan")}>
          <span className="h-sic" aria-hidden="true"><Icon name="scan" size={21} /></span>
          <b>{t(lang, "scan_tile")}</b>
          <small>{t(lang, "scan_tile_sub")}</small>
        </button>
      </div>

      {scans !== null ? (
        <button type="button" className="h-scans bm-arrive" style={{ "--i": 3 }} onClick={() => go("/scan")}>
          <span className="h-scans-ic" aria-hidden="true"><Icon name="scan" size={20} /></span>
          <span className="grow">
            <b>{scans > 0 ? t(lang, scans === 1 ? "scans_one" : "scans_n", { n: scans.toLocaleString(lang === "en" ? "en-US" : lang === "ar" ? "ar-IQ" : "ckb-IQ") }) : t(lang, "scans_zero")}</b>
            <small>{t(lang, "scans_sub")}</small>
          </span>
          <span className="h-scans-go">{t(lang, "scans_go")} <Icon name="chevron" size={14} className="flip" /></span>
        </button>
      ) : null}

      <div className="b-row-head">
        <span className="h-title">{t(lang, "categories")}</span>
        <div className="b-views" role="group" aria-label={t(lang, "categories")}>
          {[["3", "tiles9", "view_3"], ["4", "tiles4", "view_4"], ["list", "rows", "view_list"]].map(([v, icon, key]) => (
            <button key={v} type="button" aria-pressed={view === v} title={t(lang, key)} aria-label={t(lang, key)} onClick={() => setV(v)}>
              <Icon name={icon} size={17} />
            </button>
          ))}
        </div>
      </div>

      {listErr ? (
        <div className="panel" style={{ padding: 16 }}>
          <div className="err">{t(lang, "load_failed")}</div>
          <button type="button" className="link" onClick={reloadLists}>{t(lang, "try_again")}</button>
        </div>
      ) : !lists ? (
        view === "list" ? <SkelRows n={8} /> : <SkelTiles n={view === "3" ? 9 : 12} cols={view === "3" ? 3 : 4} />
      ) : view === "list" ? (
        <div className="panel">
          {cats.map((c, i) => (
            <button key={c.id} type="button" className="b-catrow" onClick={() => go("/c/" + c.id)}>
              <span className="b-ic sm h-tint" style={{ "--tint": TINTS[i % TINTS.length] }}><Icon name={categoryIcon(c)} size={20} /></span>
              <span className="grow"><b>{cityName(c, lang)}</b><small>{rows ? bizCount(lang, counts[c.id] || 0) : "…"}</small></span>
              <Icon name="chevron" size={18} className="flip" />
            </button>
          ))}
        </div>
      ) : (
        <div className={"b-tiles h-tiles cols" + view}>
          {cats.map((c, i) => (
            <button key={c.id} type="button" className="b-tile h-tile bm-arrive" style={{ "--i": i }} onClick={() => go("/c/" + c.id)}>
              <span className="b-ic h-tint" style={{ "--tint": TINTS[i % TINTS.length] }}><Icon name={categoryIcon(c)} size={view === "3" ? 24 : 22} /></span>
              <span className="b-tile-name">{cityName(c, lang)}</span>
            </button>
          ))}
        </div>
      )}

      {topList.length ? (
        <>
          <span className="h-title">{t(lang, rated.length ? "top_rated_near" : "new_on_bm")}</span>
          <div className="h-list">
            {topList.map((b, i) => {
              const st = openState(b.hours, lang);
              const dist = areaOf(b, look);
              return (
                <div key={b.id} className="h-row bm-arrive" style={{ "--i": i }} role="button" tabIndex={0} onClick={() => go("/" + b.handle)} onKeyDown={(e) => { if (e.key === "Enter") go("/" + b.handle); }}>
                  <MiniCard b={b} cats={catById} lang={lang} />
                  <span className="grow">
                    <b><bdi>{pick(b, "name", lang)}</bdi>{b.verified ? <Tick /> : null}</b>
                    <small>{[catById[b.category_id] && cityName(catById[b.category_id], lang), dist && cityName(dist, lang)].filter(Boolean).join(" · ")}</small>
                    <em>{Number(b.rating) > 0 ? <><Icon name="star" size={12} className="h-star" /> {Number(b.rating).toFixed(1)}</> : null}
                      {st ? <span className={st.open ? "b-ok" : "b-muted"}>{Number(b.rating) > 0 ? " · " : ""}{st.text}</span> : null}</em>
                  </span>
                  {b.phone ? (
                    <a className="h-call" href={`tel:${b.phone}`} onClick={(e) => { e.stopPropagation(); track(b.id, "call"); }} aria-label={t(lang, "call")}><Icon name="phone" size={18} /></a>
                  ) : null}
                </div>
              );
            })}
          </div>
        </>
      ) : null}

      {joined.length ? (
        <>
          <div className="h-headrow"><span className="h-title">{t(lang, "joined_title")}</span><small>{t(lang, "joined_sub")}</small></div>
          <div className="h-joined">
            {joined.map((b, i) => (
              <div key={b.id} className="h-jc bm-arrive" style={{ "--i": i }}>
                <button type="button" className="h-jcard" onClick={() => go("/" + b.handle)} aria-label={pick(b, "name", lang)}>
                  <MiniCard b={b} cats={catById} lang={lang} w={210} />
                </button>
                <div className="h-jrow">
                  <span className="grow"><b><bdi>{pick(b, "name", lang)}</bdi></b><small>{catById[b.category_id] ? cityName(catById[b.category_id], lang) : ""}</small></span>
                  <SaveToWallet b={b} lang={lang} go={go} setToast={setToast} className="h-jsave" iconOnly />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      <div className="b-own">
        <div className="grow">
          <b>{t(lang, "own_biz")}</b>
          <small>{t(lang, "own_biz_sub")}</small>
        </div>
        <button type="button" className="b-gold" onClick={() => go("/list")}>{t(lang, "list_it_free")}</button>
      </div>

      <div className="b-navspace" />
      <BottomNav lang={lang} active="home" go={go} signedIn={signedIn} />
      <Toast text={toast} />
      {picking ? <CitySheet lang={lang} lists={lists} city={city} onClose={() => setPicking(false)}
        onPick={(id) => { setCity(id); setPicking(false); }} /> : null}
    </div>
  );
}

// ---------- results (one category) and search ----------

// "Chamchamal", or "Centre" when the district has the same name as the city
function areaOf(b, look) {
  const d = look.dist[b.district_id];
  const c = look.city && look.city[b.city_id];
  const sub = look.sub && look.sub[b.subdistrict_id];
  if (d && c && d.name_en === c.name_en && sub) return sub;
  return d;
}

function ResultRow({ b, lang, look, onOpen }) {
  const dist = areaOf(b, look);
  return (
    <div className="b-result" role="button" tabIndex={0} onClick={onOpen} onKeyDown={(e) => { if (e.key === "Enter") onOpen(); }}>
      <span className="b-av">{initial(pick(b, "name", lang))}</span>
      <span className="grow">
        <b className="b-name"><bdi>{pick(b, "name", lang)}</bdi>{b.verified ? <Tick /> : null}</b>
        <small><Rating b={b} lang={lang} compact /> {dist ? <span className="b-muted">· {cityName(dist, lang)}</span> : null}</small>
        {openState(b.hours, lang) ? <small className={openState(b.hours, lang).open ? "b-ok" : "b-muted"}>{openState(b.hours, lang).text}</small> : null}
      </span>
      {b.phone ? (
        <a className="b-callbtn" href={`tel:${b.phone}`} onClick={(e) => { e.stopPropagation(); track(b.id, "call"); }} aria-label={t(lang, "call")}>
          <Icon name="phone" size={18} />
        </a>
      ) : null}
    </div>
  );
}

function ResultTile({ b, lang, look, onOpen }) {
  const dist = areaOf(b, look);
  return (
    <button type="button" className="b-rtile" onClick={onOpen}>
      <span className="b-av big">{initial(pick(b, "name", lang))}</span>
      <b className="b-name"><bdi>{pick(b, "name", lang)}</bdi>{b.verified ? <Tick /> : null}</b>
      <small><Rating b={b} lang={lang} compact />{dist ? <span className="b-muted"> · {cityName(dist, lang)}</span> : null}</small>
    </button>
  );
}

// ---------- results: two looks the visitor can choose ----------
const TINT_BY_CAT = (cats, id) => { const i = (cats || []).findIndex((c) => c.id === id); return TINTS[(i < 0 ? 0 : i) % TINTS.length]; };

function OpenPill({ b, lang }) {
  const st = openState(b.hours, lang);
  return st ? <span className={"r-open" + (st.open ? " on" : "")}>{st.text}</span> : null;
}
function CallBtns({ b, lang, column }) {
  return (
    <span className={"r-acts" + (column ? " col" : "")}>
      {b.phone ? <a className="r-cb call" href={`tel:${b.phone}`} onClick={(e) => { e.stopPropagation(); track(b.id, "call"); }} aria-label={t(lang, "call")}><Icon name="phone" size={17} /></a> : null}
      {b.whatsapp || b.phone ? <a className="r-cb wa" href={waLink(b.whatsapp || b.phone)} target="_blank" rel="noreferrer" onClick={(e) => { e.stopPropagation(); track(b.id, "whatsapp"); }} aria-label={t(lang, "whatsapp")}><Icon name="whatsapp" size={17} /></a> : null}
    </span>
  );
}

// A · card rows: a small picture of the business's own card, then the details and Call / WhatsApp
function ResultCardRow({ b, lang, look, onOpen }) {
  const dist = areaOf(b, look);
  const c = look.cat[b.category_id];
  return (
    <div className="r-row" role="button" tabIndex={0} onClick={onOpen} onKeyDown={(e) => { if (e.key === "Enter") onOpen(); }}>
      <MiniCard b={b} cats={look.cat} lang={lang} w={96} />
      <span className="grow">
        <b className="b-name"><bdi>{pick(b, "name", lang)}</bdi>{b.verified ? <Tick /> : null}</b>
        <small>{[dist && cityName(dist, lang), c && cityName(c, lang)].filter(Boolean).join(" · ")}</small>
        <span className="r-line"><Rating b={b} lang={lang} compact /><OpenPill b={b} lang={lang} /></span>
      </span>
      <CallBtns b={b} lang={lang} column />
    </div>
  );
}

// B · card gallery: the full digital card, with the details, Save and Call under it
function ResultCardBig({ b, lang, look, onOpen, go, setToast }) {
  const dist = areaOf(b, look);
  return (
    <div className="r-big">
      <button type="button" className="r-bigcard" onClick={onOpen} aria-label={pick(b, "name", lang)}>
        <NfcCard b={b} s={cardSettings(b)} lang={lang} cat={look.cat[b.category_id]} linksOnly />
      </button>
      <div className="r-bigrow">
        <span className="grow">
          <b className="b-name"><bdi>{pick(b, "name", lang)}</bdi>{b.verified ? <Tick /> : null}</b>
          <span className="r-line"><Rating b={b} lang={lang} compact />{dist ? <small>{cityName(dist, lang)}</small> : null}<OpenPill b={b} lang={lang} /></span>
        </span>
        <SaveToWallet b={b} lang={lang} go={go} setToast={setToast} className="r-save" iconOnly />
        {b.phone ? <a className="r-cb call" href={`tel:${b.phone}`} onClick={() => track(b.id, "call")} aria-label={t(lang, "call")}><Icon name="phone" size={17} /></a> : null}
      </div>
    </div>
  );
}

const RES_VIEW_KEY = "bm_results_view";

export function Results({ lang, city, setCity, go, back, signedIn, categoryId, search }) {
  const [lists] = useLists();
  const [rows, err, reload] = useBusinesses(city);
  const [sort, setSort] = useState("top");
  const [area, setArea] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [q, setQ] = useState(search || "");
  const [picking, setPicking] = useState(false);
  const [view, setView] = useState(() => {
    try { const v = localStorage.getItem(RES_VIEW_KEY); return v === "cards" || v === "grid" ? "cards" : "rows"; } catch { return "rows"; }
  });
  const [openOnly, setOpenOnly] = useState(false);
  const [toast, setToast] = useToast();
  const setV = (v) => { setView(v); try { localStorage.setItem(RES_VIEW_KEY, v); } catch { /* ignore */ } };
  const inputRef = useRef(null);
  useEffect(() => { if (search !== undefined && inputRef.current) inputRef.current.focus(); }, []);

  const look = useMemo(() => ({ cat: byId(lists && lists.cats), dist: byId(lists && lists.districts), city: byId(lists && lists.cities), sub: byId(lists && lists.subdistricts) }), [lists]);
  const cat = look.cat[categoryId];
  const isSearch = search !== undefined;

  let list = (rows || []).filter((b) => (isSearch ? true : b.category_id === categoryId));
  if (isSearch) {
    const s = q.trim().toLowerCase();
    const d = digits(s);
    list = s ? list.filter((b) => {
      const c = look.cat[b.category_id];
      const hay = [b.name_en, b.name_ku, b.name_ar, b.description_en, b.description_ku, b.description_ar, b.contact_name,
        c && c.name_en, c && c.name_ku, c && c.name_ar].join(" ").toLowerCase();
      return hay.includes(s) || (d.length >= 4 && digits(b.phone).includes(d.replace(/^0/, "")));
    }) : [];
  }
  const areas = Array.from(new Set(list.map((b) => b.district_id).filter(Boolean)));
  if (area) list = list.filter((b) => b.district_id === area);
  const total = list.length;
  const openCount = list.filter((b) => { const st = openState(b.hours, lang); return st && st.open; }).length;
  if (openOnly) list = list.filter((b) => { const st = openState(b.hours, lang); return st && st.open; });
  list = sortRows(list, sort);

  const cityRow = look.city[city];
  const title = isSearch ? t(lang, "search_title") : cityName(cat, lang);
  const catLabel = cityName(cat, lang);
  const open = (b) => go("/" + b.handle + "/card");
  const empty = rows && !list.length && !openOnly;

  return (
    <div className="b-page">
      <div className="b-top">
        <button type="button" className="rbtn" aria-label={t(lang, "back")} onClick={back}><Icon name="back" size={18} className="flip" /></button>
        {!isSearch && cat ? <span className="r-tic b-ic sm h-tint" style={{ "--tint": TINT_BY_CAT(lists && lists.cats, categoryId) }}><Icon name={categoryIcon(cat)} size={22} /></span> : null}
        <div className="grow b-title">
          <b>{title}</b>
          <button type="button" className="b-citylink" onClick={() => setPicking(true)}>
            {cityName(cityRow, lang)} · {rows ? bizCount(lang, total) : "…"}{rows && openCount && !isSearch ? " · " + t(lang, "n_open_now", { n: openCount }) : ""}
          </button>
        </div>
        {!isSearch ? <button type="button" className="rbtn" aria-label={t(lang, "search_title")} onClick={() => go("/search")}><Icon name="search" size={18} /></button> : null}
      </div>

      {isSearch ? (
        <label className="b-search input">
          <Icon name="search" size={19} />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t(lang, "search_ph")} type="search" enterKeyHint="search" />
        </label>
      ) : null}

      {!empty || area ? (
        <div className="r-chiprow">
        <div className="b-chips r-chips">
          {areas.length > 1 || area ? (
            <button type="button" className={"b-chip" + (showFilters || area ? " on2" : "")} onClick={() => setShowFilters(!showFilters)}>
              <Icon name="filter" size={15} /> {t(lang, "filters")}
            </button>
          ) : null}
          <button type="button" className={"b-chip" + (sort === "top" ? " on" : "")} onClick={() => setSort("top")}>{t(lang, "top_rated")}</button>
          <button type="button" className={"b-chip" + (openOnly ? " on" : "")} onClick={() => setOpenOnly((x) => !x)}>{t(lang, "open_now_chip")}</button>
          <button type="button" className={"b-chip" + (sort === "latest" ? " on" : "")} onClick={() => setSort("latest")}>{t(lang, "latest")}</button>
        </div>
          <div className="b-views r-views" role="group" aria-label={t(lang, "r_look")}>
            <button type="button" aria-pressed={view === "rows"} aria-label={t(lang, "r_rows")} title={t(lang, "r_rows")} onClick={() => setV("rows")}><Icon name="rows" size={17} /></button>
            <button type="button" aria-pressed={view === "cards"} aria-label={t(lang, "r_cards")} title={t(lang, "r_cards")} onClick={() => setV("cards")}><Icon name="contact" size={17} /></button>
          </div>
        </div>
      ) : null}

      {showFilters ? (
        <div className="b-chips wrap">
          <button type="button" className={"b-chip" + (!area ? " on" : "")} onClick={() => setArea("")}>{t(lang, "all_areas")}</button>
          {areas.map((id) => (
            <button key={id} type="button" className={"b-chip" + (area === id ? " on" : "")} onClick={() => setArea(id)}>{cityName(look.dist[id], lang)}</button>
          ))}
        </div>
      ) : null}

      {err ? (
        <div className="panel" style={{ padding: 16 }}>
          <div className="err">{t(lang, "load_failed")}</div>
          <button type="button" className="link" onClick={reload}>{t(lang, "try_again")}</button>
        </div>
      ) : !rows ? (
        <SkelRows n={6} />
      ) : isSearch && !q.trim() ? (
        <p className="note">{t(lang, "search_hint")}</p>
      ) : empty && isSearch ? (
        <p className="note">{t(lang, "search_none", { q: q.trim(), city: cityName(cityRow, lang) })}</p>
      ) : empty ? (
        <>
          <div className="b-empty">
            <div className="b-empty-ic"><Icon name="box" size={34} /></div>
            <b>{t(lang, "no_biz_yet", { cat: catLabel })}</b>
            <p>{t(lang, "empty_text")}</p>
            <a className="btn" href={waLink(BMNASSA_WHATSAPP, t(lang, "ask_msg", { cat: catLabel, city: cityName(cityRow, lang) }))} target="_blank" rel="noreferrer">
              <Icon name="chat" size={18} /> {t(lang, "ask_find")}
            </a>
            <div className="b-two">
              <button type="button" className="b-chip big" onClick={() => go("/home")}>{t(lang, "other_cats")}</button>
              <button type="button" className="b-chip big" onClick={() => setPicking(true)}>{t(lang, "other_city")}</button>
            </div>
          </div>
          <div className="b-own">
            <div className="grow"><b>{t(lang, "own_biz")}</b><small>{t(lang, "list_your_free")}</small></div>
            <button type="button" className="b-dark" onClick={() => go("/list")}>{t(lang, "list_it_free")}</button>
          </div>
        </>
      ) : !list.length && openOnly ? (
        <p className="note">{t(lang, "none_open_now")}</p>
      ) : view === "cards" ? (
        <div className="r-gallery">{list.map((b, i) => <div key={b.id} className="bm-arrive" style={{ "--i": i }}><ResultCardBig b={b} lang={lang} look={look} onOpen={() => open(b)} go={go} setToast={setToast} /></div>)}</div>
      ) : (
        <div className="r-rows">{list.map((b, i) => <div key={b.id} className="bm-arrive" style={{ "--i": i }}><ResultCardRow b={b} lang={lang} look={look} onOpen={() => open(b)} /></div>)}</div>
      )}

      <div className="b-navspace" />
      <BottomNav lang={lang} active="home" go={go} signedIn={signedIn} />
      <Toast text={toast} />
      {picking ? <CitySheet lang={lang} lists={lists} city={city} onClose={() => setPicking(false)} onPick={(id) => { setCity(id); setPicking(false); }} /> : null}
    </div>
  );
}

// ---------- photos: tap one and it zooms to full screen; swipe sideways for the next, swipe down to close ----------
function PhotoViewer({ photos, start, from, lang, onClose }) {
  const track = useRef(null);
  const wrap = useRef(null);
  const drag = useRef(null);
  const [i, setI] = useState(start);
  const [dy, setDy] = useState(0);
  useLayoutEffect(() => {
    const tr = track.current;
    if (!tr) return;
    tr.scrollLeft = start * tr.clientWidth * (document.documentElement.dir === "rtl" ? -1 : 1);
    // zoom from the tapped thumbnail
    const img = tr.children[start] && tr.children[start].querySelector("img");
    if (img && from && !calm() && img.animate) {
      const to = img.getBoundingClientRect();
      if (to.width) {
        const sx = from.width / to.width, sy = from.height / to.height, sc = Math.max(sx, sy);
        const x = from.left + from.width / 2 - (to.left + to.width / 2), y = from.top + from.height / 2 - (to.top + to.height / 2);
        img.animate([{ transform: `translate(${x}px, ${y}px) scale(${sc})`, borderRadius: "14px" }, { transform: "none", borderRadius: "0px" }],
          { duration: 420, easing: "cubic-bezier(0.2, 0, 0, 1)" });
      }
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);
  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const tr = track.current; const step = (e.key === "ArrowRight" ? 1 : -1) * (document.documentElement.dir === "rtl" ? -1 : 1);
        tr && tr.scrollBy({ left: step * tr.clientWidth, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const onScroll = () => { const tr = track.current; if (tr) setI(Math.round(Math.abs(tr.scrollLeft) / tr.clientWidth)); };
  const close = () => {
    const el = wrap.current;
    if (el && el.animate && !calm()) el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease-out", fill: "forwards" }).onfinish = onClose;
    else onClose();
  };
  const tStart = (e) => { const q = e.touches[0]; drag.current = { x: q.clientX, y: q.clientY, axis: null }; };
  const tMove = (e) => {
    const d = drag.current; if (!d) return;
    const q = e.touches[0]; const mx = q.clientX - d.x, my = q.clientY - d.y;
    if (!d.axis && Math.abs(mx) + Math.abs(my) > 10) d.axis = Math.abs(my) > Math.abs(mx) ? "y" : "x";
    if (d.axis === "y") setDy(Math.max(0, my));
  };
  const tEnd = () => { const d = drag.current; drag.current = null; if (d && d.axis === "y" && dy > 110) close(); else setDy(0); };
  const fade = Math.max(0.25, 1 - dy / 400);
  return createPortal(
    <div className="pv" ref={wrap} role="dialog" aria-modal="true" aria-label={t(lang, "photos_title")} style={{ "--pv-bg": fade }}>
      <div className="pv-top">
        <span className="pv-count">{i + 1} / {photos.length}</span>
        <button type="button" className="pv-x" aria-label={t(lang, "close")} onClick={close}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg></button>
      </div>
      <div className="pv-track" ref={track} onScroll={onScroll} onTouchStart={tStart} onTouchMove={tMove} onTouchEnd={tEnd}
        style={{ transform: dy ? `translateY(${dy}px) scale(${1 - dy / 1600})` : undefined, transition: dy ? "none" : undefined }}>
        {photos.map((p) => (
          <div key={p.id} className="pv-slide"><img src={photoUrl(p.path)} alt="" draggable="false" /></div>
        ))}
      </div>
      {photos.length > 1 ? <div className="pv-dots">{photos.map((p, k) => <i key={p.id} className={k === i ? "on" : ""} />)}</div> : null}
    </div>,
    document.body
  );
}

// ---------- one business: digital card and business page ----------

export function useBusiness(handle) {
  const [b, setB] = useState(undefined);
  const [err, setErr] = useState(false);
  const load = () => {
    setErr(false);
    const cached = Object.values(cache.biz).flat().find((x) => x.handle && x.handle.toLowerCase() === String(handle).toLowerCase());
    if (cached) setB(cached);
    businessByHandle(handle).then((row) => setB(row || null)).catch(() => { if (!cached) setErr(true); });
  };
  useEffect(load, [handle]);
  return [b, err, load];
}

function shareOrCopy(url, title, setToast, lang) {
  if (navigator.share) {
    navigator.share({ title, url }).catch(() => {});
    return;
  }
  const done = () => setToast(t(lang, "copied"));
  if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done);
  else done();
}

function downloadContact(b, lang) {
  const esc = (s) => String(s || "").replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  const name = cardPerson(b, lang);
  const lines = [
    "BEGIN:VCARD", "VERSION:3.0",
    `FN:${esc(name)}`,
    `ORG:${esc(pick(b, "name", lang))}`,
    b.phone ? `TEL;TYPE=CELL:${b.phone}` : "",
    b.handle ? `URL:${window.location.origin}/${b.handle}` : "",
    "END:VCARD",
  ].filter(Boolean);
  const blob = new Blob([lines.join("\r\n")], { type: "text/vcard" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = (name || "contact").replace(/[^\w؀-ۿ -]/g, "").trim() + ".vcf";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

function QR({ text, size = 220 }) {
  const cells = useMemo(() => {
    const q = new QRCode(-1, QRErrorCorrectLevel.M);
    q.addData(text);
    q.make();
    const n = q.getModuleCount();
    let d = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c},${r}h1v1h-1z`;
    return { n, d };
  }, [text]);
  return (
    <svg width={size} height={size} viewBox={`-2 -2 ${cells.n + 4} ${cells.n + 4}`} role="img" aria-label={text} shapeRendering="crispEdges">
      <rect x="-2" y="-2" width={cells.n + 4} height={cells.n + 4} fill="#fff" />
      <path d={cells.d} fill="#121212" />
    </svg>
  );
}

export function NotFound({ lang, go }) {
  return (
    <div className="b-page">
      <div className="b-top"><img className="logo" src="/brand/logo-ink.svg" alt="Bmnassa" /></div>
      <div className="b-empty">
        <div className="b-empty-ic"><Icon name="search" size={30} /></div>
        <b>{t(lang, "not_found_title")}</b>
        <p>{t(lang, "not_found_sub")}</p>
        <button type="button" className="btn" onClick={() => go("/home")}>{t(lang, "go_home")}</button>
      </div>
    </div>
  );
}

function subtitle(b, cat, lang) {
  const parts = [cityName(cat, lang)];
  if (b.contact_name) parts.push(pick(b, "name", lang));
  return parts.filter(Boolean).join(" · ");
}

export function Card({ lang, handle, go, back }) {
  const [b, err, reload] = useBusiness(handle);
  const [lists] = useLists();
  const [flipped, setFlipped] = useState(false);
  const [toast, setToast] = useToast();
  const touch = useRef(null);
  const screen = useRef(null);
  const body = useRef(null);
  const shine = useRef(null);
  const turning = useRef(false);
  const leaving = useRef(false);
  const st = b ? cardSettings(b) : null;

  // the card slides up from the bottom when it opens
  useEffect(() => {
    const el = screen.current;
    if (!el || !el.animate || !b) return;
    if (calm()) el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ms("--duration-instant", 80), easing: "linear" });
    else el.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], { duration: ms("--duration-sheet", 480), easing: ease("--ease-emphasized") });
  }, [!!b]);

  useEffect(() => {
    const colour = !st || st.style === "classic" ? "#121212" : st.style === "minimal" ? "#f4f1ea" : st.style === "bold" && !flipped ? st.color : "#d9dce0";
    document.documentElement.setAttribute("data-bar-locked", "");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", colour);
    return () => {
      document.documentElement.removeAttribute("data-bar-locked");
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeBar());
    };
  }, [st && st.style, st && st.color, flipped]);
  useEffect(() => { if (b && b.id) track(b.id, "view"); }, [b && b.id]);

  if (b === null) return <NotFound lang={lang} go={go} />;
  if (b === undefined) {
    return <div className="b-card-screen">{err ? <p className="b-card-wait">{t(lang, "load_failed")}</p> : <div className="b-card-skel bm-skelwrap"><Skel h={0} r={22} style={{ aspectRatio: "1.586", height: "auto", background: "#2a2b2e" }} /><Skel w="60%" h={22} style={{ background: "#2a2b2e" }} /><Skel h={58} r={18} style={{ background: "#2a2b2e" }} /><Skel h={58} r={18} style={{ background: "#2a2b2e" }} /></div>}
      {err ? <button type="button" className="link" onClick={reload}>{t(lang, "try_again")}</button> : null}</div>;
  }

  const cat = lists && byId(lists.cats)[b.category_id];
  const city = lists && byId(lists.cities)[b.city_id];
  const person = cardPerson(b, lang);
  const url = `${window.location.origin}/${b.handle}/card`;
  const leave = () => (window.history.length > 1 ? back() : go("/home"));
  // and slides back down when it closes
  const exit = () => {
    const el = screen.current;
    if (leaving.current) return;
    if (!el || !el.animate) return leave();
    leaving.current = true;
    const a = calm()
      ? el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms("--duration-instant", 80), fill: "forwards" })
      : el.animate([{ transform: "translateY(0)" }, { transform: "translateY(100%)" }], { duration: ms("--duration-base", 240), easing: ease("--ease-exit"), fill: "forwards" });
    a.onfinish = leave;
  };
  // the card turns over in 3D, with a band of light passing across it
  const flip = (dir) => {
    if (turning.current) return;
    turning.current = true;
    flipCard(body.current, { dir, shine: shine.current, swap: () => setFlipped((f) => !f), done: () => { turning.current = false; } });
  };
  const share = () => shareOrCopy(url, person, setToast, lang);
  const copy = () => {
    const done = () => setToast(t(lang, "copied"));
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, done); else share();
  };

  const onStart = (e) => { const p = e.touches[0]; touch.current = { x: p.clientX, y: p.clientY }; };
  const onEnd = (e) => {
    if (!touch.current) return;
    const p = e.changedTouches[0];
    const dx = p.clientX - touch.current.x, dy = p.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) flip(dx > 0 ? 1 : -1);
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx) && window.scrollY <= 0) exit();
  };
  const boldBar = st.style === "bold" && !flipped;

  return (
    <div ref={screen} className={"b-card-screen cs-" + st.style + (flipped ? " flipped" : "")} style={{ "--card": st.color }} onTouchStart={onStart} onTouchEnd={onEnd}>
      <div className={"b-card-bar" + (boldBar ? " cf-surface " + (st.background === "solid" ? "solid" : "carbon") : "")}>
        <button type="button" className="b-dbtn" aria-label={t(lang, "back")} onClick={exit}><Icon name="down" size={20} /></button>
        <span className="grow" />
        <button type="button" className="b-dbtn" aria-label={t(lang, "flip")} onClick={() => flip()}><Icon name="flip" size={19} /></button>
        <button type="button" className="b-dbtn" aria-label={t(lang, "share")} onClick={share}><Icon name="share" size={19} /></button>
      </div>

      <div className="b-card-body" ref={body}>
        <span className="b-flip-shine" ref={shine} aria-hidden="true" />
        {!flipped
          ? <CardFront b={b} s={st} lang={lang} cat={cat} city={city} onSaveContact={() => downloadContact(b, lang)} />
          : <CardBack b={b} s={st} lang={lang} cat={cat} url={url} onShare={share} onCopy={copy} />}
        <p className="b-hint">{t(lang, "swipe_hint")}</p>
        <p className="b-powered">{t(lang, "powered_by")} <img src="/brand/logo-silver.svg" alt="Bmnassa" /></p>
      </div>

      <div className="b-card-sheet">
        <span className="b-grab" />
        <div className="b-sheet-name"><b><bdi>{pick(b, "name", lang)}</bdi></b>{b.verified ? <Tick /> : null}</div>
        <div className="b-sheet-meta"><Rating b={b} lang={lang} />{openState(b.hours, lang) ? <span className={"b-open " + (openState(b.hours, lang).open ? "yes" : "no")}>{openState(b.hours, lang).text}</span> : null}</div>
        <button type="button" className="b-darkbtn" onClick={() => go("/" + b.handle)}><Icon name="up" size={16} /> {t(lang, "more_info")}</button>
        <SaveToWallet b={b} lang={lang} go={go} setToast={setToast} className="b-darkbtn" />
      </div>
      <Toast text={toast} />
    </div>
  );
}

// A small street map around the business (OpenStreetMap tiles), with a gold pin in the middle
function MiniMap({ lat, lng }) {
  const z = 16;
  const n = 2 ** z;
  const fx = ((lng + 180) / 360) * n;
  const r = (lat * Math.PI) / 180;
  const fy = ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n;
  const tx = Math.floor(fx), ty = Math.floor(fy);
  const tiles = [];
  for (let dx = -2; dx <= 2; dx++) for (let dy = -1; dy <= 1; dy++) tiles.push([tx + dx, ty + dy]);
  return (
    <div className="bz-map" aria-hidden="true">
      {tiles.map(([x, y]) => (
        <img key={x + "-" + y} src={`https://tile.openstreetmap.org/${z}/${x}/${y}.png`} alt="" loading="lazy"
          style={{ left: `calc(50% + ${(x - fx) * 256}px)`, top: `calc(50% + ${(y - fy) * 256}px)` }} />
      ))}
      <span className="bz-pin" />
      <small className="bz-osm">© OpenStreetMap</small>
    </div>
  );
}

export function BizPage({ lang, handle, go, back, signedIn }) {
  const [b, err, reload] = useBusiness(handle);
  const [lists] = useLists();
  const [toast, setToast] = useToast();
  const [photos, setPhotos] = useState([]);
  const [prices, setPrices] = useState([]);
  const [tab, setTab] = useState("about");
  const [viewer, setViewer] = useState(null);
  const refs = useRef({});
  // the card sits on top; scrolling tilts it away and a slim header with the logo takes over
  const coverRef = useRef(null);
  const faceRef = useRef(null);
  const [mini, setMini] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const turning = useRef(false);
  const swipe = useRef(null);
  const bodyRef = useRef(null);
  const bandRef = useRef(null);
  const hintRef = useRef(null);
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    if (!b) return undefined;
    let raf = 0;
    const paint = () => {
      const el = coverRef.current, body = bodyRef.current;
      if (!el) return;
      const y = window.scrollY;
      const vh = window.innerHeight || 700;
      const p = Math.min(1, Math.max(0, y / (vh * 0.5)));    // the card leaves
      const q = Math.min(1, Math.max(0, y / (vh * 0.42)));   // the profile arrives
      if (!calm()) {
        el.style.transform = `translateY(${-y * 0.28}px) scale(${1 - p * 0.1})`;
        if (body) body.style.transform = `translateY(${(1 - q) * 70}px)`;
      }
      el.style.opacity = String(Math.max(0, 1 - p * 1.25));
      if (body) body.style.opacity = String(q);
      if (bandRef.current) bandRef.current.style.opacity = String(Math.max(0, 1 - p));
      if (hintRef.current) hintRef.current.style.opacity = String(Math.max(0, 1 - y / 70));
      setIntro(y < vh * 0.3);
      setMini(y > vh * 0.55);
    };
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(paint); };
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    paint();
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [b && b.id]);
  const toProfile = () => window.scrollTo({ top: Math.round((window.innerHeight || 700) * 0.62), behavior: calm() ? "auto" : "smooth" });
  const flip = (dir) => {
    if (turning.current || !faceRef.current) return;
    turning.current = true;
    haptic(10);
    flipCard(faceRef.current, { dir, swap: () => setFlipped((f) => !f), done: () => { turning.current = false; } });
  };
  useEffect(() => {
    if (!b || !b.id) return;
    track(b.id, "view");
    getPhotos(b.id).then((r) => setPhotos(r || [])).catch(() => {});
    getPrices(b.id).then((r) => setPrices(r || [])).catch(() => {});
  }, [b && b.id]);
  // the tab of the section in view lights up while scrolling
  useEffect(() => {
    if (!b || !window.IntersectionObserver) return undefined;
    const io = new IntersectionObserver((entries) => {
      const seen = entries.filter((e) => e.isIntersecting).sort((x, y) => x.boundingClientRect.top - y.boundingClientRect.top)[0];
      if (seen) setTab(seen.target.dataset.sec);
    }, { rootMargin: "-30% 0px -60% 0px" });
    Object.values(refs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [b && b.id, prices.length, photos.length]);

  if (b === null) return <NotFound lang={lang} go={go} />;
  if (b === undefined) {
    return (
      <div className="b-page">
        {err ? <p className="note">{t(lang, "load_failed")}</p> : <SkelPage />}
        {err ? <button type="button" className="link" onClick={reload}>{t(lang, "try_again")}</button> : null}
      </div>
    );
  }

  const look = { cat: byId(lists && lists.cats), city: byId(lists && lists.cities), dist: byId(lists && lists.districts), sub: byId(lists && lists.subdistricts) };
  const cat = look.cat[b.category_id];
  const place = [cityName(look.sub[b.subdistrict_id], lang), cityName(look.dist[b.district_id], lang), cityName(look.city[b.city_id], lang)]
    .filter((x, i, a) => x && a.indexOf(x) === i);
  const sep = lang === "en" ? ", " : "، ";
  const about = pick(b, "description", lang);
  const url = `${window.location.origin}/${b.handle}`;
  const open = openState(b.hours, lang);
  const today = todayHours(b.hours, lang);
  const lines = hoursLines(b.hours, lang);
  const day = todayIndex();
  const links = socialLinks(b);
  const dir = directionsUrl(b);
  const n = Number(b.reviews) || 0;
  const cs = cardSettings(b);
  const ps = pageSettings(b);
  const pgLook = pageLook(ps, cs.color);
  const bigPhotos = ps.layout === "grid";
  const exit = () => (window.history.length > 1 ? back() : go("/home"));
  const sections = [
    ["about", t(lang, "about"), !!(about || photos.length)],
    ["prices", t(lang, "prices"), prices.length > 0],
    ["hours", t(lang, "hours_title"), lines.length > 0],
    ["reviews", t(lang, "reviews_short"), true],
  ].filter((x) => x[2]);
  const jump = (k) => {
    setTab(k);
    const el = refs.current[k];
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: calm() ? "auto" : "smooth" });
  };
  const sec = (k) => ({ ref: (el) => { refs.current[k] = el; }, "data-sec": k, id: "bz-" + k });
  const shown = photos.slice(0, bigPhotos ? 6 : 3);
  const more = photos.length - shown.length;

  return (
    <div className={"b-page bz cardtheme " + pgLook.cls + (intro ? " intro-on" : "")} style={{ ...pgLook.style, "--bz-card": cs.color }}>
      <div className="pg-backdrop" style={{ backgroundColor: ps.bg || undefined, backgroundImage: pgLook.bgImage || undefined }} aria-hidden="true" />
      <div className="bz-band" ref={bandRef} aria-hidden="true" />

      <section className="bz-intro">
      <div className="bz-top">
        <button type="button" className="bz-glass" aria-label={t(lang, "back")} onClick={exit}><Icon name="down" size={20} /></button>
        <span className="grow" />
        <SaveToWallet b={b} lang={lang} go={go} setToast={setToast} className="bz-glass" iconOnly />
        <button type="button" className="bz-glass" aria-label={t(lang, "share")} onClick={() => shareOrCopy(url, pick(b, "name", lang), setToast, lang)}><Icon name="share" size={19} /></button>
      </div>

      <div className="bz-coverwrap" ref={coverRef}>
        <div className="bz-cover" role="group" aria-label={t(lang, "tap_card_flip")}
          onTouchStart={(e) => { const q = e.touches[0]; swipe.current = { x: q.clientX, y: q.clientY }; }}
          onTouchEnd={(e) => { const s0 = swipe.current; swipe.current = null; if (!s0) return; const q = e.changedTouches[0]; const dx = q.clientX - s0.x; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(q.clientY - s0.y) * 1.3) { e.preventDefault(); flip(dx > 0 ? 1 : -1); } }}>
          <div ref={faceRef} className="bz-face">
            <NfcCard b={b} s={cs} lang={lang} cat={cat} back={flipped} url={url} tall />
          </div>
          {/* mouse and keyboard: arrows at the sides flip the card */}
          <button type="button" className="bz-flipbtn" aria-label={t(lang, "flip")} onClick={() => flip()}><Icon name="flip" size={16} /></button>
        </div>
      </div>
      <button type="button" className="bz-scrollhint" ref={hintRef} onClick={toProfile}>
        <small>{t(lang, "tap_card_flip")}</small>
        <b>{t(lang, "scroll_profile")}</b>
        <span className="bz-chev"><Icon name="down" size={20} /></span>
      </button>
      </section>

      <div className={"bz-mini" + (mini ? " on" : "")} aria-hidden={!mini}>
        <button type="button" className="bz-mback" aria-label={t(lang, "back")} onClick={exit}><Icon name="back" size={18} className="flip" /></button>
        <CardLogo b={b} s={cs} lang={lang} className="bz-mlogo" />
        <span className="grow"><b><bdi>{b.contact_name || pick(b, "name", lang)}</bdi></b><small><bdi>{pick(b, "name", lang)}</bdi></small></span>
        {b.phone ? <a className="bz-mcall" href={`tel:${b.phone}`} onClick={() => track(b.id, "call")} aria-label={t(lang, "call")}><Icon name="phone" size={18} /></a> : null}
      </div>

      <div className="bz-body" ref={bodyRef}>
      <div className="bz-head">
        <h1><bdi>{pick(b, "name", lang)}</bdi>{b.verified ? <Tick /> : null}</h1>
        <p className="bz-sub">{[cityName(cat, lang), place.slice(0, 2).join(sep)].filter(Boolean).join(" · ")}</p>
        <div className="bz-chips">
          {n ? (
            <button type="button" className="bz-chip" onClick={() => jump("reviews")}><span className="bz-star">★</span> {Number(b.rating || 0).toFixed(1)} <span className="bz-dim">({n})</span></button>
          ) : <span className="bz-chip">{t(lang, "new_on")}</span>}
          {open ? <span className={"bz-chip " + (open.open ? "open" : "shut")}><i />{open.text}</span> : null}
        </div>
      </div>

      {sections.length > 1 ? (
        <nav className="bz-tabs" aria-label={t(lang, "about")}>
          {sections.map(([k, label]) => (
            <button key={k} type="button" className={tab === k ? "on" : ""} aria-current={tab === k ? "true" : undefined} onClick={() => jump(k)}>{label}</button>
          ))}
        </nav>
      ) : null}

      <div className="bz-secs">
        {about || photos.length ? (
          <section className="bz-sec" {...sec("about")}>
            <span className="bz-label">{t(lang, "about")}</span>
            {about ? <p className="bz-about" dir="auto">{about}</p> : null}
            {shown.length ? (
              <div className={"bz-photos" + (bigPhotos ? " big" : "")}>
                {shown.map((p, i) => (
                  <button type="button" key={p.id} className="bz-photo" aria-label={t(lang, "photos_title") + " " + (i + 1)}
                    onClick={(e) => { haptic(8); setViewer({ start: i, from: e.currentTarget.getBoundingClientRect() }); }}>
                    <img src={photoUrl(p.path)} alt="" loading="lazy" />
                    {i === shown.length - 1 && more > 0 ? <b>+{more}</b> : null}
                  </button>
                ))}
              </div>
            ) : null}
            {links.length ? (
              <div className="bz-links">
                {links.map(([icon, cls, label, text, href]) => (
                  <a key={icon} className="bz-link" href={href} target="_blank" rel="noreferrer"><span className={"b-lic " + cls}><Icon name={icon} size={16} /></span>{label}</a>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        {prices.length ? (
          <section className="bz-sec" {...sec("prices")}>
            <span className="bz-label">{t(lang, "prices")}</span>
            {prices.map((r) => (
              <div key={r.id} className="bz-price">
                <span dir="auto">{pick(r, "item", lang)}</span>
                {r.price_iqd == null ? null : <span className="ltr"><b>{Number(r.price_iqd).toLocaleString("en-US")}</b> <small>{t(lang, "iqd")}</small></span>}
              </div>
            ))}
          </section>
        ) : null}

        {lines.length ? (
          <section className="bz-sec" {...sec("hours")}>
            <span className="bz-label">{t(lang, "hours_title")}</span>
            <div className="bz-week">
              {DAYS.map((d, i) => (
                <span key={d} className={(i === day ? "today " : "") + (b.hours && b.hours[d] ? "" : "off")}>{dayName(lang, i)}</span>
              ))}
            </div>
            {today ? <p className="bz-today"><b>{t(lang, "today_is", { h: today })}</b></p> : null}
            <div className="bz-lines">{lines.map((l) => <p key={l}>{l}</p>)}</div>
          </section>
        ) : null}

        <section className="bz-sec bz-where">
          {b.lat && b.lng ? <MiniMap lat={Number(b.lat)} lng={Number(b.lng)} /> : null}
          <div className="bz-whererow">
            <span className="grow">
              <b dir="auto">{b.address || place.join(sep)}</b>
              {b.address ? <small>{place.slice(0, 2).join(sep)}</small> : null}
            </span>
            {dir ? <a className="bz-go" href={dir} target="_blank" rel="noreferrer"><Icon name="route" size={16} /> {t(lang, "directions")}</a> : null}
          </div>
          <button type="button" className="bz-plain" onClick={() => downloadContact(b, lang)}><Icon name="contact" size={16} /> {t(lang, "save_contact")}</button>
        </section>

        <section className="bz-sec" {...sec("reviews")}>
          <ReviewsSummary b={b} lang={lang} go={go} />
        </section>
      </div>

      </div>

      {viewer ? <PhotoViewer photos={photos} start={viewer.start} from={viewer.from} lang={lang} onClose={() => setViewer(null)} /> : null}
      <div className="bz-barspace" />
      <div className="bz-bar">
        {b.phone ? <a className="b-act gold" href={`tel:${b.phone}`} onClick={() => track(b.id, "call")}><Icon name="phone" size={19} /> {t(lang, "call")}</a> : null}
        {b.whatsapp || b.phone ? <a className="b-act bz-wa" href={waLink(b.whatsapp || b.phone)} target="_blank" rel="noreferrer" onClick={() => track(b.id, "whatsapp")}><Icon name="whatsapp" size={19} /> {t(lang, "whatsapp")}</a> : null}
      </div>
      <Toast text={toast} />
    </div>
  );
}
