// Layout and visibility audit across routes and viewport widths.
// Usage: node qa/audit.mjs [widths=360,390,...] [routeFilter]
// Requires `npm run preview` on :4173.
import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

const exe = path.join(os.homedir(), 'AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe');
const WIDTHS = (process.argv[2] || '360,390,430,768,1024,1280,1440,1920').split(',').map(Number);
const FILTER = process.argv[3] || '';
const ROUTES = [
  '/',
  '/about/the-legacy-difference',
  '/about/our-team',
  '/about/our-team/tracey-hornbeck',
  '/about/our-team/brian-moore',
  '/about/our-team/ashley-barrett',
  '/about/board-of-directors',
  '/about/careers',
  '/services',
  '/services/investment-management',
  '/services/trustee-services',
  '/services/wealth-planning',
  '/services/family-office',
  '/who-we-serve',
  '/who-we-serve/business-owners',
  '/who-we-serve/corporate-executives',
  '/who-we-serve/retirees',
  '/who-we-serve/multi-generational-families',
  '/who-we-serve/special-needs-families',
  '/who-we-serve/foundations-endowments',
  '/insights',
  '/insights/the-liquidity-event-you-didnt-plan-for',
  '/insights/funding-your-trust',
  '/insights/valuations-and-returns-beyond-2025',
  '/insights/legacy-trust-at-kids-food-basket',
  '/contact',
  '/privacy-policy',
  '/usa-patriot-act',
  '/no-such-page',
];
if (process.argv[4] === 'all') {
  const people = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../src/data/people.json'), 'utf8')).team.map((p) => '/about/our-team/' + p.slug);
  const arts = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../src/data/articles-index.json'), 'utf8')).articles.map((a) => '/insights/' + a.slug);
  for (const r of [...people, ...arts]) if (!ROUTES.includes(r)) ROUTES.push(r);
}
const RUN = ROUTES.filter((r) => r.includes(FILTER));

