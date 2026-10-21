// Slice 5 · owner dashboard and Edit my page.
// The database decides what an owner may change; this page only shows and sends it.
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./owner.css";
import { walletSaves, getDailyViews } from "../api.js";
import { NfcCard, cardSettings } from "../card/CardFaces.jsx";
import { t, cityName, pick, LANGS } from "../i18n.js";
import {
  getMyBusiness, updateMyBusiness, getPrices, savePrices, getPhotos, addPhoto, removePhoto, photoUrl, getStats,
  normalisePhone, prettyPhone,
} from "../api.js";
import { useLists, Toast, ok } from "../browse/Browse.jsx";
import { SkelPage } from "../Skeleton.jsx";
import { Icon } from "../browse/icons.jsx";
import { DAYS, dayName, hoursLines, hasHours } from "../hours.js";

const initial = (s) => (String(s || "").trim().charAt(0) || "B").toUpperCase();
const byId = (arr) => Object.fromEntries((arr || []).map((x) => [x.id, x]));

export function Back({ lang, onClick }) {
  return (
    <button type="button" className="rbtn" aria-label={t(lang, "back")} onClick={onClick}>
      <Icon name="back" size={18} className="flip" />
    </button>
  );
}

function useToast() {
  const [text, setText] = useState("");
  useEffect(() => { if (!text) return; const id = setTimeout(() => setText(""), 2600); return () => clearTimeout(id); }, [text]);
  return [text, setText];
}

export function useMine(id) {
  const [b, setB] = useState(undefined);
  const [err, setErr] = useState("");
  const load = () => {
    setErr("");
    getMyBusiness(id).then((row) => setB(row || null)).catch((e) => setErr([e.status, e.code, e.message].filter(Boolean).join(" · ")));
  };
  useEffect(load, [id]);
  return [b, setB, err, load];
}

// ---------- dashboard ----------

