import { Link, useParams } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import { Page } from '../components/Page';
import { Breadcrumb } from '../components/Breadcrumb';
import { Img } from '../components/Img';
import { ArrowLink, ButtonLink, Kicker } from '../components/ui';
import { AUDIENCES, FAMILY_OFFICE_SERVICES, SERVICES } from '../data/site';
import { personBySlug, plainName } from '../lib/content';
import NotFound from './NotFound';

const ALTS: Record<string, string> = {
  'investment-management': 'A lone figure on a curved staircase rail, looking out across a sunlit atrium.',
  'trustee-services': 'Two people in silhouette talking at a table before tall windows.',
  'wealth-planning': 'A man reviewing documents at a table, backlit by a bright wall of windows.',
  'family-office': 'Grandparents and grandchildren with arms around each other, watching the sunset.',
};

/**
 * One template, four compositions: the photograph moves (right column,
 * full bleed, inset square, panorama) so the four pages never feel cloned.
 */
export default function ServiceDetail() {
  const { slug = '' } = useParams();
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) return <NotFound />;
  const idx = SERVICES.indexOf(s);
  const audiences = AUDIENCES.filter((a) => a.services.includes(s.slug));
  const people = s.people.map((p) => personBySlug(p)!).filter(Boolean);
  const others = SERVICES.filter((x) => x.slug !== s.slug);
  const [lead, ...rest] = s.summary.split(/(?<=\.)\s+/);

  const photo = (
    <div data-reveal="media" className={`media rounded-sm ${idx === 0 ? 'aspect-[16/9] md:aspect-[21/9]' : idx === 1 ? 'aspect-square' : idx === 2 ? 'aspect-[4/5]' : 'aspect-[16/9] md:aspect-[21/9]'}`}>
      <Img drift={idx === 0 || idx === 3} src={s.image} alt={ALTS[s.slug]} position={s.imagePosition} sizes="(min-width: 1024px) 60vw, 100vw" priority className="h-full w-full object-cover" />
    </div>
  );

  return (
    <Page key={slug} title={s.name} description={s.summary.slice(0, 155)}>
      <header className="shell pt-[calc(var(--header-h)+clamp(2.5rem,1.5rem+4vw,6rem))]">
        <Breadcrumb trail={[{ label: 'Services', to: '/services' }, { label: s.name }]} />
        <div className="grid-12 mt-10 items-end gap-y-10">
          <div className={`col-span-12 ${idx === 1 || idx === 2 ? 'lg:col-span-6' : 'lg:col-span-9'}`}>
            <Kicker>
              <span className="t-num text-[0.95rem] normal-case tracking-normal text-oxblood">{s.n}</span> Services
            </Kicker>
            <h1 data-reveal="words" className="t-display mt-6">
              {s.name}
            </h1>
            <p data-reveal="up" className="serif mt-6 max-w-[28ch] text-[clamp(1.4rem,1.1rem+1.1vw,2rem)] leading-snug text-taupe-ink">
              {s.line}
            </p>
          </div>
          {(idx === 1 || idx === 2) && <div className="col-span-12 sm:col-span-8 lg:col-span-5 lg:col-start-8">{photo}</div>}
        </div>
      </header>

      {(idx === 0 || idx === 3) && <div className="shell mt-[clamp(3rem,2rem+3vw,5rem)]">{photo}</div>}

      <section aria-label="Overview" className="shell section-y">
        <div className="grid-12 gap-y-8">
          <p className="t-kicker col-span-12 text-taupe-ink lg:col-span-3">Overview</p>
          <div className="col-span-12 lg:col-span-8">
            <p data-reveal="up" className="serif text-[clamp(1.7rem,1.2rem+1.8vw,2.9rem)] leading-[1.22]">
              {lead}
            </p>
            {rest.length > 0 && (
              <p data-reveal="up" className="t-lede mt-8 max-w-[44rem]">
                {rest.join(' ')}
              </p>
            )}
            {s.brochure && (
              <a href={s.brochure} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-10">
                <FileText size={16} aria-hidden /> Download the {s.name} overview (PDF)
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {s.slug === 'family-office' && (
        <section aria-labelledby="fo-services" className="shell pb-[var(--section-y)]">
          <h2 id="fo-services" className="t-h3 border-b border-ink pb-5">
            Family Office services
          </h2>
          <ol data-reveal="stagger" className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {FAMILY_OFFICE_SERVICES.map((name, i) => (
              <li key={name} className="flex items-baseline gap-4 border-b border-line py-5">
                <span className="t-num w-7 flex-none text-oxblood">{String(i + 1).padStart(2, '0')}</span>
                <span className="serif text-[1.4rem] leading-snug">{name}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Who it serves */}
      <section aria-labelledby="serves" className="bg-paper">
        <div className="shell section-y">
          <div className="grid-12 gap-y-8">
            <div className="col-span-12 lg:col-span-4">
              <Kicker>Who it serves</Kicker>
              <h2 id="serves" className="t-h2 mt-5">
                Built around <em className="italic-accent">your situation.</em>
              </h2>
            </div>
            <ul data-reveal="stagger" className="col-span-12 border-t border-line lg:col-span-7 lg:col-start-6">
              {audiences.map((a) => (
                <li key={a.slug} className="border-b border-line">
                  <Link to={`/who-we-serve/${a.slug}`} className="group flex items-center justify-between gap-6 py-5">
                    <span className="min-w-0">
                      <span className="serif block text-[clamp(1.4rem,1.1rem+1vw,2rem)] leading-tight">
                        <span className="link-line">{a.name}</span>
                      </span>
                      <span className="t-meta mt-1 block">{a.prompt}</span>
                    </span>
                    <ArrowRight size={18} strokeWidth={1.5} className="flex-none transition-transform duration-500 group-hover:translate-x-1" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* People */}
      {people.length > 0 && (
        <section aria-labelledby="people" className="shell section-y">
          <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Kicker>Your team</Kicker>
              <h2 id="people" className="t-h2 mt-4">
                People who lead this work
              </h2>
            </div>
            <ArrowLink to="/about/our-team">Meet the full team</ArrowLink>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-x-[clamp(1rem,0.4rem+2vw,2.5rem)] gap-y-10 md:grid-cols-3 lg:grid-cols-5">
            {people.map((p) => (
              <li key={p.slug}>
                <Link to={`/about/our-team/${p.slug}`} className="group block">
                  <div data-reveal="media" className="media portrait-tone zoom-on-hover aspect-[3/4] rounded-sm">
                    <Img src={`team/${p.slug}`} alt="" position="50% 22%" sizes="(min-width: 1024px) 18vw, (min-width: 768px) 30vw, 46vw" className="h-full w-full object-cover" />
                  </div>
                  <p className="serif mt-4 text-[1.25rem] leading-tight">
                    <span className="link-line">{plainName(p.name)}</span>
                  </p>
                  <p className="t-meta mt-1">{p.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Other services */}
      <section aria-labelledby="other" className="on-dark bg-lake text-porcelain">
        <div className="shell section-y">
          <div className="grid-12 gap-y-10">
            <div className="col-span-12 lg:col-span-5">
              <Kicker light>Four disciplines. One relationship.</Kicker>
              <h2 id="other" className="t-h2 mt-5">
                Every discipline, <em className="italic-accent">one conversation.</em>
              </h2>
              <ButtonLink to="/contact" variant="btn-light" className="mt-8">
                Start a conversation
              </ButtonLink>
            </div>
            <ul className="col-span-12 border-t border-lake-line lg:col-span-6 lg:col-start-7">
              {others.map((o) => (
                <li key={o.slug} className="border-b border-lake-line">
                  <Link to={`/services/${o.slug}`} className="group flex items-baseline gap-5 py-6">
                    <span className="t-num text-champagne">{o.n}</span>
                    <span className="serif min-w-0 flex-1 text-[clamp(1.5rem,1.1rem+1.4vw,2.4rem)] leading-tight">
                      <span className="link-line">{o.name}</span>
                    </span>
                    <ArrowRight size={18} strokeWidth={1.5} aria-hidden className="flex-none self-center" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Page>
  );
}
