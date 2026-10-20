import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { LinkedInIcon } from '../components/LinkedInIcon';
import { Page } from '../components/Page';
import { Breadcrumb } from '../components/Breadcrumb';
import { Img } from '../components/Img';
import { ArrowLink, Kicker } from '../components/ui';
import { TEAM, plainName, credentials, type Person } from '../lib/content';

const INTRO =
  'In addition to holding the Northstead organization to the highest standards of ethics and fiscal responsibility, we hold our people to the highest standards of professional excellence.';

/** Photography-led: large executive portraits, then the advisory team in a varied grid. */
export default function Team() {
  const exec = TEAM.filter((p) => p.group === 'executive');
  const advisory = TEAM.filter((p) => p.group === 'advisory');
  const counsel = TEAM.filter((p) => p.group === 'counsel');

  return (
    <Page title="Our Team" description={INTRO}>
      <header className="shell pt-[calc(var(--header-h)+clamp(2.5rem,1.5rem+4vw,6rem))]">
        <Breadcrumb trail={[{ label: 'About' }, { label: 'Our Team' }]} />
        <div className="grid-12 mt-10 gap-y-8">
          <h1 data-reveal="words" className="t-display col-span-12 lg:col-span-7">
            Our <em className="italic-accent">team.</em>
          </h1>
          <p data-reveal="up" className="t-lede col-span-12 self-end lg:col-span-5">
            {INTRO}
          </p>
        </div>
      </header>

      <section aria-labelledby="exec" className="shell section-y">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
          <h2 id="exec" className="t-h3">
            Executive Team
          </h2>
          <p className="t-meta">{exec.length} leaders</p>
        </div>
        <ul className="mt-12 grid grid-cols-1 gap-x-[clamp(1.25rem,0.5rem+2.5vw,3rem)] gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {exec.map((p, i) => (
            <li key={p.slug} className={i % 2 === 1 ? 'lg:pt-24' : ''}>
              <Card p={p} aspect="aspect-[3/4]" sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 100vw" />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="advisory" className="bg-paper">
        <div className="shell section-y">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
            <h2 id="advisory" className="t-h3">
              Advisory Team
            </h2>
            <p className="t-meta">Wealth advisors, portfolio managers and client service</p>
          </div>
          <ul className="mt-12 grid grid-cols-1 gap-x-[clamp(1rem,0.4rem+2vw,2.5rem)] gap-y-14 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {advisory.map((p, i) => (
              <li key={p.slug} className={i % 4 === 1 || i % 4 === 3 ? 'xl:pt-14' : ''}>
                <Card p={p} aspect={i % 3 === 0 ? 'aspect-[4/5]' : 'aspect-[3/4]'} sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 400px) 46vw, 100vw" compact />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="counsel" className="shell section-y">
        <div className="grid-12 items-center gap-y-8">
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            {counsel.map((p) => (
              <Link key={p.slug} to={`/about/our-team/${p.slug}`} tabIndex={-1} aria-hidden className="block">
                <div data-reveal="media" className="media portrait-tone aspect-[4/5] rounded-sm">
                  <Img src={`team/${p.slug}`} alt="" position="50% 25%" sizes="(min-width: 768px) 28vw, 100vw" className="h-full w-full object-cover" />
                </div>
              </Link>
            ))}
          </div>
          <div className="col-span-12 md:col-span-8 md:col-start-6">
            <Kicker>Of Counsel</Kicker>
            {counsel.map((p) => (
              <div key={p.slug}>
                <h2 id="counsel" className="t-h2 mt-4">
                  {p.name}
                </h2>
                <p className="t-body mt-5 max-w-[40rem]">{p.intro[0]}</p>
                <ArrowLink to={`/about/our-team/${p.slug}`} className="mt-6">
                  Read biography
                </ArrowLink>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Page>
  );
}

function Card({ p, aspect, sizes, compact = false }: { p: Person; aspect: string; sizes: string; compact?: boolean }) {
  const hasBio = p.intro.length > 0;
  return (
    <article className="group">
      {hasBio ? (
        <Link to={`/about/our-team/${p.slug}`} tabIndex={-1} aria-hidden className="block">
          <div data-reveal="media" className={`media portrait-tone zoom-on-hover rounded-sm ${aspect}`}>
            <Img src={`team/${p.slug}`} alt="" position="50% 22%" sizes={sizes} className="h-full w-full object-cover" />
          </div>
        </Link>
      ) : (
        <div data-reveal="media" className={`media portrait-tone rounded-sm ${aspect}`}>
          <Img src={`team/${p.slug}`} alt={`Portrait of ${plainName(p.name)}`} position="50% 22%" sizes={sizes} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="mt-5">
        <h3 className={compact ? 't-h4' : 't-h3'}>
          {hasBio ? (
            <Link to={`/about/our-team/${p.slug}`} className="link-line">
              {plainName(p.name)}
            </Link>
          ) : (
            plainName(p.name)
          )}
        </h3>
        {credentials(p.name) && <p className="t-meta mt-1 text-oxblood">{credentials(p.name)}</p>}
        <p className="t-meta mt-1">{p.title}</p>
        <Contacts p={p} />
      </div>
    </article>
  );
}

export function Contacts({ p, light = false }: { p: Person; light?: boolean }) {
  const cls = `grid h-11 w-11 place-items-center rounded-full border transition-colors ${
    light ? 'border-lake-line text-porcelain hover:bg-porcelain hover:text-ink' : 'border-line text-ink hover:border-ink hover:bg-ink hover:text-porcelain'
  }`;
  const name = plainName(p.name);
  if (!p.phone && !p.email && !p.linkedin) return null;
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {p.phone && (
        <li>
          <a href={`tel:+1${p.phone.replace(/\D/g, '')}`} className={cls} aria-label={`Call ${name} at ${p.phone}`}>
            <Phone size={16} strokeWidth={1.6} aria-hidden />
          </a>
        </li>
      )}
      {p.email && (
        <li>
          <a href={`mailto:${p.email}`} className={cls} aria-label={`Email ${name}`}>
            <Mail size={16} strokeWidth={1.6} aria-hidden />
          </a>
        </li>
      )}
      {p.linkedin && (
        <li>
          <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className={cls} aria-label={`${name} on LinkedIn (opens in a new tab)`}>
            <LinkedInIcon size={15} />
          </a>
        </li>
      )}
    </ul>
  );
}
