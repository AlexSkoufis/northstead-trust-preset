// Loads pages WITHOUT scrolling and lists reveal elements inside the first
// viewport that are still hidden after the intro settles.
import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';
const exe = path.join(os.homedir(), 'AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe');
const routes = (process.argv[2] || '/,/contact,/services,/about/our-team,/insights,/who-we-serve/retirees,/about/the-legacy-difference').split(',');
const widths = (process.argv[3] || '390,1440').split(',').map(Number);
const browser = await chromium.launch({ executablePath: exe });
for (const w of widths) for (const r of routes) {
  const page = await browser.newPage({ viewport: { width: w, height: w < 768 ? 820 : 900 } });
  await page.goto('http://localhost:4173' + r, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3200);
  const bad = await page.evaluate(() => [...document.querySelectorAll('[data-reveal], [data-intro]')].filter((el) => {
    const b = el.getBoundingClientRect();
    if (b.top > innerHeight || b.bottom < 0) return false;
    return parseFloat(getComputedStyle(el).opacity) < 0.98 || /inset\((?!0)/.test(getComputedStyle(el).clipPath);
  }).map((el) => `${el.tagName}[${el.dataset.reveal || 'intro'}] "${el.textContent.trim().slice(0, 30)}" top=${Math.round(el.getBoundingClientRect().top)}`));
  console.log(`${r} @${w}:`, bad.length ? bad : 'ok');
  await page.close();
}
await browser.close();
