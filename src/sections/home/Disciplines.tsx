import { useLayoutEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { FAMILY_OFFICE_SERVICES, SERVICES, SERVICES_INTRO, type Service } from '../../data/site';
import { Img } from '../../components/Img';
import { ArrowLink, Chapter } from '../../components/ui';
import { gsap, ScrollTrigger, useGSAP } from '../../motion/gsap';

/**
 * Chapter 03. A magazine spread: each discipline gets a different proportion.
 * A sticky (never pinned) folio on the left carries an oversized number that
 * rolls to the discipline currently being read.
 */
export function Disciplines() {
  const root = useRef<HTMLElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);
  const prev = useRef(0);

  useGSAP(
    () => {
      root.current!.querySelectorAll<HTMLElement>('[data-service]').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setCurrent(i),
        });
      });
    },
    { scope: root },
  );

  useLayoutEffect(() => {
    if (prev.current === current || !num.current) return;
    const dir = current > prev.current ? 1 : -1;
    prev.current = current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = gsap.fromTo(num.current, { yPercent: 35 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out' });
    return () => {
      t.kill();
      gsap.set(num.current, { clearProps: 'all' });
    };
  }, [current]);

  return (
    <section ref={root} aria-labelledby="disciplines-title" className="relative section-y">
      <div className="shell">
        <div className="grid-12 gap-y-12">
          {/* Folio */}
          <aside className="col-span-12 lg:col-span-4 xl:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
              <Chapter n="03" label="Services" />
              <h2 id="disciplines-title" data-reveal="words" className="t-h2 mt-6">
                Four disciplines. <em className="italic-accent">One relationship.</em>
              </h2>
              <p data-reveal="up" className="t-body mt-6 max-w-[30rem]">
                {SERVICES_INTRO}
              </p>
              <div aria-hidden className="mt-12 hidden lg:block">
                <span ref={num} className="t-num block text-[clamp(7rem,4rem+6vw,11rem)] leading-[1.05] text-oxblood">
                  {SERVICES[current].n}
                </span>
                <span className="serif mt-2 block text-[1.5rem] leading-tight">{SERVICES[current].name}</span>
                <ol className="mt-8 flex gap-2">
                  {SERVICES.map((s, i) => (
                    <li key={s.slug} className={`h-[3px] w-10 transition-colors duration-500 ${i <= current ? 'bg-oxblood' : 'bg-line'}`} />
                  ))}
                </ol>
              </div>
            </div>
          </aside>

          {/* Spread */}
          <div className="col-span-12 space-y-[clamp(5rem,3rem+6vw,10rem)] lg:col-span-8 lg:border-l lg:border-line lg:pl-[clamp(1.5rem,0.5rem+2.5vw,4rem)] xl:col-span-9">
            <Investment s={SERVICES[0]} />
            <Trustee s={SERVICES[1]} />
            <Planning s={SERVICES[2]} />
            <FamilyOffice s={SERVICES[3]} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Heading({ s }: { s: Service }) {
  return (
    <div>
      <p className="t-num text-[1.05rem] text-oxblood lg:hidden">{s.n}</p>
      <h3 className="t-h2 mt-1">{s.name}</h3>
    </div>
  );
}

function Links({ s }: { s: Service }) {
  return (
    <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-2">
      <ArrowLink to={`/services/${s.slug}`}>Explore {s.name}</ArrowLink>
      {s.brochure && (
        <a href={s.brochure} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-taupe-ink hover:text-oxblood">
          <Download size={15} aria-hidden /> <span className="link-line">Overview (PDF)</span>
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}

/** 01: panoramic photograph, copy in two columns beneath. */
function Investment({ s }: { s: Service }) {
  return (
    <article data-service aria-labelledby={`svc-${s.slug}`}>
      <div data-reveal="media" className="media aspect-[16/9] rounded-sm sm:aspect-[21/9]">
        <Img drift src={s.image} alt="A lone figure on a curved staircase rail, looking out across a sunlit atrium." position={s.imagePosition} sizes="(min-width: 1024px) 66vw, 100vw" className="h-full w-full object-cover" />
      </div>
      <div className="mt-9 grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-2">
        <div id={`svc-${s.slug}`} data-reveal="up">
          <Heading s={s} />
          <p className="serif mt-4 text-[1.35rem] leading-snug text-taupe-ink">{s.line}</p>
        </div>
        <div data-reveal="up" data-delay="0.1">
          <p className="t-body">{s.summary}</p>
          <Links s={s} />
        </div>
      </div>
    </article>
  );
}

/** 02: a square image held to the left, copy dropped below its top edge. */
function Trustee({ s }: { s: Service }) {
  return (
    <article data-service aria-labelledby={`svc-${s.slug}`} className="grid grid-cols-12 gap-x-[clamp(1rem,0.4rem+2vw,2.5rem)] gap-y-8">
      <div className="col-span-12 sm:col-span-6 md:col-span-5">
        <div data-reveal="media" className="media aspect-square rounded-sm">
          <Img src={s.image} alt="Two people in silhouette talking at a table before tall windows." position={s.imagePosition} sizes="(min-width: 1024px) 28vw, (min-width: 640px) 50vw, 100vw" className="h-full w-full object-cover" />
        </div>
      </div>
      <div id={`svc-${s.slug}`} data-reveal="up" className="col-span-12 sm:col-span-6 md:col-span-7 md:pt-[clamp(2rem,1rem+5vw,8rem)]">
        <Heading s={s} />
        <p className="serif mt-4 text-[1.35rem] leading-snug text-taupe-ink">{s.line}</p>
        <p className="t-body mt-5">{s.summary}</p>
        <Links s={s} />
      </div>
    </article>
  );
}

/** 03: the brand's own line as a pull quote, image pushed right. */
function Planning({ s }: { s: Service }) {
  return (
    <article data-service aria-labelledby={`svc-${s.slug}`}>
      <p data-reveal="words" className="serif max-w-[18ch] text-[clamp(2.25rem,1.4rem+3.4vw,4.75rem)] leading-[1.06]" aria-hidden>
        In matters of wealth, <em className="italic-accent">details matter.</em>
      </p>
      <div className="mt-10 grid grid-cols-12 gap-x-[clamp(1rem,0.4rem+2vw,2.5rem)] gap-y-8">
        <div id={`svc-${s.slug}`} data-reveal="up" className="order-2 col-span-12 md:order-1 md:col-span-5">
          <Heading s={s} />
          <p className="t-body mt-5">{s.summary}</p>
          <Links s={s} />
        </div>
        <div className="order-1 col-span-12 md:order-2 md:col-span-7">
          <div data-reveal="media" className="media aspect-[4/3] rounded-sm">
            <Img src={s.image} alt="A man reviewing documents at a table, backlit by a bright wall of windows." position={s.imagePosition} sizes="(min-width: 1024px) 40vw, 100vw" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </article>
  );
}

/** 04: no photograph. A typographic ledger of the ten family office services. */
function FamilyOffice({ s }: { s: Service }) {
  return (
    <article data-service aria-labelledby={`svc-${s.slug}`} className="rounded-sm bg-stone/70 p-[clamp(1.5rem,0.8rem+3vw,4rem)]">
      <div className="grid grid-cols-1 gap-x-10 gap-y-6 xl:grid-cols-2">
        <div id={`svc-${s.slug}`} data-reveal="up">
          <Heading s={s} />
          <p className="serif mt-4 text-[1.35rem] leading-snug text-taupe-ink">{s.line}</p>
        </div>
        <div data-reveal="up" data-delay="0.1">
          <p className="t-body">{s.summary}</p>
        </div>
      </div>
      <div data-reveal="line" className="rule mt-10" />
      <ol data-reveal="stagger" className="mt-2 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
        {FAMILY_OFFICE_SERVICES.map((name, i) => (
          <li key={name} className="flex items-baseline gap-4 border-b border-line/80 py-4">
            <span className="t-num w-7 flex-none text-[0.95rem] text-oxblood">{String(i + 1).padStart(2, '0')}</span>
            <span className="serif text-[1.3rem] leading-snug">{name}</span>
          </li>
        ))}
      </ol>
      <Links s={s} />
    </article>
  );
}
