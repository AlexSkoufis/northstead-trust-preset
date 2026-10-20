import { useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP } from '../motion/gsap';

/** North star in a ring: the Northstead mark. Drawn in currentColor. */
export function Mark({ className = '', id }: { className?: string; id?: string }) {
  return (
    <svg id={id} className={className} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M24 6l3.2 14.8L42 24l-14.8 3.2L24 42l-3.2-14.8L6 24l14.8-3.2z" fill="currentColor" />
    </svg>
  );
}

export function Logo({ light = false, className = '' }: { light?: boolean; className?: string }) {
  // Wordmark lockup: mark, name and descriptor. Ink on light grounds, porcelain on dark.
  return (
    <svg
      viewBox="0 0 300 56"
      role="img"
      aria-label="Northstead Trust Wealth Management"
      className={`h-auto ${light ? 'text-porcelain' : 'text-ink'} ${className}`}
    >
      <g transform="translate(2 4)" className={light ? 'text-champagne' : 'text-oxblood'}>
        <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M24 6l3.2 14.8L42 24l-14.8 3.2L24 42l-3.2-14.8L6 24l14.8-3.2z" fill="currentColor" />
      </g>
      <text x="62" y="36" fill="currentColor" fontFamily="var(--font-serif)" fontSize="38">
        Northstead
      </text>
      <text x="222" y="35" fill="currentColor" fontFamily="var(--font-sans)" fontSize="13" fontWeight="600" letterSpacing="3.5">
        TRUST
      </text>
    </svg>
  );
}

type ArrowLinkProps = { to: string; children: ReactNode; className?: string; external?: boolean; download?: boolean };

/** Contextual CTA: text plus a circled arrow. Internal links use the router. */
export function ArrowLink({ to, children, className = '', external }: ArrowLinkProps) {
  const inner = (
    <>
      <span className="link-line">{children}</span>
      <span className="arrow-dot" aria-hidden>
        {external ? <ArrowUpRight size={16} strokeWidth={1.6} /> : <ArrowRight size={16} strokeWidth={1.6} />}
      </span>
    </>
  );
  if (external || /^(https?:|mailto:|tel:)/.test(to)) {
    const isWeb = to.startsWith('http');
    return (
      <a href={to} className={`arrow-link ${className}`} {...(isWeb ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
        {isWeb && <span className="visually-hidden"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <Link to={to} className={`arrow-link ${className}`}>
      {inner}
    </Link>
  );
}

/** Subtle magnetic pull for primary actions (fine pointers, motion allowed). */
export function Magnetic({ children, strength = 0.28, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
        const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          x((e.clientX - (r.left + r.width / 2)) * strength);
          y((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const leave = () => {
          x(0);
          y(0);
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        return () => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
        };
      });
    },
    { scope: ref },
  );
  return (
    <span ref={ref} className={`inline-flex max-w-full ${className}`}>
      {children}
    </span>
  );
}

export function ButtonLink({ to, children, variant = '', className = '' }: { to: string; children: ReactNode; variant?: string; className?: string }) {
  const cls = `btn ${variant} ${className}`;
  if (/^(https?:|mailto:|tel:)/.test(to)) {
    const isWeb = to.startsWith('http');
    return (
      <a href={to} className={cls} {...(isWeb ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={cls}>
      {children}
    </Link>
  );
}

/** Chapter marker: "02 / 07" with a label. */
export function Chapter({ n, label, light = false }: { n: string; label: string; light?: boolean }) {
  return (
    <p className={`t-kicker kicker-row ${light ? 'text-champagne' : 'text-taupe-ink'}`}>
      <span className="t-num text-[0.95rem] tracking-normal normal-case">{n}</span>
      <span>{label}</span>
    </p>
  );
}

export function Kicker({ children, light = false, className = '' }: { children: ReactNode; light?: boolean; className?: string }) {
  return <p className={`t-kicker kicker-row ${light ? 'text-champagne' : 'text-taupe-ink'} ${className}`}>{children}</p>;
}
