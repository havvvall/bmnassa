// Slice 6 · Card Studio: the owner designs their digital card. Changes go live straight away on Publish.
import { flipCard } from "../motion.js";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./studio.css";
import { SkelPage } from "../Skeleton.jsx";
import { t, pick } from "../i18n.js";
import { getMyBusiness, updateMyBusiness, uploadImage, photoUrl } from "../api.js";
import { useLists, Toast, ok } from "../browse/Browse.jsx";
import { Icon } from "../browse/icons.jsx";
import { NfcCard, cardSettings, cardLinks, CARD_COLOURS, STYLES, LINK_KEYS } from "./CardFaces.jsx";

const byId = (arr) => Object.fromEntries((arr || []).map((x) => [x.id, x]));

function shrink(file, max = 1200) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement("canvas");
      c.width = Math.round(img.naturalWidth * k);
      c.height = Math.round(img.naturalHeight * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("no image"))), "image/jpeg", 0.85);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("not an image")); };
    img.src = url;
  });
}

// Shows the real card page, made small to fit the screen
// The card exactly as people see it on your page: tall, matte, with your logo; Flip shows the QR back
function Preview({ b, s, lang, cat, flipped }) {
  const url = `${window.location.origin}/${b.handle || "your-business"}`;
  return (
    <div className="st-frame st-tall" aria-hidden="true">
      <NfcCard b={b} s={s} lang={lang} cat={cat} back={flipped} url={url} tall linksOnly />
    </div>
  );
}

function StyleThumb({ style, colour }) {
  return (
    <span className={"st-thumb " + style} style={{ "--card": colour }}>
      {style === "classic" ? <><i className="ring" /><i className="l w60" /><i className="l w40 gold" /><i className="row" /><i className="row" /><i className="row" /><i className="btn gold" /></> : null}
      {style === "minimal" ? <><i className="sq" /><i className="l w70 dark" /><i className="l w50 dark" /><i className="l w30 gold" /><i className="row light" /><i className="row light" /><i className="btn dark" /></> : null}
      {style === "bold" ? <><i className="head" /><i className="grid" /><i className="btn colour" /></> : null}
      {style === "wallet" ? <><i className="nfc" /><i className="trio" /><i className="row light" /><i className="row light" /></> : null}
    </span>
  );
}

