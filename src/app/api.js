// Bmnassa talks to Supabase over plain HTTP (no extra library), like the back office does.
// The publishable key is safe in the browser: every table is guarded by row-level security.

export const SB_URL = import.meta.env.VITE_SUPABASE_URL || "https://hfcqvcduuhzfxijsniav.supabase.co";
export const SB_KEY = import.meta.env.VITE_SUPABASE_KEY || "sb_publishable_oz8_r7FdYNbPYBOgofjriw__JVhsBOh";


const SESSION_KEY = "bm_session";

export class ApiError extends Error {
  constructor(message, code, status) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(s) {
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* private mode: the session simply lasts for this tab */
  }
}

let session = readSession();

export function getSession() {
  return session;
}

function keepSession(data) {
  session = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at || Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
    user: data.user,
  };
  writeSession(session);
  return session;
}

async function call(path, { method = "GET", body, auth = false, headers = {} } = {}) {
  const h = { apikey: SB_KEY, "Content-Type": "application/json", ...headers };
  if (auth) {
    const s = await freshSession();
    if (!s) throw new ApiError("Not signed in", "no_session", 401);
    h.Authorization = "Bearer " + s.access_token;
  }
  let res;
  try {
    res = await fetch(SB_URL + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError("Network error", "network", 0);
  }
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const code = (data && (data.error_code || data.code || data.error)) || "http_" + res.status;
    const msg = (data && (data.msg || data.message || data.error_description)) || res.statusText;
    throw new ApiError(msg, String(code), res.status);
  }
  return data;
}

async function freshSession() {
  if (!session) return null;
  const now = Math.floor(Date.now() / 1000);
  if (session.expires_at - now > 60) return session;
  try {
    const data = await call("/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      body: { refresh_token: session.refresh_token },
    });
    return keepSession(data);
  } catch {
    session = null;
    writeSession(null);
    return null;
  }
}

// ---------- email sign-in ----------
// A 6-digit code goes to the person's email. Phone sign-in comes back once Bmnassa is registered.

// Trims, lower-cases and checks the shape; null if it is not an email address.
export function normaliseEmail(input) {
  const e = String(input || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) ? e : null;
}

export function sendCode(email) {
  return call("/auth/v1/otp", { method: "POST", body: { email, create_user: true } });
}

export async function verifyCode(email, token) {
  const data = await call("/auth/v1/verify", { method: "POST", body: { type: "email", email, token } });
  return keepSession(data);
}

// ---------- phone numbers (for the business phone) ----------

// "0770 121 8832", "770 121 8832" or "+964 770…" -> "+9647701218832"; null if it is not an Iraqi mobile.
export function normalisePhone(input) {
  let d = String(input || "")
    .replace(/[٠-٩]/g, (c) => "٠١٢٣٤٥٦٧٨٩".indexOf(c))
    .replace(/[۰-۹]/g, (c) => "۰۱۲۳۴۵۶۷۸۹".indexOf(c))
    .replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("964")) d = d.slice(3);
  if (d.startsWith("0")) d = d.slice(1);
  return /^7\d{9}$/.test(d) ? "+964" + d : null;
}

