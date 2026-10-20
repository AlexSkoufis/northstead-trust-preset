import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import { AUDIENCES } from '../../data/site';
import { Img } from '../../components/Img';
import { ArrowLink, Chapter } from '../../components/ui';
import { Flip, gsap, useGSAP, MOTION_OK, START } from '../../motion/gsap';
import { useMedia, DESKTOP } from '../../lib/useMedia';

/**
 * Chapter 02. Audience-first: visitors locate themselves before they see a
 * single service. Desktop is a numbered editorial index driving a large
 * photographic panel; mobile is a tap accordion with nothing hidden.
 */
export function Journey() {
  const desktop = useMedia(DESKTOP);
  return (
    <section id="journey" aria-labelledby="journey-title" className="relative bg-paper section-y">
      <div className="shell">
        <div className="grid-12 gap-y-8">
          <div className="col-span-12 lg:col-span-5">
            <Chapter n="02" label="Who we serve" />
            <h2 id="journey-title" data-reveal="words" className="t-h2 mt-6 max-w-[14ch]">
              Every journey begins somewhere <em className="italic-accent">different.</em>
            </h2>
          </div>
          <p data-reveal="up" className="t-lede col-span-12 self-end lg:col-span-5 lg:col-start-8">
            A business sale, a career at its peak, a family across three generations. Choose where you are today, and see how Northstead Trust helps.
          </p>
        </div>
        <div className="mt-[clamp(3rem,2rem+4vw,6rem)]">{desktop ? <JourneyIndex /> : <JourneyAccordion />}</div>
      </div>
    </section>
  );
}

