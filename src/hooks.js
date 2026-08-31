import { useEffect, useRef } from "react";

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Adds .is-in to the element when it scrolls into view (one-shot).
 * Used with the .reveal CSS classes for entrance animations.
 */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/**
 * Scroll-scrubbed progress (0..1) written to --fill on the element.
 * Drives the signature headline text-fill effect. With reduced motion
 * the headline is simply shown fully filled.
 */
export function useScrollFill() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fill each line in reading order: line 1 completes before line 2 starts.
    // Global progress p (0..1) is split evenly across the lines, so line i
    // fills over its own slice [i/n, (i+1)/n].
    const lineEls = el.querySelectorAll(".scrub-line");
    const targets = lineEls.length ? Array.from(lineEls) : [el];
    const n = targets.length;
    const applyFill = (p) => {
      for (let i = 0; i < n; i++) {
        const lf = Math.min(1, Math.max(0, p * n - i));
        targets[i].style.setProperty("--fill", lf.toFixed(4));
      }
    };

    if (prefersReducedMotion()) {
      applyFill(1);
      return;
    }

    // Progress source. When the headline sits inside a sticky scroll wrapper
    // (.who-scroll), the fill is driven by how far we've scrolled through the
    // pinned range: 0 the moment the panel pins (headline empty and fully in
    // view), 1 a little before it unpins so the finished headline holds briefly.
    // Otherwise fall back to a viewport-position sweep.
    const scroller = el.closest(".who-scroll");
    const computeTarget = () => {
      const vh = window.innerHeight;
      if (scroller) {
        const r = scroller.getBoundingClientRect();
        const dist = (r.height - vh) * 0.85;
        if (dist <= 0) return 0;
        return Math.min(1, Math.max(0, -r.top / dist));
      }
      const r = el.getBoundingClientRect();
      const start = vh * 0.85; // empty until the headline is comfortably in view
      const end = vh * 0.15; // then line 1 onward fill as you keep scrolling
      return Math.min(1, Math.max(0, (start - r.top) / (start - end)));
    };

    // Ease the applied value toward the scroll target each frame so the fill
    // glides fluidly instead of snapping 1:1 to the scroll position.
    let target = computeTarget();
    let current = target;
    let raf = null;
    const EASE = 0.12;

    const tick = () => {
      current += (target - current) * EASE;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        applyFill(current);
        raf = null; // settled — stop the loop until the next scroll
        return;
      }
      applyFill(current);
      raf = requestAnimationFrame(tick);
    };
    const ensureRunning = () => {
      if (raf === null) raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      target = computeTarget();
      ensureRunning();
    };

    applyFill(current);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}
