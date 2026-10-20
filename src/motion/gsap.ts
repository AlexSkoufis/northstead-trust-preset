import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, Flip, SplitText, useGSAP);
gsap.defaults({ ease: 'expo.out', duration: 1.1 });
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, Flip, SplitText, useGSAP };

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const EASE = 'expo.out';

/** Reveal starts are clamped so triggers near the page end still fire. */
export const START = 'clamp(top 88%)';

/**
 * Split a heading into words and lift them in. Words-only splitting keeps the
 * browser's own line breaking (inline-block words reflow on resize), there is
 * no overflow mask (nothing can clip ascenders or descenders), and the split
 * is reverted the moment the animation finishes.
 */
export function wordsIn(el: Element, vars: gsap.TweenVars = {}) {
  const split = SplitText.create(el, { type: 'words', wordsClass: 'split-word', aria: 'auto' });
  return gsap.from(split.words, {
    yPercent: 55,
    opacity: 0,
    rotate: 1.5,
    duration: 1.15,
    stagger: 0.045,
    ease: EASE,
    ...vars,
    onComplete() {
      split.revert();
      (vars.onComplete as (() => void) | undefined)?.();
    },
  });
}

/**
 * Declarative reveals for everything under `scope`:
 *   data-reveal="up"       fade + rise
 *   data-reveal="words"    word-by-word heading
 *   data-reveal="media"    clip-path wipe with inner image settle
 *   data-reveal="stagger"  children rise in sequence
 *   data-reveal="line"     hairline draws from the left
 *   data-parallax="12"     yPercent drift while scrolling (desktop only)
 *   data-drift            an image drifting inside its frame (desktop only)
 * Must be called inside a gsap context (useGSAP) so it reverts on unmount.
 */
export function wireReveals(scope: Element) {
  const mm = gsap.matchMedia();
  mm.add(MOTION_OK, () => {
    // Elements already on screen when the page mounts play straight away as a
    // short sequence. A ScrollTrigger whose start clamps to 0 can wait for
    // the first scroll event, which would leave above-the-fold content hidden.
    let shown = 0;
    scope.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      const kind = el.dataset.reveal;
      const inView = el.getBoundingClientRect().top < window.innerHeight;
      const delay = Number(el.dataset.delay ?? 0) + (inView ? 0.12 + Math.min(shown++, 6) * 0.1 : 0);
      const st = inView ? undefined : { trigger: el, start: START, once: true };
      if (kind === 'up') {
        gsap.from(el, { y: 36, opacity: 0, duration: 1.2, delay, scrollTrigger: st });
      } else if (kind === 'words') {
        const tween = wordsIn(el, { delay, paused: !inView });
        if (st) ScrollTrigger.create({ ...st, onEnter: () => void tween.play() });
      } else if (kind === 'media') {
        const img = el.querySelector('img');
        const tl = gsap.timeline({ delay, scrollTrigger: st });
        tl.fromTo(el, { clipPath: 'inset(18% 12% 18% 12%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', clearProps: 'clipPath' });
        if (img && !img.hasAttribute('data-drift')) tl.from(img, { scale: 1.22, duration: 1.8, ease: 'expo.out', clearProps: 'transform' }, 0);
      } else if (kind === 'stagger') {
        gsap.from(el.children, { y: 28, opacity: 0, duration: 1, stagger: 0.08, delay, scrollTrigger: st });
      } else if (kind === 'line') {
        gsap.from(el, { scaleX: 0, transformOrigin: '0 50%', duration: 1.6, ease: 'expo.inOut', delay, scrollTrigger: st });
      } else if (kind === 'fade') {
        gsap.from(el, { opacity: 0, duration: 1.4, delay, scrollTrigger: st });
      }
    });
  });
  mm.add(`${MOTION_OK} and (min-width: 64rem)`, () => {
    scope.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const amount = Number(el.dataset.parallax || 10);
      gsap.fromTo(
        el,
        { yPercent: -amount / 2 },
        { yPercent: amount / 2, ease: 'none', scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    });
    scope.querySelectorAll<HTMLElement>('[data-drift]').forEach((el) => {
      gsap.fromTo(
        el,
        { yPercent: -5, scale: 1.12 },
        { yPercent: 5, scale: 1.12, ease: 'none', scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    });
  });
  return mm;
}
