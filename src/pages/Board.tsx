import { useRef, useState } from 'react';
import { Page } from '../components/Page';
import { Breadcrumb } from '../components/Breadcrumb';
import { Img } from '../components/Img';
import { ArrowLink, Kicker } from '../components/ui';
import { BOARD } from '../lib/content';
import { gsap, useGSAP } from '../motion/gsap';

const INTRO = 'We are guided by a highly distinguished Board of Directors who provide oversight and governance on a local level.';

/**
 * A masthead rather than a card grid: names set large, roles beside them.
 * Every row carries its own small portrait; on wide screens a large sticky
 * portrait follows whichever director is hovered.
 */
export default function Board() {
  const [active, setActive] = useState(0);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stage.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo(stage.current.querySelector('[data-current]'), { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.out', clearProps: 'clipPath' });
    },
    { dependencies: [active], scope: stage },
  );

  const m = BOARD[active];

  return (
    <Page title="Board of Directors" description={INTRO}>
      <header className="shell pt-[calc(var(--header-h)+clamp(2.5rem,1.5rem+4vw,6rem))]">
        <Breadcrumb trail={[{ label: 'About' }, { label: 'Board of Directors' }]} />
        <Kicker className="mt-10">Governance</Kicker>
        <h1 data-reveal="words" className="t-h1 mt-6 max-w-[20ch]">
          Overseen locally, by people who <em className="italic-accent">live here too.</em>
        </h1>
        <p data-reveal="up" className="t-lede mt-8 max-w-[40rem]">
          {INTRO} To this day, the entire management team and Board of Directors live and work in the region.
        </p>
      </header>

      <section aria-labelledby="board-list" className="shell section-y">
        <h2 id="board-list" className="visually-hidden">
          Meet our Board of Directors
        </h2>
        <div className="grid-12 items-start">
          <ol data-reveal="stagger" className="col-span-12 border-t border-ink lg:col-span-8">
            {BOARD.map((b, i) => (
              <li
                key={b.slug}
                onPointerEnter={() => setActive(i)}
                className={`grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-x-4 border-b border-line py-5 transition-colors duration-300 sm:grid-cols-[4.5rem_minmax(0,1fr)] md:grid-cols-[4.5rem_minmax(0,1.2fr)_minmax(0,1fr)] md:gap-x-8 ${
                  i === active ? 'lg:bg-paper' : ''
                }`}
              >
                <div className="media portrait-tone aspect-[4/5] w-full rounded-sm">
                  <Img src={`board/${b.slug}`} alt={`Portrait of ${b.name}`} position="50% 22%" sizes="80px" className="h-full w-full object-cover" />
                </div>
                <p className="serif min-w-0 text-[clamp(1.5rem,1.1rem+1.4vw,2.4rem)] leading-[1.1]">{b.name}</p>
                <p className="col-start-2 mt-1 min-w-0 md:col-start-3 md:mt-0">
                  <span className="block text-[0.9375rem] font-semibold leading-snug">{b.role}</span>
                  <span className="t-meta block">{b.org}</span>
                </p>
              </li>
            ))}
          </ol>

          <div ref={stage} aria-hidden className="col-span-4 hidden pl-10 lg:block">
            <div className="sticky top-[calc(var(--header-h)+2rem)]">
              <div data-current key={m.slug} className="media portrait-tone aspect-[3/4] rounded-sm">
                <Img src={`board/${m.slug}`} alt="" position="50% 22%" sizes="30vw" className="h-full w-full object-cover" />
              </div>
              <p className="serif mt-5 text-[1.6rem] leading-tight">{m.name}</p>
              <p className="t-meta mt-1">
                {m.role}, {m.org}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3">
          <ArrowLink to="/about/the-northstead-difference">The Northstead Difference</ArrowLink>
          <ArrowLink to="/about/our-team/eleanor-voss">Eleanor Voss, President &amp; CEO</ArrowLink>
        </div>
      </section>
    </Page>
  );
}
