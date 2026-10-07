import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';
export const EASE = 'power3.out';

/**
 * Fades up every `[data-reveal]` element inside `scope` once it scrolls into view.
 * Elements sharing a `data-reveal-group` parent stagger together.
 */
export function revealOnScroll(scope: Element) {
    const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', scope);
    if (!items.length) return;
    gsap.set(items, { autoAlpha: 0, y: 18 });
    ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
            gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: EASE,
                stagger: 0.08,
                overwrite: true,
            }),
    });
}

export { gsap, ScrollTrigger, useGSAP };
