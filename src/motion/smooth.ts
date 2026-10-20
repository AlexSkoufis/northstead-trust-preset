import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

let lenis: Lenis | null = null;

/**
 * Optional smooth scrolling: only for fine pointers with motion allowed.
 * Native scrolling stays in charge everywhere else (touch, reduced motion).
 */
export function startSmoothScroll() {
  const ok = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches;
  if (!ok || lenis) return;
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, anchors: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

function tick(time: number) {
  lenis?.raf(time * 1000);
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
}

export function scrollToEl(el: Element) {
  const offset = -(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) * 16 || 76) - 24;
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset });
  else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}
