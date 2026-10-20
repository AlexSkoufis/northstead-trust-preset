import { useRef } from 'react';
import { DIFFERENCE } from '../../data/site';
import { ArrowLink, Chapter } from '../../components/ui';
import { gsap, SplitText, useGSAP, MOTION_OK } from '../../motion/gsap';

// Resting tone for not-yet-read words: 4.6:1 on lake, so the paragraph is
// readable at every scroll position.
const DIM = '#80958f';
const BRIGHT = '#f4f1ec';
const HL = '#c9b08c';

const TENETS = [
  {
    n: 'i',
    title: 'A chartered trust bank',
    body: 'Held to the highest standard of fiduciary responsibility, compliance and governance by a local board of directors.',
  },
  {
    n: 'ii',
    title: 'Decided close to home',
    body: 'The entire management team and Board of Directors live and work in the region, so decisions are made locally and never handed down by remote corporate officers.',
  },
  {
    n: 'iii',
    title: 'No B team',
    body: 'Every member is an experienced and proven contributor, from Certified Financial Planners and Chartered Financial Analysts to JDs and MBAs.',
  },
];

/**
 * Chapter 04. A break in rhythm: no photography, no cards. A dark panel opens
 * to full bleed, then the independence statement brightens word by word.
 */
export function Independence() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 48rem)`, () => {
        gsap.fromTo(
          q('[data-panel]'),
          { clipPath: 'inset(5% 2.5% 0% 2.5% round 28px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 15%', scrub: true } },
        );
      });
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(q('[data-scrub]'), { type: 'words', wordsClass: 'scrub-word' });
        split.words.forEach((w) => {
          gsap.set(w, { color: DIM });
        });
        gsap.to(split.words, {
          color: (_i: number, w: Element) => (w.closest('[data-hl]') ? HL : BRIGHT),
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: { trigger: q('[data-scrub]')[0], start: 'top 82%', end: 'bottom 48%', scrub: 0.6 },
        });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="independence-title" className="relative">
      <div data-panel className="on-dark bg-lake text-porcelain">
        <div className="shell section-y">
          <Chapter n="04" label="The Northstead Difference" light />
          <h2 id="independence-title" data-reveal="words" className="t-display mt-10 max-w-[15ch]">
            Independent by design. <em className="italic-accent">Personal by nature.</em>
          </h2>

          <div className="grid-12 mt-[clamp(4rem,2rem+6vw,9rem)] gap-y-10">
            <p className="t-kicker col-span-12 text-champagne lg:col-span-3 lg:pt-3">{DIFFERENCE.intro}</p>
            <p data-scrub className="serif col-span-12 text-[clamp(1.75rem,1.15rem+2.3vw,3.4rem)] leading-[1.2] lg:col-span-9">
              That&rsquo;s why we remain an entirely <span data-hl>independent trust-only bank.</span> This independence gives us the ability to build
              programs and seize opportunities that are <span data-hl>tailored to you and your family&rsquo;s</span> unique, personal situations.
            </p>
          </div>

          <ul className="mt-[clamp(4rem,2rem+5vw,8rem)] grid grid-cols-1 border-t border-lake-line md:grid-cols-3">
            {TENETS.map((t, i) => (
              <li
                key={t.title}
                data-reveal="up"
                data-delay={String(i * 0.1)}
                className={`py-8 md:px-8 md:py-10 ${i > 0 ? 'border-t border-lake-line md:border-l md:border-t-0' : 'md:pl-0'}`}
              >
                <span className="serif text-[1.1rem] italic text-champagne">{t.n}.</span>
                <h3 className="t-h4 mt-3">{t.title}</h3>
                <p className="t-small mt-3 text-mist">{t.body}</p>
              </li>
            ))}
          </ul>
          <ArrowLink to="/about/the-northstead-difference" className="mt-6 text-porcelain">
            Read the Northstead Difference
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
