// Slice 4 · listing: home, results, search, business card and business page.
// Anyone can browse without an account; only live (approved) businesses come back from the database.
import { themeBar } from "../theme.js";
import { calm, ms, ease, flipCard } from "../motion.js";
import { ReviewsSummary } from "../reviews/Reviews.jsx";
import { SaveToWallet } from "../wallet/Wallet.jsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./browse.css";
import { t, cityName, bizCount, pick, FALLBACK_CITIES } from "../i18n.js";
import { getCategories, getCities, getPlaces, listBusinesses, businessByHandle, prettyPhone, getPhotos, getPrices, photoUrl, track } from "../api.js";
import { hoursLines, openState } from "../hours.js";
import { CardFront, CardBack, NfcCard, cardSettings } from "../card/CardFaces.jsx";
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

export function Toast({ text }) {
  return text ? <div className="b-toast" role="status">{text}</div> : null;
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
    ["scan", "nav_scan", () => setToast(t(lang, "soon_feature"))],
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

export function Home({ lang, city, setCity, go, signedIn }) {
  const [lists, listErr, reloadLists] = useLists();
  const [rows] = useBusinesses(city);
  const [view, setView] = useState(() => { try { return localStorage.getItem(VIEW_KEY) || "4"; } catch { return "4"; } });
  const [picking, setPicking] = useState(false);
  const setV = (v) => { setView(v); try { localStorage.setItem(VIEW_KEY, v); } catch { /* ignore */ } };

  const cityRow = lists && lists.cities.find((c) => c.id === city);
  const counts = useMemo(() => {
    const m = {};
    (rows || []).forEach((b) => { m[b.category_id] = (m[b.category_id] || 0) + 1; });
    return m;
  }, [rows]);
  const cats = lists ? lists.cats : [];

  return (
    <div className="b-page">
      <div className="b-top">
        <img className="logo" src="/brand/logo-ink.svg" alt="Bmnassa" />
        <span className="grow" />
        <button type="button" className="b-pill" onClick={() => setPicking(true)}>
          <Icon name="pin" size={15} /> {cityName(cityRow, lang) || t(lang, "choose_city")}
        </button>
      </div>

      <div className="stack" style={{ gap: 4 }}>
        <h1>{t(lang, "home_title")}</h1>
        <p className="sub">{t(lang, "home_sub")}</p>
      </div>

      <button type="button" className="b-search" onClick={() => go("/search")}>
        <Icon name="search" size={19} /> <span>{t(lang, "search_ph")}</span>
      </button>

      <div className="b-row-head">
        <span className="label">{t(lang, "categories")}</span>
        <div className="b-views" role="group" aria-label={t(lang, "categories")}>
          {[["4", "tiles4", "view_4"], ["3", "tiles9", "view_3"], ["list", "rows", "view_list"]].map(([v, icon, key]) => (
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
        <p className="note">{t(lang, "loading")}</p>
      ) : view === "list" ? (
        <div className="panel">
          {cats.map((c) => (
            <button key={c.id} type="button" className="b-catrow" onClick={() => go("/c/" + c.id)}>
              <span className="b-ic sm"><Icon name={categoryIcon(c)} size={20} /></span>
              <span className="grow"><b>{cityName(c, lang)}</b><small>{rows ? bizCount(lang, counts[c.id] || 0) : "…"}</small></span>
              <Icon name="chevron" size={18} className="flip" />
            </button>
          ))}
        </div>
      ) : (
        <div className={"b-tiles cols" + view}>
          {cats.map((c) => (
            <button key={c.id} type="button" className="b-tile" onClick={() => go("/c/" + c.id)}>
              <span className="b-ic"><Icon name={categoryIcon(c)} size={view === "3" ? 30 : 24} /></span>
              <span className="b-tile-name">{cityName(c, lang)}</span>
            </button>
          ))}
        </div>
      )}

      <div className="b-own">
        <div className="grow">
          <b>{t(lang, "own_biz")}</b>
          <small>{t(lang, "own_biz_sub")}</small>
        </div>
        <button type="button" className="b-gold" onClick={() => go(signedIn ? "/list" : "/list")}>{t(lang, "list_it_free")}</button>
      </div>

      <div className="b-navspace" />
      <BottomNav lang={lang} active="home" go={go} signedIn={signedIn} />
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

const RES_VIEW_KEY = "bm_results_view";

export function Results({ lang, city, setCity, go, back, signedIn, categoryId, search }) {
  const [lists] = useLists();
  const [rows, err, reload] = useBusinesses(city);
  const [sort, setSort] = useState("top");
  const [area, setArea] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [q, setQ] = useState(search || "");
  const [picking, setPicking] = useState(false);
  const [view, setView] = useState(() => { try { return localStorage.getItem(RES_VIEW_KEY) || "list"; } catch { return "list"; } });
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
  list = sortRows(list, sort);

  const cityRow = look.city[city];
  const title = isSearch ? t(lang, "search_title") : cityName(cat, lang);
  const catLabel = cityName(cat, lang);
  const open = (b) => go("/" + b.handle + "/card");
  const empty = rows && !list.length;

  return (
    <div className="b-page">
      <div className="b-top">
        <button type="button" className="rbtn" aria-label={t(lang, "back")} onClick={back}><Icon name="back" size={18} className="flip" /></button>
        <div className="grow b-title">
          <b>{title}</b>
          <button type="button" className="b-citylink" onClick={() => setPicking(true)}>
            {cityName(cityRow, lang)} · {rows ? bizCount(lang, list.length) : "…"}
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
        <div className="b-chips">
          {areas.length > 1 || area ? (
            <button type="button" className={"b-chip" + (showFilters || area ? " on2" : "")} onClick={() => setShowFilters(!showFilters)}>
              <Icon name="filter" size={15} /> {t(lang, "filters")}
            </button>
          ) : null}
          <button type="button" className={"b-chip" + (sort === "top" ? " on" : "")} onClick={() => setSort("top")}>{t(lang, "top_rated")}</button>
          <button type="button" className={"b-chip" + (sort === "latest" ? " on" : "")} onClick={() => setSort("latest")}>{t(lang, "latest")}</button>
          <span className="grow" />
          <div className="b-views">
            <button type="button" aria-pressed={view === "list"} aria-label={t(lang, "view_list")} onClick={() => setV("list")}><Icon name="rows" size={17} /></button>
            <button type="button" aria-pressed={view === "grid"} aria-label={t(lang, "view_3")} onClick={() => setV("grid")}><Icon name="tiles9" size={17} /></button>
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
        <p className="note">{t(lang, "loading")}</p>
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
      ) : view === "grid" ? (
        <div className="b-rgrid">{list.map((b) => <ResultTile key={b.id} b={b} lang={lang} look={look} onOpen={() => open(b)} />)}</div>
      ) : (
        <div className="b-results">{list.map((b) => <ResultRow key={b.id} b={b} lang={lang} look={look} onOpen={() => open(b)} />)}</div>
      )}

      <div className="b-navspace" />
      <BottomNav lang={lang} active="home" go={go} signedIn={signedIn} />
      {picking ? <CitySheet lang={lang} lists={lists} city={city} onClose={() => setPicking(false)} onPick={(id) => { setCity(id); setPicking(false); }} /> : null}
    </div>
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
  const name = b.contact_name || pick(b, "name", lang);
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
    return <div className="b-card-screen"><p className="b-card-wait">{err ? t(lang, "load_failed") : t(lang, "loading")}</p>
      {err ? <button type="button" className="link" onClick={reload}>{t(lang, "try_again")}</button> : null}</div>;
  }

  const cat = lists && byId(lists.cats)[b.category_id];
  const city = lists && byId(lists.cities)[b.city_id];
  const person = b.contact_name || pick(b, "name", lang);
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
  const flip = (dir = 1) => {
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
        <button type="button" className="b-dbtn" aria-label={t(lang, "flip")} onClick={() => flip(1)}><Icon name="flip" size={19} /></button>
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

export function BizPage({ lang, handle, go, back, signedIn }) {
  const [b, err, reload] = useBusiness(handle);
  const [lists] = useLists();
  const [toast, setToast] = useToast();
  const [photos, setPhotos] = useState([]);
  const [prices, setPrices] = useState([]);
  useEffect(() => {
    if (!b || !b.id) return;
    track(b.id, "view");
    getPhotos(b.id).then((r) => setPhotos(r || [])).catch(() => {});
    getPrices(b.id).then((r) => setPrices(r || [])).catch(() => {});
  }, [b && b.id]);

  if (b === null) return <NotFound lang={lang} go={go} />;
  if (b === undefined) {
    return (
      <div className="b-page">
        <p className="note">{err ? t(lang, "load_failed") : t(lang, "loading")}</p>
        {err ? <button type="button" className="link" onClick={reload}>{t(lang, "try_again")}</button> : null}
      </div>
    );
  }

  const look = { cat: byId(lists && lists.cats), city: byId(lists && lists.cities), dist: byId(lists && lists.districts), sub: byId(lists && lists.subdistricts) };
  const cat = look.cat[b.category_id];
  const person = b.contact_name || pick(b, "name", lang);
  const place = [cityName(look.sub[b.subdistrict_id], lang), cityName(look.dist[b.district_id], lang), cityName(look.city[b.city_id], lang)]
    .filter((x, i, a) => x && a.indexOf(x) === i);
  const about = pick(b, "description", lang);
  const url = `${window.location.origin}/${b.handle}`;
  const open = openState(b.hours, lang);
  const lines = hoursLines(b.hours, lang);
  const links = socialLinks(b);
  const dir = directionsUrl(b);
  const priceText = (r) => (r.price_iqd == null ? "" : `${Number(r.price_iqd).toLocaleString("en-US")} ${t(lang, "iqd")}`);
  const ps = pageSettings(b);
  const pgLook = pageLook(ps, cardSettings(b).color);
  const grid = ps.layout === "grid" && photos.length > 0;
  const exit = () => (window.history.length > 1 ? back() : go("/home"));

  return (
    <div className={"b-page " + pgLook.cls} style={pgLook.style}>
      <div className="pg-backdrop" style={{ backgroundColor: ps.bg || undefined, backgroundImage: pgLook.bgImage || undefined }} aria-hidden="true" />
      <div className="b-top">
        <button type="button" className="rbtn" aria-label={t(lang, "back")} onClick={exit}><Icon name="down" size={18} /></button>
        <span className="grow" />
        <button type="button" className="rbtn" aria-label={t(lang, "share")} onClick={() => shareOrCopy(url, pick(b, "name", lang), setToast, lang)}><Icon name="share" size={18} /></button>
      </div>

      {grid ? (
        <div className="pg-grid">{photos.slice(0, 5).map((p, i) => <img key={p.id} className={i === 0 ? "first" : ""} src={photoUrl(p.path)} alt="" loading="lazy" />)}</div>
      ) : null}
      {grid ? null : <button type="button" className="b-minicard" onClick={() => go("/" + b.handle + "/card")} aria-label={t(lang, "share_card")}>
        <NfcCard b={b} s={cardSettings(b)} lang={lang} cat={cat} small linksOnly />
      </button>}

      <div className="b-head">
        <h1><bdi>{pick(b, "name", lang)}</bdi>{b.verified ? <Tick /> : null}</h1>
        <p className="sub">{[cityName(cat, lang), place.slice(-2).join(lang === "en" ? ", " : "، ")].filter(Boolean).join(" · ")}</p>
        <div className="b-row-c"><Rating b={b} lang={lang} />{open ? <span className={"b-open " + (open.open ? "yes" : "no")}>{open.text}</span> : null}</div>
      </div>

      {photos.length && !grid ? (
        <div className="b-photos">{photos.map((p) => <img key={p.id} src={photoUrl(p.path)} alt="" loading="lazy" />)}</div>
      ) : null}

      <div className="b-actions">
        {b.phone ? <a className="b-act gold" href={`tel:${b.phone}`} onClick={() => track(b.id, "call")}><Icon name="phone" size={18} /> {t(lang, "call")}</a> : null}
        {b.whatsapp || b.phone ? <a className="b-act green" href={waLink(b.whatsapp || b.phone)} target="_blank" rel="noreferrer" onClick={() => track(b.id, "whatsapp")}><Icon name="whatsapp" size={18} /> {t(lang, "whatsapp")}</a> : null}
      </div>
      <div className="b-chips">
        {dir ? <a className="b-chip" href={dir} target="_blank" rel="noreferrer"><Icon name="route" size={15} /> {t(lang, "directions")}</a> : null}
        <button type="button" className="b-chip" onClick={() => go("/" + b.handle + "/card")}><Icon name="flip" size={15} /> {t(lang, "share_card")}</button>
        <SaveToWallet b={b} lang={lang} go={go} setToast={setToast} />
        <button type="button" className="b-chip" onClick={() => downloadContact(b, lang)}><Icon name="contact" size={15} /> {t(lang, "save_contact")}</button>
      </div>

      <div className="panel b-info">
        {about ? (
          <section>
            <span className="label">{t(lang, "about")}</span>
            <p dir="auto">{about}</p>
          </section>
        ) : null}
        <ReviewsSummary b={b} lang={lang} go={go} />
        {prices.length ? (
          <section>
            <span className="label">{t(lang, "prices")}</span>
            <div style={{ marginTop: 6 }}>
              {prices.map((r) => (
                <div key={r.id} className="b-price"><span dir="auto">{pick(r, "item", lang)}</span><b className="ltr">{priceText(r)}</b></div>
              ))}
            </div>
          </section>
        ) : null}
        {lines.length ? (
          <section>
            <span className="label">{t(lang, "hours_title")}</span>
            <div style={{ marginTop: 6 }}>{lines.map((l) => <p key={l} style={{ margin: 0 }}>{l}</p>)}</div>
          </section>
        ) : null}
        <section>
          <span className="label">{t(lang, "location")}</span>
          <p>{place.join(lang === "en" ? ", " : "، ")}</p>
          {b.address ? <p className="b-muted" dir="auto" style={{ marginTop: 2 }}>{b.address}</p> : null}
          {dir ? <a className="link" href={dir} target="_blank" rel="noreferrer">{t(lang, "directions")} ↗</a> : null}
        </section>
        {links.length ? (
          <section>
            <span className="label">{t(lang, "links")}</span>
            <div className="b-chips wrap" style={{ marginTop: 8 }}>
              {links.map(([icon, cls, label, text, href]) => (
                <a key={icon} className="b-chip" href={href} target="_blank" rel="noreferrer"><Icon name={icon} size={15} /> {label}</a>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div className="b-navspace" />
      <BottomNav lang={lang} active="home" go={go} signedIn={signedIn} />
      <Toast text={toast} />
    </div>
  );
}