export function Dashboard({ lang, id, go }) {
  const [b, , err, reload] = useMine(id);
  const [lists] = useLists();
  const [stats, setStats] = useState(null);
  const [photos, setPhotos] = useState(null);
  const [prices, setPrices] = useState(null);
  const [saves, setSaves] = useState(null);
  const [toast, setToast] = useToast();
  const [days, setDays] = useState(null);

  useEffect(() => {
    getDailyViews(id).then(setDays).catch(() => setDays([]));
    getStats(id).then(setStats).catch(() => setStats({ views: 0, calls: 0, whatsapp: 0 }));
    getPhotos(id, true).then((r) => setPhotos(r || [])).catch(() => setPhotos([]));
    getPrices(id, true).then((r) => setPrices(r || [])).catch(() => setPrices([]));
    walletSaves(id).then(setSaves);
  }, [id]);

  if (b === null) return <Missing lang={lang} go={go} />;
  if (b === undefined) return <Loading lang={lang} err={err} reload={reload} go={go} />;

  const cat = lists && byId(lists.cats)[b.category_id];
  const city = lists && byId(lists.cities)[b.city_id];
  const steps = [
    ["ck_name", !!(pick(b, "name", lang) && b.phone), null],
    ["ck_photos", !!(photos && photos.length), "photos"],
    ["ck_location", !!(b.lat && b.lng), "location"],
    ["ck_hours", hasHours(b.hours), "hours"],
    ["ck_prices", !!((prices && prices.length) || b.instagram || b.facebook || b.tiktok || b.email || b.website), "prices"],
    ["ck_card", !!b.card, "card"],
  ];
  const done = steps.filter((s) => s[1]).length;
  const next = steps.find((x) => !x[1] && x[2]);
  const live = b.status === "approved" && b.handle;
  const peak = days ? Math.max(1, ...days.map((d) => d.views)) : 1;
  const openStep = (part) => (part === "card" ? go(`/my/${b.id}/card`) : go(`/my/${b.id}/edit#${part}`));
  const share = async () => {
    const url = `${window.location.origin}/${b.handle}`;
    try { if (navigator.share) await navigator.share({ title: pick(b, "name", lang), url }); else { await navigator.clipboard.writeText(url); setToast(ok(t(lang, "link_copied"))); } } catch { /* cancelled */ }
  };

  return (
    <div className="o-page db">
      <div className="db-head">
        <Back lang={lang} onClick={() => go("/account")} />
        <div className="grow">
          <b><bdi>{pick(b, "name", lang)}</bdi></b>
          <small>{[cityName(cat, lang), cityName(city, lang)].filter(Boolean).join(" · ")}</small>
        </div>
        <span className={"db-status " + (b.status || "pending")}>{b.status === "approved" ? t(lang, "live") : t(lang, "st_" + (b.status || "pending"))}</span>
      </div>

      {b.status === "rejected" ? (
        <div className="o-banner red">
          <Icon name="flip" size={20} />
          <span className="grow"><b>{t(lang, "not_approved_banner")}</b><small>{b.rejection_reason ? `${t(lang, "reason")} ${b.rejection_reason} · ` : ""}{t(lang, "fix_and_save")}</small></span>
        </div>
      ) : b.status !== "approved" ? (
        <div className="o-banner wait">
          <Icon name="clock" size={20} />
          <span className="grow"><b>{t(lang, "pending_approval")}</b><small>{t(lang, "team_will_call")}</small></span>
        </div>
      ) : null}

      <div className="db-card">
        <button type="button" className="db-cardbtn" onClick={() => (live ? go(`/${b.handle}/card`) : go(`/my/${b.id}/card`))} aria-label={t(lang, "open_card")}>
          <NfcCard b={b} s={cardSettings(b)} lang={lang} cat={cat} linksOnly />
        </button>
        {live ? (
          <div className="db-cardacts">
            <button type="button" onClick={() => go("/" + b.handle)}><Icon name="globe" size={16} /> {t(lang, "open_my_page")}</button>
            <button type="button" onClick={share}><Icon name="share" size={16} /> {t(lang, "share")}</button>
            <button type="button" onClick={() => go(`/my/${b.id}/card`)}><Icon name="palette" size={16} /> {t(lang, "card_colours_btn")}</button>
          </div>
        ) : null}
      </div>

      <div className="db-bento">
        <div className="db-hero">
          <small>{t(lang, "last_7_days")}</small>
          <b>{stats ? t(lang, "n_views", { n: stats.views }) : "…"}</b>
          <span className="db-bars" aria-hidden="true">{(days || Array.from({ length: 7 }, () => ({ views: 0, day: "" }))).map((d, i) => <i key={i} style={{ height: Math.max(8, (d.views / peak) * 100) + "%" }} />)}</span>
          <span className="db-days" aria-hidden="true">{(days || []).map((d, i) => <em key={i}>{d.day ? dayLetter(d.day, lang) : ""}</em>)}</span>
        </div>
        <div className="db-tile"><span className="db-ic call"><Icon name="phone" size={17} /></span><b>{stats ? stats.calls : "…"}</b><small>{t(lang, "call_taps")}</small></div>
        <div className="db-tile"><span className="db-ic wa"><Icon name="whatsapp" size={17} /></span><b>{stats ? stats.whatsapp : "…"}</b><small>{t(lang, "wa_taps")}</small></div>
        <div className="db-tile wide">
          <span className="db-ic"><Icon name="wallet" size={17} /></span><span className="grow"><b className="sm">{t(lang, "wallet_saves", { n: saves || 0 })}</b></span>
          {live ? <button type="button" className="db-rate" onClick={() => go(`/${b.handle}/reviews`)}><Icon name="star" size={14} className="db-star" /> {Number(b.reviews) ? `${Number(b.rating || 0).toFixed(1)} · ${b.reviews}` : t(lang, "reviews_short")}</button> : null}
        </div>
      </div>

      {done < 6 ? (
        <button type="button" className="db-steps" onClick={() => next && openStep(next[2])}>
          <span className="db-ring" style={{ "--p": done / 6 }}><b>{done}/6</b></span>
          <span className="grow"><b>{t(lang, "complete_page")}</b><small>{next ? t(lang, "next_step") + " " + t(lang, next[0]) : ""}</small></span>
          <Icon name="chevron" size={18} className="flip" />
        </button>
      ) : null}

      <div className="db-actions">
        <button type="button" onClick={() => go(`/my/${b.id}/edit`)}><span className="db-aic"><Icon name="rows" size={20} /></span><b>{t(lang, "edit_page")}</b><small>{t(lang, "edit_page_sub")}</small></button>
        <button type="button" onClick={() => go(`/my/${b.id}/card`)}><span className="db-aic"><Icon name="palette" size={20} /></span><b>{t(lang, "card_colours_btn")}</b><small>{t(lang, "card_colours_sub")}</small></button>
        {live ? <button type="button" onClick={() => go(`/${b.handle}/reviews`)}><span className="db-aic"><Icon name="star" size={20} /></span><b>{t(lang, "reviews_short")}</b><small>{Number(b.reviews) ? `★ ${Number(b.rating || 0).toFixed(1)} · ${b.reviews}` : t(lang, "reviews_tile_sub")}</small></button> : null}
        <button type="button" onClick={() => go(`/my/${b.id}/nfc`)}><span className="db-aic"><Icon name="nfc" size={20} /></span><b>{t(lang, "order_nfc")}</b><small>{t(lang, "order_nfc_sub")}</small></button>
      </div>
      <Toast text={toast} />
    </div>
  );
}

