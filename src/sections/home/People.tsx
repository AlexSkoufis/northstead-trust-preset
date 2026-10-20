import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Img } from '../../components/Img';
import { ArrowLink, Chapter } from '../../components/ui';
import { personBySlug, plainName, credentials, type Person } from '../../lib/content';
import { gsap, useGSAP, MOTION_OK } from '../../motion/gsap';

const FEATURED = ['eleanor-voss', 'thomas-reinholt', 'claire-ashdown', 'james-whitcombe', 'marcus-delaney', 'priya-natarajan'];

// Columns of the staggered gallery, and how far each drifts while scrolling.
const COLUMNS = [
  { people: [0, 3], drift: 0, offset: 'lg:pt-0' },
  { people: [1, 4], drift: -70, offset: 'lg:pt-40' },
  { people: [2, 5], drift: 30, offset: 'lg:pt-16' },
];

const firstSentence = (p: Person) => {
  const t = p.intro[0] ?? '';
  const m = t.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : t).trim();
};

/**
 * Chapter 05. Leadership as an asymmetric portrait gallery. Each column
 * drifts at its own speed on desktop; every name, title and introduction is
 * always visible as text below its portrait (nothing lives behind hover).
 */
export function People() {
  const root = useRef<HTMLElement>(null);
  const people = FEATURED.map((s) => personBySlug(s)!).filter(Boolean);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 64rem)`, () => {
        root.current!.querySelectorAll<HTMLElement>('[data-col]').forEach((col) => {
          const d = Number(col.dataset.col);
          if (!d) return;
          gsap.fromTo(col, { y: -d / 2 }, { y: d / 2, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="people-title" className="relative overflow-x-clip section-y">
      <div className="shell">
        <div className="grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <Chapter n="05" label="Our team" />
            <h2 id="people-title" data-reveal="words" className="t-h2 mt-6 max-w-[16ch]">
              The people behind <em className="italic-accent">the promise.</em>
            </h2>
          </div>
          <blockquote className="col-span-12 m-0 self-end lg:col-span-4 lg:col-start-9">
            <p data-reveal="up" className="serif text-[clamp(1.35rem,1.1rem+0.9vw,1.85rem)] leading-[1.3]">
              &ldquo;We don&rsquo;t have a B team; every member is an experienced and proven contributor.&rdquo;
            </p>
            <footer data-reveal="up" className="t-meta mt-4">
              The Northstead Difference
            </footer>
          </blockquote>
        </div>

        <div className="mt-[clamp(3.5rem,2rem+5vw,7rem)] grid grid-cols-1 gap-x-[clamp(1.25rem,0.5rem+2.5vw,3.5rem)] gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {COLUMNS.map((col, ci) => (
            <div key={ci} data-col={col.drift} className={`contents lg:block ${col.offset}`}>
              {col.people.map((pi, k) => {
                const p = people[pi];
                if (!p) return null;
                // Phones: portraits alternate left and right at 84% width.
                const side = (ci * 2 + k) % 2 ? 'max-md:ml-auto' : '';
                return <Portrait key={p.slug} p={p} tall={(ci + k) % 2 === 0} className={`max-md:w-[84%] ${side} ${k > 0 ? 'lg:mt-20' : ''}`} />;
              })}
            </div>
          ))}
        </div>

        <div className="mt-[clamp(4rem,2rem+5vw,8rem)] flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <p className="t-body max-w-[36rem]">
            Executive leadership, wealth advisors, portfolio managers and client service, all under one roof at 700 Lakefront Plaza.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <ArrowLink to="/about/our-team">Meet the full team</ArrowLink>
            <ArrowLink to="/about/board-of-directors">Board of Directors</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function Portrait({ p, tall, className = '' }: { p: Person; tall: boolean; className?: string }) {
  return (
    <article className={`group ${className}`}>
      <Link to={`/about/our-team/${p.slug}`} className="block" aria-label={`${p.name}, ${p.title}. Read biography`}>
        <div data-reveal="media" className={`media portrait-tone zoom-on-hover rounded-sm ${tall ? 'aspect-[3/4]' : 'aspect-[4/5]'}`}>
          <Img src={`team/${p.slug}`} alt={`Portrait of ${plainName(p.name)}`} position="50% 22%" sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 100vw" className="h-full w-full object-cover" />
        </div>
      </Link>
      <div data-reveal="up" className="mt-5">
        <h3 className="t-h4">
          <Link to={`/about/our-team/${p.slug}`} className="link-line">
            {plainName(p.name)}
          </Link>
          {credentials(p.name) && <span className="t-meta ml-2 align-middle">{credentials(p.name)}</span>}
        </h3>
        <p className="t-meta mt-1">{p.title}</p>
        <p className="t-small mt-3 text-ink-soft">{firstSentence(p)}</p>
      </div>
    </article>
  );
}
