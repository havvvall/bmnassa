// Slice 6 · Card Studio: the owner designs their digital card. Changes go live straight away on Publish.
import { flipCard } from "../motion.js";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./studio.css";
import { SkelPage } from "../Skeleton.jsx";
import { t, pick } from "../i18n.js";
import { getMyBusiness, updateMyBusiness, uploadImage, photoUrl } from "../api.js";
import { useLists, Toast, ok } from "../browse/Browse.jsx";
import { Icon } from "../browse/icons.jsx";
import { CardFront, CardBack, cardSettings, cardLinks, CARD_COLOURS, STYLES, LINK_KEYS } from "./CardFaces.jsx";

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
function Preview({ b, s, lang, cat, city, flipped }) {
  const box = useRef(null);
  const [k, setK] = useState(0.6);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setK(Math.min(1, el.clientWidth / 390));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const url = `${window.location.origin}/${b.handle || "your-business"}/card`;
  return (
    <div className={"st-frame cs-" + s.style + (flipped ? " flipped" : "")} ref={box} style={{ "--card": s.color, height: Math.round(560 * k) }} aria-hidden="true">
      <div className="st-inner" style={{ transform: `scale(${k})` }}>
        {!flipped
          ? <CardFront b={b} s={s} lang={lang} cat={cat} city={city} onSaveContact={() => {}} preview />
          : <CardBack b={b} s={s} lang={lang} cat={cat} url={url} onShare={() => {}} />}
      </div>
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
      const card = { ...s, links: s.links ? shown : null };
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
        <h1 className="grow" style={{ fontSize: 22 }}>{t(lang, "card_studio")}</h1>
        <button type="button" className="b-pill" onClick={() => flipCard(document.querySelector(".st-frame"), { swap: () => setFlipped((f) => !f) })}><Icon name="flip" size={15} /> {t(lang, "flip")}</button>
      </div>

      <Preview b={live} s={s} lang={lang} cat={cat} city={city} flipped={flipped} />

      <div className="seg st-tabs" role="tablist">
        {[["content", "content"], ["style", "style"], ["design", "design_tab"], ["buttons", "buttons_tab"]].map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-pressed={tab === k} onClick={() => setTab(k)}>{t(lang, label)}</button>
        ))}
      </div>

      {tab === "content" ? (
        <section className="o-sec">
          <span className="label">{t(lang, "card_photo")}</span>
          <div className="st-logo">
            {s.logo_path ? <img src={photoUrl(s.logo_path)} alt="" /> : <span className="st-logo-empty"><Icon name="image" size={22} /></span>}
            <button type="button" className="b-chip" disabled={busy === "logo"} onClick={() => logoInput.current && logoInput.current.click()}>
              {busy === "logo" ? t(lang, "uploading") : s.logo_path ? t(lang, "change_photo") : t(lang, "add_photo")}
            </button>
            {s.logo_path ? <button type="button" className="link" onClick={() => set("logo_path", "")}>{t(lang, "remove")}</button> : null}
            <input ref={logoInput} type="file" accept="image/*" hidden onChange={(e) => { upload(e.target.files && e.target.files[0], "logo"); e.target.value = ""; }} />
          </div>
          <span className="label">{t(lang, "name_on_card")}</span>
          <div className="field"><input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder={pick(b, "name", lang)} /></div>
          <span className="label">{t(lang, "card_title")}</span>
          <div className="field"><input value={s.title} onChange={(e) => set("title", e.target.value)} maxLength={60} placeholder={t(lang, "card_title_ph")} /></div>
        </section>
      ) : null}

      {tab === "style" ? (
        <section className="o-sec">
          <div className="stack" style={{ gap: 2 }}>
            <b style={{ fontSize: 17 }}>{t(lang, "digital_style")}</b>
            <span className="note">{t(lang, "digital_style_sub")}</span>
          </div>
          <div className="st-styles">
            {STYLES.map((k) => (
              <button key={k} type="button" className={"st-style" + (s.style === k ? " on" : "")} aria-pressed={s.style === k} onClick={() => set("style", k)}>
                <StyleThumb style={k} colour={s.color} />
                <b>{t(lang, "st_" + k)}</b>
                <small>{t(lang, "st_" + k + "_sub")}</small>
                {s.style === k ? <span className="st-tick"><Icon name="check" size={12} stroke={3} /></span> : null}
              </button>
            ))}
          </div>
          <p className="note" style={{ textAlign: "center" }}>{t(lang, "change_anytime")}</p>
        </section>
      ) : null}

      {tab === "design" ? (
        <section className="o-sec">
          <span className="label">{t(lang, "card_colour")}</span>
          <div className="st-swatches">
            {CARD_COLOURS.map((c) => (
              <button key={c} type="button" className={"st-sw" + (s.color.toLowerCase() === c ? " on" : "")} style={{ background: c }} aria-label={c} aria-pressed={s.color.toLowerCase() === c} onClick={() => set("color", c)} />
            ))}
            <label className={"st-sw add" + (!CARD_COLOURS.includes(s.color.toLowerCase()) ? " on" : "")} style={!CARD_COLOURS.includes(s.color.toLowerCase()) ? { background: s.color } : undefined}>
              +<input type="color" value={s.color} onChange={(e) => set("color", e.target.value)} />
            </label>
          </div>
          <span className="label">{t(lang, "card_background")}</span>
          <div className="st-opts">
            {["solid", "carbon"].map((k) => (
              <button key={k} type="button" className={"st-opt" + (s.background === k ? " on" : "")} onClick={() => set("background", k)}>
                <span className={"st-dot cf-surface " + k} style={{ "--card": s.color }} /> {t(lang, "bg_" + k)}
              </button>
            ))}
            <button type="button" className={"st-opt" + (s.background === "photo" ? " on" : "")} disabled={busy === "bg"}
              onClick={() => (s.bg_path ? set("background", "photo") : bgInput.current && bgInput.current.click())}>
              <Icon name="image" size={16} /> {busy === "bg" ? t(lang, "uploading") : t(lang, "bg_photo")}
            </button>
            {s.bg_path ? <button type="button" className="link" onClick={() => bgInput.current && bgInput.current.click()}>{t(lang, "change_photo")}</button> : null}
            <input ref={bgInput} type="file" accept="image/*" hidden onChange={(e) => { upload(e.target.files && e.target.files[0], "bg"); e.target.value = ""; }} />
          </div>
          <span className="label">{t(lang, "icon_colours")}</span>
          <div className="st-opts">
            <button type="button" className={"st-opt" + (s.icons === "app" ? " on" : "")} onClick={() => set("icons", "app")}>
              <span className="st-appdots"><i style={{ background: "#25d366" }} /><i style={{ background: "#e1306c" }} /><i style={{ background: "#1877f2" }} /></span> {t(lang, "app_colours")}
            </button>
            <button type="button" className={"st-opt" + (s.icons === "match" ? " on" : "")} onClick={() => set("icons", "match")}>
              <span className="st-dot" style={{ background: s.color }} /> {t(lang, "match_card")}
            </button>
          </div>
        </section>
      ) : null}

      {tab === "buttons" ? (
        <section className="o-sec">
          <div className="b-row-head"><span className="label">{t(lang, "front_icons")}</span><span className="note">{t(lang, "front_icons_sub")}</span></div>
          <div className="panel st-links">
            {shown.map((k, i) => (
              <div key={k} className="st-linkrow">
                <input type="checkbox" checked onChange={() => toggle(k)} aria-label={t(lang, labels[k])} />
                <span className="grow">{t(lang, labels[k])}</span>
                <button type="button" className="st-mv" disabled={i === 0} onClick={() => move(k, -1)} aria-label="Up"><Icon name="up" size={15} /></button>
                <button type="button" className="st-mv" disabled={i === shown.length - 1} onClick={() => move(k, 1)} aria-label="Down"><Icon name="down" size={15} /></button>
              </div>
            ))}
            {LINK_KEYS.filter((k) => !shown.includes(k)).map((k) => (
              <div key={k} className={"st-linkrow" + (available.includes(k) ? "" : " off")}>
                <input type="checkbox" checked={false} disabled={!available.includes(k)} onChange={() => toggle(k)} aria-label={t(lang, labels[k])} />
                <span className="grow">{t(lang, labels[k])}{available.includes(k) ? null : <small> · {t(lang, "not_added")}</small>}</span>
              </div>
            ))}
          </div>
          <p className="note">{t(lang, "add_in_edit")}</p>
          <span className="label">{t(lang, "wide_button")}</span>
          <div className="field pick">
            <select value={s.wide} onChange={(e) => set("wide", e.target.value)}>
              {["directions", "call", "whatsapp"].map((k) => <option key={k} value={k}>{t(lang, labels[k])}</option>)}
              <option value="none">{t(lang, "wide_none")}</option>
            </select>
            <Icon name="down" size={16} />
          </div>
          <p className="note">{t(lang, "wide_hint")}</p>
        </section>
      ) : null}

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
