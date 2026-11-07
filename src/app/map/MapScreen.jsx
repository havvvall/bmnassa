// Live map: services near the person, pinned on a free OpenStreetMap map (Leaflet, loaded when the screen opens).
// Each category has its own colour. Filters: category chips and "Open now" (Baghdad time, as in hours.js).
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getCategories, listBusinesses } from "../api.js";
import { t, pick } from "../i18n.js";
import { openState } from "../hours.js";
import { BottomNav } from "../browse/Browse.jsx";
import { Icon } from "../browse/icons.jsx";
import "./map.css";

const LEAFLET_JS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
const LEAFLET_CSS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
// One distinct colour per category (in the category sort order)
export const CAT_COLOURS = ["#e11d48", "#2563eb", "#16a34a", "#f59e0b", "#7c3aed", "#0891b2", "#ea580c", "#db2777", "#4d7c0f", "#475569", "#0d9488", "#b45309"];
const YOU = "#0a84ff";
const CENTRE = [35.5613, 45.4305]; // Sulaymaniyah, used when the person does not share their location

let leafletPromise = null;
function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (!leafletPromise) {
    leafletPromise = new Promise((resolve, reject) => {
      const css = document.createElement("link");
      css.rel = "stylesheet"; css.href = LEAFLET_CSS;
      document.head.appendChild(css);
      const s = document.createElement("script");
      s.src = LEAFLET_JS; s.async = true;
      s.onload = () => (window.L ? resolve(window.L) : reject(new Error("leaflet missing")));
      s.onerror = () => { leafletPromise = null; reject(new Error("leaflet load failed")); };
      document.head.appendChild(s);
    });
  }
  return leafletPromise;
}

// Distance in km between two points on the earth
export function distanceKm(a, b) {
  const R = 6371;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b[0] - a[0]);
  const dLng = rad(b[1] - a[1]);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

const fmtKm = (km) => (km < 1 ? Math.round(km * 1000) + " m" : km.toFixed(1) + " km");

