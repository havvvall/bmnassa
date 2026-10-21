// Slice 6 · the digital card in its four styles (Classic, Minimal, Bold, Wallet card), front and back.
// Used by the public card page, the business page and the Card Studio preview, so all three always match.
import React, { useMemo } from "react";
import "./card.css";
import { t, cityName, pick } from "../i18n.js";
import { prettyPhone, photoUrl, track } from "../api.js";
import { Icon } from "../browse/icons.jsx";
import { hoursLines, openState } from "../hours.js";
import { QRCode, QRErrorCorrectLevel } from "../vendor/qrcode.js";

export const CARD_COLOURS = ["#3a3e42", "#121212", "#1b2a4a", "#1f3d2b", "#5a1a26", "#0f5c5c", "#b5532f", "#3f2a5c"];
export const STYLES = ["classic", "minimal", "bold", "wallet"];
export const LINK_KEYS = ["call", "whatsapp", "instagram", "facebook", "tiktok", "email", "website", "directions"];

// The owner's choices with sensible defaults, so a business that never opened Card Studio still has a good card
export const ICON_COLOURS = ["app", "match", "white", "gold"];
// Every card uses the one standard Bmnassa design (Monogram: matte colour, faint Bmnassa mark, all links in the same order).
// The owner chooses the card colour, the icon colour and the company logo; older style choices are ignored, not deleted.
export function cardSettings(b) {
  const c = (b && b.card) || {};
  return {
    style: "wallet",
    color: /^#[0-9a-f]{6}$/i.test(c.color || "") ? c.color : "#1b2a4a",
    background: "carbon",
    bg_path: "",
    logo_path: c.logo_path || "",
    icons: ICON_COLOURS.includes(c.icons) ? c.icons : "app",
    links: null,
    wide: "directions",
    title: "",
  };
}