// "S" "S" "M"... one letter for each day under the chart
function dayLetter(iso, lang) {
  const d = new Date(iso + "T12:00:00");
  try { return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : lang === "ar" ? "ar" : "ckb", { weekday: "narrow" }).format(d); } catch { return ""; }
}

export function Loading({ lang, err, reload, go }) {
  return (
    <div className="o-page">
      <div className="o-head"><Back lang={lang} onClick={() => go("/account")} /></div>
      {err ? (
        <div className="panel" style={{ padding: 16 }}>
          <div className="err">{t(lang, "load_failed")}</div>
          <div className="note ltr" style={{ fontSize: 11 }}>{err}</div>
          <button type="button" className="link" onClick={reload}>{t(lang, "try_again")}</button>
        </div>
      ) : <SkelPage card={false} />}
    </div>
  );
}

export function Missing({ lang, go }) {
  return (
    <div className="o-page">
      <div className="o-head"><Back lang={lang} onClick={() => go("/account")} /></div>
      <div className="panel" style={{ padding: 18 }}><b>{t(lang, "not_found_title")}</b></div>
    </div>
  );
}

// ---------- photos ----------

// Makes a phone photo small enough to load fast (longest side 1600 px, JPEG)
function shrink(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const max = 1600;
      const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement("canvas");
      c.width = Math.round(img.naturalWidth * k);
      c.height = Math.round(img.naturalHeight * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("no image"))), "image/jpeg", 0.82);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("not an image")); };
    img.src = url;
  });
}

function Photos({ lang, bid, photos, setPhotos, setToast }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(0);
  const add = async (files) => {
    const list = Array.from(files || []).slice(0, Math.max(0, 8 - photos.length));
    for (const f of list) {
      setBusy((n) => n + 1);
      try {
        const blob = await shrink(f);
        const row = await addPhoto(bid, blob, photos.length + 1);
        if (row) setPhotos((p) => p.concat(row));
      } catch {
        setToast(t(lang, "upload_failed"));
      } finally {
        setBusy((n) => n - 1);
      }
    }
    if (input.current) input.current.value = "";
  };
  const del = async (p) => {
    setPhotos((list) => list.filter((x) => x.id !== p.id));
    try { await removePhoto(p); } catch { setPhotos((list) => list.concat(p)); }
  };
  return (
    <section id="photos" className="o-sec">
      <span className="label">{t(lang, "photos")}</span>
      <div className="o-photos">
        {photos.map((p) => (
          <div key={p.id} className="o-photo">
            <img src={photoUrl(p.path)} alt="" loading="lazy" />
            <button type="button" aria-label={t(lang, "remove")} onClick={() => del(p)}>×</button>
          </div>
        ))}
        {busy ? <div className="o-photo wait">{t(lang, "uploading")}</div> : null}
        {photos.length + busy < 8 ? (
          <button type="button" className="o-photo add" onClick={() => input.current && input.current.click()} aria-label={t(lang, "photos")}>+</button>
        ) : null}
      </div>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => add(e.target.files)} />
      <p className="note">{t(lang, "photo_hint")}</p>
    </section>
  );
}

// ---------- map pin (Leaflet, already in the site for the old register page) ----------