function JourneyIndex() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const flipState = useRef<Flip.FlipState | null>(null);
  const prev = useRef(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number) => {
    if (i === active) return;
    flipState.current = Flip.getState(root.current!.querySelector('[data-indicator]'));
    setActive(i);
  };

  // Reveal the index once, as a sequence.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from('[data-index-item]', { opacity: 0, x: -24, duration: 1, stagger: 0.07, scrollTrigger: { trigger: root.current, start: START, once: true } });
        gsap.fromTo(
          '[data-stage]',
          { clipPath: 'inset(0% 0% 0% 100%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', clearProps: 'clipPath', scrollTrigger: { trigger: root.current, start: START, once: true } },
        );
      });
    },
    { scope: root },
  );

  // State change: Flip the indicator, wipe in the new photograph, lift the copy.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prev.current === active) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (flipState.current && !reduce) {
        Flip.from(flipState.current, { duration: 0.8, ease: 'expo.inOut' });
      }
      const imgs = el.querySelectorAll<HTMLElement>('[data-slide]');
      const incoming = imgs[active];
      gsap.set(imgs, { zIndex: 0 });
      gsap.set(imgs[prev.current], { zIndex: 1 });
      gsap.set(incoming, { zIndex: 2 });
      if (!reduce) {
        gsap.fromTo(incoming, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.inOut' });
        gsap.fromTo(incoming.querySelector('img'), { scale: 1.18, xPercent: 4 }, { scale: 1, xPercent: 0, duration: 1.6, ease: 'expo.out' });
        gsap.from(el.querySelectorAll('[data-copy] > *'), { opacity: 0, y: 18, duration: 0.9, stagger: 0.06, ease: 'expo.out' });
      }
    }, el);
    prev.current = active;
    flipState.current = null;
    return () => ctx.kill();
  }, [active]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = AUDIENCES.length;
    let next = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % n;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + n) % n;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = n - 1;
    if (next >= 0) {
      e.preventDefault();
      select(next);
      tabs.current[next]?.focus();
    }
  };

  const a = AUDIENCES[active];

  return (
    <div ref={root} className="grid-12 items-start">
      <div role="tablist" aria-orientation="vertical" aria-label="Who we serve" className="col-span-5 border-t border-line">
        {AUDIENCES.map((item, i) => {
          const on = i === active;
          return (
            <button
              key={item.slug}
              ref={(b) => {
                tabs.current[i] = b;
              }}
              data-index-item
              role="tab"
              id={`journey-tab-${item.slug}`}
              aria-selected={on}
              aria-controls="journey-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={`group relative flex w-full items-baseline gap-5 border-b border-line py-5 pl-6 pr-2 text-left transition-colors duration-500 ${
                on ? 'text-ink' : 'text-ink/45 hover:text-ink/80'
              }`}
            >
              {on && <span data-indicator className="absolute bottom-[-1px] left-0 top-[-1px] w-[3px] bg-oxblood" aria-hidden />}
              <span className={`t-num w-8 flex-none text-[1.05rem] ${on ? 'text-oxblood' : ''}`}>{item.n}</span>
              <span className="serif min-w-0 text-[clamp(1.6rem,0.9rem+1.35vw,2.6rem)] leading-[1.1]">{item.name}</span>
            </button>
          );
        })}
      </div>

      <div id="journey-panel" role="tabpanel" aria-labelledby={`journey-tab-${a.slug}`} className="col-span-7 lg:pl-6 xl:pl-12">
        <div data-stage className="media aspect-[3/2] rounded-sm">
          {AUDIENCES.map((item, i) => (
            <div key={item.slug} data-slide className="absolute inset-0" style={{ zIndex: i === active ? 2 : 0 }} aria-hidden={i !== active}>
              <Img
                src={item.image}
                alt={i === active ? item.alt : ''}
                position={item.imagePosition}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          <span className="absolute right-4 top-4 z-10 rounded-full bg-porcelain/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
            {a.n} / 06
          </span>
        </div>
        <div data-copy key={a.slug} className="mt-9 grid grid-cols-12 gap-x-6 gap-y-5">
          <p className="t-h3 col-span-12 xl:col-span-5">{a.prompt}</p>
          <div className="col-span-12 xl:col-span-7">
            <p className="t-body">{a.body}</p>
            <ArrowLink to={`/who-we-serve/${a.slug}`} className="mt-6">
              Planning for {a.name}
            </ArrowLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function JourneyAccordion() {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(0);

  useLayoutEffect(() => {
    const el = root.current?.querySelector<HTMLElement>(`[data-acc-panel="${open}"]`);
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from(el, { height: 0, duration: 0.8, ease: 'expo.inOut', clearProps: 'height' });
      gsap.from(el.querySelectorAll('[data-acc-item]'), { opacity: 0, y: 16, duration: 0.8, stagger: 0.06, delay: 0.2 });
    }, root);
    return () => ctx.revert();
  }, [open]);

  return (
    <div ref={root} className="border-t border-line" data-reveal="stagger">
      {AUDIENCES.map((item, i) => {
        const on = i === open;
        return (
          <div key={item.slug} className="border-b border-line">
            <h3 className="m-0">
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`acc-${item.slug}`}
                id={`acc-btn-${item.slug}`}
                onClick={() => setOpen(on ? -1 : i)}
                className="flex min-h-16 w-full items-center gap-4 py-5 text-left"
              >
                <span className={`t-num w-7 flex-none text-[1rem] ${on ? 'text-oxblood' : 'text-taupe-ink'}`}>{item.n}</span>
                <span className="serif min-w-0 flex-1 text-[clamp(1.5rem,1.1rem+2vw,2.25rem)] leading-[1.12]">{item.name}</span>
                <span
                  className={`grid h-10 w-10 flex-none place-items-center rounded-full border border-line transition-transform duration-500 ${on ? 'rotate-45 bg-ink text-porcelain' : ''}`}
                  aria-hidden
                >
                  <Plus size={18} strokeWidth={1.6} />
                </span>
              </button>
            </h3>
            {on && (
              <div id={`acc-${item.slug}`} role="region" aria-labelledby={`acc-btn-${item.slug}`} data-acc-panel={i} className="overflow-hidden">
                <div className="pb-8">
                  <div data-acc-item className="media aspect-[16/10] rounded-sm">
                    <Img src={item.image} alt={item.alt} position={item.imagePosition} sizes="100vw" className="h-full w-full object-cover" />
                  </div>
                  <p data-acc-item className="t-h4 mt-6">
                    {item.prompt}
                  </p>
                  <p data-acc-item className="t-body mt-3">
                    {item.body}
                  </p>
                  <div data-acc-item>
                    <ArrowLink to={`/who-we-serve/${item.slug}`} className="mt-5">
                      Planning for {item.name}
                    </ArrowLink>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
