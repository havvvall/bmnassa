// Bmnassa back office (team only, English only) · slice 3: approvals.
// Every change is also checked by the database: only team accounts can approve, reject or edit other people's businesses.
import React, { useEffect, useMemo, useState } from "react";
import "./team.css";
import {
  amIStaff, teamBusinesses, teamProfiles, teamUpdateBusiness,
  getCategories, getCities, getPlaces, prettyPhone,
} from "../api.js";
import { FALLBACK_CITIES } from "../i18n.js";

const LANGS = [
  { id: "en", label: "English", name: "English", dir: "ltr" },
  { id: "ku", label: "کوردی", name: "Kurdish", dir: "rtl" },
  { id: "ar", label: "عربي", name: "Arabic", dir: "rtl" },
];

const CHECKS = [
  ["phone", "Phone answers, owner confirms the business"],
  ["place", "Category and location are correct"],
  ["langs", "Name and description in all 3 languages"],
  ["clean", "Description is clean"],
  ["unique", "Not already listed"],
];

const REASONS = [
  "The phone did not answer. Please check the number and send again.",
  "We could not confirm this is a real business.",
  "This business is already listed on Bmnassa.",
  "The name or description needs changes.",
];

const STATUS = {
  pending: ["Waiting for review", "amber"],
  approved: ["Live", "green"],
  rejected: ["Not approved", "red"],
  hidden: ["Hidden", "grey"],
};

const SOON = ["Unfinished sign-ups", "Card builder", "NFC orders", "Wallet leads", "Reviews", "Users and owners", "Ask Bmnassa fact sheet"];

function when(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const day = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((day(now) - day(d)) / 86400000);
  const hm = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  if (diff === 0) return `Today ${hm}`;
  if (diff === 1) return `Yesterday ${hm}`;
  if (diff < 7) return `${diff} days ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const nameOf = (b) => (b && (b.name_en || b.name_ku || b.name_ar)) || "Unnamed";
const enName = (row) => (row && (row.name_en || row.name_ku || row.name_ar)) || "";
// "Erbil · Soran"; the district is left out when it has the same name as the city
const placeText = (...parts) => parts.map(enName).filter((x, i, a) => x && a.indexOf(x) === i).join(" · ");

function missingLangs(b) {
  const anyDesc = !!(b.description_en || b.description_ku || b.description_ar);
  return LANGS.filter((l) => !(b["name_" + l.id] || "").trim() || (anyDesc && !(b["description_" + l.id] || "").trim())).map((l) => l.id);
}

function waLink(phone) {
  const d = String(phone || "").replace(/\D/g, "");
  return d ? `https://wa.me/${d}` : null;
}

// ---------- the page ----------

