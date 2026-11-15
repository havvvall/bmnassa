// Records what the app loads from Supabase and OpenStreetMap, so the Claude preview can run without network.
// Usage: node record.cjs <out.json> [app url]  (the dev server must be running)
const { chromium, devices } = require('playwright');
const fs = require('fs');
const SB = 'https://hfcqvcduuhzfxijsniav.supabase.co';
const OUT = process.argv[2] || 'rec.json';
const APP = process.argv[3] || 'http://localhost:5173';
const rec = {}; const imgs = {}; const tiles = {};
(async () => {
  const b = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } } : {});
  const ctx = await b.newContext({ ...devices['iPhone 13'], geolocation: { latitude: 35.5613, longitude: 45.4302 }, permissions: ['geolocation'] });
  const p = await ctx.newPage();
  p.on('response', async r => {
    const u = r.url(); const req = r.request();
    try {
      if (u.startsWith(SB + '/rest/') && req.method() === 'GET' && r.ok()) rec[u] = await r.text();
      else if (u.startsWith(SB + '/storage/') && r.ok()) imgs[u] = 'data:' + (r.headers()['content-type']||'image/jpeg') + ';base64,' + (await r.body()).toString('base64');
      else if (/tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png/.test(u) && r.ok()) { const m = u.match(/\/(\d+)\/(\d+)\/(\d+)\.png/); tiles[m[1]+'/'+m[2]+'/'+m[3]] = 'data:image/png;base64,' + (await r.body()).toString('base64'); }
    } catch {}
  });
  const go = async (path, wait = 2500) => { await p.goto(APP + path, { waitUntil: 'networkidle' }); await p.waitForTimeout(wait); };
  await go('/welcome', 500);
  await p.getByText('English', { exact: true }).click();
  await p.getByRole('button', { name: /get started/i }).click();
  await p.waitForTimeout(800);
  await p.getByRole('button', { name: /Sulaymaniyah/ }).click();
  await p.getByRole('button', { name: 'Continue' }).click();
  await p.waitForTimeout(1500);
  for (const path of ['/path', '/home', '/search', '/wallet', '/map']) await go(path, 3000);
  // zoom the map once in and out to collect neighbouring tiles
  for (const sel of ['.leaflet-control-zoom-in', '.leaflet-control-zoom-out', '.leaflet-control-zoom-out']) { try { await p.click(sel); await p.waitForTimeout(1500); } catch {} }
  // business pages: collect handles from home links
  await go('/home', 3000);
  const bizRows = Object.entries(rec).filter(([u]) => u.includes('/businesses?')).flatMap(([, t]) => { try { return JSON.parse(t); } catch { return []; } });
  const handles = [...new Set(bizRows.map(x => x.handle).filter(Boolean))];
  console.log('handles', handles.length, handles.slice(0, 40));
  for (const h of handles.slice(0, 40)) {
    await go('/' + h, 1500);
    for (let y = 0; y < 8; y++) { await p.mouse.wheel(0, 600); await p.waitForTimeout(400); }
    await p.waitForTimeout(1500);
  }
  fs.writeFileSync(OUT, JSON.stringify({ rec, imgs, tiles }));
  console.log('rest', Object.keys(rec).length, 'imgs', Object.keys(imgs).length, 'tiles', Object.keys(tiles).length);
  await b.close();
})();
