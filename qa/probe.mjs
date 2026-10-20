import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';
const exe = path.join(os.homedir(), 'AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe');
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('console', (m) => console.log('console:', m.type(), m.text()));
page.on('pageerror', (e) => console.log('pageerror:', e.message));
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(250); }
await page.waitForTimeout(2000);
console.log(await page.evaluate(() => {
  const items = [...document.querySelectorAll('[data-index-item]')].map((e) => getComputedStyle(e).opacity);
  const stage = document.querySelector('[data-stage]');
  return { y: scrollY, items, stage: stage && getComputedStyle(stage).clipPath, tabs: document.querySelectorAll('[role=tab]').length };
}));
await page.screenshot({ path: 'qa/shots/probe.png', fullPage: true });
console.log(await page.evaluate(() => [...document.querySelectorAll('[data-index-item]')].map((e) => getComputedStyle(e).opacity + '/' + getComputedStyle(e).transform)));
await browser.close();
