# Northstead Trust — Private Wealth & Trust Company Preset

A complete, multi-page site for a **fictional** independent trust company: homepage, services, audiences, team and bios, board, careers, insights with articles, contact and legal pages. Porcelain paper, night-lake navy and brass; Instrument Serif + Manrope. Team and board portraits are engraved-style monograms, and the north-star mark and wordmark are drawn in code.

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · GSAP 3 (ScrollTrigger, Flip, SplitText) · Lenis · React Router 7 · Lucide.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into ./dist
npm run preview    # serve ./dist on http://localhost:4173
npm run images     # rebuild WebP ladders from assets-src/ (only if images change)
```

## Pages

| Route | What |
|---|---|
| `/` | Seven chapters: Opening, Journey (pick your situation), Disciplines, Independence, People, Perspectives, Conversation |
| `/about/the-northstead-difference` | Pillars, founding story, milestones |
| `/about/our-team`, `/about/our-team/:slug` | Team grid and individual bios |
| `/about/board-of-directors` | Board |
| `/about/careers` | Culture, benefits and open roles |
| `/services`, `/services/:slug` | Four services, each with its people and audiences |
| `/who-we-serve`, `/who-we-serve/:slug` | Six audiences, each with related services and insights |
| `/insights`, `/insights/:slug` | Filterable articles, research documents and an archive |
| `/contact`, `/privacy-policy`, `/usa-patriot-act` | Contact form (opens the visitor's email app) and legal notices |

## Re-skin

- **Firm, services, audiences, story**: `src/data/site.ts` (contact details, mission, services, audiences, the Difference page, navigation and article bylines).
- **People**: `src/data/people.json` (team with bios, board). Portraits are `assets-src/team/<slug>.jpg` and `assets-src/board/<slug>.jpg`; swap the monograms for real photos with the same file names and run `npm run images`.
- **Articles**: `src/data/articles-index.json` (list, categories, research documents) and `src/data/articles.json` (bodies as simple blocks: paragraph, heading, list, quote). Article images are `assets-src/insights/<slug>.jpg`.
- **Careers**: `src/data/careers.ts`.
- **Photos**: `assets-src/photo/`, referenced as `photo/<name>`. Credits in `assets-src/CREDITS.md`.
- **Logo & mark**: `Logo` and `Mark` in `src/components/ui.tsx`; favicons are `public/favicon.png` and `public/apple-touch-icon.png`.
- **Colour & type**: tokens in `src/styles/index.css`. The token names are kept from the base design (`--color-oxblood` holds the navy accent, `--color-legacy` the brass).
- **Legal**: `src/pages/Legal.tsx` holds template privacy and USA PATRIOT Act notices. Have counsel review them, and replace the footer disclosure in `src/components/Footer.tsx`.

## Motion rules

- Every animation lives in a `useGSAP` scope and reverts on unmount; `gsap.matchMedia` gates everything on `prefers-reduced-motion: no-preference`.
- Text reveals split words only, with no overflow masks. Without JavaScript nothing is hidden.
- No pinned sections or scroll hijacking; native scrolling on touch.

## QA

`qa/` holds Playwright scripts (layout audit across routes and widths, interactions, internal links, screenshots). Run them against `npm run preview`; they point at a local Chromium, so adjust `exe` for your machine.

## Deploy

A static SPA: any host works if unknown paths fall back to `index.html` (`public/_redirects` for Netlify, `vercel.json` for Vercel). The demo is `noindex` (in `src/lib/meta.tsx` and `vercel.json`); remove that at launch.

## Demo content

Northstead Trust, its people, board, articles, figures, address and email (`.example`) are fictional, and the phone numbers are placeholders.
