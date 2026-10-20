import { useRef } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Img } from '../../components/Img';
import { Magnetic, Mark } from '../../components/ui';
import { SERVICES } from '../../data/site';
import { gsap, useGSAP, wordsIn, MOTION_OK } from '../../motion/gsap';

/**
 * Chapter 01. A split editorial composition: the statement owns ~55% of the
 * grid, a framed photograph the rest. The opening timeline draws the column
 * rules, lifts the headline word by word, then opens the photograph's mask.
 */
export function Opening() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Split now so words are hidden from the first frame; play on cue.
        const words = wordsIn(q('h1')[0], { stagger: 0.06, duration: 1.3, paused: true });
        const tl = gsap.timeline({ delay: 0.25 });
        tl.fromTo(q('[data-col-rule]'), { scaleY: 0 }, { scaleY: 1, duration: 1.8, stagger: 0.08, ease: 'expo.inOut', transformOrigin: '50% 0%' }, 0)
          .fromTo(q('[data-glow]'), { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 2.6, ease: 'power2.out' }, 0)
          .fromTo(q('[data-kicker]'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1 }, 0.35)
          .add(() => void words.play(), 0.45)
          .fromTo(q('[data-frame]'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', clearProps: 'clipPath' }, 0.55)
          .fromTo(q('[data-frame] img'), { scale: 1.3 }, { scale: 1, duration: 2.4, ease: 'expo.out' }, 0.6)
          .fromTo(q('[data-ledger]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2 }, 1.35)
          .fromTo(q('[data-rise]'), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08 }, 1.0)
          .fromTo(q('[data-cue]'), { opacity: 0 }, { opacity: 1, duration: 1 }, 1.6);

        // Scroll: the photograph drifts slower than the page, the card faster.
        gsap.to(q('[data-frame] img'), {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to(q('[data-ledger]'), {
          y: -40,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="opening-title" className="relative isolate overflow-x-clip pt-[var(--header-h)]">
      {/* Architectural column rules and a warm light source */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div data-glow className="absolute -right-[10%] -top-[20%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(closest-side,rgba(201,176,140,0.28),rgba(244,241,236,0))]" />
        <div className="shell relative h-full">
          <div className="grid-12 h-full">
            {[0, 3, 6, 9].map((c) => (
              <span key={c} data-col-rule className="hidden h-full border-l border-ink/[0.07] md:block" style={{ gridColumn: `${c + 1} / span 3` }} />
            ))}
          </div>
        </div>
      </div>

      <div className="shell">
        <div className="grid-12 items-end gap-y-12 pb-12 pt-[clamp(2.5rem,1rem+6vw,7rem)] lg:pb-16">
          <div className="col-span-12 lg:col-span-7 lg:pb-6">
            <p data-kicker data-intro className="t-kicker kicker-row text-taupe-ink">
              <span>Independent trust bank</span>
              <span aria-hidden className="hidden sm:inline">·</span>
              <span>Milwaukee, Wisconsin</span>
            </p>
            <h1 id="opening-title" data-intro className="t-display mt-7 max-w-[13ch] text-ink">
              What you build today <em className="italic-accent">shapes tomorrow.</em>
            </h1>
            <p data-rise data-intro className="t-lede mt-8 max-w-[34rem]">
              Northstead Trust manages investments, administers trusts and plans for families across generations, with advice that is personal and
              decisions that are made right here at home.
            </p>
            <div data-rise data-intro className="mt-10 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link to="/contact" className="btn">
                  Begin a conversation <ArrowRight size={17} strokeWidth={1.7} aria-hidden />
                </Link>
              </Magnetic>
              <Link to="/who-we-serve" className="btn btn-ghost">
                Find your path
              </Link>
            </div>
          </div>

          <div className="relative col-span-12 sm:col-span-10 sm:col-start-2 lg:col-span-5 lg:col-start-8">
            <figure className="relative m-0">
              <div data-frame data-intro className="media aspect-[5/4] rounded-t-[999px] sm:aspect-[4/5] lg:aspect-[4/5]">
                <Img
                  src="photo/hero-horizon"
                  alt="Green hills and a winding road under a sunrise sky with low cloud."
                  sizes="(min-width: 1024px) 40vw, (min-width: 640px) 80vw, 100vw"
                  position="61% 60%"
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
              <div
                data-ledger
                data-intro
                className="absolute bottom-4 left-4 max-w-[calc(100%-2rem)] rounded-sm bg-porcelain/95 px-5 py-4 shadow-[0_20px_50px_-25px_rgba(20,32,46,0.45)] backdrop-blur sm:bottom-6 sm:left-6"
              >
                <div className="flex items-center gap-3">
                  <Mark className="h-9 w-9 flex-none text-taupe" />
                  <div className="min-w-0">
                    <p className="t-kicker text-taupe-ink">Since 2004</p>
                    <p className="serif text-[1.15rem] leading-snug text-ink">Wealth is personal. Legacy is generational.</p>
                  </div>
                </div>
              </div>
              <figcaption className="visually-hidden">Three generations of time on a single shoreline.</figcaption>
            </figure>
          </div>
        </div>

        {/* Ledger strip: the four disciplines and a scroll cue */}
        <div data-rise data-intro className="border-t border-line">
          <div className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
            <ul className="flex flex-wrap gap-x-6 gap-y-1 text-[0.8125rem] font-medium text-taupe-ink">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="inline-flex min-h-9 items-center gap-2 hover:text-oxblood">
                    <span className="t-num text-[0.95rem]">{s.n}</span>
                    <span className="link-line">{s.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <a href="#journey" data-cue className="hidden items-center gap-3 text-[0.8125rem] font-semibold text-ink md:inline-flex">
              <span className="relative block h-9 w-px overflow-hidden bg-line">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_2.2s_cubic-bezier(.65,0,.35,1)_infinite] bg-oxblood" />
              </span>
              Scroll to begin <ArrowDown size={15} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