export function prettyPhone(e164) {
  const d = String(e164 || "").replace(/\D/g, "").replace(/^964/, "");
  return d.length === 10 ? `+964 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : e164 || "";
}

export async function signOut() {
  try {
    await call("/auth/v1/logout", { method: "POST", auth: true });
  } catch {
    /* signed out locally either way */
  }
  session = null;
  writeSession(null);
  walletIds = null;
}

// ---------- data ----------

export async function getMyProfile() {
  const s = await freshSession();
  if (!s) return null;
  const rows = await call(`/rest/v1/profiles?id=eq.${s.user.id}&select=*`, { auth: true });
  return rows && rows[0] ? rows[0] : null;
}

export async function updateMyProfile(fields) {
  const s = await freshSession();
  if (!s) throw new ApiError("Not signed in", "no_session", 401);
  const rows = await call(`/rest/v1/profiles?id=eq.${s.user.id}`, {
    method: "PATCH",
    auth: true,
    body: fields,
    headers: { Prefer: "return=representation" },
  });
  return rows && rows[0];
}

export async function getCities() {
  return call("/rest/v1/cities?select=id,name_en,name_ku,name_ar,live,sort_order&order=sort_order");
}

export async function getCategories() {
  return call("/rest/v1/categories?select=id,name_en,name_ku,name_ar,icon,sort_order&order=sort_order");
}

// All districts and subdistricts at once (about 180 short rows), so the dropdowns change instantly.
export async function getPlaces() {
  const [districts, subdistricts] = await Promise.all([
    call("/rest/v1/districts?select=id,city_id,name_en,name_ku,name_ar,sort_order&order=sort_order"),
    call("/rest/v1/subdistricts?select=id,district_id,name_en,name_ku,name_ar,sort_order&order=sort_order"),
  ]);
  return { districts: districts || [], subdistricts: subdistricts || [] };
}

const BIZ_FIELDS =
  "id,name_en,name_ku,name_ar,category_id,city_id,district_id,subdistrict_id,phone,whatsapp,description_en,description_ku,description_ar,status,rejection_reason,handle,created_at";

export async function getMyBusinesses() {
  const s = await freshSession();
  if (!s) return [];
  try {
    return await call(`/rest/v1/businesses?owner_id=eq.${s.user.id}&select=${BIZ_FIELDS}&order=created_at.desc`, { auth: true });
  } catch {
    // Before 004_approvals.sql has run, the review columns do not exist yet
    const older = BIZ_FIELDS.replace(",rejection_reason,handle", "");
    return call(`/rest/v1/businesses?owner_id=eq.${s.user.id}&select=${older}&order=created_at.desc`, { auth: true });
  }
}

// The owner types the name and description in the language they use; the team fills the others at approval.
export async function createBusiness({ name, description, lang, category_id, city_id, district_id, subdistrict_id, phone }) {
  const s = await freshSession();
  if (!s) throw new ApiError("Not signed in", "no_session", 401);
  const body = {
    owner_id: s.user.id,
    status: "pending",
    category_id, city_id, district_id, subdistrict_id,
    phone, whatsapp: phone,
    sent_in_language: lang,
    ["name_" + lang]: name,
  };
  if (description) body["description_" + lang] = description;
  const rows = await call(`/rest/v1/businesses?select=${BIZ_FIELDS}`, {
    method: "POST", auth: true, body, headers: { Prefer: "return=representation" },
  });
  return rows && rows[0];
}

// ---------- back office (team only; the database checks the role on every call) ----------

export async function amIStaff() {
  try {
    return (await call("/rest/v1/rpc/bmnassa_is_staff", { method: "POST", auth: true, body: {} })) === true;
  } catch {
    return false;
  }
}

export async function teamBusinesses(status) {
  const q = status ? `status=eq.${status}&` : "";
  return call(`/rest/v1/businesses?${q}select=*&order=created_at.desc.nullslast&limit=500`, { auth: true });
}

export async function teamProfiles(ids) {
  const list = Array.from(new Set(ids.filter(Boolean)));
  if (!list.length) return [];
  return call(`/rest/v1/profiles?id=in.(${list.join(",")})&select=id,full_name,email,phone,role`, { auth: true });
}

export async function teamUpdateBusiness(id, fields) {
  const rows = await call(`/rest/v1/businesses?id=eq.${id}&select=*`, {
    method: "PATCH", auth: true, body: fields, headers: { Prefer: "return=representation" },
  });
  if (!rows || !rows.length) throw new ApiError("Not allowed", "not_allowed", 403);
  return rows[0];
}

// ---------- listing (anyone, no account needed; the database only returns live businesses) ----------

const LIST_FIELDS =
  "id,handle,owner_id,name_en,name_ku,name_ar,description_en,description_ku,description_ar,category_id,city_id,district_id,subdistrict_id,phone,whatsapp,contact_name,rating,reviews,verified,created_at,instagram,facebook,tiktok,email,website,hours,lat,lng,address,card,page_style";

// The fields every version of the database has; used when a newer column is not there yet
const BASE_LIST_FIELDS =
  "id,handle,owner_id,name_en,name_ku,name_ar,description_en,description_ku,description_ar,category_id,city_id,district_id,subdistrict_id,phone,whatsapp,rating,reviews,verified,created_at";

// Ask with all fields; if the database is missing a newer column (its update not run yet), ask again with the basic ones
async function withFallback(build) {
  try {
    return await call(build(LIST_FIELDS));
  } catch (e) {
    if (e.status === 400 || /column/i.test(e.message || "")) return call(build(BASE_LIST_FIELDS));
    throw e;
  }
}

export async function listBusinesses(cityId) {
  const city = cityId ? `city_id=eq.${encodeURIComponent(cityId)}&` : "";
  return withFallback((f) => `/rest/v1/businesses?${city}status=eq.approved&select=${f}&order=created_at.desc.nullslast&limit=1000`);
}

export async function businessByHandle(handle) {
  const h = String(handle || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!h) return null;
  const rows = await withFallback((f) => `/rest/v1/businesses?handle=ilike.${h}&status=eq.approved&select=${f}&limit=1`);
  return rows && rows[0] ? rows[0] : null;
}

// ---------- slice 5: owner pages ----------

const OWN_FIELDS =
  "id,handle,status,rejection_reason,name_en,name_ku,name_ar,description_en,description_ku,description_ar,category_id,city_id,district_id,subdistrict_id,phone,whatsapp,contact_name,instagram,facebook,tiktok,email,website,hours,lat,lng,address,rating,reviews,verified,created_at,card,page_style";

export async function getMyBusiness(id) {
  let rows;
  try {
    rows = await call(`/rest/v1/businesses?id=eq.${Number(id)}&select=${OWN_FIELDS}`, { auth: true });
  } catch (e) {
    // A newer column (card design, page style) may not exist until its database update has run
    if (e.status !== 400) throw e;
    rows = await call(`/rest/v1/businesses?id=eq.${Number(id)}&select=${OWN_FIELDS.replace(",card,page_style", "")}`, { auth: true });
  }
  return rows && rows[0] ? rows[0] : null;
}

export async function updateMyBusiness(id, fields) {
  const send = (sel) => call(`/rest/v1/businesses?id=eq.${Number(id)}&select=${sel}`, {
    method: "PATCH", auth: true, body: fields, headers: { Prefer: "return=representation" },
  });
  let rows;
  try {
    rows = await send(OWN_FIELDS);
  } catch (e) {
    if (e.status !== 400 || "card" in fields || "page_style" in fields) throw e;
    rows = await send(OWN_FIELDS.replace(",card,page_style", ""));
  }
  if (!rows || !rows.length) throw new ApiError("Not allowed", "not_allowed", 403);
  return rows[0];
}

export async function getPrices(bid, auth) {
  return call(`/rest/v1/business_prices?business_id=eq.${Number(bid)}&select=id,item_en,item_ku,item_ar,price_iqd,sort_order&order=sort_order`, { auth: !!auth });
}

// Replaces the whole price list with the rows given
export async function savePrices(bid, rows) {
  await call(`/rest/v1/business_prices?business_id=eq.${Number(bid)}`, { method: "DELETE", auth: true });
  if (!rows.length) return [];
  return call(`/rest/v1/business_prices?select=id,item_en,item_ku,item_ar,price_iqd,sort_order`, {
    method: "POST", auth: true, headers: { Prefer: "return=representation" },
    body: rows.map((r, i) => ({ business_id: Number(bid), item_en: r.item_en || null, item_ku: r.item_ku || null, item_ar: r.item_ar || null, price_iqd: r.price_iqd, sort_order: i })),
  });
}

export const photoUrl = (path) => `${SB_URL}/storage/v1/object/public/business-photos/${path}`;

export async function getPhotos(bid, auth) {
  return call(`/rest/v1/business_photos?business_id=eq.${Number(bid)}&select=id,path,sort_order&order=sort_order,id`, { auth: !!auth });
}

// Uploads one photo (already made small by the app) and records it on the business
// Puts one image file in the business's photo folder and returns its path
export async function uploadImage(bid, blob, prefix = "") {
  const s = await freshSession();
  if (!s) throw new ApiError("Not signed in", "no_session", 401);
  const path = `${Number(bid)}/${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}.jpg`;
  let res;
  try {
    res = await fetch(`${SB_URL}/storage/v1/object/business-photos/${path}`, {
      method: "POST",
      headers: { apikey: SB_KEY, Authorization: "Bearer " + s.access_token, "Content-Type": "image/jpeg", "x-upsert": "false" },
      body: blob,
    });
  } catch {
    throw new ApiError("Network error", "network", 0);
  }
  if (!res.ok) {
    let msg = res.statusText;
    try { const j = await res.json(); msg = j.message || j.error || msg; } catch { /* ignore */ }
    throw new ApiError(msg, "upload_" + res.status, res.status);
  }
  return path;
}

export async function addPhoto(bid, blob, sortOrder) {
  const path = await uploadImage(bid, blob);
  const rows = await call(`/rest/v1/business_photos?select=id,path,sort_order`, {
    method: "POST", auth: true, headers: { Prefer: "return=representation" },
    body: { business_id: Number(bid), path, sort_order: sortOrder || 0 },
  });
  return rows && rows[0];
}

export async function removePhoto(photo) {
  await call(`/rest/v1/business_photos?id=eq.${Number(photo.id)}`, { method: "DELETE", auth: true });
  const s = await freshSession();
  try {
    await fetch(`${SB_URL}/storage/v1/object/business-photos/${photo.path}`, {
      method: "DELETE", headers: { apikey: SB_KEY, Authorization: "Bearer " + (s && s.access_token) },
    });
  } catch { /* the record is gone; a leftover file does no harm */ }
}

export async function getStats(bid, days = 7) {
  const from = new Date(Date.now() - (days - 1) * 86400000).toISOString().slice(0, 10);
  const rows = await call(`/rest/v1/page_stats?business_id=eq.${Number(bid)}&day=gte.${from}&select=day,views,calls,whatsapp`, { auth: true });
  return (rows || []).reduce((a, r) => ({ views: a.views + r.views, calls: a.calls + r.calls, whatsapp: a.whatsapp + r.whatsapp }), { views: 0, calls: 0, whatsapp: 0 });
}

// Counts a page view or a tap; never gets in the way if it fails
const tracked = new Set();
export function track(bid, kind) {
  if (!bid) return;
  if (kind === "view") {
    const key = "v" + bid;
    try { if (sessionStorage.getItem("bm_" + key)) return; sessionStorage.setItem("bm_" + key, "1"); } catch { if (tracked.has(key)) return; tracked.add(key); }
  }
  const send = (s) => fetch(`${SB_URL}/rest/v1/rpc/bmnassa_track`, {
    method: "POST",
    headers: { apikey: SB_KEY, "Content-Type": "application/json", ...(s ? { Authorization: "Bearer " + s.access_token } : {}) },
    body: JSON.stringify({ bid: Number(bid), kind }), keepalive: true,
  }).catch(() => {});
  // Signed in: a Call or WhatsApp tap is remembered, so the person can rate the business later
  if (kind !== "view" && session) {
    if (session.expires_at - Math.floor(Date.now() / 1000) > 60) send(session);
    else freshSession().then((s) => send(s)).catch(() => send(null));
  } else send(null);
}

// ---------- reviews (slice 7) ----------
const REVIEW_FIELDS = "id,business_id,rating,tags,body,first_name,contact_kind,contacted_at,owner_reply,owner_reply_at,created_at,updated_at,status";
export const REVIEW_TAGS = ["on_time", "fair_price", "clean_work", "friendly", "fast_reply"];

export function myUserId() {
  return (session && session.user && session.user.id) || null;
}

// Live reviews of a business, newest first. Signed-in owners also see hidden ones of their own business.
export async function getReviews(bid) {
  const rows = await call(`/rest/v1/reviews?business_id=eq.${Number(bid)}&select=${REVIEW_FIELDS}&order=created_at.desc&limit=200`);
  return (rows || []).filter((r) => r.status === "live");
}

export async function getMyReview(bid) {
  const me = myUserId();
  if (!me) return null;
  const rows = await call(`/rest/v1/reviews?business_id=eq.${Number(bid)}&user_id=eq.${me}&select=${REVIEW_FIELDS}`, { auth: true });
  return (rows && rows[0]) || null;
}

// The person's latest Call or WhatsApp tap on this business (needed to rate it).
export async function getMyContact(bid) {
  const me = myUserId();
  if (!me) return null;
  const rows = await call(`/rest/v1/business_contacts?business_id=eq.${Number(bid)}&user_id=eq.${me}&select=kind,at`, { auth: true });
  return (rows && rows[0]) || null;
}

export async function saveReview(bid, { rating, tags, body }, id) {
  const fields = { rating, tags, body };
  const rows = id
    ? await call(`/rest/v1/reviews?id=eq.${Number(id)}`, { method: "PATCH", auth: true, body: fields, headers: { Prefer: "return=representation" } })
    : await call("/rest/v1/reviews", { method: "POST", auth: true, body: { business_id: Number(bid), ...fields }, headers: { Prefer: "return=representation" } });
  return rows && rows[0];
}

export async function deleteReview(id) {
  await call(`/rest/v1/reviews?id=eq.${Number(id)}`, { method: "DELETE", auth: true });
}

export async function replyToReview(id, text) {
  const rows = await call(`/rest/v1/reviews?id=eq.${Number(id)}`, { method: "PATCH", auth: true, body: { owner_reply: text }, headers: { Prefer: "return=representation" } });
  return rows && rows[0];
}

export async function teamReviews() {
  return call(`/rest/v1/reviews?select=${REVIEW_FIELDS},businesses(name_en,name_ku,handle)&order=created_at.desc&limit=200`, { auth: true });
}

export async function teamSetReview(id, fields) {
  const rows = await call(`/rest/v1/reviews?id=eq.${Number(id)}`, { method: "PATCH", auth: true, body: fields, headers: { Prefer: "return=representation" } });
  return rows && rows[0];
}

// ---------- wallet (slice 7) ----------
// Saved business ids for this session, so "Save to wallet" buttons know their state at once
let walletIds = null;
const WALLET_SELECT = (fields) => `id,kind,business_id,data,image_path,created_at,businesses(${fields})`;

export async function getWallet() {
  const q = (f) => `/rest/v1/wallet_items?select=${WALLET_SELECT(f)}&order=created_at.desc&limit=500`;
  let rows;
  try { rows = await call(q(LIST_FIELDS), { auth: true }); } catch (e) {
    if (e.status === 400) rows = await call(q(BASE_LIST_FIELDS), { auth: true }); else throw e;
  }
  walletIds = new Map((rows || []).filter((r) => r.business_id).map((r) => [r.business_id, r.id]));
  return rows || [];
}

// The wallet item id if this business is saved, null if not, undefined if unknown (not signed in)
export async function walletItemFor(bid) {
  if (!session) return undefined;
  if (!walletIds) {
    const rows = await call(`/rest/v1/wallet_items?select=id,business_id&business_id=not.is.null&limit=500`, { auth: true });
    walletIds = new Map((rows || []).map((r) => [r.business_id, r.id]));
  }
  return walletIds.get(Number(bid)) || null;
}

export async function saveToWallet(bid) {
  try {
    const rows = await call("/rest/v1/wallet_items", { method: "POST", auth: true, body: { kind: "business", business_id: Number(bid) }, headers: { Prefer: "return=representation" } });
    const id = rows && rows[0] && rows[0].id;
    if (walletIds) walletIds.set(Number(bid), id);
    return id;
  } catch (e) {
    if (e.status === 409 || e.code === "23505") { walletIds = null; return walletItemFor(bid); }
    throw e;
  }
}

export async function removeFromWallet(id, bid) {
  await call(`/rest/v1/wallet_items?id=eq.${Number(id)}`, { method: "DELETE", auth: true });
  if (walletIds && bid) walletIds.delete(Number(bid));
}

export async function walletSaves(bid) {
  try { return await call("/rest/v1/rpc/bmnassa_wallet_saves", { method: "POST", auth: true, body: { bid: Number(bid) } }); } catch { return null; }
}

export function forgetWallet() { walletIds = null; }

// ---------- scanned paper cards (slice 7) ----------
// Reads a card with the scan-card function (Claude). front/back: base64 JPEG without the data: prefix.
export async function scanCard(front, back) {
  const s = await freshSession();
  if (!s) throw new ApiError("Not signed in", "no_session", 401);
  let res;
  try {
    res = await fetch(`${SB_URL}/functions/v1/scan-card`, {
      method: "POST",
      headers: { apikey: SB_KEY, Authorization: "Bearer " + s.access_token, "Content-Type": "application/json" },
      body: JSON.stringify({ front, ...(back ? { back } : {}) }),
    });
  } catch {
    throw new ApiError("Network error", "network", 0);
  }
  let data = null;
  try { data = await res.json(); } catch { /* not JSON */ }
  if (!res.ok) throw new ApiError((data && (data.detail || data.error)) || res.statusText, (data && data.error) || "http_" + res.status, res.status);
  return data;
}

// Private photos of scanned cards, in the person's own folder
export async function uploadScan(blob, side) {
  const s = await freshSession();
  if (!s) throw new ApiError("Not signed in", "no_session", 401);
  const path = `${s.user.id}/${side}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}.jpg`;
  let res;
  try {
    res = await fetch(`${SB_URL}/storage/v1/object/wallet-scans/${path}`, {
      method: "POST",
      headers: { apikey: SB_KEY, Authorization: "Bearer " + s.access_token, "Content-Type": "image/jpeg", "x-upsert": "false" },
      body: blob,
    });
  } catch {
    throw new ApiError("Network error", "network", 0);
  }
  if (!res.ok) {
    let msg = res.statusText;
    try { const j = await res.json(); msg = j.message || j.error || msg; } catch { /* ignore */ }
    throw new ApiError(msg, "upload_" + res.status, res.status);
  }
  return path;
}

const scanUrls = new Map();
// A private photo as a temporary link this page can show
export async function scanImageUrl(path) {
  if (!path) return null;
  if (scanUrls.has(path)) return scanUrls.get(path);
  const s = await freshSession();
  if (!s) return null;
  const res = await fetch(`${SB_URL}/storage/v1/object/authenticated/wallet-scans/${path}`, { headers: { apikey: SB_KEY, Authorization: "Bearer " + s.access_token } });
  if (!res.ok) return null;
  const url = URL.createObjectURL(await res.blob());
  scanUrls.set(path, url);
  return url;
}

export async function removeScanPhotos(paths) {
  const s = await freshSession();
  const list = (paths || []).filter(Boolean);
  if (!s || !list.length) return;
  await fetch(`${SB_URL}/storage/v1/object/wallet-scans`, {
    method: "DELETE",
    headers: { apikey: SB_KEY, Authorization: "Bearer " + s.access_token, "Content-Type": "application/json" },
    body: JSON.stringify({ prefixes: list }),
  }).catch(() => {});
}

export async function addScannedCard(data, imagePath) {
  const rows = await call("/rest/v1/wallet_items", { method: "POST", auth: true, body: { kind: "scanned", data, image_path: imagePath || null }, headers: { Prefer: "return=representation" } });
  return rows && rows[0];
}

export async function updateScannedCard(id, data) {
  const rows = await call(`/rest/v1/wallet_items?id=eq.${Number(id)}`, { method: "PATCH", auth: true, body: { data }, headers: { Prefer: "return=representation" } });
  return rows && rows[0];
}

export async function getWalletItem(id) {
  const rows = await call(`/rest/v1/wallet_items?id=eq.${Number(id)}&select=id,kind,data,image_path,created_at`, { auth: true });
  return rows && rows[0];
}

// ---------- NFC card orders (slice 7) ----------
export const NFC_PRICE_USD = 15;
export const PAYMENTS = ["cash", "fib", "fastpay", "asiapay", "zaincash"];
const ORDER_FIELDS = "id,business_id,name_on_card,title_on_card,quantity,unit_price_usd,delivery_address,phone,payment,status,created_at";

export async function getMyOrders(bid) {
  return call(`/rest/v1/nfc_orders?business_id=eq.${Number(bid)}&select=${ORDER_FIELDS}&order=created_at.desc&limit=20`, { auth: true });
}

export async function placeOrder(bid, o) {
  const rows = await call("/rest/v1/nfc_orders", { method: "POST", auth: true, body: { business_id: Number(bid), ...o }, headers: { Prefer: "return=representation" } });
  return rows && rows[0];
}

export async function cancelOrder(id) {
  const rows = await call(`/rest/v1/nfc_orders?id=eq.${Number(id)}`, { method: "PATCH", auth: true, body: { status: "cancelled" }, headers: { Prefer: "return=representation" } });
  return rows && rows[0];
}

export async function teamOrders() {
  return call(`/rest/v1/nfc_orders?select=${ORDER_FIELDS},team_note,businesses(name_en,name_ku,handle,city_id)&order=created_at.desc&limit=300`, { auth: true });
}

export async function teamUpdateOrder(id, fields) {
  const rows = await call(`/rest/v1/nfc_orders?id=eq.${Number(id)}`, { method: "PATCH", auth: true, body: fields, headers: { Prefer: "return=representation" } });
  return rows && rows[0];
}

// Home: the categories people called most in this city over the last week (totals only).
// Empty until migration 014 is run or there are enough taps.
const topCalledCache = {};
export async function topCalled(city) {
  if (!city) return [];
  if (topCalledCache[city]) return topCalledCache[city];
  try {
    const rows = await call("/rest/v1/rpc/bmnassa_top_called", { method: "POST", body: { city } });
    topCalledCache[city] = Array.isArray(rows) ? rows : [];
  } catch {
    topCalledCache[city] = [];
  }
  return topCalledCache[city];
}