export function MapScreen({ lang, city, go }) {
  const [cats, setCats] = useState([]);
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState(false);
  const [catId, setCatId] = useState(null);
  const [openNow, setOpenNow] = useState(false);
  const [me, setMe] = useState(null);      // [lat, lng] of the person, once shared
  const [locMsg, setLocMsg] = useState("");
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  // Categories and businesses for the chosen city
  useEffect(() => {
    getCategories().then((c) => setCats(c || [])).catch(() => {});
    setRows(null); setErr(false);
    listBusinesses(city).then((r) => setRows(r || [])).catch(() => setErr(true));
  }, [city]);

  const colourOf = useMemo(() => {
    const m = {};
    cats.forEach((c, i) => { m[c.id] = CAT_COLOURS[i % CAT_COLOURS.length]; });
    return (id) => m[id] || "#64748b";
  }, [cats]);

  // Only businesses with a location can be shown on the map
  const placed = useMemo(() => (rows || []).filter((b) => typeof b.lat === "number" && typeof b.lng === "number"), [rows]);

  const visible = useMemo(() => placed.filter((b) => {
    if (catId && b.category_id !== catId) return false;
    if (openNow) { const s = openState(b.hours, lang); if (!s || !s.open) return false; }
    return true;
  }), [placed, catId, openNow, lang]);

  // The list under the map: nearest first when we know where the person is
  const list = useMemo(() => visible
    .map((b) => ({ b, km: me ? distanceKm(me, [b.lat, b.lng]) : null }))
    .sort((x, y) => (x.km == null || y.km == null ? 0 : x.km - y.km)), [visible, me]);

  // Ask for the person's position (only on this phone; it is not saved or sent anywhere)
  const findMe = () => {
    if (!navigator.geolocation) { setLocMsg(t(lang, "map_no_location")); return; }
    setLocMsg(t(lang, "map_locating"));
    navigator.geolocation.getCurrentPosition(
      (p) => { setMe([p.coords.latitude, p.coords.longitude]); setLocMsg(""); },
      () => setLocMsg(t(lang, "map_no_location")),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Build the map once
  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then((L) => {
      if (cancelled || !mapEl.current || mapRef.current) return;
      const map = L.map(mapEl.current, { zoomControl: false, attributionControl: true }).setView(CENTRE, 13);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setTimeout(() => map.invalidateSize(), 0);
    }).catch(() => setErr(true));
    return () => { cancelled = true; if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  // Redraw the pins when the filters or data change
  useEffect(() => {
    const L = window.L;
    if (!L || !mapRef.current || !layerRef.current) return;
    const layer = layerRef.current;
    layer.clearLayers();
    visible.forEach((b) => {
      const colour = colourOf(b.category_id);
      const m = L.circleMarker([b.lat, b.lng], { radius: 9, color: "#fff", weight: 2, fillColor: colour, fillOpacity: 1 });
      m.bindTooltip(pick(b, "name", lang) || b.handle || "", { direction: "top", offset: [0, -8] });
      m.on("click", () => go("/" + b.handle));
      m.addTo(layer);
    });
    if (me) {
      L.circleMarker(me, { radius: 8, color: "#fff", weight: 3, fillColor: YOU, fillOpacity: 1 }).addTo(layer);
    }
  }, [visible, me, colourOf, lang, go]);

  // Centre on the person only when they share their location (not on every filter change)
  useEffect(() => {
    if (me && mapRef.current) mapRef.current.setView(me, 14);
  }, [me]);

  const catName = (c) => pick(c, "name", lang) || c.name_en;

  return (
    <div className="b-page map-page">
      <div className="b-top">
        <span className="grow h-title">{t(lang, "map_title")}</span>
        <button type="button" className="b-chip on2" onClick={findMe}>
          <Icon name="pin" size={16} /> {t(lang, "map_near")}
        </button>
      </div>

      <div className="b-chips map-chips" role="group" aria-label={t(lang, "map_filters")}>
        <button type="button" className={"b-chip" + (catId == null ? " on" : "")} aria-pressed={catId == null} onClick={() => setCatId(null)}>{t(lang, "map_all")}</button>
        <button type="button" className={"b-chip" + (openNow ? " on" : "")} aria-pressed={openNow} onClick={() => setOpenNow((v) => !v)}>{t(lang, "map_open_now")}</button>
        {cats.map((c) => (
          <button key={c.id} type="button" className={"b-chip" + (catId === c.id ? " on" : "")} aria-pressed={catId === c.id} onClick={() => setCatId(catId === c.id ? null : c.id)}>
            <span className="map-dot" style={{ background: colourOf(c.id) }} />{catName(c)}
          </button>
        ))}
      </div>

      <div className="map-box">
        <div ref={mapEl} className="map-canvas" role="region" aria-label={t(lang, "map_title")} />
        {rows === null && !err ? <div className="map-note">{t(lang, "map_loading")}</div> : null}
        {err ? <div className="map-note">{t(lang, "map_error")}</div> : null}
      </div>
      {locMsg ? <p className="b-muted map-msg">{locMsg}</p> : null}

      <div className="map-list">
        {rows && !err && list.length === 0 ? <p className="b-muted">{t(lang, "map_empty")}</p> : null}
        {list.map(({ b, km }) => {
          const s = openState(b.hours, lang);
          const cat = cats.find((c) => c.id === b.category_id);
          return (
            <button key={b.id} type="button" className="b-result map-row" onClick={() => go("/" + b.handle)}>
              <span className="map-dot big" style={{ background: colourOf(b.category_id) }} />
              <span className="grow">
                <b className="b-name"><bdi>{pick(b, "name", lang)}</bdi></b>
                <small className="b-muted">
                  {cat ? catName(cat) : ""}{km != null ? " · " + fmtKm(km) : ""}
                  {s ? <span className={s.open ? " b-ok" : ""}> · {s.text}</span> : null}
                </small>
              </span>
            </button>
          );
        })}
      </div>
      {rows && placed.length < rows.length ? <p className="b-muted map-msg">{t(lang, "map_some_missing")}</p> : null}

      <div className="b-navspace" />
      <BottomNav lang={lang} active="map" go={go} signedIn />
    </div>
  );
}
