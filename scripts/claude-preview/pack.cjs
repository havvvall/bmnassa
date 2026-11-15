const fs = require('fs'), path = require('path');
// Packs the built app (dist) into one self-contained HTML page that runs inside a Claude artifact.
// Usage: node pack.cjs <distDir> <publicDir> <rec.json> <leafletDir> <out.html>
const [,, distDir, pubDir, recFile, leafletDir, out] = process.argv;
const { rec, imgs, tiles } = JSON.parse(fs.readFileSync(recFile, 'utf8'));
const mime = { '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const dataUri = f => 'data:' + mime[path.extname(f)] + ';base64,' + fs.readFileSync(path.join(pubDir, f)).toString('base64');
const assets = ['/brand/kurdistan-skyline-v2.webp', '/brand/logo-ink.svg', '/brand/logo-silver.svg', '/brand/mark-ink.svg', '/fib-qr-white.png', '/fib-qr.jpg'];
const inline = s => { for (const a of assets) s = s.split('"' + a + '"').join('"' + dataUri(a) + '"').split('(' + a + ')').join('(' + dataUri(a) + ')'); return s; };
const jsFile = fs.readdirSync(distDir + '/assets').find(f => f.endsWith('.js'));
const cssFile = fs.readdirSync(distDir + '/assets').find(f => f.endsWith('.css'));
let js = inline(fs.readFileSync(distDir + '/assets/' + jsFile, 'utf8'));
const intro = fs.readFileSync(path.join(pubDir, 'intro/index.html'), 'utf8').replace('new URLSearchParams(location.search).get("lang")', '"__BMLANG__"');
const before = js.length;
js = js.replace(/src:`\/intro\/index\.html\?lang=\$\{(\w+)\}`/, (m, v) => 'srcDoc:window.__BM_INTRO.replace("__BMLANG__",' + v + ')');
if (js.length === before) throw new Error('intro iframe not found');
const b2 = js.length;
js = js.replace(/src:`https:\/\/tile\.openstreetmap\.org\/16\/\$\{(\w+)\}\/\$\{(\w+)\}\.png`/g, (m, a, b) => 'src:(window.__BM_TILES["16/"+' + a + '+"/"+' + b + ']||window.__BM_BLANK)');
if (js.length === b2) throw new Error('tile img not found');
const css = inline(fs.readFileSync(distDir + '/assets/' + cssFile, 'utf8'));
const shim = `
(function(){
  var SB = "https://hfcqvcduuhzfxijsniav.supabase.co";
  window.__BM_INTRO = ${JSON.stringify(intro).split('</').join('<\\/')};
  window.__BM_TILES = ${JSON.stringify(tiles)};
  window.__BM_BLANK = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#e8e6e1"/></svg>');
  var REC = ${JSON.stringify(rec)};
  var IMGS = ${JSON.stringify(imgs)};
  try { if (location.pathname !== "/") history.replaceState(null, "", "/"); } catch (e) {}
  var realFetch = window.fetch ? window.fetch.bind(window) : null;
  function json(body, status) { return Promise.resolve(new Response(body, { status: status || 200, headers: { "Content-Type": "application/json" } })); }
  window.fetch = function (input, init) {
    var url = typeof input === "string" ? input : (input && input.url) || String(input);
    var method = ((init && init.method) || (input && input.method) || "GET").toUpperCase();
    if (url.indexOf(SB) === 0) {
      if (method === "GET" && REC[url] != null) return json(REC[url]);
      if (method === "GET" && url.indexOf("/rest/") > 0) return json("[]");
      if (method === "HEAD") return json("", 200);
      return json(JSON.stringify({ message: "Preview: sign-in and saving are turned off in this Claude preview.", code: "preview" }), 503);
    }
    return realFetch ? realFetch(input, init) : Promise.reject(new Error("offline"));
  };
  function fixImg(el) {
    var s = el.getAttribute && el.getAttribute("src");
    if (!s) return;
    if (IMGS[s]) return el.setAttribute("src", IMGS[s]);
    var at = s.indexOf("tile.openstreetmap.org/");
    if (at >= 0) { var key = s.slice(at + 23).split(".png")[0]; el.setAttribute("src", window.__BM_TILES[key] || window.__BM_BLANK); }
  }
  new MutationObserver(function (ms) {
    ms.forEach(function (m) {
      if (m.type === "attributes") fixImg(m.target);
      m.addedNodes && m.addedNodes.forEach(function (n) {
        if (n.nodeType !== 1) return;
        if (n.tagName === "IMG") fixImg(n);
        n.querySelectorAll && n.querySelectorAll("img").forEach(fixImg);
      });
    });
  }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["src"] });
})();`;
const tileShim = `
(function(){
  var TILES = window.__BM_TILES;
  var BLANK = window.__BM_BLANK;
  var _unused = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#e8e6e1"/></svg>');
  if (window.L && L.TileLayer) {
    L.TileLayer.prototype.getTileUrl = function (c) { return TILES[c.z + "/" + c.x + "/" + c.y] || BLANK; };
  }
})();`;
let html = fs.readFileSync(distDir + '/index.html', 'utf8');
html = html
  .replace(/\s*<link rel="manifest"[^>]*>/, '')
  .replace(/\s*<link rel="apple-touch-icon"[^>]*>/, '')
  .replace(/<link rel="icon"[^>]*>/, '')
  .replace(/\s*<script type="module" crossorigin src="[^"]+"><\/script>/, '')
  .replace(/\s*<link rel="stylesheet" crossorigin href="[^"]+">/, '')
  .replace('</head>', () =>
    '<style>' + fs.readFileSync(path.join(leafletDir, 'leaflet.css'), 'utf8') + '</style>\n' +
    '<style>' + css + '</style>\n' +
    '<script>' + shim + '</script>\n' +
    '<script>' + fs.readFileSync(path.join(leafletDir, 'leaflet.js'), 'utf8') + '</script>\n' +
    '<script>' + tileShim + '</script>\n' +
    '<script type="module">' + js + '</script>\n</head>');
html = html.replace('<title>Bmnassa</title>', '<title>Bmnassa V1 – live preview</title>');
fs.writeFileSync(out, html);
console.log('wrote', out, (html.length / 1024 / 1024).toFixed(2), 'MB');
