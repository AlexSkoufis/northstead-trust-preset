// Screenshot helper: node qa/shoot.mjs <path> <width> [height] [scrollY|full] [out]
// Expects a server on http://localhost:4173 (npm run preview).
import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

const exe = path.join(os.homedir(), 'AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe');
const [route = '/', w = '1440', h = '900', at = '0', out] = process.argv.slice(2);
const dir = path.resolve(import.meta.dirname, 'shots');
fs.mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
await page.goto(`http://localhost:4173${route}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);
const file = path.join(dir, out ?? `${route.replace(/\W+/g, '_') || 'home'}-${w}-${at}.png`);
if (at === 'full') {
  // Walk the page so every scroll-triggered reveal fires, then capture.
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 500) {
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(140);
  }
  await page.waitForTimeout(1800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.screenshot({ path: file, fullPage: true });
} else {
  if (+at) {
    await page.mouse.wheel(0, +at);
    await page.waitForTimeout(2200);
  }
  await page.screenshot({ path: file });
}
console.log(file);
await browser.close();