const digits = (s) => String(s || "").replace(/\D/g, "");
const clean = (v) => String(v || "").trim();
const handleOf = (v) => clean(v).replace(/^https?:\/\/(www\.)?[^/]+\//i, "").replace(/^@/, "").replace(/\/$/, "");
const isUrl = (v) => /^https?:/i.test(clean(v));

// Every way to reach the business, in the owner's order
export function cardLinks(b, lang, s) {
  const all = {
    call: b.phone && { key: "call", icon: "phone", cls: "call", label: t(lang, "call"), text: prettyPhone(b.phone), href: `tel:${b.phone}`, ltr: true, kind: "call" },
    whatsapp: (b.whatsapp || b.phone) && { key: "whatsapp", icon: "whatsapp", cls: "wa", label: t(lang, "whatsapp"), text: t(lang, "send_message"), href: `https://wa.me/${digits(b.whatsapp || b.phone)}`, kind: "whatsapp" },
    instagram: clean(b.instagram) && { key: "instagram", icon: "instagram", cls: "ig", label: t(lang, "instagram"), text: "@" + handleOf(b.instagram), href: isUrl(b.instagram) ? clean(b.instagram) : `https://instagram.com/${handleOf(b.instagram)}`, ltr: true },
    facebook: clean(b.facebook) && { key: "facebook", icon: "facebook", cls: "fb", label: t(lang, "facebook"), text: handleOf(b.facebook), href: isUrl(b.facebook) ? clean(b.facebook) : `https://facebook.com/${handleOf(b.facebook)}`, ltr: true },
    tiktok: clean(b.tiktok) && { key: "tiktok", icon: "tiktok", cls: "tt", label: t(lang, "tiktok"), text: "@" + handleOf(b.tiktok), href: isUrl(b.tiktok) ? clean(b.tiktok) : `https://www.tiktok.com/@${handleOf(b.tiktok)}`, ltr: true },
    email: clean(b.email) && { key: "email", icon: "mail", cls: "em", label: t(lang, "email_link"), text: clean(b.email), href: `mailto:${clean(b.email)}`, ltr: true },
    website: clean(b.website) && { key: "website", icon: "globe", cls: "web", label: t(lang, "website"), text: clean(b.website).replace(/^https?:\/\//i, "").replace(/\/$/, ""), href: isUrl(b.website) ? clean(b.website) : `https://${clean(b.website)}`, ltr: true },
    directions: b.lat && b.lng && { key: "directions", icon: "pin", cls: "dir", label: t(lang, "directions"), text: clean(b.address) || t(lang, "open_in_maps"), href: `https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}` },
  };
  const order = s.links && s.links.length ? s.links : LINK_KEYS;
  return order.map((k) => all[k]).filter(Boolean);
}

export const linkAvailable = (b, key) => !!cardLinks(b, "en", { links: [key] }).length;

function A({ l, b, className, children, ...rest }) {
  return (
    <a className={className} href={l.href} target={l.key === "call" ? undefined : "_blank"} rel="noreferrer"
      onClick={() => { if (l.kind && b.id) track(b.id, l.kind); }} {...rest}>{children}</a>
  );
}

export function cardRole(b, cat, lang, s) {
  return clean(s.title) || [cityName(cat, lang), b.contact_name ? pick(b, "name", lang) : ""].filter(Boolean).join(" · ");
}

function Avatar({ s, person, className }) {
  return s.logo_path
    ? <span className={className + " has-img"}><img src={photoUrl(s.logo_path)} alt="" /></span>
    : <span className={className}><span>{(String(person || "").trim().charAt(0) || "B").toUpperCase()}</span></span>;
}

export const surface = (s) => ({
  "--card": s.color,
  backgroundImage: s.background === "photo" && s.bg_path ? `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.55)), url(${photoUrl(s.bg_path)})` : undefined,
});
export const surfaceClass = (s) => "cf-surface " + (s.background === "photo" && s.bg_path ? "photo" : s.background === "solid" ? "solid" : "carbon");

// The company logo, or the first letter of the business on a gold tile when there is no logo yet
export function CardLogo({ b, s, lang, className = "" }) {
  const letter = (String(pick(b, "name", lang) || b.contact_name || "B").trim().charAt(0) || "B").toUpperCase();
  return s.logo_path
    ? <span className={"cf-logo has-img " + className}><img src={photoUrl(s.logo_path)} alt="" /></span>
    : <span className={"cf-logo " + className} aria-hidden="true"><span>{letter}</span></span>;
}

// The standard Bmnassa card · Monogram: matte colour, a faint Bmnassa mark, logo top-left, name, round icons, wordmark
export function NfcCard({ b, s, lang, cat, small, back, url, linksOnly }) {
  const person = b.contact_name || pick(b, "name", lang);
  const links = cardLinks(b, lang, s).filter((l) => l.key !== "directions").slice(0, 5);
  const shell = (cls, children) => (
    <div className={"cf-nfc mono" + cls + (small ? " small" : "")} style={{ "--card": s.color }}>
      <i className="cf-grain" aria-hidden="true" />
      <img className="cf-mono-mark" src="/brand/mark-ink.svg" alt="" aria-hidden="true" />
      {children}
    </div>
  );
  if (back) {
    return shell(" back", (
      <>
        <div className="cf-nfc-qr"><QR text={url} /></div>
        <div className="cf-nfc-backtext">
          <CardLogo b={b} s={s} lang={lang} className="sm" />
          <small>{t(lang, "scan_or_tap")}</small>
          <b className="ltr">{window.location.host}/<br />{b.handle}</b>
        </div>
      </>
    ));
  }
  return shell("", (
    <>
      <div className="cf-nfc-top">
        <CardLogo b={b} s={s} lang={lang} />
        <span className="cf-nfc-sign"><Icon name="nfc" size={small ? 16 : 19} /></span>
      </div>
      <div className="cf-nfc-name">
        <b><bdi>{person}</bdi></b>
        <small>{cardRole(b, cat, lang, s)}</small>
      </div>
      <div className="cf-mono-foot">
        <img className="cf-mono-word" src="/brand/logo-silver.svg" alt="Bmnassa" />
        <span className="cf-nfc-icons">
          {links.slice(0, 4).map((l) => (linksOnly
            ? <span key={l.key} className={"cf-ic " + (s.icons !== "app" ? s.icons : l.cls)}><Icon name={l.icon} size={small ? 13 : 15} /></span>
            : <A key={l.key} l={l} b={b} className={"cf-ic " + (s.icons !== "app" ? s.icons : l.cls)} aria-label={l.label}><Icon name={l.icon} size={15} /></A>))}
        </span>
      </div>
    </>
  ));
}

export function QR({ text }) {
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
    <svg viewBox={`-2 -2 ${cells.n + 4} ${cells.n + 4}`} role="img" aria-label={text} shapeRendering="crispEdges">
      <rect x="-2" y="-2" width={cells.n + 4} height={cells.n + 4} fill="#fff" />
      <path d={cells.d} fill="#121212" />
    </svg>
  );
}

function LinkRows({ b, links, s, theme }) {
  return (
    <div className={"cf-rows " + theme}>
      {links.map((l) => (
        <A key={l.key} l={l} b={b} className="cf-row">
          <span className={"cf-ic " + (s.icons !== "app" ? s.icons : l.cls)}><Icon name={l.icon} size={18} /></span>
          <span className="cf-grow"><b>{l.label}</b><small className={l.ltr ? "ltr" : ""}>{l.text}</small></span>
          <Icon name="chevron" size={16} className="flip" />
        </A>
      ))}
    </div>
  );
}

// ---------- front ----------

export function CardFront({ b, s, lang, cat, city, onSaveContact, preview }) {
  const person = b.contact_name || pick(b, "name", lang);
  const role = cardRole(b, cat, lang, s);
  const links = cardLinks(b, lang, s);
  const saveBtn = (cls) => (
    <button type="button" className={"cf-save " + cls} onClick={onSaveContact} tabIndex={preview ? -1 : 0}>
      <Icon name="contact" size={18} /> {t(lang, "save_contact")}
    </button>
  );

  if (s.style === "minimal") {
    const [first, ...rest] = String(person).split(" ");
    return (
      <div className="cf-face cf-minimal" style={{ "--card": s.color }}>
        <Avatar s={s} person={person} className="cf-square" />
        <h1 className="cf-bigname"><bdi>{rest.length ? <>{first}<br />{rest.join(" ")}</> : person}</bdi></h1>
        <div className="cf-role">{role}</div>
        <div className="cf-sub">{[pick(b, "name", lang), cityName(city, lang)].filter(Boolean).join(" · ")}</div>
        <LinkRows b={b} links={links} s={s} theme="light" />
        <span className="cf-grow" />
        {saveBtn("dark")}
      </div>
    );
  }

  if (s.style === "bold") {
    return (
      <div className="cf-face cf-bold" style={{ "--card": s.color }}>
        <div className={surfaceClass(s) + " cf-bold-head"} style={surface(s)}>
          <Avatar s={s} person={person} className="cf-ring white" />
          <h1 className="cf-person"><bdi>{person}</bdi></h1>
          <div className="cf-role light">{role}</div>
        </div>
        <div className="cf-tiles">
          {links.map((l) => (
            <A key={l.key} l={l} b={b} className="cf-tile">
              <span className={"cf-ic big " + (s.icons !== "app" ? s.icons : l.cls)}><Icon name={l.icon} size={20} /></span>
              <b>{l.label}</b>
            </A>
          ))}
        </div>
        <span className="cf-grow" />
        {saveBtn("colour")}
      </div>
    );
  }

  if (s.style === "wallet") {
    const wide = s.wide !== "none" ? links.find((l) => l.key === s.wide) : null;
    const big = ["call", "whatsapp", "directions"].map((k) => links.find((l) => l.key === k)).filter(Boolean);
    const open = openState(b.hours, lang);
    const lines = hoursLines(b.hours, lang);
    const rest = links.filter((l) => !["call", "whatsapp", "directions"].includes(l.key));
    return (
      <div className="cf-face cf-wallet" style={{ "--card": s.color }}>
        <NfcCard b={b} s={s} lang={lang} cat={cat} />
        <div className="cf-big" style={{ gridTemplateColumns: `repeat(${Math.max(1, big.length - (wide ? 1 : 0))}, 1fr)` }}>
          {big.map((l) => (
            <A key={l.key} l={l} b={b} className={"cf-bigbtn " + l.key + (wide && wide.key === l.key ? " wide" : "")}>
              <Icon name={l.icon} size={20} /><b>{l.label}</b>
            </A>
          ))}
        </div>
        {b.lat || open || rest.length ? (
          <div className="cf-info">
            {b.lat && b.lng ? (
              <a className="cf-inforow" href={`https://www.google.com/maps?q=${b.lat},${b.lng}`} target="_blank" rel="noreferrer">
                <span className="cf-ii"><Icon name="pin" size={17} /></span>
                <span className="cf-grow"><b dir="auto">{clean(b.address) || t(lang, "location")}</b><small>{t(lang, "open_in_maps")}</small></span>
                <Icon name="chevron" size={16} className="flip" />
              </a>
            ) : null}
            {open ? (
              <div className="cf-inforow">
                <span className="cf-ii"><Icon name="clock" size={17} /></span>
                <span className="cf-grow"><b className={open.open ? "ok" : ""}>{open.text}</b><small>{lines.join(" · ")}</small></span>
              </div>
            ) : null}
            {rest.map((l) => (
              <A key={l.key} l={l} b={b} className="cf-inforow">
                <span className="cf-ii"><Icon name={l.icon} size={17} /></span>
                <span className="cf-grow"><b className={l.ltr ? "ltr" : ""}>{l.text}</b><small>{l.label}</small></span>
                <Icon name="chevron" size={16} className="flip" />
              </A>
            ))}
          </div>
        ) : null}
        <span className="cf-grow" />
        {saveBtn("light")}
      </div>
    );
  }

  // Classic: black and gold
  return (
    <div className="cf-face cf-classic">
      <Avatar s={s} person={person} className="cf-ring gold" />
      <h1 className="cf-person"><bdi>{person}</bdi></h1>
      <div className="cf-role gold">{role}</div>
      <LinkRows b={b} links={links} s={s} theme="dark" />
      <span className="cf-grow" />
      {saveBtn("gold")}
    </div>
  );
}

// ---------- back ----------

export function CardBack({ b, s, lang, cat, url, onShare, onCopy }) {
  const person = b.contact_name || pick(b, "name", lang);
  const urlBox = (
    <button type="button" className="cf-urlbox" onClick={onCopy || onShare}>
      <span className="ltr">{window.location.host}/<em>{b.handle}</em></span>
      <Icon name="copy" size={17} />
    </button>
  );
  const share = (cls) => <button type="button" className={"cf-save " + cls} onClick={onShare}><Icon name="share" size={18} /> {t(lang, "share_card")}</button>;

  if (s.style === "wallet") {
    return (
      <div className="cf-face cf-wallet back" style={{ "--card": s.color }}>
        <NfcCard b={b} s={s} lang={lang} cat={cat} back url={url} />
        <span className="cf-nfcbubble"><Icon name="nfc" size={22} /></span>
        <h2 className="cf-tap">{t(lang, "tap_scan_save")}</h2>
        <p className="cf-tapsub">{t(lang, "tap_scan_sub")}</p>
        {urlBox}
        <span className="cf-grow" />
        {share("gold")}
      </div>
    );
  }
  const theme = s.style === "minimal" ? "cf-minimal" : s.style === "bold" ? "cf-bold" : "cf-classic";
  return (
    <div className={"cf-face back " + theme} style={{ "--card": s.color }}>
      <h1 className="cf-person"><bdi>{person}</bdi></h1>
      <div className={"cf-role " + (s.style === "classic" ? "gold" : "")}>{cardRole(b, cat, lang, s)}</div>
      <div className="cf-qr"><QR text={url} /></div>
      <b className="cf-scan">{t(lang, "scan_save")}</b>
      <small className="cf-muted">{t(lang, "or_link")}</small>
      {urlBox}
      <span className="cf-grow" />
      {share(s.style === "classic" ? "gold" : s.style === "bold" ? "colour" : "dark")}
    </div>
  );
}