// Runs in the page after the walk.
function inspect() {
  const vw = document.documentElement.clientWidth;
  const out = { scrollWidth: document.documentElement.scrollWidth, vw, overflow: [], clipped: [], invisible: [], stuck: [], headerOverlap: null, credit: null };
  const ignore = (el) => el.closest('[aria-hidden="true"], .visually-hidden, #mobile-menu, .skip-link, noscript, svg');

  const all = [...document.body.querySelectorAll('*')];
  // 1. Horizontal overflow culprits: elements extending past the viewport,
  // unless an ancestor clips them.
  const clipsX = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (/(hidden|clip)/.test(s.overflowX) || s.position === 'fixed') return true;
    }
    return false;
  };
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (!r.width || ignore(el)) continue;
    if ((r.right > vw + 1 || r.left < -1) && !clipsX(el) && getComputedStyle(el).position !== 'fixed') {
      out.overflow.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} [${Math.round(r.left)},${Math.round(r.right)}]`);
    }
  }
  out.overflow = out.overflow.slice(0, 8);

  // 2. Clipped text: a text node's box falls outside an overflow-hiding ancestor,
  // or a text element is wider than its own box.
  const textEls = all.filter((el) => !ignore(el) && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1));
  for (const el of textEls) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const tr = range.getBoundingClientRect();
    if (!tr.width) continue;
    if (el.scrollWidth > el.clientWidth + 2 && /(hidden|clip|auto|scroll)/.test(getComputedStyle(el).overflowX)) {
      out.clipped.push(`self-overflow: ${el.tagName} "${el.textContent.trim().slice(0, 40)}"`);
      continue;
    }
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (/(hidden|clip)/.test(s.overflowX + s.overflowY)) {
        const pr = p.getBoundingClientRect();
        if (tr.top < pr.top - 1 || tr.bottom > pr.bottom + 1 || tr.left < pr.left - 1 || tr.right > pr.right + 1) {
          out.clipped.push(`${el.tagName} "${el.textContent.trim().slice(0, 40)}" in ${p.tagName}.${String(p.className).slice(0, 40)}`);
        }
        break;
      }
    }
  }
  out.clipped = out.clipped.slice(0, 8);

  // 3. Invisible text after every reveal should have fired.
  for (const el of textEls) {
    if (el.closest('[data-flip-id], [role="tabpanel"] [aria-hidden]')) continue;
    let hidden = '';
    for (let p = el; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (s.visibility === 'hidden') hidden = 'visibility';
      else if (parseFloat(s.opacity) < 0.98) hidden = `opacity ${s.opacity}`;
      else if (s.display === 'none') hidden = 'none';
      if (hidden) break;
    }
    if (hidden && hidden !== 'none') out.invisible.push(`${el.tagName} "${el.textContent.trim().slice(0, 40)}" (${hidden})`);
  }
  out.invisible = out.invisible.slice(0, 8);

  // 4. Reveals stuck mid-animation.
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    const s = getComputedStyle(el);
    if (s.transform !== 'none' && !/matrix\(1, 0, 0, 1, 0, 0\)/.test(s.transform) && el.dataset.reveal !== 'line') out.stuck.push(`${el.tagName} ${el.dataset.reveal} ${s.transform}`);
    if (s.clipPath && s.clipPath !== 'none' && !/inset\(0(px|%)?( 0(px|%)?)*\)/.test(s.clipPath)) out.stuck.push(`${el.tagName} clip ${s.clipPath}`);
  });

  // 5. Credit present and visible.
  const credit = [...document.querySelectorAll('a')].find((a) => a.textContent.includes('Designed by CoreConcepts Design'));
  out.credit = credit ? { href: credit.href, target: credit.target, rel: credit.rel } : null;
  return out;
}

const browser = await chromium.launch({ executablePath: exe });
const report = [];
const jobs = [];
for (const w of WIDTHS) for (const r of RUN) jobs.push([w, r]);

async function run([w, route]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 820 : 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  try {
    await page.goto(`http://localhost:4173${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1600);
    // Header must not cover the first heading at the top of the page.
    const overlap = await page.evaluate(() => {
      const h = document.querySelector('main h1');
      const hd = document.querySelector('header');
      if (!h || !hd) return null;
      return h.getBoundingClientRect().top - hd.getBoundingClientRect().bottom;
    });
    // Walk down in steps so every ScrollTrigger fires, then let animations finish.
    let y = 0;
    for (let i = 0; i < 80; i++) {
      const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      if (y >= max) break;
      y = Math.min(max, y + 450);
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(90);
    }
    await page.waitForTimeout(2600);
    const res = await page.evaluate(inspect);
    res.headerOverlap = overlap;
    report.push({ w, route, errors, ...res });
  } catch (e) {
    report.push({ w, route, errors: [String(e)] });
  }
  await ctx.close();
}

const CONC = 4;
for (let i = 0; i < jobs.length; i += CONC) await Promise.all(jobs.slice(i, i + CONC).map(run));
await browser.close();

let problems = 0;
for (const r of report.sort((a, b) => a.route.localeCompare(b.route) || a.w - b.w)) {
  const issues = [];
  if (r.errors?.length) issues.push('ERRORS ' + r.errors.join(' | '));
  if (r.scrollWidth > r.vw + 1) issues.push(`OVERFLOW scrollWidth ${r.scrollWidth} > ${r.vw}`);
  if (r.overflow?.length) issues.push('overflowing: ' + r.overflow.join(' ; '));
  if (r.clipped?.length) issues.push('CLIPPED: ' + r.clipped.join(' ; '));
  if (r.invisible?.length) issues.push('INVISIBLE: ' + r.invisible.join(' ; '));
  if (r.stuck?.length) issues.push('STUCK: ' + r.stuck.slice(0, 4).join(' ; '));
  if (r.headerOverlap !== null && r.headerOverlap < 0) issues.push(`HEADER covers h1 by ${-r.headerOverlap}px`);
  if (!r.credit || r.credit.target !== '_blank' || !/noopener/.test(r.credit.rel)) issues.push('CREDIT missing or wrong');
  if (issues.length) {
    problems++;
    console.log(`\n✗ ${r.route} @${r.w}\n  ` + issues.join('\n  '));
  }
}
console.log(`\n${report.length} checks, ${problems} with issues`);
fs.writeFileSync(path.join(import.meta.dirname, 'audit-report.json'), JSON.stringify(report, null, 2));
