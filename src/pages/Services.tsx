import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import { Page } from '../components/Page';
import { Breadcrumb } from '../components/Breadcrumb';
import { Img } from '../components/Img';
import { ButtonLink, Kicker } from '../components/ui';
import { FAMILY_OFFICE_SERVICES, SERVICES, SERVICES_INTRO } from '../data/site';
import { gsap, useGSAP } from '../motion/gsap';

const HEADLINE = 'Our approach is consistent and proven. We are an entirely independent trust bank, held to the highest standards.';

export default function Services() {
  return (
    <Page title="Services" description={`${HEADLINE} Investment management, trustee services, wealth planning and family office.`}>
      <header className="shell pt-[calc(var(--header-h)+clamp(2.5rem,1.5rem+4vw,6rem))]">
        <Breadcrumb trail={[{ label: 'Services' }]} />
        <Kicker className="mt-10">Services</Kicker>
        <h1 data-reveal="words" className="t-h1 mt-6 max-w-[24ch]">
          Our approach is consistent and proven. <em className="italic-accent">We are an entirely independent trust bank,</em> held to the highest standards.
        </h1>
      </header>

      <section aria-label="Our services" className="shell mt-[clamp(3rem,2rem+4vw,6rem)]">
        <ol className="border-t border-ink">
          {SERVICES.map((s) => (
            <ServiceRow key={s.slug} s={s} />
          ))}
        </ol>
      </section>

      <section aria-labelledby="one-roof" className="shell section-y">
        <div className="grid-12 gap-y-10">
          <h2 id="one-roof" data-reveal="words" className="t-h2 col-span-12 lg:col-span-5">
            All right here, <em className="italic-accent">under one roof.</em>
          </h2>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <p data-reveal="up" className="t-lede">
              {SERVICES_INTRO}
            </p>
            <div data-reveal="up" className="mt-10">
              <p className="t-kicker text-taupe-ink">Service overviews</p>
              <ul className="mt-4 border-t border-line">
                {SERVICES.filter((s) => s.brochure).map((s) => (
                  <li key={s.slug} className="border-b border-line">
                    <a href={s.brochure} target="_blank" rel="noopener noreferrer" className="group flex min-h-14 items-center justify-between gap-4 py-3">
                      <span className="flex items-center gap-3">
                        <FileText size={17} strokeWidth={1.5} className="text-oxblood" aria-hidden />
                        <span className="link-line font-semibold">{s.name}</span>
                      </span>
                      <span className="t-meta">PDF</span>
                      <span className="visually-hidden"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="fo-list" className="on-dark bg-lake text-porcelain">
        <div className="shell section-y">
          <div className="grid-12 gap-y-10">
            <div className="col-span-12 lg:col-span-4">
              <Kicker light>Family Office</Kicker>
              <h2 id="fo-list" data-reveal="words" className="t-h2 mt-5">
                Ten services, <em className="italic-accent">one family.</em>
              </h2>
              <p data-reveal="up" className="t-body mt-6 text-mist">
                Our independence gives us the ability to build programs and seize opportunities that are tailored to you and your family&rsquo;s unique
                personal situations.
              </p>
              <ButtonLink to="/services/family-office" variant="btn-light" className="mt-8">
                Explore Family Office
              </ButtonLink>
            </div>
            <ol data-reveal="stagger" className="col-span-12 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
              {FAMILY_OFFICE_SERVICES.map((name, i) => (
                <li key={name} className="flex items-baseline gap-4 border-b border-lake-line py-4">
                  <span className="t-num w-7 flex-none text-champagne">{String(i + 1).padStart(2, '0')}</span>
                  <span className="serif text-[1.35rem] leading-snug">{name}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section aria-labelledby="independence-close" className="shell section-y">
        <div className="grid-12 items-center gap-y-10">
          <div className="col-span-12 md:col-span-6">
            <div data-reveal="media" className="media aspect-[4/3] rounded-sm">
              <Img drift src="photo/family-shore" alt="Mountain peaks rising above a sea of clouds at dusk." position="60% 60%" sizes="(min-width: 768px) 50vw, 100vw" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8">
            <h2 id="independence-close" data-reveal="words" className="t-h2">
              Not sure where to begin?
            </h2>
            <p data-reveal="up" className="t-body mt-6">
              Start with the people you are planning for. Our advisors will help you decide which disciplines belong in your plan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/who-we-serve">Who we serve</ButtonLink>
              <ButtonLink to="/contact" variant="btn-ghost">
                Contact us
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}

function ServiceRow({ s }: { s: (typeof SERVICES)[number] }) {
  const row = useRef<HTMLLIElement>(null);
  const { contextSafe } = useGSAP({ scope: row });

  // Desktop: the photograph opens behind the row on hover or focus.
  const show = contextSafe((on: boolean) => {
    if (!window.matchMedia('(hover: hover) and (min-width: 64rem) and (prefers-reduced-motion: no-preference)').matches) return;
    gsap.to('[data-row-img]', { clipPath: on ? 'inset(0% 0% 0% 0%)' : 'inset(50% 0% 50% 0%)', duration: 0.8, ease: 'expo.out' });
    gsap.to('[data-row-img] img', { scale: on ? 1 : 1.15, duration: 1.1, ease: 'expo.out' });
  });

  return (
    <li ref={row} className="border-b border-line" onPointerEnter={() => show(true)} onPointerLeave={() => show(false)}>
      <Link
        to={`/services/${s.slug}`}
        onFocus={() => show(true)}
        onBlur={() => show(false)}
        className="group grid grid-cols-12 items-center gap-x-[clamp(1rem,0.4rem+2vw,2.5rem)] gap-y-4 py-8 lg:py-10"
      >
        <span className="t-num col-span-2 text-[clamp(1.1rem,0.9rem+0.8vw,1.6rem)] text-oxblood sm:col-span-1">{s.n}</span>
        <span className="col-span-10 min-w-0 sm:col-span-11 lg:col-span-5">
          <span className="t-h2 block transition-transform duration-700 ease-[var(--ease-editorial)] lg:group-hover:translate-x-3">{s.name}</span>
        </span>
        <span className="col-span-12 sm:col-span-4 sm:col-start-2 lg:col-span-3 lg:col-start-auto">
          <span data-row-img className="media block aspect-[4/3] rounded-sm [@media(hover:hover)_and_(min-width:64rem)_and_(prefers-reduced-motion:no-preference)]:[clip-path:inset(50%_0%_50%_0%)]">
            <Img src={s.image} alt="" position={s.imagePosition} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 100vw" className="h-full w-full object-cover [@media(hover:hover)_and_(min-width:64rem)_and_(prefers-reduced-motion:no-preference)]:scale-[1.15]" />
          </span>
        </span>
        <span className="col-span-12 flex items-end justify-between gap-6 sm:col-span-7 lg:col-span-3">
          <span className="t-body min-w-0">{s.line}</span>
          <span className="grid h-12 w-12 flex-none place-items-center rounded-full border border-line transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-porcelain" aria-hidden>
            <ArrowRight size={18} strokeWidth={1.6} />
          </span>
        </span>
      </Link>
    </li>
  );
}
