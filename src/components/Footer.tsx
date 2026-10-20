import { Link } from 'react-router-dom';
import { ArrowUpRight, Lock } from 'lucide-react';
import { ABOUT_LINE, AUDIENCES, CONTACT, SERVICES } from '../data/site';
import { Logo } from './ui';

const COLS = [
  {
    title: 'About',
    links: [
      { label: 'The Northstead Difference', to: '/about/the-northstead-difference' },
      { label: 'Our Team', to: '/about/our-team' },
      { label: 'Board of Directors', to: '/about/board-of-directors' },
      { label: 'Careers', to: '/about/careers' },
      { label: 'Insights', to: '/insights' },
    ],
  },
  { title: 'Services', links: [{ label: 'All Services', to: '/services' }, ...SERVICES.map((s) => ({ label: s.name, to: `/services/${s.slug}` }))] },
  { title: 'Who We Serve', links: AUDIENCES.map((a) => ({ label: a.name, to: `/who-we-serve/${a.slug}` })) },
];

export function Footer() {
  return (
    <footer className="on-dark relative bg-lake-deep text-porcelain">
      <div className="shell pb-10 pt-[clamp(4rem,3rem+5vw,7rem)]">
        <div className="grid-12 gap-y-14">
          <div className="col-span-12 lg:col-span-4">
            <Link to="/" aria-label="Northstead Trust, home" className="inline-block">
              <Logo light className="w-[13rem]" />
            </Link>
            <p className="t-small mt-7 max-w-[22rem] text-mist">{ABOUT_LINE}</p>
            <a
              href={CONTACT.clientLogin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-ghost-light mt-8"
            >
              <Lock size={15} strokeWidth={1.7} aria-hidden /> Client Login
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </div>

          <nav aria-label="Footer" className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:col-span-5">
            {COLS.map((col) => (
              <div key={col.title} className="min-w-0">
                <h2 className="t-kicker text-champagne">{col.title}</h2>
                <ul className="mt-4 space-y-1">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="inline-flex min-h-9 items-center py-1 text-[0.9375rem] leading-snug text-mist transition-colors hover:text-porcelain">
                        <span className="link-line">{l.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <address className="col-span-12 not-italic sm:col-span-6 lg:col-span-3">
            <h2 className="t-kicker text-champagne">Contact Us</h2>
            <ul className="mt-4 space-y-3 text-[0.9375rem] text-mist">
              <li>
                <a href={CONTACT.phoneHref} className="link-line hover:text-porcelain">
                  P: {CONTACT.phone}
                </a>
              </li>
              <li>F: {CONTACT.fax}</li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className="link-line break-anywhere hover:text-porcelain">
                  {CONTACT.email}
                </a>
              </li>
              <li className="pt-2 leading-relaxed">
                <a href={CONTACT.mapHref} target="_blank" rel="noopener noreferrer" className="hover:text-porcelain">
                  {CONTACT.street}
                  <br />
                  {CONTACT.city}
                  <span className="visually-hidden"> (map, opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 hover:text-porcelain">
                  <span className="link-line">LinkedIn</span> <ArrowUpRight size={14} aria-hidden />
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </address>
        </div>

        <div className="mt-16 border-t border-lake-line pt-8">
          <p className="t-small max-w-[64rem] text-mist">
            Northstead Trust makes no representation concerning nor is it responsible for the quality, content, nature, or security of any hyperlinked
            site. Links to other sites are provided as a convenience and do not imply any investigation or endorsement of the site.
          </p>
          <p className="t-small mt-4 max-w-[64rem] text-mist">
            Trust and investment products are not FDIC insured, are not deposits of any bank and may lose value. Placeholder disclosure: replace with
            the firm&rsquo;s own regulatory wording.
          </p>

          <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-mist">
              <li>&copy; {new Date().getFullYear()} Northstead Trust</li>
              <li>
                <Link to="/privacy-policy" className="link-line hover:text-porcelain">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/usa-patriot-act" className="link-line hover:text-porcelain">
                  USA PATRIOT Act
                </Link>
              </li>
            </ul>
            <a
              href="https://coreconcepts.design/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-porcelain"
            >
              <span className="link-line-rest">Designed by CoreConcepts Design</span>
              <ArrowUpRight size={15} aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
