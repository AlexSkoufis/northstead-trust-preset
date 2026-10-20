import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Play } from 'lucide-react';
import { Page } from '../components/Page';
import { Breadcrumb } from '../components/Breadcrumb';
import { Img } from '../components/Img';
import { Kicker } from '../components/ui';
import { ARTICLES, RESEARCH, cover, fmtDate, type Article } from '../lib/content';
import { Flip, gsap } from '../motion/gsap';
import { SERVICES } from '../data/site';

const FILTERS = ['All', 'Perspectives', 'News', 'In The Community'] as const;
type Filter = (typeof FILTERS)[number];

// Earlier investment perspectives, linked as PDFs. Replace the hrefs with real files.
const ARCHIVE = [
  { title: 'Reading an Inverted Curve', href: '#' },
  { title: 'What the Fed Is Watching', href: '#' },
  { title: 'Lessons From a Crypto Collapse', href: '#' },
  { title: 'When Banks Wobble', href: '#' },
  { title: 'The Path of Rates', href: '#' },
];

const matches = (a: Article, f: Filter) => f === 'All' || (f === 'Perspectives' ? a.category === 'Perspectives' || a.category === 'Investment Insights' : a.category === f);

/** A financial publication: masthead, lead story, filterable index, research desk. */
export default function Insights() {
  const [filter, setFilter] = useState<Filter>('All');
  const grid = useRef<HTMLUListElement>(null);
  const flip = useRef<Flip.FlipState | null>(null);
  const lead = ARTICLES.find((a) => a.category === 'Perspectives' && !a.video)!;
  const rest = ARTICLES.filter((a) => a.slug !== lead.slug);
  const shown = rest.filter((a) => matches(a, filter));

  const choose = (f: Filter) => {
    if (f === filter) return;
    if (grid.current) flip.current = Flip.getState(grid.current.querySelectorAll('[data-card]'));
    setFilter(f);
  };

  useLayoutEffect(() => {
    if (!flip.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      flip.current = null;
      return;
    }
    const ctx = gsap.context(() => {
      Flip.from(flip.current!, {
        duration: 0.8,
        ease: 'expo.inOut',
        absolute: true,
        stagger: 0.02,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.2 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.3 }),
      });
    });
    flip.current = null;
    return () => ctx.revert();
  }, [filter]);

  const latest = ARTICLES[0];

  return (
    <Page title="Insights" description="Market commentary, investment perspectives, news and community updates from Northstead Trust in Milwaukee.">
      <header className="shell pt-[calc(var(--header-h)+clamp(2.5rem,1.5rem+4vw,6rem))]">
        <Breadcrumb trail={[{ label: 'Insights' }]} />
        <div className="mt-10 flex flex-col gap-6 border-b-2 border-ink pb-6 md:flex-row md:items-end md:justify-between">
          <h1 data-reveal="words" className="t-display">
            Insights
          </h1>
          <p className="t-meta md:text-right">
            Latest issue <time dateTime={latest.date}>{fmtDate(latest.date, true)}</time>
            <br />
            Milwaukee, Wisconsin
          </p>
        </div>
        <p data-reveal="up" className="t-lede mt-6 max-w-[40rem]">
          Stay current with the latest press releases, news, and events on Northstead Trust.
        </p>
      </header>

      {/* Lead story */}
      <section aria-label="Lead story" className="shell mt-[clamp(3rem,2rem+3vw,5rem)]">
        <Link to={`/insights/${lead.slug}`} className="group grid-12 gap-y-8 border-b border-line pb-[clamp(3rem,2rem+3vw,5rem)]">
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <CoverImg a={lead} aspect="aspect-[4/5]" sizes="(min-width: 768px) 36vw, 100vw" priority portraits />
          </div>
          <div className="col-span-12 flex flex-col md:col-span-7 lg:col-span-7 lg:col-start-6">
            <p className="t-kicker text-oxblood">Lead perspective</p>
            <h2 data-reveal="words" className="t-h1 mt-4">
              {lead.title}
            </h2>
            <p className="t-meta mt-5">
              {lead.author && <>By {lead.author} · </>}
              {fmtDate(lead.date, true)}
            </p>
            <p className="t-lede mt-6 max-w-[40rem]">{lead.excerpt}</p>
            <span className="arrow-link mt-8">
              <span className="link-line">Read the perspective</span>
              <span className="arrow-dot" aria-hidden>
                &rarr;
              </span>
            </span>
          </div>
        </Link>
      </section>

      {/* Index */}
      <section aria-labelledby="index-title" className="shell section-y pt-[clamp(3rem,2rem+3vw,5rem)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <h2 id="index-title" className="t-h3">
            The archive
          </h2>
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => choose(f)}
                className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold transition-colors ${
                  filter === f ? 'bg-ink text-porcelain' : 'border border-line hover:border-ink'
                }`}
              >
                {f}
                <span className={`ml-2 text-xs ${filter === f ? 'text-mist' : 'text-taupe-ink'}`}>{rest.filter((a) => matches(a, f)).length}</span>
              </button>
            ))}
          </div>
        </div>
        <p className="visually-hidden" aria-live="polite">
          Showing {shown.length} {filter === 'All' ? 'articles' : filter}
        </p>

        <ul ref={grid} className="mt-10 grid grid-cols-1 gap-x-[clamp(1rem,0.4rem+2vw,2.5rem)] gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((a, i) => (
            <li key={a.slug} data-card data-flip-id={a.slug} className={i % 3 === 1 ? 'lg:translate-y-10' : ''}>
              <Card a={a} />
            </li>
          ))}
        </ul>
      </section>

      {/* Research desk */}
      <section aria-labelledby="research" className="bg-paper">
        <div className="shell section-y">
          <div className="grid-12 gap-y-12">
            <div className="col-span-12 lg:col-span-4">
              <Kicker>Research desk</Kicker>
              <h2 id="research" className="t-h2 mt-4">
                Market snapshots and summaries
              </h2>
              <p className="t-body mt-5">Your daily look at key performers in the marketplace, plus weekly summaries. Each opens as a PDF.</p>
            </div>
            <div className="col-span-12 lg:col-span-7 lg:col-start-6">
              <ul className="border-t border-ink">
                {RESEARCH.map((r) => (
                  <Doc key={r.href} title={r.title} meta={`${r.category} · ${fmtDate(r.date)}`} href={r.href} />
                ))}
              </ul>
              <h3 className="t-kicker mt-14 text-taupe-ink">Service overviews</h3>
              <ul className="mt-3 border-t border-line">
                {SERVICES.filter((s) => s.brochure).map((s) => (
                  <Doc key={s.slug} title={s.name} meta="Literature" href={s.brochure!} />
                ))}
              </ul>
              <h3 className="t-kicker mt-14 text-taupe-ink">Earlier investment perspectives</h3>
              <ul className="mt-3 border-t border-line">
                {ARCHIVE.map((d) => (
                  <Doc key={d.href} title={d.title} meta="2023" href={d.href} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}

function Doc({ title, meta, href }: { title: string; meta: string; href: string }) {
  return (
    <li className="border-b border-line">
      <a href={href} target="_blank" rel="noopener noreferrer" className="group flex min-h-14 items-center gap-4 py-3.5">
        <FileText size={17} strokeWidth={1.5} className="flex-none text-oxblood" aria-hidden />
        <span className="min-w-0 flex-1 font-semibold leading-snug">
          <span className="link-line">{title}</span>
        </span>
        <span className="t-meta flex-none text-right">{meta}</span>
        <span className="visually-hidden"> (PDF, opens in a new tab)</span>
      </a>
    </li>
  );
}

const TONES = ['bg-lake text-porcelain', 'bg-stone text-ink', 'bg-[#e8e0d2] text-ink', 'bg-oxblood text-porcelain'];

/**
 * Article cover. Real photographs show as images; otherwise (author portrait
 * or a small CMS thumbnail) the cover is set as type, like a journal cover,
 * so the archive never becomes a wall of repeated headshots.
 */
export function CoverImg({ a, aspect, sizes, priority, portraits = false }: { a: Article; aspect: string; sizes: string; priority?: boolean; portraits?: boolean }) {
  const c = cover(a);
  if (c && c.kind !== 'photo' && !(portraits && c.kind === 'portrait')) {
    const tone = TONES[(a.slug.length + a.date.charCodeAt(9)) % TONES.length];
    const dark = !tone.includes('bg-stone');
    return (
      <div aria-hidden className={`relative flex flex-col justify-between overflow-hidden rounded-sm p-[clamp(1.1rem,0.8rem+1vw,1.75rem)] transition-[filter] duration-700 group-hover:brightness-110 ${aspect} ${tone}`}>
        <span className={`t-kicker text-[0.6875rem] ${dark ? 'text-champagne' : 'text-oxblood'}`}>{a.category}</span>
        <span className="serif line-clamp-4 text-[clamp(1.35rem,1rem+1.2vw,2rem)] leading-[1.15]">{a.title}</span>
        <span className="flex items-center gap-3">
          {c.kind === 'portrait' && (
            <span className="media h-9 w-9 flex-none rounded-full">
              <Img src={c.key} alt="" position="50% 20%" sizes="36px" className="h-full w-full object-cover" />
            </span>
          )}
          <span className="text-xs font-semibold opacity-85">{a.video ? 'Video conversation' : a.author ? a.author : 'Northstead Trust'}</span>
        </span>
      </div>
    );
  }
  return (
    <div className={`media zoom-on-hover rounded-sm ${aspect} ${c?.kind === 'portrait' ? 'portrait-tone' : ''}`}>
      {c && (
        <Img
          src={c.key}
          alt={c.alt}
          position={c.kind === 'portrait' ? '50% 22%' : '50% 50%'}
          sizes={c.kind === 'thumb' ? '300px' : sizes}
          priority={priority}
          className="h-full w-full object-cover"
        />
      )}
      {a.video && (
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-porcelain/92 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
          <Play size={12} fill="currentColor" aria-hidden /> Video
        </span>
      )}
    </div>
  );
}

function Card({ a }: { a: Article }) {
  return (
    <article className="group">
      <Link to={`/insights/${a.slug}`} className="block">
        <CoverImg a={a} aspect="aspect-[4/3]" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw" />
        <p className="t-meta mt-5">
          <span className="text-oxblood">{a.category}</span> <span aria-hidden>·</span> <time dateTime={a.date}>{fmtDate(a.date)}</time>
        </p>
        <h3 className="serif mt-2 text-[clamp(1.4rem,1.2rem+0.7vw,1.8rem)] leading-[1.2]">
          <span className="link-line">{a.title}</span>
        </h3>
        {a.author && <p className="t-meta mt-2">By {a.author}</p>}
      </Link>
    </article>
  );
}
