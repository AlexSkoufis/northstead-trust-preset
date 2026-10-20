// Captures the homepage intro mid-animation and checks every headline word box
// sits fully inside the viewport and inside its heading (no clipping masks).
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import os from 'node:os';
import path from 'node:path';

const exe = path.join(os.homedir(), 'AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe');
const browser = await chromium.launch({ executablePath: exe });
for (const [w, h] of [[360, 760], [1440, 900]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto('http://localhost:4173/', { waitUntil: 'commit' });
  const frames = [];
  for (const t of [700, 1100, 1500, 2200, 3600]) {
    await page.waitForTimeout(t - (frames.length ? [700, 1100, 1500, 2200, 3600][frames.length - 1] : 0));
    const words = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      if (!h1) return null;
      const hr = h1.getBoundingClientRect();
      const ws = [...h1.querySelectorAll('.split-word')];
      // A clipping ancestor would hide parts of words: report any overflow-hidden ancestor.
      let clip = null;
      for (let p = h1; p; p = p.parentElement) if (/(hidden|clip)/.test(getComputedStyle(p).overflowY)) { clip = p.tagName + '.' + p.className.slice(0, 30); break; }
      return { split: ws.length, outsideX: ws.filter((s) => { const r = s.getBoundingClientRect(); return r.left < 0 || r.right > innerWidth; }).length, h1Right: Math.round(hr.right), vw: innerWidth, clip };
    });
    frames.push(await page.screenshot());
    console.log(`@${w} t=${t}ms`, JSON.stringify(words));
  }
  const fw = w > 800 ? 720 : w;
  const fh = Math.round(h * (fw / w));
  const res = await Promise.all(frames.map((f) => sharp(f).resize(fw).toBuffer()));
  await sharp({ create: { width: fw * res.length + 6 * (res.length - 1), height: fh, channels: 3, background: '#ff00aa' } })
    .composite(res.map((input, i) => ({ input, left: i * (fw + 6), top: 0 })))
    .png()
    .toFile(path.join(import.meta.dirname, 'shots', `midanim-${w}.png`));
  await page.close();
}
await browser.close();