let leafletPromise = null;
function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (!leafletPromise) {
    leafletPromise = new Promise((resolve, reject) => {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "/register/leaflet/leaflet.css";
      document.head.appendChild(css);
      const s = document.createElement("script");
      s.src = "/register/leaflet/leaflet.js";
      s.onload = () => resolve(window.L);
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  return leafletPromise;
}

const CITY_CENTRES = {
  sulaymaniyah: [35.5613, 45.4306], erbil: [36.1911, 44.0092], duhok: [36.8663, 42.9885],
  kirkuk: [35.4681, 44.3922], halabja: [35.1779, 45.9861],
};

function MapPin({ lang, lat, lng, cityId, onChange }) {
  const box = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    loadLeaflet().then((L) => {
      if (!alive || !box.current || map.current) return;
      const start = lat && lng ? [lat, lng] : CITY_CENTRES[cityId] || CITY_CENTRES.sulaymaniyah;
      const m = L.map(box.current, { zoomControl: true, attributionControl: true }).setView(start, lat && lng ? 16 : 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(m);
      const icon = L.divIcon({ className: "o-pin", html: "<span></span>", iconSize: [30, 42], iconAnchor: [15, 40] });
      const place = (ll) => {
        if (!marker.current) {
          marker.current = L.marker(ll, { draggable: true, icon }).addTo(m);
          marker.current.on("dragend", () => { const p = marker.current.getLatLng(); onChange(+p.lat.toFixed(6), +p.lng.toFixed(6)); });
        } else marker.current.setLatLng(ll);
        onChange(+ll[0].toFixed(6), +ll[1].toFixed(6));
      };
      if (lat && lng) {
        marker.current = L.marker([lat, lng], { draggable: true, icon }).addTo(m);
        marker.current.on("dragend", () => { const p = marker.current.getLatLng(); onChange(+p.lat.toFixed(6), +p.lng.toFixed(6)); });
      }
      m.on("click", (e) => place([e.latlng.lat, e.latlng.lng]));
      map.current = { m, place };
      setTimeout(() => m.invalidateSize(), 150);
    }).catch(() => setFailed(true));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // "Use my location": a quick rough fix first (Wi-Fi / mobile network), then sharpen it with GPS
  const [geo, setGeo] = useState("");
  const useMine = () => {
    if (!window.isSecureContext || !navigator.geolocation) { setGeo("fail"); return; }
    if (!map.current) { setGeo("busy"); setTimeout(useMine, 600); return; }
    setGeo("busy");
    let got = false;
    const put = (p) => {
      const ll = [p.coords.latitude, p.coords.longitude];
      map.current.m.setView(ll, 17);
      map.current.place(ll);
    };
    const fail = (e) => {
      if (got) return;
      setGeo(e && e.code === 1 ? "denied" : e && e.code === 2 ? "off" : "fail");
    };
    navigator.geolocation.getCurrentPosition((p) => {
      got = true;
      put(p);
      setGeo("refine");
      navigator.geolocation.getCurrentPosition((q) => { if (q.coords.accuracy <= p.coords.accuracy) put(q); setGeo("done"); },
        () => setGeo("done"), { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
    }, (e) => {
      if (e && e.code === 1) { fail(e); return; }
      // no quick fix: wait longer for GPS
      navigator.geolocation.getCurrentPosition((q) => { got = true; put(q); setGeo("done"); }, fail,
        { enableHighAccuracy: true, timeout: 25000, maximumAge: 0 });
    }, { enableHighAccuracy: false, timeout: 8000, maximumAge: 120000 });
  };
  const geoNote = { busy: "geo_busy", refine: "geo_refine", denied: "geo_denied", off: "geo_off", fail: "geo_fail" }[geo];

  if (failed) return <p className="note">{t(lang, "load_failed")}</p>;
  return (
    <>
      <div className="o-map" ref={box} />
      <div className="o-maprow">
        <span className="note">{lat && lng ? t(lang, "pin_set") : t(lang, "pin_tap")}</span>
        <button type="button" className="b-chip" onClick={useMine} disabled={geo === "busy"} aria-busy={geo === "busy"}><Icon name="pin" size={15} /> {geo === "busy" ? t(lang, "geo_busy") : t(lang, "use_my_location")}</button>
      </div>
      {geoNote && geo !== "busy" ? <p className={"note o-geonote" + (["denied", "off", "fail"].includes(geo) ? " warn" : "")} role="status">{t(lang, geoNote)}</p> : null}
    </>
  );
}

// ---------- working hours ----------

function HoursEditor({ lang, hours, onDone, onClose }) {
  const [h, setH] = useState(() => {
    const base = {};
    DAYS.forEach((d, i) => { base[d] = hours && Array.isArray(hours[d]) ? [...hours[d]] : hasHours(hours) ? null : i < 6 ? ["09:00", "18:00"] : null; });
    return base;
  });
  const [same, setSame] = useState(() => {
    const open = DAYS.filter((d) => h[d]);
    return open.every((d) => h[d][0] === h[open[0]][0] && h[d][1] === h[open[0]][1]);
  });
  const first = DAYS.find((d) => h[d]) || "sat";
  const setDay = (d, v) => setH((x) => ({ ...x, [d]: v }));
  const setTime = (d, k, v) => {
    setH((x) => {
      const n = { ...x };
      const targets = same ? DAYS.filter((dd) => n[dd]) : [d];
      targets.forEach((dd) => { const cur = n[dd] ? [...n[dd]] : ["09:00", "18:00"]; cur[k] = v; n[dd] = cur; });
      return n;
    });
  };
  return (
    <div className="b-sheet-wrap" onClick={onClose}>
      <div className="b-sheet o-hours" role="dialog" aria-label={t(lang, "set_hours")} onClick={(e) => e.stopPropagation()}>
        <div className="b-sheet-head"><b>{t(lang, "set_hours")}</b><button type="button" className="link" onClick={onClose}>{t(lang, "close")}</button></div>
        <label className="o-same"><input type="checkbox" checked={same} onChange={(e) => setSame(e.target.checked)} /> {t(lang, "same_every_day")}</label>
        <div className="o-days">
          {DAYS.map((d, i) => (
            <div key={d} className={"o-day" + (h[d] ? "" : " off")}>
              <button type="button" className={"o-dtog" + (h[d] ? " on" : "")} aria-pressed={!!h[d]}
                onClick={() => setDay(d, h[d] ? null : (same && h[first] ? [...h[first]] : ["09:00", "18:00"]))}>
                {dayName(lang, i)}
              </button>
              {h[d] && (!same || d === first) ? (
                <span className="o-times ltr">
                  <input type="time" value={h[d][0]} onChange={(e) => setTime(d, 0, e.target.value)} />
                  <span>–</span>
                  <input type="time" value={h[d][1]} onChange={(e) => setTime(d, 1, e.target.value)} />
                </span>
              ) : <span className="o-dstate">{h[d] ? `${h[d][0]} – ${h[d][1]}` : t(lang, "closed_word")}</span>}
            </div>
          ))}
        </div>
        <div className="o-row2">
          <button type="button" className="btn ghost" onClick={() => onDone(null)}>{t(lang, "clear")}</button>
          <button type="button" className="btn" onClick={() => onDone(h)}>{t(lang, "done")}</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Edit my page ----------

const LINKS = [
  ["instagram", "instagram", "@yourshop"],
  ["facebook", "facebook", "facebook.com/yourshop"],
  ["tiktok", "tiktok", "@yourshop"],
  ["email", "email_link", "name@gmail.com"],
  ["website", "website", "yourshop.com"],
];

const FIELDS = ["name_en", "name_ku", "name_ar", "description_en", "description_ku", "description_ar", "category_id", "phone",
  "contact_name", "instagram", "facebook", "tiktok", "email", "website", "lat", "lng", "address"];

export function EditPage({ lang, id, go }) {
  const [b, setB, err, reload] = useMine(id);
  const [lists] = useLists();
  const [f, setF] = useState(null);
  const [tab, setTab] = useState(lang);
  const [prices, setPricesRows] = useState(null);
  const [photos, setPhotos] = useState(null);
  const [hours, setHours] = useState(undefined);
  const [editingHours, setEditingHours] = useState(false);
  const [openLinks, setOpenLinks] = useState([]);
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState(() => (window.location.hash === "#style" ? "style" : "content"));
  const [msg, setMsg] = useState("");
  const [toast, setToast] = useToast();
  const original = useRef({ prices: "[]", hours: "null" });

  useEffect(() => {
    if (!b) return;
    const o = {};
    FIELDS.forEach((k) => { o[k] = b[k] == null ? "" : b[k]; });
    o.phone = b.phone ? prettyPhone(b.phone).replace("+964 ", "0") : "";
    o.job_title = cardSettings(b).title;
    setF(o);
    setHours(b.hours || null);
    original.current.hours = JSON.stringify(b.hours || null);
    setOpenLinks(LINKS.map((l) => l[0]).filter((k) => b[k]));
  }, [b]);
  useEffect(() => {
    getPrices(id, true).then((r) => { setPricesRows((r || []).map((x) => ({ ...x }))); original.current.prices = JSON.stringify(r || []); }).catch(() => setPricesRows([]));
    getPhotos(id, true).then((r) => setPhotos(r || [])).catch(() => setPhotos([]));
  }, [id]);
  useEffect(() => {
    if (!f || !window.location.hash) return;
    const el = document.getElementById(window.location.hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
  }, [!!f]);

  if (b === null) return <Missing lang={lang} go={go} />;
  if (b === undefined || !f) return <Loading lang={lang} err={err} reload={reload} go={go} />;

  const set = (k, v) => { setF((x) => ({ ...x, [k]: v })); setMsg(""); };
  const miss = (l) => !String(f["name_" + l] || "").trim();
  const LANG_IDS = ["en", "ku", "ar"];
  const langDir = (l) => (l === "en" ? "ltr" : "rtl");
  const priceRows = prices || [];
  const setPrice = (i, k, v) => setPricesRows((rows) => rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  const save = async () => {
    setMsg("");
    const phone = normalisePhone(f.phone);
    if (!phone) { setMsg(t(lang, "biz_phone_invalid")); return; }
    if (!LANG_IDS.some((l) => String(f["name_" + l]).trim())) { setMsg(t(lang, "name_required")); return; }
    const body = {};
    FIELDS.forEach((k) => {
      let v = f[k];
      if (k === "phone") v = phone;
      if (typeof v === "string") v = v.trim() || null;
      if ((k === "lat" || k === "lng") && v !== null && v !== "") v = Number(v);
      if (v === "") v = null;
      const old = b[k] == null ? null : b[k];
      if (String(v) !== String(old)) body[k] = v;
    });
    if (body.phone && b.whatsapp === b.phone) body.whatsapp = body.phone;
    const title = String(f.job_title || "").trim().slice(0, 60);
    if (title !== cardSettings(b).title) body.card = { ...(b.card || {}), title };
    if (JSON.stringify(hours || null) !== original.current.hours) body.hours = hours || null;
    const cleanPrices = priceRows
      .map((r) => ({ ...r, price_iqd: r.price_iqd === "" || r.price_iqd == null ? null : Number(String(r.price_iqd).replace(/[^\d]/g, "")) }))
      .filter((r) => (r.item_en || r.item_ku || r.item_ar || "").trim());
    const pricesChanged = JSON.stringify(cleanPrices.map((r) => [r.item_en, r.item_ku, r.item_ar, r.price_iqd]))
      !== JSON.stringify(JSON.parse(original.current.prices).map((r) => [r.item_en, r.item_ku, r.item_ar, r.price_iqd]));
    setBusy(true);
    try {
      let row = b;
      if (Object.keys(body).length) row = await updateMyBusiness(b.id, body);
      if (pricesChanged) {
        const saved = await savePrices(b.id, cleanPrices);
        original.current.prices = JSON.stringify(saved || []);
        setPricesRows((saved || []).map((x) => ({ ...x })));
      }
      const wentBack = b.status === "approved" && row.status === "pending";
      setB(row);
      setToast(ok(t(lang, wentBack ? "saved_review" : "saved_page")));
    } catch (e) {
      setMsg(`${t(lang, "save_failed")} (${[e.status, e.message].filter(Boolean).join(" · ")})`);
    } finally {
      setBusy(false);
    }
  };

  const cats = lists ? lists.cats : [];
  const lines = hoursLines(hours, lang);

  const cat = lists && byId(lists.cats)[f.category_id];
  const live = { ...b, contact_name: f.contact_name || null, card: { ...(b.card || {}), title: f.job_title } };
  const jumpTo = (k) => { const el = document.getElementById("ed-" + k); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" }); };
  const Head = ({ ic, title, sub }) => (
    <div className="ed-h"><span className="ed-ic"><Icon name={ic} size={18} /></span><span className="grow"><b>{title}</b>{sub ? <small>{sub}</small> : null}</span></div>
  );

  return (
    <div className="o-page ed">
      <div className="ed-top">
        <Back lang={lang} onClick={() => go(`/my/${b.id}`)} />
        <h1 className="grow">{t(lang, "edit_page")}</h1>
        {b.status === "approved" && b.handle ? (
          <button type="button" className="b-pill" onClick={() => go("/" + b.handle)}><Icon name="globe" size={15} /> {t(lang, "preview")}</button>
        ) : null}
      </div>

      <div className="ed-card"><NfcCard b={live} s={cardSettings(live)} lang={lang} cat={cat} linksOnly /></div>

      <nav className="ed-jump">
        {[["card", "ed_card"], ["photos", "photos_title"], ["about", "name_desc"], ["contact", "ed_contact"], ["prices", "prices"], ["hours", "working_hours"], ["location", "location"], ["links", "links"]].map(([k, label]) => (
          <button key={k} type="button" onClick={() => jumpTo(k)}>{t(lang, label)}</button>
        ))}
      </nav>

      <section id="ed-card" className="o-sec ed-sec">
        <Head ic="contact" title={t(lang, "ed_card")} sub={t(lang, "ed_card_sub")} />
        <span className="label">{t(lang, "name_on_card")}</span>
        <div className="field"><input value={f.contact_name} onChange={(e) => set("contact_name", e.target.value)} maxLength={60} placeholder={t(lang, "name_on_card_ph")} /></div>
        <span className="label">{t(lang, "job_title")}</span>
        <div className="field"><input value={f.job_title} onChange={(e) => set("job_title", e.target.value)} maxLength={60} placeholder={t(lang, "job_title_ph")} /></div>
        <button type="button" className="ed-link" onClick={() => go(`/my/${b.id}/card`)}><Icon name="palette" size={16} /> {t(lang, "ed_colours_logo")} <Icon name="chevron" size={14} className="flip" /></button>
      </section>

      <div id="ed-photos" className="ed-sec ed-photos">
        <Head ic="image" title={t(lang, "photos_title")} sub={t(lang, "photos_hint_short")} />
        {photos ? <Photos lang={lang} bid={b.id} photos={photos} setPhotos={setPhotos} setToast={setToast} /> : null}
      </div>

      <section id="ed-about" className="o-sec ed-sec">
        <Head ic="rows" title={t(lang, "name_desc")} sub={t(lang, "ed_about_sub")} />
        <div className="seg">
          {LANG_IDS.map((l) => (
            <button key={l} type="button" aria-pressed={tab === l} onClick={() => setTab(l)} dir={langDir(l)}>
              {LANGS.find((x) => x.id === l).label} {miss(l) ? <em className="o-miss">{t(lang, "missing")}</em> : <span className="o-ok"><Icon name="check" size={11} stroke={3} /></span>}
            </button>
          ))}
        </div>
        <div className="field"><input dir={langDir(tab)} value={f["name_" + tab]} onChange={(e) => set("name_" + tab, e.target.value)} placeholder={t(lang, "biz_name_ph")} maxLength={80} /></div>
        <div className="field area"><textarea dir={langDir(tab)} rows={3} value={f["description_" + tab]} onChange={(e) => set("description_" + tab, e.target.value)} placeholder={t(lang, "desc_ph")} maxLength={300} /></div>
      </section>

      <section id="ed-contact" className="o-sec ed-sec">
        <Head ic="phone" title={t(lang, "ed_contact")} />
        <span className="label">{t(lang, "biz_phone")}</span>
        <div className="field ltr"><input type="tel" inputMode="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="0770 123 4567" /></div>
        <span className="label">{t(lang, "category")}</span>
        <div className="field pick">
          <select value={f.category_id} onChange={(e) => set("category_id", e.target.value)}>
            {cats.map((c) => <option key={c.id} value={c.id}>{cityName(c, lang)}</option>)}
          </select>
          <Icon name="down" size={16} />
        </div>
      </section>

      <section id="ed-prices" className="o-sec ed-sec">
        <Head ic="box" title={t(lang, "prices")} sub={t(lang, "ed_prices_sub")} />
        {priceRows.map((r, i) => (
          <div key={r.id || "n" + i} className="o-price">
            <div className="field"><input value={r["item_" + lang] || r.item_en || r.item_ku || r.item_ar || ""}
              onChange={(e) => setPrice(i, "item_" + lang, e.target.value)} placeholder={t(lang, "item_ph")} maxLength={60} /></div>
            <div className="field ltr o-amount"><input inputMode="numeric" value={r.price_iqd == null ? "" : Number(String(r.price_iqd).replace(/[^\d]/g, "") || 0).toLocaleString("en-US")}
              onChange={(e) => setPrice(i, "price_iqd", e.target.value.replace(/[^\d٠-٩۰-۹]/g, "").replace(/[٠-٩]/g, (c) => "٠١٢٣٤٥٦٧٨٩".indexOf(c)).replace(/[۰-۹]/g, (c) => "۰۱۲۳۴۵۶۷۸۹".indexOf(c)))}
              placeholder={t(lang, "price_ph")} /><span className="prefix">{t(lang, "iqd")}</span></div>
            <button type="button" className="o-x" aria-label={t(lang, "remove")} onClick={() => setPricesRows((rows) => rows.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
        {priceRows.length < 30 ? <button type="button" className="ed-add" onClick={() => setPricesRows((rows) => rows.concat({ item_en: "", item_ku: "", item_ar: "", price_iqd: "" }))}><Icon name="plus" size={16} /> {t(lang, "add_price")}</button> : null}
      </section>

      <section id="ed-hours" className="o-sec ed-sec">
        <Head ic="clock" title={t(lang, "working_hours")} />
        <button type="button" className="o-rowbtn" onClick={() => setEditingHours(true)}>
          <span className="grow">{lines.length ? lines.map((l) => <span key={l} className="o-hline">{l}</span>) : <span className="b-muted">{t(lang, "set_hours")}</span>}</span>
          <Icon name="chevron" size={16} className="flip" />
        </button>
      </section>

      <section id="ed-location" className="o-sec ed-sec">
        <Head ic="pin" title={t(lang, "location")} />
        <MapPin lang={lang} lat={b.lat} lng={b.lng} cityId={b.city_id} onChange={(la, ln) => setF((x) => ({ ...x, lat: la, lng: ln }))} />
        <div className="field"><input value={f.address} onChange={(e) => set("address", e.target.value)} placeholder={t(lang, "address_ph")} maxLength={120} /></div>
      </section>

      <section id="ed-links" className="o-sec ed-sec">
        <Head ic="globe" title={t(lang, "links")} sub={t(lang, "ed_links_sub")} />
        {LINKS.filter(([k]) => openLinks.includes(k)).map(([k, label, ph]) => (
          <div key={k} className="o-linkrow">
            <span className="o-lname">{t(lang, label)}</span>
            <div className="field ltr"><input value={f[k]} onChange={(e) => set(k, e.target.value)} placeholder={ph} maxLength={120}
              type={k === "email" ? "email" : "text"} inputMode={k === "email" ? "email" : "url"} autoCapitalize="none" spellCheck={false} /></div>
          </div>
        ))}
        <div className="b-chips wrap">
          {LINKS.filter(([k]) => !openLinks.includes(k)).map(([k, label]) => (
            <button key={k} type="button" className="b-chip" onClick={() => setOpenLinks((o) => o.concat(k))}>+ {t(lang, label)}</button>
          ))}
        </div>
      </section>

      <div className="o-warn"><Icon name="flip" size={16} /> {t(lang, "edit_warning")}</div>
      {msg ? <div className="err" role="alert">{msg}</div> : null}
      <div className="o-savebar ed-save">
        <button type="button" className="btn" disabled={busy} onClick={save}>{busy ? t(lang, "loading") : t(lang, "save")}</button>
      </div>

      {editingHours ? <HoursEditor lang={lang} hours={hours} onClose={() => setEditingHours(false)} onDone={(h) => { setHours(h); setEditingHours(false); }} /> : null}
      <Toast text={toast} />
    </div>
  );
}