export default function Team({ profile, onSignOut, onOpenApp }) {
  const [staff, setStaff] = useState(null);
  const [rows, setRows] = useState(null);
  const [loadErr, setLoadErr] = useState("");
  const [lists, setLists] = useState({ cats: [], cities: FALLBACK_CITIES, districts: [], subdistricts: [] });
  const [owners, setOwners] = useState({});
  const [view, setView] = useState("pending");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    amIStaff().then(setStaff);
  }, []);

  const load = async () => {
    setLoadErr("");
    try {
      const [biz, cats, cities, places] = await Promise.all([teamBusinesses(), getCategories(), getCities().catch(() => null), getPlaces()]);
      setRows(biz || []);
      setLists({ cats: cats || [], cities: cities && cities.length ? cities : FALLBACK_CITIES, ...places });
      const ps = await teamProfiles((biz || []).map((b) => b.owner_id)).catch(() => []);
      setOwners(Object.fromEntries((ps || []).map((p) => [p.id, p])));
    } catch (e) {
      setLoadErr([e.status, e.code, e.message].filter(Boolean).join(" · ") || "Could not load.");
    }
  };
  useEffect(() => { if (staff) load(); }, [staff]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  const look = useMemo(() => {
    const byId = (arr) => Object.fromEntries(arr.map((x) => [x.id, x]));
    return { cat: byId(lists.cats), city: byId(lists.cities), dist: byId(lists.districts), sub: byId(lists.subdistricts) };
  }, [lists]);

  const pending = (rows || []).filter((b) => (b.status || "pending") === "pending");
  const base = view === "pending" ? pending : (rows || []).filter((b) => !statusFilter || (b.status || "pending") === statusFilter);
  const shown = base.filter((b) => {
    if (cityFilter && b.city_id !== cityFilter) return false;
    if (!q.trim()) return true;
    const s = q.trim().toLowerCase();
    const digits = s.replace(/\D/g, "");
    return [b.name_en, b.name_ku, b.name_ar].some((n) => (n || "").toLowerCase().includes(s))
      || (digits.length >= 3 && String(b.phone || "").replace(/\D/g, "").includes(digits));
  });
  const cityCounts = lists.cities.map((c) => [c, base.filter((b) => b.city_id === c.id).length]).filter(([, n]) => n > 0);
  const open = (rows || []).find((b) => b.id === openId) || null;

  const replaceRow = (row) => setRows((rs) => rs.map((b) => (b.id === row.id ? row : b)));

  if (staff === null) return <div className="bo-center">Loading…</div>;
  if (!staff) {
    return (
      <div className="bo-center">
        <div className="bo-card">
          <h1>Team only</h1>
          <p>The back office is for the Bmnassa team. {profile && profile.email ? <>You are signed in as <b>{profile.email}</b>.</> : null}</p>
          <p className="bo-muted">To add someone to the team, run this in Supabase → SQL Editor:<br />
            <code>update public.profiles set role = 'team' where lower(email) = '{(profile && profile.email) || "name@example.com"}';</code></p>
          <div className="bo-row">
            <button className="bo-btn ghost" onClick={onOpenApp}>Back to the app</button>
            <button className="bo-btn ghost danger" onClick={onSignOut}>Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={"bo" + (open ? " has-panel" : "")}>
      <aside className="bo-side">
        <div className="bo-brand"><img src="/brand/logo-silver.svg" alt="Bmnassa" /><span>Back office</span></div>
        <nav>
          <button className={"bo-nav" + (view === "pending" ? " on" : "")} onClick={() => { setView("pending"); setOpenId(null); }}>
            Pending approval {pending.length ? <span className="bo-count">{pending.length}</span> : null}
          </button>
          <button className={"bo-nav" + (view === "all" ? " on" : "")} onClick={() => { setView("all"); setOpenId(null); }}>
            Businesses {rows ? <span className="bo-count soft">{rows.length}</span> : null}
          </button>
          <div className="bo-soon-h">Coming in later updates</div>
          {SOON.map((s) => <span key={s} className="bo-nav soon">{s}</span>)}
          <a className="bo-nav old" href="/admin">Categories, cities, admins<small>Old back office ↗</small></a>
        </nav>
        <div className="bo-me">
          <span className="bo-av">{((profile && profile.full_name) || "B").trim().charAt(0).toUpperCase()}</span>
          <div>
            <b>{(profile && profile.full_name) || "Team"}</b>
            <small>{profile && profile.email}</small>
            <span className="bo-links"><button onClick={onOpenApp}>App</button> · <button onClick={onSignOut}>Sign out</button></span>
          </div>
        </div>
      </aside>

      <main className="bo-main">
        <header className="bo-head">
          <div>
            <h1>{view === "pending" ? "Pending approval" : "Businesses"}</h1>
            <p>{view === "pending" ? "Newest first · target: every sign-up checked within 48 hours" : "Every business in the database, newest first"}</p>
          </div>
          <label className="bo-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input placeholder="Search name or phone" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
        </header>

        <div className="bo-chips">
          {view === "all" ? (
            <>
              <button className={"bo-chip" + (!statusFilter ? " on" : "")} onClick={() => setStatusFilter("")}>All · {(rows || []).length}</button>
              {Object.entries(STATUS).map(([k, [label]]) => {
                const n = (rows || []).filter((b) => (b.status || "pending") === k).length;
                return n ? <button key={k} className={"bo-chip" + (statusFilter === k ? " on" : "")} onClick={() => setStatusFilter(k)}>{label} · {n}</button> : null;
              })}
              <span className="bo-sep" />
            </>
          ) : (
            <button className={"bo-chip" + (!cityFilter ? " on" : "")} onClick={() => setCityFilter("")}>All · {base.length}</button>
          )}
          {cityCounts.map(([c, n]) => (
            <button key={c.id} className={"bo-chip" + (cityFilter === c.id ? " on" : "")} onClick={() => setCityFilter(cityFilter === c.id ? "" : c.id)}>{c.name_en} · {n}</button>
          ))}
          <button className="bo-chip ghost" onClick={load} title="Load again">Refresh</button>
        </div>

        {loadErr ? <div className="bo-alert">Could not load businesses: {loadErr}. If this mentions a missing column, run <code>004_approvals.sql</code> in Supabase.</div> : null}

        <div className="bo-table">
          <table>
            <thead>
              <tr><th>Received</th><th>Business</th><th>Category</th><th>Location</th><th>Phone</th><th>Came from</th><th>{view === "pending" ? "Languages" : "Status"}</th></tr>
            </thead>
            <tbody>
              {rows === null && !loadErr ? <tr><td colSpan={7} className="bo-empty">Loading…</td></tr> : null}
              {rows !== null && !shown.length ? (
                <tr><td colSpan={7} className="bo-empty">{view === "pending" && !q && !cityFilter ? "Nothing waiting. Every sign-up has been checked." : "No businesses match."}</td></tr>
              ) : null}
              {shown.map((b) => {
                const miss = missingLangs(b);
                const st = STATUS[b.status || "pending"] || [b.status, "grey"];
                return (
                  <tr key={b.id} className={openId === b.id ? "on" : ""} onClick={() => setOpenId(b.id)} tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter") setOpenId(b.id); }}>
                    <td className="bo-muted">{when(b.created_at)}</td>
                    <td><b>{nameOf(b)}</b>{b.name_en && (b.name_ku || b.name_ar) ? <span className="bo-sub" dir="rtl">{b.name_ku || b.name_ar}</span> : null}</td>
                    <td>{enName(look.cat[b.category_id]) || b.category_id || "—"}</td>
                    <td>{placeText(look.city[b.city_id], look.dist[b.district_id]) || b.city_id || "—"}</td>
                    <td className="bo-num">{b.phone ? prettyPhone(b.phone).replace("+964 ", "0") : "—"}</td>
                    <td>{b.owner_id ? "Sign-up form" : "Back office"}</td>
                    <td>
                      {view === "pending"
                        ? <span className={"bo-pill " + (miss.length ? "amber" : "green")}>{miss.length ? `${miss.length} missing` : "All 3"}</span>
                        : <span className={"bo-pill " + st[1]}>{st[0]}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {open ? (
        <Review key={open.id} b={open} owner={owners[open.owner_id]} look={look} lists={lists}
          onClose={() => setOpenId(null)}
          onSaved={(row, msg) => {
            replaceRow(row);
            if (msg) setToast(msg);
            if (row.status !== "pending" && view === "pending") {
              const next = pending.find((x) => x.id !== row.id);
              setOpenId(next ? next.id : null);
            }
          }} />
      ) : null}

      {toast ? <div className="bo-toast" role="status">{toast}</div> : null}
    </div>
  );
}

// ---------- the review panel ----------

function Review({ b, owner, look, lists, onClose, onSaved }) {
  const [f, setF] = useState(() => ({
    name_en: b.name_en || "", name_ku: b.name_ku || "", name_ar: b.name_ar || "",
    description_en: b.description_en || "", description_ku: b.description_ku || "", description_ar: b.description_ar || "",
    category_id: b.category_id || "",
    contact_name: b.contact_name || "",
  }));
  const firstMissing = missingLangs(b)[0];
  const [tab, setTab] = useState(firstMissing || b.sent_in_language || "en");
  const [checks, setChecks] = useState({});
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");

  const bodyRef = React.useRef(null);
  useEffect(() => {
    if (rejecting && bodyRef.current) bodyRef.current.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [rejecting]);
  const merged = { ...b, ...f };
  const miss = missingLangs(merged);
  const allChecked = CHECKS.every(([k]) => checks[k]);
  const dirty = Object.keys(f).some((k) => (f[k] || "") !== (b[k] || ""));
  const status = b.status || "pending";
  const lang = LANGS.find((l) => l.id === tab);
  const anyDesc = !!(f.description_en || f.description_ku || f.description_ar);
  const sent = LANGS.find((l) => l.id === b.sent_in_language);

  const fields = () => {
    const o = {};
    for (const k of Object.keys(f)) o[k] = f[k].trim() || null;
    return o;
  };

  const save = async (extra, msg, kind) => {
    setBusy(kind); setErr("");
    try {
      const row = await teamUpdateBusiness(b.id, { ...fields(), ...extra });
      onSaved(row, typeof msg === "function" ? msg(row) : msg);
    } catch (e) {
      setErr([e.status, e.code, e.message].filter(Boolean).join(" · "));
    } finally {
      setBusy("");
    }
  };

  const approve = () => save({ status: "approved" }, (row) => `${row.name_en || nameOf(row)} is live · bmnassa.com/${row.handle || ""}`, "approve");
  const reject = () => save({ status: "rejected", rejection_reason: reason.trim() }, `${nameOf(b)} was not approved. The owner sees the reason in the app.`, "reject");

  const st = STATUS[status] || [status, "grey"];
  const city = look.city[b.city_id], dist = look.dist[b.district_id], sub = look.sub[b.subdistrict_id];

  return (
    <aside className="bo-panel" aria-label={`Review ${nameOf(b)}`}>
      <div className="bo-p-head">
        <span className="bo-av big">{nameOf(merged).trim().charAt(0).toUpperCase()}</span>
        <div className="bo-grow">
          <h2>{nameOf(merged)}</h2>
          <p>Signed up {when(b.created_at).replace(/^T/, "t").replace(/^Y/, "y")}{sent ? ` · typed in ${sent.name}` : ""}</p>
        </div>
        <button className="bo-x" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>

      <div className="bo-p-body" ref={bodyRef}>
        {status !== "pending" ? (
          <div className={"bo-state " + st[1]}>
            <b>{st[0]}</b>{b.reviewed_at ? ` · ${when(b.reviewed_at)}` : ""}
            {status === "approved" && b.handle ? <> · <a href={`/${b.handle}`} target="_blank" rel="noreferrer">bmnassa.com/{b.handle}</a></> : null}
            {status === "rejected" && b.rejection_reason ? <div className="bo-reason">Reason: {b.rejection_reason}</div> : null}
          </div>
        ) : null}

        <dl className="bo-facts">
          <div><dt>Owner</dt><dd>{owner ? <>{owner.full_name || "—"}<small>{owner.email || prettyPhone(owner.phone)}</small></> : (b.owner || (b.owner_id ? "—" : "Added by the team"))}</dd></div>
          <div>
            <dt>Category</dt>
            <dd>
              <select className="bo-select" value={f.category_id} onChange={(e) => setF({ ...f, category_id: e.target.value })}>
                {!f.category_id ? <option value="">Choose…</option> : null}
                {lists.cats.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
              </select>
            </dd>
          </div>
          <div>
            <dt>Name on the card</dt>
            <dd><input className="bo-select" value={f.contact_name} placeholder={owner && owner.full_name ? owner.full_name : "Person's name"}
              onChange={(e) => setF({ ...f, contact_name: e.target.value })} maxLength={60} /></dd>
          </div>
          <div><dt>City · District · Subdistrict</dt><dd>{[enName(city) || b.city_id, enName(dist), enName(sub)].filter(Boolean).join(" · ") || "—"}</dd></div>
          <div><dt>Phone · WhatsApp</dt><dd className="bo-num">{b.phone ? prettyPhone(b.phone) : "—"}</dd></div>
        </dl>

        <div className="bo-sec">
          <span>Languages</span>
          {miss.length ? <em className="red">{miss.length} missing · add before approving</em> : <em className="green">All 3 filled</em>}
        </div>
        <div className="bo-seg" role="tablist">
          {LANGS.map((l) => (
            <button key={l.id} role="tab" aria-selected={tab === l.id} className={tab === l.id ? "on" : ""} onClick={() => setTab(l.id)} dir={l.dir}>
              {l.label}<i className={miss.includes(l.id) ? "red" : "green"} />
            </button>
          ))}
        </div>
        <label className="bo-field">
          <span>Name in {lang.name}</span>
          <input dir={lang.dir} value={f["name_" + tab]} onChange={(e) => setF({ ...f, ["name_" + tab]: e.target.value })}
            placeholder={`Add the ${lang.name} name…`} className={!f["name_" + tab].trim() ? "need" : ""} maxLength={80} />
        </label>
        <label className="bo-field">
          <span>Description in {lang.name}{anyDesc ? "" : " · optional"}</span>
          <textarea dir={lang.dir} rows={3} value={f["description_" + tab]} onChange={(e) => setF({ ...f, ["description_" + tab]: e.target.value })}
            placeholder={`Add the ${lang.name} description…`} className={anyDesc && !f["description_" + tab].trim() ? "need" : ""} maxLength={300} />
        </label>
        {tab === "en" ? <p className="bo-hint">The English name also makes the page link, for example bmnassa.com/azad-cooling.</p> : null}

        {status === "pending" ? (
          <>
            <div className="bo-sec"><span>Approval checklist</span></div>
            <div className="bo-checks">
              {CHECKS.map(([k, label]) => (
                <label key={k}>
                  <input type="checkbox" checked={!!checks[k]} onChange={(e) => setChecks({ ...checks, [k]: e.target.checked })} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </>
        ) : null}

        {rejecting ? (
          <div className="bo-reject">
            <div className="bo-sec"><span>Reason for the owner</span></div>
            <div className="bo-reasons">
              {REASONS.map((r) => <button key={r} className={reason === r ? "on" : ""} onClick={() => setReason(r)}>{r}</button>)}
            </div>
            <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Write the reason the owner will see…" maxLength={300} />
          </div>
        ) : null}

        {err ? <div className="bo-alert">{err}</div> : null}
      </div>

      <div className="bo-p-foot">
        <div className="bo-row">
          <a className={"bo-btn ghost" + (b.phone ? "" : " off")} href={b.phone ? `tel:${b.phone}` : undefined}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
            Call owner
          </a>
          <a className={"bo-btn ghost" + (b.phone ? "" : " off")} href={waLink(b.phone) || undefined} target="_blank" rel="noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z" /></svg>
            WhatsApp
          </a>
        </div>
        {status === "pending" ? (
          rejecting ? (
            <div className="bo-row">
              <button className="bo-btn ghost" onClick={() => setRejecting(false)}>Cancel</button>
              <button className="bo-btn red" disabled={!reason.trim() || !!busy} onClick={reject}>{busy === "reject" ? "Saving…" : "Send rejection"}</button>
            </div>
          ) : (
            <>
              <div className="bo-row">
                <button className="bo-btn ghost danger" onClick={() => setRejecting(true)}>Reject with reason</button>
                <button className="bo-btn gold" disabled={!!busy || miss.length > 0 || !allChecked || !f.category_id} onClick={approve}
                  title={miss.length ? "Fill in the missing languages first" : !allChecked ? "Tick every line of the checklist first" : ""}>
                  {busy === "approve" ? "Approving…" : "Approve and publish"}
                </button>
              </div>
              {miss.length || !allChecked ? <p className="bo-hint center">{miss.length ? "Add the missing languages" : "Tick the checklist"} to approve.</p> : null}
              {dirty ? <button className="bo-link" disabled={!!busy} onClick={() => save({}, "Saved", "save")}>{busy === "save" ? "Saving…" : "Save changes without approving"}</button> : null}
            </>
          )
        ) : (
          <div className="bo-row">
            {dirty ? <button className="bo-btn gold" disabled={!!busy} onClick={() => save({}, "Saved", "save")}>{busy === "save" ? "Saving…" : "Save changes"}</button> : null}
            <button className="bo-btn ghost" disabled={!!busy} onClick={() => save({ status: "pending", rejection_reason: null }, `${nameOf(b)} is back in Pending approval`, "back")}>Move back to pending</button>
          </div>
        )}
      </div>
    </aside>
  );
}
