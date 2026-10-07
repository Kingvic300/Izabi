import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/motion';

// Animates the leading number in `value` (e.g. "1,240", "+90", "60%") from 0.
export function CountUp({ value }: { value: string | number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const text = String(value);
    const match = text.match(/^([^\d-]*)(-?[\d,]*\.?\d+)(.*)$/);

    useGSAP(
        () => {
            if (!match || !ref.current) return;
            const [, prefix, num, suffix] = match;
            const target = Number(num.replace(/,/g, ''));
            if (!Number.isFinite(target) || target === 0) return;
            const decimals = num.includes('.') ? num.split('.')[1].length : 0;
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                const counter = { v: 0 };
                gsap.to(counter, {
                    v: target,
                    duration: 1.1,
                    ease: 'power2.out',
                    onComplete: () => {
                        if (ref.current) ref.current.textContent = text;
                    },
                    onUpdate: () => {
                        if (!ref.current) return;
                        ref.current.textContent =
                            prefix +
                            counter.v.toLocaleString(undefined, {
                                minimumFractionDigits: decimals,
                                maximumFractionDigits: decimals,
                            }) +
                            suffix;
                    },
                });
            });
            return () => mm.revert();
        },
        { dependencies: [text], revertOnUpdate: true },
    );

    // keyed so React owns a fresh text node whenever the value changes
    return (
        <span key={text} ref={ref}>
            {text}
        </span>
    );
}
