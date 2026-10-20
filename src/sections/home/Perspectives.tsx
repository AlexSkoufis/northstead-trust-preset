import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Img, hasImg } from '../../components/Img';
import { ArrowLink, Chapter } from '../../components/ui';
import { articleBySlug, fmtDate, RESEARCH, type Article } from '../../lib/content';
import { gsap, useGSAP } from '../../motion/gsap';
import { useMedia, FINE_POINTER } from '../../lib/useMedia';

const FEATURED = 'when-the-money-arrives-all-at-once';
const INDEX = [
  'a-day-of-service-on-the-lakefront',
  'northstead-welcomes-rebecca-tran',
  'funding-your-trust',
  'bonds-are-back',
  'the-estate-documents-that-matter-most',
];

/**
 * Chapter 06. Insights as an independent publication: a featured column with
 * its author, a typographic index of recent pieces (with a cursor-following
 * preview on desktop), and the latest market research as plain documents.
 */
export function Perspectives() {
  const featured = articleBySlug(FEATURED)!;
  const list = INDEX.map((s) => articleBySlug(s)!).filter(Boolean);

  return (
    <section aria-labelledby="perspectives-title" className="relative bg-paper section-y">
      <div className="shell">
        {/* Masthead */}
        <div className="flex flex-col gap-6 border-b border-ink pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Chapter n="06" label="Insights" />
            <h2 id="perspectives-title" data-reveal="words" className="t-h1 mt-6">
              Perspectives <em className="italic-accent">that matter.</em>
            </h2>
          </div>
          <p data-reveal="up" className="t-body max-w-[26rem] lg:text-right">
            Market commentary, investment perspectives and community news, written by the people who manage Northstead Trust portfolios.
          </p>
        </div>

        <div className="grid-12 mt-12 gap-y-14">
          <Featured a={featured} />
          <IndexList items={list} />
        </div>

        <Research />
      </div>
    </section>
  );
}

function Featured({ a }: { a: Article }) {
  return (
    <article className="group col-span-12 lg:col-span-7 lg:border-r lg:border-line lg:pr-[clamp(1.5rem,0.5rem+3vw,4rem)]">
      <Link to={`/insights/${a.slug}`} className="block">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6">
          <div className="col-span-12 sm:col-span-5">
            <div data-reveal="media" className="media portrait-tone zoom-on-hover aspect-[4/5] rounded-sm">
              <Img src="team/marcus-delaney" alt="Monogram portrait of Marcus Delaney, CFP, Senior Wealth Advisor" position="50% 20%" sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 100vw" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="col-span-12 flex flex-col sm:col-span-7">
            <p className="t-kicker text-oxblood">Featured {a.category}</p>
            <h3 data-reveal="up" className="t-h2 mt-4">
              <span className="link-line">{a.title}</span>
            </h3>
            <p className="t-meta mt-5">
              By {a.author} <span aria-hidden>·</span> {fmtDate(a.date, true)}
            </p>
            <p className="t-body mt-5">{a.excerpt}</p>
            <span className="arrow-link mt-auto pt-6">
              <span className="link-line">Read the perspective</span>
              <span className="arrow-dot" aria-hidden>
                &rarr;
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function IndexList({ items }: { items: Article[] }) {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const fine = useMedia(FINE_POINTER);
  const [hover, setHover] = useState<string | null>(null);
  const moveRef = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  useGSAP(
    () => {
      if (!fine || !preview.current) return;
      moveRef.current = {
        x: gsap.quickTo(preview.current, 'x', { duration: 0.55, ease: 'power3.out' }),
        y: gsap.quickTo(preview.current, 'y', { duration: 0.55, ease: 'power3.out' }),
      };
    },
    { scope: root, dependencies: [fine] },
  );

  useGSAP(
    () => {
      if (!preview.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.to(preview.current, { autoAlpha: hover ? 1 : 0, scale: hover ? 1 : 0.92, duration: 0.45, ease: 'power3.out' });
    },
    { scope: root, dependencies: [hover] },
  );

  const onMove = (e: React.PointerEvent) => {
    if (!fine || !root.current || !moveRef.current) return;
    const r = root.current.getBoundingClientRect();
    // Sits to the left of the cursor so the hovered title stays readable,
    // and is clamped so it can never extend past the viewport edge.
    const w = 240;
    const x = Math.max(-r.left + 12, Math.min(e.clientX - r.left - w - 28, r.width - w));
    moveRef.current.x(x);
    moveRef.current.y(e.clientY - r.top - 110);
  };

  const hovered = items.find((i) => i.slug === hover);

  return (
    <div ref={root} className="relative col-span-12 lg:col-span-5" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
      <p className="t-kicker text-taupe-ink">Recently published</p>
      <ol data-reveal="stagger" className="mt-4 border-t border-line">
        {items.map((a) => (
          <li key={a.slug} className="border-b border-line">
            <Link
              to={`/insights/${a.slug}`}
              onPointerEnter={() => fine && setHover(a.slug)}
              onFocus={() => setHover(null)}
              className="group grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 py-5 transition-colors duration-300 hover:text-oxblood"
            >
              <span className="t-meta pt-1">
                <time dateTime={a.date}>{fmtDate(a.date)}</time>
              </span>
              <span className="min-w-0">
                <span className="t-kicker block text-[0.6875rem] text-taupe-ink">{a.category}</span>
                <span className="serif mt-1 block text-[1.4rem] leading-[1.22]">
                  <span className="link-line">{a.title}</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <ArrowLink to="/insights" className="mt-6">
        All insights
      </ArrowLink>

      {fine && (
        <div
          ref={preview}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-10 w-[15rem] overflow-hidden rounded-sm shadow-[0_30px_60px_-30px_rgba(20,32,46,0.55)]"
          style={{ visibility: 'hidden', opacity: 0 }}
        >
          {hovered && hasImg(`insights/${hovered.image}`) && (
            <Img src={`insights/${hovered.image}`} alt="" sizes="240px" className="aspect-[4/3] h-auto w-full object-cover" />
          )}
        </div>
      )}
    </div>
  );
}

function Research() {
  const items = RESEARCH.slice(0, 4);
  return (
    <div className="mt-[clamp(4rem,2rem+4vw,7rem)] rounded-sm bg-porcelain p-[clamp(1.25rem,0.8rem+2vw,2.5rem)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="t-kicker text-taupe-ink">Market research</p>
          <h3 className="t-h4 mt-2">Daily snapshots and weekly summaries</h3>
        </div>
        <p className="t-small max-w-[26rem] text-ink-soft">Your daily look at key performers in the marketplace, published as PDF documents.</p>
      </div>
      <ul data-reveal="stagger" className="mt-7 grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-line sm:grid-cols-2 xl:grid-cols-4">
        {items.map((r) => (
          <li key={r.href} className="bg-porcelain">
            <a href={r.href} target="_blank" rel="noopener noreferrer" className="group flex h-full items-start gap-3 bg-paper p-5 transition-colors hover:bg-stone/60">
              <FileText size={18} strokeWidth={1.5} className="mt-1 flex-none text-oxblood" aria-hidden />
              <span className="min-w-0">
                <span className="t-meta block">{r.category}</span>
                <span className="mt-1 block font-semibold leading-snug">
                  <span className="link-line">{r.title}</span>
                </span>
                <span className="visually-hidden"> (PDF, opens in a new tab)</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
