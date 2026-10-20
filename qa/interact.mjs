// Scripted interaction checks against `npm run preview` on :4173.
import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';

const exe = path.join(os.homedir(), 'AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe');
const B = 'http://localhost:4173';
const browser = await chromium.launch({ executablePath: exe });
const results = [];
const check = (name, ok, extra = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  (${extra})` : ''}`);
const vis = (p, sel) => p.evaluate((s) => getComputedStyle(document.querySelector(s)).visibility, sel);

// ---- Mobile: menu, navigation, accordion
{
  const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(B + '/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.click('button[aria-controls="mobile-menu"]');
  await p.waitForTimeout(1200);
  check('mobile menu opens', (await vis(p, '#mobile-menu')) === 'visible');
  check('mobile menu moves focus inside', await p.evaluate(() => document.getElementById('mobile-menu').contains(document.activeElement)));
  check('page is inert while menu is open', await p.evaluate(() => document.getElementById('page-root').hasAttribute('inert')));
  check('mobile menu has no horizontal overflow', await p.evaluate(() => { const m = document.getElementById('mobile-menu'); return m.scrollWidth <= m.clientWidth + 1; }));
  for (let i = 0; i < 40; i++) await p.keyboard.press('Tab');
  check('Tab stays trapped in menu', await p.evaluate(() => document.getElementById('mobile-menu').contains(document.activeElement)));
  await p.keyboard.press('Escape');
  await p.waitForTimeout(1000);
  check('Escape closes menu', (await vis(p, '#mobile-menu')) === 'hidden');
  check('focus returns to menu button', await p.evaluate(() => document.activeElement?.getAttribute('aria-controls') === 'mobile-menu'));
  await p.click('button[aria-controls="mobile-menu"]');
  await p.waitForTimeout(1200);
  await p.click('#mobile-menu a[href="/about/our-team"]');
  await p.waitForTimeout(2000);
  check('menu link navigates', p.url().endsWith('/about/our-team'));
  check('menu closed after navigation', (await vis(p, '#mobile-menu')) === 'hidden');
  check('scroll at top after navigation', await p.evaluate(() => scrollY < 5));
  await p.goto(B + '/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  await p.click('#acc-btn-retirees');
  await p.waitForTimeout(1300);
  const acc = await p.evaluate(() => ({
    exp: document.getElementById('acc-btn-retirees').getAttribute('aria-expanded'),
    txt: document.getElementById('acc-retirees')?.innerText.includes('After a successful career'),
  }));
  check('mobile accordion opens Retirees with full text', acc.exp === 'true' && acc.txt);
  await p.close();
}

// ---- Desktop: dropdown, journey tabs, route transition, filter, contact
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(B + '/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  const dd = 'nav[aria-label="Primary"] button';
  await p.focus(dd);
  await p.keyboard.press('Enter');
  await p.waitForTimeout(500);
  check('dropdown opens by keyboard', (await p.getAttribute(dd, 'aria-expanded')) === 'true');
  await p.keyboard.press('Escape');
  await p.waitForTimeout(300);
  check('dropdown closes on Escape', (await p.getAttribute(dd, 'aria-expanded')) === 'false');

  await p.focus('#journey-tab-business-owners');
  await p.keyboard.press('ArrowDown');
  await p.keyboard.press('ArrowDown');
  await p.waitForTimeout(1600);
  const tab = await p.evaluate(() => ({
    sel: document.querySelector('[role=tab][aria-selected=true]')?.id,
    panel: document.getElementById('journey-panel').innerText.includes('After a successful career'),
  }));
  check('journey tabs: arrow keys select Retirees', tab.sel === 'journey-tab-retirees' && tab.panel);
  await p.click('#journey-tab-foundations-endowments');
  await p.waitForTimeout(1600);
  check('journey tabs: click selects Foundations', await p.evaluate(() => document.getElementById('journey-panel').innerText.includes('Foundations and Endowments must balance')));
  check('journey indicator follows selection (Flip)', await p.evaluate(() => !!document.querySelector('#journey-tab-foundations-endowments [data-indicator]')));

  await p.evaluate(() => window.scrollTo(0, 0));
  await p.mouse.wheel(0, -200);
  await p.waitForTimeout(900);
  await p.click('nav[aria-label="Primary"] a[href="/insights"]');
  await p.waitForTimeout(350);
  const during = await p.evaluate(() => getComputedStyle(document.getElementById('curtain-mark').parentElement).visibility);
  await p.waitForTimeout(1800);
  const after = await p.evaluate(() => getComputedStyle(document.getElementById('curtain-mark').parentElement).visibility);
  check('route transition curtain shows, then clears', during === 'visible' && after === 'hidden', `${during} -> ${after}`);
  check('document title updates per page', (await p.title()).startsWith('Insights |'));

  await p.click('button[aria-pressed]:has-text("News")');
  await p.waitForTimeout(1500);
  const cats = await p.evaluate(() => [...document.querySelectorAll('[data-card] .t-meta .text-oxblood')].map((e) => e.textContent));
  check('insights filter shows only News', cats.length > 0 && cats.every((c) => c === 'News'), `${cats.length} cards`);
  check('filtered cards fully visible after Flip', await p.evaluate(() => [...document.querySelectorAll('[data-card]')].every((c) => parseFloat(getComputedStyle(c).opacity) > 0.98)));

  await p.goto(B + '/contact', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  await p.click('button[type=submit]');
  check('contact form validates names', (await p.textContent('[role=alert]')).includes('first and last name'));
  await p.fill('input[name=first]', 'Jane');
  await p.fill('input[name=last]', 'Doe');
  await p.check('input[value="Wealth Planning"]');
  const req = p.waitForEvent('request', { predicate: (r) => r.url().startsWith('mailto:'), timeout: 3000 }).catch(() => null);
  await p.click('button[type=submit]');
  const r = await req;
  const mail = r ? decodeURIComponent(r.url()) : '';
  check('contact composes mailto to hello@northstead.example', mail.startsWith('mailto:hello@northstead.example') && mail.includes('Jane Doe'), mail.slice(0, 70));
  check('no page errors in desktop flows', errs.length === 0, errs.join(' | '));
  await p.close();
}

// ---- Reduced motion
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(B + '/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  const hidden = await p.evaluate(() => [...document.querySelectorAll('h1,h2,h3,p')].filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.98).length);
  check('reduced motion: no hidden text on load', hidden === 0, `${hidden} hidden`);
  check('reduced motion: native scrolling (no Lenis)', await p.evaluate(() => !document.documentElement.classList.contains('lenis')));
  await ctx.close();
}

console.log(results.join('\n'));
await browser.close();
