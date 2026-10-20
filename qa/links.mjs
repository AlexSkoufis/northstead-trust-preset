// Crawls every internal link from the home page outward; verifies each route
// renders a real page (not the 404), flags placeholder hrefs, and checks
// external links respond.
import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';

const exe = path.join(os.homedir(), 'AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe');
const B = 'http://localhost:4173';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const seen = new Set();
const queue = ['/'];
const external = new Set();
const bad = [];
while (queue.length) {
  const route = queue.shift();
  if (seen.has(route)) continue;
  seen.add(route);
  await page.goto(B + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(250);
  const info = await page.evaluate(() => ({
    notFound: document.title.startsWith('Page not found'),
    links: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
  }));
  if (info.notFound && route !== '/no-such-page') bad.push(`404: ${route}`);
  for (const h of info.links) {
    if (!h || h === '#' || h.startsWith('javascript')) bad.push(`placeholder href on ${route}: "${h}"`);
    else if (h.startsWith('/')) {
      const clean = h.split('#')[0];
      if (!seen.has(clean)) queue.push(clean);
    } else if (h.startsWith('http')) external.add(h);
  }
}
await browser.close();

const checkable = [...external].filter((u) => /coreconcepts\.design/.test(u));
for (const u of checkable) {
  try {
    let r = await fetch(u, { method: 'HEAD', redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (r.status >= 400) r = await fetch(u, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (r.status >= 400) bad.push(`external ${r.status}: ${u}`);
  } catch (e) {
    bad.push(`external error: ${u} ${e.message}`);
  }
}
console.log(`internal routes crawled: ${seen.size}`);
console.log(`external links: ${external.size} (checked ${checkable.length})`);
console.log(bad.length ? bad.join('\n') : 'no broken or placeholder links');
