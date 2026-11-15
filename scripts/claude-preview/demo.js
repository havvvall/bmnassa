// Demo mode for the Claude preview. Runs before the app, inside the artifact page.
// - answers every Supabase request from a small in-memory database (seeded from the recording + demo rows below),
// - signs the viewer in as a demo business owner (who is also on the team), so every page opens,
// - adds a "Pages" button that jumps to any screen.
// Nothing here reaches the real Supabase project: changes last until the page is reloaded.
// Placeholders filled in by pack.cjs: __SB__, __REC__, __IMGS__.
(function () {
  var SB = __SB__;
  var REC = __REC__;
  var IMGS = __IMGS__;
  window.__BM_IMGS = IMGS;

  // ---------- storage that works even where the sandbox blocks localStorage ----------
  function memStore() {
    var m = {};
    return {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; },
      setItem: function (k, v) { m[k] = String(v); },
      removeItem: function (k) { delete m[k]; },
      clear: function () { m = {}; },
      key: function (i) { return Object.keys(m)[i] || null; },
      get length() { return Object.keys(m).length; },
    };
  }
  ["localStorage", "sessionStorage"].forEach(function (name) {
    try { window[name].setItem("bm_probe", "1"); window[name].removeItem("bm_probe"); }
    catch (e) { try { Object.defineProperty(window, name, { value: memStore(), configurable: true }); } catch (e2) {} }
  });

  try { if (location.pathname !== "/") history.replaceState(null, "", "/"); } catch (e) {}

  // ---------- demo account ----------
  var ME = "00000000-0000-4000-8000-0000000de300";
  var now = Date.now();
  var iso = function (msAgo) { return new Date(now - msAgo).toISOString(); };
  var DAY = 86400000;
  var SESSION = {
    access_token: "demo", refresh_token: "demo", expires_at: Math.floor(now / 1000) + 365 * 86400,
    user: { id: ME, email: "demo@bmnassa.com" },
  };
  try {
    if (!localStorage.getItem("bm_session")) localStorage.setItem("bm_session", JSON.stringify(SESSION));
    if (!localStorage.getItem("bm_city")) localStorage.setItem("bm_city", "sulaymaniyah");
  } catch (e) {}

  // ---------- tables ----------
  var DB = {};
  var table = function (name) { return DB[name] || (DB[name] = []); };
  Object.keys(REC).forEach(function (url) {
    var m = url.match(/\/rest\/v1\/([a-z_]+)\?/);
    if (!m) return;
    var rows; try { rows = JSON.parse(REC[url]); } catch (e) { return; }
    if (!Array.isArray(rows)) return;
    var t = table(m[1]);
    rows.forEach(function (r) {
      var old = r.id != null && t.find(function (x) { return x.id === r.id; });
      if (old) Object.assign(old, r); else t.push(Object.assign({}, r));
    });
  });
  // every recorded business is live; the first one belongs to the demo owner
  table("businesses").forEach(function (b, i) {
    b.status = b.status || "approved";
    if (i === 0) b.owner_id = ME;
  });
  var mine = table("businesses")[0] || {
    id: 255, handle: "demo-business", owner_id: ME, status: "approved", name_en: "Demo Business", name_ku: "بزنسی نموونە",
    name_ar: "نشاط تجريبي", category_id: "civil-eng", city_id: "sulaymaniyah", district_id: "sulaymaniyah/sulaymaniyah",
    phone: "+9647701234567", whatsapp: "+9647701234567", rating: 0, reviews: 0, created_at: iso(30 * DAY),
  };
  if (!table("businesses").length) table("businesses").push(mine);
  var BID = mine.id;
  mine.rating = 4.7; mine.reviews = 3; mine.verified = true;

  table("profiles").push(
    { id: ME, email: "demo@bmnassa.com", phone: "+9647701234567", full_name: "Demo Owner", language: null, city_id: "sulaymaniyah", role: "owner", created_at: iso(40 * DAY) },
    { id: "demo-owner-2", email: "azad@example.com", phone: "+9647501112233", full_name: "Azad Karim", language: "ku", city_id: "sulaymaniyah", role: "owner", created_at: iso(3 * DAY) },
    { id: "demo-owner-3", email: "rebin@example.com", phone: "+9647709998877", full_name: "Rebin Ali", language: "en", city_id: "sulaymaniyah", role: "owner", created_at: iso(1 * DAY) }
  );
  // two sign-ups waiting for the team, so the back office has something to approve
  table("businesses").push(
    { id: 9001, handle: null, owner_id: "demo-owner-2", status: "pending", name_en: null, name_ku: "ئازاد بۆ ساردکەرەوە", name_ar: null,
      description_ku: "چاککردنەوە و دانانی ساردکەرەوە", category_id: "hvac", city_id: "sulaymaniyah", district_id: "sulaymaniyah/sulaymaniyah",
      subdistrict_id: "sulaymaniyah/sulaymaniyah/centre", phone: "+9647501112233", whatsapp: "+9647501112233", sent_in_language: "ku", created_at: iso(3 * DAY) },
    { id: 9002, handle: null, owner_id: "demo-owner-3", status: "pending", name_en: "Rebin Dental", name_ku: null, name_ar: null,
      description_en: "Family dentist, open evenings.", category_id: "beauty", city_id: "sulaymaniyah", district_id: "sulaymaniyah/sulaymaniyah",
      subdistrict_id: "sulaymaniyah/sulaymaniyah/centre", phone: "+9647709998877", whatsapp: "+9647709998877", sent_in_language: "en", created_at: iso(1 * DAY) }
  );
  table("reviews").push(
    { id: 1, business_id: BID, user_id: "demo-owner-2", rating: 5, tags: ["on_time", "fair_price"], body: "Came on time and explained everything clearly.", first_name: "Azad", contact_kind: "call", contacted_at: iso(9 * DAY), owner_reply: "Thank you Azad!", owner_reply_at: iso(8 * DAY), created_at: iso(8 * DAY), updated_at: iso(8 * DAY), status: "live" },
    { id: 2, business_id: BID, user_id: "demo-owner-3", rating: 5, tags: ["clean_work", "friendly"], body: "Very professional work.", first_name: "Rebin", contact_kind: "whatsapp", contacted_at: iso(5 * DAY), owner_reply: null, owner_reply_at: null, created_at: iso(4 * DAY), updated_at: iso(4 * DAY), status: "live" },
    { id: 3, business_id: BID, user_id: "demo-user-4", rating: 4, tags: ["fast_reply"], body: "Answered quickly on WhatsApp.", first_name: "Shilan", contact_kind: "whatsapp", contacted_at: iso(3 * DAY), owner_reply: null, owner_reply_at: null, created_at: iso(2 * DAY), updated_at: iso(2 * DAY), status: "live" }
  );
  table("business_contacts").push({ business_id: BID, user_id: ME, kind: "call", at: iso(2 * DAY) });
  for (var d = 0; d < 30; d++) {
    var v = 12 + ((d * 7) % 11) + (d % 3) * 4;
    table("page_stats").push({ business_id: BID, day: new Date(now - d * DAY).toISOString().slice(0, 10), views: v, calls: Math.round(v / 5), whatsapp: Math.round(v / 4) });
  }
  table("business_prices").push(
    { id: 1, business_id: BID, item_en: "Site visit", item_ku: "سەردانی شوێن", item_ar: "زيارة موقع", price_iqd: 25000, sort_order: 0 },
    { id: 2, business_id: BID, item_en: "House plan (per m²)", item_ku: "نەخشەی خانوو (بۆ هەر م²)", item_ar: "مخطط منزل (للمتر²)", price_iqd: 5000, sort_order: 1 }
  );
  table("wallet_items").push(
    { id: 1, user_id: ME, kind: "business", business_id: BID, data: null, image_path: null, created_at: iso(6 * DAY) },
    { id: 2, user_id: ME, kind: "scanned", business_id: null, image_path: null, created_at: iso(2 * DAY),
      data: { name: "Karwan Ahmed", title: "Electrician", company: "Karwan Electric", phones: ["+9647501234567"], email: "", website: "", address: "Salim St., Sulaymaniyah", instagram: "karwan.electric", facebook: "", whatsapp: "+9647501234567", category_id: "electrical" } }
  );
  table("nfc_orders").push(
    { id: 1, business_id: BID, user_id: ME, name_on_card: mine.contact_name || "Demo Owner", title_on_card: "Civil Engineer", quantity: 2, unit_price_usd: 15,
      delivery_address: "Sulaymaniyah, Salim St.", phone: mine.phone, payment: "cash", status: "confirmed", created_at: iso(1 * DAY), plan_name: null, price_iqd: null, design_url: null, team_note: "Call before delivery" }
  );
  table("business_suggestions").push(
    { id: 1, user_id: ME, wallet_item_id: 2, city_id: "sulaymaniyah", data: table("wallet_items")[1].data, image_path: null, back_path: null, note: "Good electrician, should be on Bmnassa", status: "new", business_id: null, team_note: null, created_at: iso(1 * DAY), updated_at: iso(1 * DAY) }
  );
  ["business_photos", "plan_orders"].forEach(table);

  // ---------- a tiny PostgREST ----------
  function parse(url) {
    var u = new URL(url);
    var name = u.pathname.replace(/^\/rest\/v1\//, "");
    var filters = [], select = "*", order = null, limit = null;
    u.searchParams.forEach(function (val, key) {
      if (key === "select") select = val;
      else if (key === "order") order = val;
      else if (key === "limit") limit = Number(val);
      else if (key !== "offset" && key !== "on_conflict" && key !== "columns") filters.push([key, val]);
    });
    return { name: name, filters: filters, select: select, order: order, limit: limit };
  }
  function test(row, key, expr) {
    var neg = false;
    if (expr.indexOf("not.") === 0) { neg = true; expr = expr.slice(4); }
    var dot = expr.indexOf("."), op = expr.slice(0, dot), val = expr.slice(dot + 1), x = row[key], ok;
    if (op === "eq") ok = x != null && String(x) === val;
    else if (op === "neq") ok = x == null || String(x) !== val;
    else if (op === "is") ok = val === "null" ? x == null : String(x) === val;
    else if (op === "in") ok = val.replace(/^\(|\)$/g, "").split(",").map(function (s) { return s.replace(/^"|"$/g, ""); }).indexOf(String(x)) >= 0;
    else if (op === "ilike" || op === "like") {
      var re = new RegExp("^" + val.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$", op === "ilike" ? "i" : "");
      ok = x != null && re.test(String(x));
    } else if (op === "gte" || op === "gt" || op === "lte" || op === "lt") {
      var a = typeof x === "number" ? x : String(x), b = typeof x === "number" ? Number(val) : val;
      ok = x != null && (op === "gte" ? a >= b : op === "gt" ? a > b : op === "lte" ? a <= b : a < b);
    } else ok = true;
    return neg ? !ok : ok;
  }
  function find(q) {
    return table(q.name).filter(function (r) { return q.filters.every(function (f) { return test(r, f[0], f[1]); }); });
  }
  function shape(rows, q) {
    var out = rows.map(function (r) {
      var o = Object.assign({}, r);
      if (/businesses\(/.test(q.select) && q.name !== "businesses") {
        o.businesses = table("businesses").find(function (b) { return b.id === r.business_id; }) || null;
      }
      return o;
    });
    if (q.order) {
      var parts = q.order.split(",")[0].split("."), k = parts[0], desc = parts.indexOf("desc") > 0;
      out.sort(function (a, b) {
        var x = a[k], y = b[k];
        if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1;
        return (x > y ? 1 : x < y ? -1 : 0) * (desc ? -1 : 1);
      });
    }
    if (q.limit) out = out.slice(0, q.limit);
    return out;
  }
  function nextId(t) { return t.reduce(function (m, r) { return typeof r.id === "number" && r.id > m ? r.id : m; }, 0) + 1; }

  function rest(url, method, body) {
    var q = parse(url);
    if (q.name.indexOf("rpc/") === 0) return rpc(q.name.slice(4), body || {});
    var t = table(q.name);
    if (method === "GET" || method === "HEAD") return [200, shape(find(q), q)];
    if (method === "POST") {
      var list = Array.isArray(body) ? body : [body];
      var made = list.map(function (b) {
        var r = Object.assign({ id: nextId(t), created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, b);
        if (q.name !== "businesses" && q.name !== "profiles" && r.user_id == null) r.user_id = ME;
        if (q.name === "nfc_orders" && !r.status) r.status = "new";
        if (q.name === "business_suggestions" && !r.status) r.status = "new";
        if (q.name === "reviews") { r.status = r.status || "live"; r.first_name = r.first_name || "Demo"; }
        t.push(r);
        return r;
      });
      return [201, shape(made, q)];
    }
    if (method === "PATCH") {
      var hit = find(q);
      hit.forEach(function (r) {
        Object.assign(r, body, { updated_at: new Date().toISOString() });
        if (q.name === "reviews" && body && "owner_reply" in body) r.owner_reply_at = new Date().toISOString();
      });
      return [200, shape(hit, q)];
    }
    if (method === "DELETE") {
      var gone = find(q);
      DB[q.name] = t.filter(function (r) { return gone.indexOf(r) < 0; });
      return [200, shape(gone, q)];
    }
    return [405, { message: "Not supported in the demo" }];
  }
  function rpc(name, body) {
    if (name === "bmnassa_is_staff") return [200, true];
    if (name === "bmnassa_wallet_saves") return [200, 4];
    if (name === "bmnassa_scan_stats") return [200, 37];
    if (name === "bmnassa_joined_from_scans") return [200, []];
    if (name === "bmnassa_top_called") {
      return [200, [{ category_id: "electrical", taps: 41 }, { category_id: "plumbing", taps: 33 }, { category_id: "civil-eng", taps: 18 }]];
    }
    if (name === "bmnassa_track") return [204, null];
    return [200, null];
  }

  // ---------- sign-in, files and the card reader ----------
  var FILES = {};
  function storage(url, method, body) {
    var path = url.split("/storage/v1/object/")[1] || "";
    if (method === "POST" || method === "PUT") {
      var key = path.replace(/^authenticated\//, "");
      FILES[key] = body;
      try { if (body instanceof Blob) IMGS[SB + "/storage/v1/object/public/" + key] = URL.createObjectURL(body); } catch (e) {}
      return [200, { Key: key }];
    }
    if (method === "DELETE") return [200, []];
    var file = FILES[path.replace(/^(authenticated|public)\//, "")];
    if (file) return [200, file];
    return [404, { message: "Not found" }];
  }
  function auth(url, method, body) {
    if (/\/otp/.test(url)) return [200, {}];
    if (/\/verify|\/token/.test(url)) {
      var email = (body && body.email) || "demo@bmnassa.com";
      var me = table("profiles").find(function (p) { return p.id === ME; });
      if (me) me.email = email;
      return [200, { access_token: "demo", refresh_token: "demo", expires_in: 365 * 86400, user: { id: ME, email: email } }];
    }
    if (/\/logout/.test(url)) return [204, null];
    return [200, {}];
  }
  var SCANNED = {
    name: "Karwan Ahmed", title: "Electrician", company: "Karwan Electric", phones: ["+9647501234567"], email: "karwan@example.com",
    website: "", address: "Salim St., Sulaymaniyah", instagram: "karwan.electric", facebook: "", whatsapp: "+9647501234567",
    category_id: "electrical", language: "en",
  };

  function reply(status, data) {
    if (data instanceof Blob) return Promise.resolve(new Response(data, { status: status }));
    var text = data == null ? "" : JSON.stringify(data);
    return Promise.resolve(new Response(status === 204 ? null : text, { status: status, headers: { "Content-Type": "application/json" } }));
  }
  var realFetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (input, init) {
    var url = typeof input === "string" ? input : (input && input.url) || String(input);
    if (url.indexOf(SB) !== 0) return realFetch ? realFetch(input, init) : Promise.reject(new Error("offline"));
    var method = ((init && init.method) || (input && input.method) || "GET").toUpperCase();
    var raw = init && init.body, body = raw;
    if (typeof raw === "string") { try { body = JSON.parse(raw); } catch (e) {} }
    var r;
    try {
      if (url.indexOf(SB + "/rest/v1/") === 0) r = rest(url, method, body);
      else if (url.indexOf(SB + "/auth/v1/") === 0) r = auth(url, method, body);
      else if (url.indexOf(SB + "/storage/v1/") === 0) r = storage(url, method, raw);
      else if (url.indexOf(SB + "/functions/v1/scan-card") === 0) r = [200, SCANNED];
      else r = [404, { message: "Not in the demo" }];
    } catch (e) {
      r = [500, { message: "Demo error: " + e.message }];
    }
    return new Promise(function (ok) { setTimeout(function () { ok(reply(r[0], r[1])); }, 120); });
  };

  // ---------- "Pages" button: jump to any screen ----------
  var H = mine.handle || "demo-business";
  var PAGES = [
    ["Start", [["Welcome", "/welcome"], ["Intro slides", "/intro"], ["Choose a path", "/path"], ["Sign in", "/signin"], ["Your name", "/name"]]],
    ["Customers", [["Home", "/home"], ["Search", "/search"], ["Category: Electricians", "/c/electrical"], ["Map", "/map"], ["Wallet", "/wallet"], ["Scan a card", "/scan"], ["Edit a scanned card", "/scan/edit/2"]]],
    ["Business page", [["Page", "/" + H], ["Card", "/" + H + "/card"], ["Reviews", "/" + H + "/reviews"], ["Rate it", "/" + H + "/rate"]]],
    ["Owners", [["Account", "/account"], ["Plans", "/plans"], ["Plan set-up", "/plan/setup"], ["List a business", "/list"], ["My business", "/my/" + BID], ["Edit page", "/my/" + BID + "/edit"], ["Card studio", "/my/" + BID + "/card"], ["Order NFC cards", "/my/" + BID + "/nfc"]]],
    ["Team", [["Back office", "/team"]]],
  ];
  function go(p) {
    try { history.pushState({}, "", p); dispatchEvent(new PopStateEvent("popstate")); } catch (e) {}
    close();
  }
  var css = "#bm-demo-btn{position:fixed;z-index:2147483000;left:0;top:42%;transform:translateY(-50%);writing-mode:vertical-rl;padding:12px 6px;border:0;border-radius:0 10px 10px 0;background:#f2c230;color:#15171a;font:700 12px/1 Manrope,system-ui,sans-serif;letter-spacing:.06em;box-shadow:0 4px 14px rgba(0,0,0,.25);cursor:pointer;opacity:.92}" +
    "#bm-demo{position:fixed;z-index:2147483001;inset:0;background:rgba(10,10,12,.55);display:none}" +
    "#bm-demo.open{display:block}" +
    "#bm-demo .p{position:absolute;left:0;top:0;bottom:0;width:min(300px,86vw);overflow:auto;background:#fff;color:#15171a;padding:18px 16px 28px;font:500 14px/1.3 Manrope,system-ui,sans-serif;direction:ltr;text-align:left}" +
    "#bm-demo h2{font-size:18px;margin:0 0 4px}#bm-demo .s{color:#666;font-size:12px;margin:0 0 12px}" +
    "#bm-demo h3{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#8a7200;margin:16px 0 6px}" +
    "#bm-demo button.l{display:block;width:100%;text-align:left;border:0;background:#f3f4f6;border-radius:10px;padding:10px 12px;margin:0 0 6px;font:inherit;color:inherit;cursor:pointer}" +
    "#bm-demo button.l:active{background:#e5e7eb}#bm-demo button.r{background:#15171a;color:#fff;margin-top:14px}";
  function build() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var b = document.createElement("button"); b.id = "bm-demo-btn"; b.type = "button"; b.textContent = "PAGES"; b.onclick = open;
    var o = document.createElement("div"); o.id = "bm-demo";
    o.onclick = function (e) { if (e.target === o) close(); };
    var p = document.createElement("div"); p.className = "p";
    p.innerHTML = "<h2>Bmnassa demo</h2><p class='s'>Signed in as a demo owner who is also on the team. Changes are pretend and reset on reload.</p>";
    PAGES.forEach(function (g) {
      var h = document.createElement("h3"); h.textContent = g[0]; p.appendChild(h);
      g[1].forEach(function (it) {
        var x = document.createElement("button"); x.type = "button"; x.className = "l"; x.textContent = it[0];
        x.onclick = function () { go(it[1]); }; p.appendChild(x);
      });
    });
    var reset = document.createElement("button"); reset.type = "button"; reset.className = "l r"; reset.textContent = "Restart the demo";
    reset.onclick = function () { try { localStorage.clear(); sessionStorage.clear(); } catch (e) {} location.reload(); };
    p.appendChild(reset);
    o.appendChild(p);
    document.body.appendChild(o); document.body.appendChild(b);
  }
  function open() { document.getElementById("bm-demo").classList.add("open"); }
  function close() { var o = document.getElementById("bm-demo"); if (o) o.classList.remove("open"); }
  if (document.body) build(); else document.addEventListener("DOMContentLoaded", build);
})();
