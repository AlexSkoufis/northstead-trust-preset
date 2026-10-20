import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { gsap, useGSAP } from '../motion/gsap';
import { Mark } from './ui';

export function Layout() {
  const { pathname } = useLocation();
  const curtain = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // All [data-intro] owners have set their own from-states by now.
  useEffect(() => {
    requestAnimationFrame(() => document.documentElement.classList.remove('intro-pending'));
  }, []);

  // Route change: lift a curtain off the new page.
  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline()
          .set(curtain.current, { visibility: 'visible', scaleY: 1, transformOrigin: '50% 0%' })
          .fromTo('#curtain-mark', { opacity: 1, y: 0 }, { opacity: 0, y: -16, duration: 0.45, ease: 'power2.in' }, 0.05)
          .to(curtain.current, { scaleY: 0, duration: 0.95, ease: 'expo.inOut' }, 0.15)
          .set(curtain.current, { visibility: 'hidden' });
      });
    },
    { dependencies: [pathname] },
  );

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <div id="page-root">
        <main id="main" tabIndex={-1} className="outline-none">
          <Suspense fallback={<div className="min-h-screen" />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
      <div ref={curtain} aria-hidden className="pointer-events-none fixed inset-0 z-[70] grid place-items-center bg-lake" style={{ visibility: 'hidden' }}>
        <Mark id="curtain-mark" className="w-14 text-champagne opacity-90" />
      </div>
    </>
  );
}
