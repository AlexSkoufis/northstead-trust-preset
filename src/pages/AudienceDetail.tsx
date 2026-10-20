import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Phone } from 'lucide-react';
import { Page } from '../components/Page';
import { Breadcrumb } from '../components/Breadcrumb';
import { Img, hasImg } from '../components/Img';
import { ArrowLink, ButtonLink, Kicker } from '../components/ui';
import { AUDIENCES, CONTACT, SERVICES } from '../data/site';
import { articleBySlug, fmtDate } from '../lib/content';
import NotFound from './NotFound';

export default function AudienceDetail() {
  const { slug = '' } = useParams();
  const a = AUDIENCES.find((x) => x.slug === slug);
  if (!a) return <NotFound />;
  const i = AUDIENCES.indexOf(a);
  const prev = AUDIENCES[(i - 1 + AUDIENCES.length) % AUDIENCES.length];
  const next = AUDIENCES[(i + 1) % AUDIENCES.length];
  const services = a.services.map((s) => SERVICES.find((x) => x.slug === s)!);
  const reading = a.insights.map((s) => articleBySlug(s)!).filter(Boolean);
  const [first, ...rest] = a.body.split(/(?<=[.?])\s+/);

  return (
    <Page key={slug} title={a.name} description={a.body.slice(0, 155)}>
      <header className="relative pt-[calc(var(--header-h)+clamp(2.5rem,1.5rem+4vw,6rem))]">
        <div className="shell">
          <Breadcrumb trail={[{ label: 'Who We Serve', to: '/who-we-serve' }, { label: a.name }]} />
          <div className="grid-12 mt-10 gap-y-6">
            <p className="t-num col-span-12 text-[clamp(1.2rem,1rem+0.8vw,1.6rem)] text-oxblood lg:col-span-1">{a.n}</p>
            <div className="col-span-12 lg:col-span-10">
              <h1 data-reveal="words" className="t-display">
                {a.name}
              </h1>
              <p data-reveal="up" className="serif mt-6 max-w-[30ch] text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] leading-snug text-taupe-ink">
                {a.prompt}
              </p>
            </div>
          </div>
        </div>
        <div className="shell mt-[clamp(3rem,2rem+3vw,5rem)]">
          <div data-reveal="media" className="media aspect-[4/3] rounded-sm sm:aspect-[16/9] lg:aspect-[21/9]">
            <Img drift src={a.image} alt={a.alt} position={a.imagePosition} sizes="100vw" priority className="h-full w-full object-cover" />
          </div>
        </div>
      </header>

      <section aria-label="How we help" className="shell section-y">
        <div className="grid-12 gap-y-10">
          <p className="t-kicker col-span-12 text-taupe-ink lg:col-span-3">How we help</p>
          <div className="col-span-12 lg:col-span-8">
            <p data-reveal="up" className="serif text-[clamp(1.7rem,1.2rem+1.8vw,2.8rem)] leading-[1.22]">
              {first}
            </p>
            {rest.length > 0 && (
              <p data-reveal="up" className="t-lede mt-8 max-w-[46rem]">
                {rest.join(' ')}
              </p>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="aud-services" className="bg-paper">
        <div className="shell section-y">
          <Kicker>Relevant services</Kicker>
          <h2 id="aud-services" className="t-h2 mt-4 max-w-[20ch]">
            The disciplines that come together for you
          </h2>
          <ol className="mt-10 border-t border-ink">
            {services.map((s) => (
              <li key={s.slug} className="border-b border-line">
                <Link to={`/services/${s.slug}`} className="group grid grid-cols-12 items-baseline gap-x-4 gap-y-2 py-7">
                  <span className="t-num col-span-2 text-oxblood sm:col-span-1">{s.n}</span>
                  <span className="serif col-span-10 text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] leading-tight sm:col-span-11 lg:col-span-4">
                    <span className="link-line">{s.name}</span>
                  </span>
                  <span className="t-body col-span-12 sm:col-span-10 sm:col-start-2 lg:col-span-6 lg:col-start-auto">{s.line}</span>
                  <ArrowRight size={18} strokeWidth={1.5} aria-hidden className="col-span-1 hidden justify-self-end transition-transform duration-500 group-hover:translate-x-1 lg:block" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {reading.length > 0 && (
        <section aria-labelledby="aud-reading" className="shell section-y">
          <div className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Kicker>Further reading</Kicker>
              <h2 id="aud-reading" className="t-h2 mt-4">
                From our perspectives
              </h2>
            </div>
            <ArrowLink to="/insights">All insights</ArrowLink>
          </div>
          <ul className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
            {reading.map((r) => (
              <li key={r.slug}>
                <Link to={`/insights/${r.slug}`} className="group grid grid-cols-[7rem_minmax(0,1fr)] gap-5 sm:grid-cols-[10rem_minmax(0,1fr)]">
                  <div className="media zoom-on-hover aspect-square rounded-sm">
                    {hasImg(`insights/${r.image}`) && <Img src={`insights/${r.image}`} alt="" sizes="160px" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <p className="t-meta">
                      {r.category} <span aria-hidden>·</span> {fmtDate(r.date)}
                    </p>
                    <h3 className="serif mt-2 text-[clamp(1.35rem,1.1rem+0.8vw,1.75rem)] leading-tight">
                      <span className="link-line">{r.title}</span>
                    </h3>
                    {r.author && <p className="t-meta mt-2">By {r.author}</p>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="aud-cta" className="on-dark bg-lake text-porcelain">
        <div className="shell section-y">
          <div className="grid-12 gap-y-8">
            <h2 id="aud-cta" className="t-h1 col-span-12 lg:col-span-7">
              Let&rsquo;s talk about <em className="italic-accent">your plan.</em>
            </h2>
            <div className="col-span-12 flex flex-col gap-3 self-end sm:flex-row lg:col-span-5 lg:justify-end">
              <ButtonLink to="/contact" variant="btn-light">
                Start a conversation
              </ButtonLink>
              <a href={CONTACT.phoneHref} className="btn btn-ghost-light">
                <Phone size={16} aria-hidden /> {CONTACT.phone}
              </a>
            </div>
          </div>
          <nav aria-label="Other audiences" className="mt-[clamp(3rem,2rem+4vw,6rem)] grid grid-cols-2 border-t border-lake-line">
            <Link to={`/who-we-serve/${prev.slug}`} className="group flex min-w-0 flex-col gap-1 py-6 pr-4">
              <span className="t-meta inline-flex items-center gap-2 text-mist">
                <ArrowLeft size={14} aria-hidden /> Previous
              </span>
              <span className="serif text-[clamp(1.2rem,1rem+1vw,1.75rem)] leading-tight">
                <span className="link-line">{prev.name}</span>
              </span>
            </Link>
            <Link to={`/who-we-serve/${next.slug}`} className="group flex min-w-0 flex-col items-end gap-1 border-l border-lake-line py-6 pl-4 text-right">
              <span className="t-meta inline-flex items-center gap-2 text-mist">
                Next <ArrowRight size={14} aria-hidden />
              </span>
              <span className="serif text-[clamp(1.2rem,1rem+1vw,1.75rem)] leading-tight">
                <span className="link-line">{next.name}</span>
              </span>
            </Link>
          </nav>
        </div>
      </section>
    </Page>
  );
}
