// Walks a page at a real viewport size, capturing a frame per viewport of
// scroll (what a visitor actually sees, mid-animation states included), then
// stitches the frames into one tall contact strip.
// Usage: node qa/walk.mjs <route> <width> [height] [settleMs]
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

const exe = path.join(os.homedir(), 'AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe');
const [route = '/', w = '1440', h = '900', settle = '1300'] = process.argv.slice(2);
const W = +w;
const H = +h;
const dir = path.resolve(import.meta.dirname, 'shots');
fs.mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: W, height: H } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(`http://localhost:4173${route}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600);

const frames = [];
let y = 0;
for (let i = 0; i < 40; i++) {
  frames.push(await page.screenshot());
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  if (y >= max) break;
  const step = Math.min(H - 80, max - y);
  // Wheel in small increments so smooth scrolling and triggers behave naturally.
  for (let s = 0; s < step; s += 200) await page.mouse.wheel(0, Math.min(200, step - s));
  await page.waitForTimeout(+settle);
  y = await page.evaluate(() => Math.round(scrollY));
}

const scale = W > 800 ? 0.5 : 1;
const fw = Math.round(W * scale);
const fh = Math.round(H * scale);
const resized = await Promise.all(frames.map((f) => sharp(f).resize(fw, fh).png().toBuffer()));
const gap = 6;
const slug = route.replace(/\W+/g, '_') || 'home';
const out = path.join(dir, `walk${slug}-${W}.png`);
await sharp({ create: { width: fw, height: resized.length * (fh + gap), channels: 3, background: '#ff00aa' } })
  .composite(resized.map((input, i) => ({ input, left: 0, top: i * (fh + gap) })))
  .png()
  .toFile(out);
// Also split into readable pages of up to 4 frames.
for (let p = 0; p * 4 < resized.length; p++) {
  const part = resized.slice(p * 4, p * 4 + 4);
  await sharp({ create: { width: fw, height: part.length * (fh + gap), channels: 3, background: '#ff00aa' } })
    .composite(part.map((input, i) => ({ input, left: 0, top: i * (fh + gap) })))
    .png()
    .toFile(out.replace('.png', `-p${p}.png`));
}
console.log(out, frames.length, 'frames', errors.length ? 'ERRORS: ' + errors.join(' | ') : 'no page errors');
await browser.close();
