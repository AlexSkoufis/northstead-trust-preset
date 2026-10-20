import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { CONTACT } from '../../data/site';
import { Chapter, Magnetic } from '../../components/ui';
import { gsap, useGSAP, MOTION_OK } from '../../motion/gsap';

const RINGS = [70, 120, 175, 235, 300, 370, 445, 525];

/**
 * Chapter 07. A personal invitation rather than a banner. Concentric rings,
 * one per generation, draw themselves as the visitor arrives. Contact routes
 * are real: phone, email and the office address.
 */
export function Conversation() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-ring]',
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, stagger: 0.06, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'center 55%', scrub: 0.8 } },
        );
        gsap.to('[data-rings]', { rotate: 24, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="conversation-title" className="relative isolate overflow-x-clip section-y">
      <svg
        data-rings
        aria-hidden
        viewBox="-560 -560 1120 1120"
        className="pointer-events-none absolute -right-[22rem] top-1/2 -z-10 h-[70rem] w-[70rem] -translate-y-1/2 text-champagne sm:-right-[16rem] lg:-right-[8rem]"
      >
        {RINGS.map((r, i) => (
          <circle
            key={r}
            data-ring
            r={r}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.55 - i * 0.04}
            strokeWidth={i === 3 ? 1.6 : 1}
            pathLength={1}
            strokeDasharray="1 1"
            transform={`rotate(${-90 + i * 17})`}
          />
        ))}
        <circle r={5} fill="var(--color-oxblood)" />
      </svg>

      <div className="shell">
        <Chapter n="07" label="The conversation" />
        <h2 id="conversation-title" data-reveal="words" className="t-display mt-8 max-w-[14ch]">
          Every legacy begins with <em className="italic-accent">a conversation.</em>
        </h2>
        <div className="grid-12 mt-10 gap-y-8">
          <p data-reveal="up" className="t-lede col-span-12 md:col-span-7 lg:col-span-5">
            Let&rsquo;s talk. Tell us a little about yourself, your family and what you are building, and a Northstead Trust advisor will be in touch.
          </p>
          <div data-reveal="up" data-delay="0.1" className="col-span-12 flex flex-wrap items-start gap-3 md:col-span-5 md:justify-end lg:col-span-4 lg:col-start-9">
            <Magnetic>
              <Link to="/contact" className="btn">
                Start a conversation <ArrowRight size={17} strokeWidth={1.7} aria-hidden />
              </Link>
            </Magnetic>
          </div>
        </div>

        <ul data-reveal="stagger" className="mt-[clamp(3.5rem,2rem+4vw,6rem)] grid grid-cols-1 border-y border-line bg-porcelain/70 backdrop-blur-[2px] md:grid-cols-3">
          <li className="min-w-0 py-7 md:pr-8">
            <a href={CONTACT.phoneHref} className="group block">
              <span className="t-kicker flex items-center gap-2 text-taupe-ink">
                <Phone size={14} aria-hidden /> Call
              </span>
              <span className="serif mt-3 block text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] leading-tight">
                <span className="link-line">{CONTACT.phone}</span>
              </span>
            </a>
          </li>
          <li className="min-w-0 border-t border-line py-7 md:border-l md:border-t-0 md:px-8">
            <a href={`mailto:${CONTACT.email}`} className="group block">
              <span className="t-kicker flex items-center gap-2 text-taupe-ink">
                <Mail size={14} aria-hidden /> Write
              </span>
              <span className="serif break-anywhere mt-3 block text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] leading-tight">
                <span className="link-line">{CONTACT.email}</span>
              </span>
            </a>
          </li>
          <li className="min-w-0 border-t border-line py-7 md:border-l md:border-t-0 md:pl-8">
            <a href={CONTACT.mapHref} target="_blank" rel="noopener noreferrer" className="group block">
              <span className="t-kicker flex items-center gap-2 text-taupe-ink">
                <MapPin size={14} aria-hidden /> Visit
              </span>
              <span className="mt-3 block text-[1.0625rem] font-medium leading-snug">
                <span className="link-line">{CONTACT.street}</span>
                <br />
                {CONTACT.city}
              </span>
              <span className="visually-hidden"> (map, opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
