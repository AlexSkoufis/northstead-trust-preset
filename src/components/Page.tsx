import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Meta } from '../lib/meta';
import { ScrollTrigger, useGSAP, wireReveals } from '../motion/gsap';
import { scrollToEl, scrollToTop } from '../motion/smooth';

type Props = { title: string; description: string; image?: string; children: ReactNode; className?: string };

/** Page wrapper: document meta, declarative reveals, hash scrolling. */
export function Page({ title, description, image, children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { hash } = useLocation();

  // Reset scroll before this page creates its ScrollTriggers.
  useLayoutEffect(() => {
    if (!window.location.hash) scrollToTop();
  }, []);

  useGSAP(
    () => {
      wireReveals(ref.current!);
      // Positions settle once fonts and lazy images arrive.
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener('load', refresh, { once: true });
      const t = window.setTimeout(refresh, 600);
      return () => {
        window.clearTimeout(t);
        window.removeEventListener('load', refresh);
      };
    },
    { scope: ref },
  );

  useEffect(() => {
    if (!hash) return;
    const t = window.setTimeout(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) scrollToEl(el);
    }, 120);
    return () => window.clearTimeout(t);
  }, [hash]);

  return (
    <div ref={ref} className={className}>
      <Meta title={title} description={description} image={image} />
      {children}
    </div>
  );
}
