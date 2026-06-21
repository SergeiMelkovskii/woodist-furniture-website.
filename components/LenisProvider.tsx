'use client';

import { useEffect } from 'react';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let frame: number;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    let current = window.scrollY;
    let target = window.scrollY;
    let raf = false;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      target += e.deltaY;
      target = Math.max(0, Math.min(target, document.documentElement.scrollHeight - window.innerHeight));
      if (!raf) {
        raf = true;
        frame = requestAnimationFrame(loop);
      }
    };

    const loop = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.5) {
        current = target;
        raf = false;
        window.scrollTo(0, current);
        return;
      }
      current += diff * 0.12;
      window.scrollTo(0, current);
      frame = requestAnimationFrame(loop);
    };

    const onResize = () => {
      target = window.scrollY;
      current = window.scrollY;
    };

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('wheel', onWheel, { passive: true });
      window.addEventListener('resize', onResize);
    }

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <>{children}</>;
}
