import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Page } from '../components/Page';
import { Breadcrumb } from '../components/Breadcrumb';
import { Img } from '../components/Img';
import { ArrowLink, Kicker } from '../components/ui';
import { ARTICLES, TEAM, fmtDate, personBySlug, plainName, credentials } from '../lib/content';
import { Contacts } from './Team';
import NotFound from './NotFound';

export default function Person() {
  const { slug = '' } = useParams();
  const p = personBySlug(slug);
  if (!p) return <NotFound />;

  const name = plainName(p.name);
  const first = name.split(' ')[0];
  const surname = name.split(' ').slice(-1)[0];
  const i = TEAM.indexOf(p);
  const prev = TEAM[(i - 1 + TEAM.length) % TEAM.length];
  const next = TEAM[(i + 1) % TEAM.length];
  // Articles whose published byline names this person.
  const writing = ARTICLES.filter((a) => a.author && (a.author.includes(name) || (a.author.includes(surname) && a.author.includes(first.slice(0, 4)))));

  return (
    <Page key={slug} title={name} description={`${p.name}, ${p.title} at Northstead Trust. ${p.intro[0]?.slice(0, 120) ?? ''}`}>
      <article className="shell pb-[var(--section-y)] pt-[calc(var(--header-h)+clamp(2rem,1rem+3vw,4rem))]">
        <Breadcrumb trail={[{ label: 'About' }, { label: 'Our Team', to: '/about/our-team' }, { label: name }]} />
        <div className="grid-12 mt-10 gap-y-12">
          <div className="col-span-12 sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-1 lg:col-span-5">
            <div className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
              <div data-reveal="media" className="media portrait-tone aspect-[3/4] rounded-sm">
                <Img src={`team/${p.slug}`} alt={`Portrait of ${name}`} position="50% 22%" sizes="(min-width: 1024px) 38vw, (min-width: 768px) 48vw, 80vw" priority className="h-full w-full object-cover" />
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-6 lg:col-start-7">
            <Kicker>{p.group === 'executive' ? 'Executive Team' : p.group === 'counsel' ? 'Of Counsel' : 'Advisory Team'}</Kicker>
            <h1 data-reveal="words" className="t-h1 mt-6">
              {name}
            </h1>
            {credentials(p.name) && <p className="t-kicker mt-4 text-oxblood">{credentials(p.name)}</p>}
            <p className="t-lede mt-3">{p.title}</p>
            <Contacts p={p} />
            {(p.phone || p.email) && (
              <p className="t-small mt-4 text-ink-soft">
                {p.phone && (
                  <a href={`tel:+1${p.phone.replace(/\D/g, '')}`} className="link-line-rest mr-5">
                    {p.phone}
                  </a>
                )}
                {p.email && (
                  <a href={`mailto:${p.email}`} className="link-line-rest break-anywhere">
                    {p.email}
                  </a>
                )}
              </p>
            )}

            <div className="mt-12 space-y-5">
              {p.intro.map((para) => (
                <p key={para.slice(0, 24)} data-reveal="up" className="t-body text-[1.0625rem]">
                  {para}
                </p>
              ))}
              {p.intro.length === 0 && (
                <p className="t-body">
                  {first} is part of the Northstead Trust team at 700 Lakefront Plaza in Milwaukee. Reach {first} directly using the details above.
                </p>
              )}
            </div>

            {p.sections.map((s) => (
              <section key={s.heading} className="mt-14" aria-labelledby={`bio-${s.heading}`}>
                <h2 id={`bio-${s.heading}`} className="t-kicker kicker-row text-taupe-ink">
                  {s.heading}
                </h2>
                <ul className="mt-4 border-t border-line">
                  {s.items.map((it) => (
                    <li key={it.label + (it.detail ?? '')} className="flex flex-col gap-1 border-b border-line py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                      <span className="min-w-0 font-medium leading-snug">{it.label}</span>
                      {it.detail && <span className="t-meta min-w-0 sm:text-right">{it.detail}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {writing.length > 0 && (
              <section className="mt-14" aria-labelledby="writing">
                <h2 id="writing" className="t-kicker kicker-row text-taupe-ink">
                  Perspectives by {first}
                </h2>
                <ul className="mt-4 border-t border-line">
                  {writing.map((a) => (
                    <li key={a.slug} className="border-b border-line">
                      <Link to={`/insights/${a.slug}`} className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                        <span className="serif min-w-0 text-[1.3rem] leading-snug">
                          <span className="link-line">{a.title}</span>
                        </span>
                        <span className="t-meta flex-none">{fmtDate(a.date)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3">
              <ArrowLink to="/contact">Start a conversation</ArrowLink>
            </div>
          </div>
        </div>

        <nav aria-label="More team members" className="mt-[clamp(4rem,2rem+5vw,8rem)] grid grid-cols-2 border-t border-line">
          <Link to={`/about/our-team/${prev.slug}`} className="group flex min-w-0 flex-col gap-1 py-6 pr-4">
            <span className="t-meta inline-flex items-center gap-2">
              <ArrowLeft size={14} aria-hidden /> Previous
            </span>
            <span className="serif text-[clamp(1.2rem,1rem+1vw,1.75rem)] leading-tight">
              <span className="link-line">{plainName(prev.name)}</span>
            </span>
          </Link>
          <Link to={`/about/our-team/${next.slug}`} className="group flex min-w-0 flex-col items-end gap-1 border-l border-line py-6 pl-4 text-right">
            <span className="t-meta inline-flex items-center gap-2">
              Next <ArrowRight size={14} aria-hidden />
            </span>
            <span className="serif text-[clamp(1.2rem,1rem+1vw,1.75rem)] leading-tight">
              <span className="link-line">{plainName(next.name)}</span>
            </span>
          </Link>
        </nav>
      </article>
    </Page>
  );
}
