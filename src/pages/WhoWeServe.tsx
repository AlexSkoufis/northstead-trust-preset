import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../components/Page';
import { Breadcrumb } from '../components/Breadcrumb';
import { Img } from '../components/Img';
import { ArrowLink, ButtonLink, Kicker } from '../components/ui';
import { AUDIENCES, SERVICES } from '../data/site';
import { ScrollTrigger, useGSAP } from '../motion/gsap';
import { scrollToEl } from '../motion/smooth';

/**
 * Six audiences on one long page. Desktop: a sticky index tracks the section
 * being read. Mobile: a wrapping jump grid at the top (no horizontal tabs).
 */
export default function WhoWeServe() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      root.current!.querySelectorAll<HTMLElement>('[data-aud]').forEach((el, i) => {
        ScrollTrigger.create({ trigger: el, start: 'top 45%', end: 'bottom 45%', onToggle: (self) => self.isActive && setActive(i) });
      });
    },
    { scope: root },
  );

  const jump = (e: React.MouseEvent, slug: string) => {
    const el = document.getElementById(slug);
    if (!el) return;
    e.preventDefault();
    history.replaceState(null, '', `#${slug}`);
    scrollToEl(el);
    el.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
  };

  return (
    <Page
      title="Who We Serve"
      description="Business owners, corporate executives, retirees, multi-generational families, special needs families, and foundations and endowments."
    >
      <header className="shell pt-[calc(var(--header-h)+clamp(2.5rem,1.5rem+4vw,6rem))]">
        <Breadcrumb trail={[{ label: 'Who We Serve' }]} />
        <div className="grid-12 mt-10 gap-y-8">
          <div className="col-span-12 lg:col-span-8">
            <Kicker>Who we serve</Kicker>
            <h1 data-reveal="words" className="t-display mt-6">
              Wealth is personal. <em className="italic-accent">So is the plan.</em>
            </h1>
          </div>
          <p data-reveal="up" className="t-lede col-span-12 self-end lg:col-span-4">
            Each family is unique and your wealth management strategy should be too. Find the situation closest to yours.
          </p>
        </div>

        {/* Mobile and tablet jump grid */}
        <nav aria-label="Audiences" className="mt-12 lg:hidden">
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-line xs:grid-cols-2 md:grid-cols-3">
            {AUDIENCES.map((a) => (
              <li key={a.slug} className="bg-porcelain">
                <a href={`#${a.slug}`} onClick={(e) => jump(e, a.slug)} className="flex min-h-14 items-center gap-3 bg-paper px-4 py-3 hover:bg-stone/60">
                  <span className="t-num text-oxblood">{a.n}</span>
                  <span className="font-semibold leading-snug">{a.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div ref={root} className="shell section-y">
        <div className="grid-12">
          <nav aria-label="Audiences" className="col-span-3 hidden lg:block">
            <ol className="sticky top-[calc(var(--header-h)+2.5rem)] border-l border-line">
              {AUDIENCES.map((a, i) => (
                <li key={a.slug}>
                  <a
                    href={`#${a.slug}`}
                    onClick={(e) => jump(e, a.slug)}
                    aria-current={i === active ? 'true' : undefined}
                    className={`-ml-px flex min-h-11 items-baseline gap-3 border-l-2 py-2.5 pl-5 transition-colors duration-500 ${
                      i === active ? 'border-oxblood text-ink' : 'border-transparent text-ink/50 hover:text-ink'
                    }`}
                  >
                    <span className="t-num text-[0.95rem]">{a.n}</span>
                    <span className="font-semibold leading-snug">{a.name}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="col-span-12 space-y-[clamp(5rem,3rem+6vw,10rem)] lg:col-span-9 lg:border-l lg:border-line lg:pl-[clamp(1.5rem,0.5rem+3vw,4.5rem)]">
            {AUDIENCES.map((a, i) => (
              <section key={a.slug} id={a.slug} data-aud aria-labelledby={`${a.slug}-title`} className="scroll-mt-[calc(var(--header-h)+1.5rem)]">
                <div className="grid grid-cols-12 gap-x-[clamp(1rem,0.4rem+2vw,2.5rem)] gap-y-8">
                  <div className={`col-span-12 ${i % 2 ? 'md:order-2 md:col-span-7' : 'md:col-span-7'}`}>
                    <p className="t-num text-[1.1rem] text-oxblood">{a.n}</p>
                    <h2 id={`${a.slug}-title`} tabIndex={-1} data-reveal="words" className="t-h1 mt-2 outline-none">
                      {a.name}
                    </h2>
                    <p data-reveal="up" className="serif mt-5 text-[clamp(1.35rem,1.1rem+0.9vw,1.85rem)] leading-snug text-taupe-ink">
                      {a.prompt}
                    </p>
                  </div>
                  <div className={`col-span-12 ${i % 2 ? 'md:order-1 md:col-span-5' : 'md:col-span-5'}`}>
                    <div data-reveal="media" className="media aspect-[4/3] rounded-sm">
                      <Img src={a.image} alt={a.alt} position={a.imagePosition} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 100vw" className="h-full w-full object-cover" />
                    </div>
                  </div>
                </div>
                <p data-reveal="up" className="t-lede mt-10 max-w-[48rem]">
                  {a.body}
                </p>
                <div className="mt-8 flex flex-col gap-6 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
                  <ul className="flex flex-wrap gap-2" aria-label={`Services for ${a.name}`}>
                    {a.services.map((sv) => {
                      const s = SERVICES.find((x) => x.slug === sv)!;
                      return (
                        <li key={sv}>
                          <Link to={`/services/${sv}`} className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-sm font-semibold transition-colors hover:border-ink hover:bg-ink hover:text-porcelain">
                            {s.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <ArrowLink to={`/who-we-serve/${a.slug}`} className="flex-none">
                    Planning for {a.name}
                  </ArrowLink>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      <section className="on-dark bg-lake text-porcelain" aria-labelledby="wws-cta">
        <div className="shell flex flex-col gap-8 py-[clamp(4rem,3rem+4vw,7rem)] md:flex-row md:items-end md:justify-between">
          <h2 id="wws-cta" className="t-h2 max-w-[18ch]">
            Not quite any of these? <em className="italic-accent">Tell us your story.</em>
          </h2>
          <ButtonLink to="/contact" variant="btn-light">
            Start a conversation
          </ButtonLink>
        </div>
      </section>
    </Page>
  );
}