export default function Studio({ lang, id, go }) {
  const [b, setB] = useState(undefined);
  const [err, setErr] = useState("");
  const [lists] = useLists();
  const [s, setS] = useState(null);
  const [name, setName] = useState("");
  const [tab, setTab] = useState("style");
  const [flipped, setFlipped] = useState(false);
  const [busy, setBusy] = useState("");
  const [toast, setToast] = useState("");
  const logoInput = useRef(null);
  const bgInput = useRef(null);

  useEffect(() => {
    getMyBusiness(id).then((row) => {
      setB(row || null);
      if (row) { setS(cardSettings(row)); setName(row.contact_name || ""); }
    }).catch((e) => setErr([e.status, e.message].filter(Boolean).join(" · ")));
  }, [id]);
  useEffect(() => { if (!toast) return; const x = setTimeout(() => setToast(""), 2600); return () => clearTimeout(x); }, [toast]);

  if (b === null) return <div className="o-page"><p className="note">{t(lang, "not_found_title")}</p></div>;
  if (b === undefined || !s) {
    return (
      <div className="o-page">
        <div className="b-top"><button type="button" className="rbtn" onClick={() => go(`/my/${id}`)} aria-label={t(lang, "back")}><Icon name="back" size={18} className="flip" /></button></div>
        {err ? <p className="note">{`${t(lang, "load_failed")} ${err}`}</p> : <SkelPage />}
      </div>
    );
  }

  const cat = lists && byId(lists.cats)[b.category_id];
  const city = lists && byId(lists.cities)[b.city_id];
  const live = { ...b, contact_name: name };
  const set = (k, v) => setS((x) => ({ ...x, [k]: v }));
  const available = LINK_KEYS.filter((k) => cardLinks(live, lang, { links: [k] }).length);
  const shown = (s.links && s.links.length ? s.links : available).filter((k) => available.includes(k));
  const toggle = (k) => {
    const cur = shown;
    set("links", cur.includes(k) ? cur.filter((x) => x !== k) : cur.concat(k).slice(0, 8));
  };
  const move = (k, dir) => {
    const cur = shown.slice();
    const i = cur.indexOf(k), j = i + dir;
    if (i < 0 || j < 0 || j >= cur.length) return;
    [cur[i], cur[j]] = [cur[j], cur[i]];
    set("links", cur);
  };
  const upload = async (file, kind) => {
    if (!file) return;
    setBusy(kind);
    try {
      const blob = await shrink(file, kind === "logo" ? 600 : 1400);
      const path = await uploadImage(b.id, blob, kind === "logo" ? "card-logo-" : "card-bg-");
      if (kind === "logo") set("logo_path", path);
      else setS((x) => ({ ...x, bg_path: path, background: "photo" }));
    } catch {
      setToast(t(lang, "upload_failed"));
    } finally {
      setBusy("");
    }
  };
  const publish = async () => {
    setBusy("publish");
    try {
      const card = { ...(b.card || {}), style: "mono", color: s.color, icons: s.icons, logo_path: s.logo_path || "" };
      const row = await updateMyBusiness(b.id, { card, contact_name: name.trim() || null });
      setB(row);
      setToast(ok(t(lang, "published")));
    } catch (e) {
      setToast(`${t(lang, "save_failed")} (${e.message || e.status})`);
    } finally {
      setBusy("");
    }
  };

  const labels = {
    call: "call", whatsapp: "whatsapp", instagram: "instagram", facebook: "facebook", tiktok: "tiktok",
    email: "email_link", website: "website", directions: "directions",
  };

  return (
    <div className="o-page st-page">
      <div className="b-top">
        <button type="button" className="rbtn" aria-label={t(lang, "back")} onClick={() => go(`/my/${b.id}`)}><Icon name="back" size={18} className="flip" /></button>
        <h1 className="grow" style={{ fontSize: 22 }}>{t(lang, "card_colours_btn")}</h1>
        <button type="button" className="b-pill" onClick={() => flipCard(document.querySelector(".st-frame"), { swap: () => setFlipped((f) => !f) })}><Icon name="flip" size={15} /> {t(lang, "flip")}</button>
      </div>

      <Preview b={live} s={s} lang={lang} cat={cat} city={city} flipped={flipped} />

      <p className="note st-std">{t(lang, "standard_note")}</p>

      <section className="o-sec">
        <span className="label">{t(lang, "company_logo")}</span>
        <div className="st-logo">
          {s.logo_path ? <img src={photoUrl(s.logo_path)} alt="" /> : <span className="st-logo-empty"><Icon name="image" size={22} /></span>}
          <button type="button" className="b-chip" disabled={busy === "logo"} onClick={() => logoInput.current && logoInput.current.click()}>
            {busy === "logo" ? t(lang, "uploading") : s.logo_path ? t(lang, "change_photo") : t(lang, "add_logo")}
          </button>
          {s.logo_path ? <button type="button" className="link" onClick={() => set("logo_path", "")}>{t(lang, "remove")}</button> : null}
          <input ref={logoInput} type="file" accept="image/*" hidden onChange={(e) => { upload(e.target.files && e.target.files[0], "logo"); e.target.value = ""; }} />
        </div>
        <p className="note">{t(lang, "logo_hint")}</p>

        <span className="label">{t(lang, "name_on_card")}</span>
        <div className="field"><input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder={pick(b, "name", lang)} /></div>

        <span className="label">{t(lang, "card_colour")}</span>
        <div className="st-swatches">
          {CARD_COLOURS.map((c) => (
            <button key={c} type="button" className={"st-sw" + (s.color.toLowerCase() === c ? " on" : "")} style={{ background: c }} aria-label={c} aria-pressed={s.color.toLowerCase() === c} onClick={() => set("color", c)} />
          ))}
          <label className={"st-sw add" + (!CARD_COLOURS.includes(s.color.toLowerCase()) ? " on" : "")} style={!CARD_COLOURS.includes(s.color.toLowerCase()) ? { background: s.color } : undefined}>
            +<input type="color" value={s.color} onChange={(e) => set("color", e.target.value)} />
          </label>
        </div>

        <span className="label">{t(lang, "icon_colours")}</span>
        <div className="st-icons">
          {[["app", "app_colours"], ["match", "match_card"], ["white", "icons_white"], ["gold", "icons_gold"]].map(([k, label]) => (
            <button key={k} type="button" className={"st-icon" + (s.icons === k ? " on" : "")} aria-pressed={s.icons === k} onClick={() => set("icons", k)}>
              <span className="st-icprev" style={{ "--card": s.color }}>
                {k === "app" ? <><i className="cf-ic call"><Icon name="phone" size={12} /></i><i className="cf-ic wa"><Icon name="whatsapp" size={12} /></i><i className="cf-ic ig"><Icon name="instagram" size={12} /></i></>
                  : [0, 1, 2].map((n) => <i key={n} className={"cf-ic " + k}><Icon name={["phone", "whatsapp", "instagram"][n]} size={12} /></i>)}
              </span>
              <b>{t(lang, label)}</b>
            </button>
          ))}
        </div>
      </section>

      <p className="note" style={{ textAlign: "center" }}>{t(lang, "link_never_changes")} {t(lang, "card_live_note")}</p>
      <div className="o-savebar">
        <button type="button" className="btn" disabled={!!busy} onClick={publish}>{busy === "publish" ? t(lang, "loading") : t(lang, "publish")}</button>
      </div>
      {b.status === "approved" && b.handle ? (
        <button type="button" className="link" style={{ alignSelf: "center" }} onClick={() => go(`/${b.handle}/card`)}>{t(lang, "open_card")}</button>
      ) : null}
      <Toast text={toast} />
    </div>
  );
}
