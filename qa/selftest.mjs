// Proves the audit's detectors fire: inject known-bad elements and inspect.
import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
const exe = path.join(os.homedir(), 'AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe');
const src = fs.readFileSync(path.join(import.meta.dirname, 'audit.mjs'), 'utf8');
const fnSrc = src.slice(src.indexOf('function inspect()'), src.indexOf('const browser'));
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
await page.goto('http://localhost:4173/contact', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.evaluate(() => {
  const m = document.querySelector('main');
  m.insertAdjacentHTML('beforeend', `
    <div style="width:600px;background:red">WIDE BLOCK causing overflow</div>
    <div style="height:12px;overflow:hidden"><p style="font-size:40px">Clipped headline text</p></div>
    <p style="opacity:0">Invisible paragraph text</p>
    <div data-reveal="up" style="transform:translateY(30px)">Stuck reveal</div>`);
});
const res = await page.evaluate(new Function(`${fnSrc}; return inspect();`));
console.log(JSON.stringify({ scrollWidth: res.scrollWidth, vw: res.vw, overflow: res.overflow.slice(0, 2), clipped: res.clipped, invisible: res.invisible, stuck: res.stuck }, null, 1));
await browser.close();
