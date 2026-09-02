import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./hooks.js";

/*
 * Custom cursor: a small arrow that replaces the native pointer, trailed by a
 * rounded name tag. Both glide toward the mouse (eased) for a fluid follow.
 * Uses the brand blue, and flips to white over the blue Services panel.
 * Desktop pointers only; disabled for touch and reduced-motion.
 */
export default function UserCursor({ name = "ME" }) {
  const arrowRef = useRef(null);
  const tagRef = useRef(null);
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !prefersReducedMotion()
  );

  useEffect(() => {
    if (!enabled) return;
    const arrow = arrowRef.current;
    const tag = tagRef.current;
    if (!arrow || !tag) return;

    document.body.classList.add("cursor-hidden");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let ax = mx;
    let ay = my; // arrow (tighter follow)
    let tx = mx;
    let ty = my; // tag (laggier trail)
    let shown = false;
    let raf = 0;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!shown) {
        shown = true;
        arrow.style.opacity = "1";
        tag.style.opacity = "1";
      }
      // White over the blue panel background (but not over its white cards).
      const el = document.elementFromPoint(mx, my);
      const light = !!(el && el.closest(".panel-blue") && !el.closest(".card"));
      arrow.classList.toggle("is-light", light);
      tag.classList.toggle("is-light", light);
    };

    const hide = () => {
      shown = false;
      arrow.style.opacity = "0";
      tag.style.opacity = "0";
    };
    const onOut = (e) => {
      if (!e.relatedTarget) hide();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onOut);
    window.addEventListener("blur", hide);

    const tick = () => {
      ax += (mx - ax) * 0.35;
      ay += (my - ay) * 0.35;
      tx += (ax - tx) * 0.16;
      ty += (ay - ty) * 0.16;
      arrow.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
      tag.style.transform = `translate3d(${tx + 12}px, ${ty + 20}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onOut);
      window.removeEventListener("blur", hide);
      document.body.classList.remove("cursor-hidden");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div className="user-cursor__arrow" ref={arrowRef} aria-hidden="true">
        <svg width="16" height="22" viewBox="0 0 12 17" fill="none">
          <path d="M0 0 L0 15 L4 11.5 L6.3 16.6 L8.6 15.6 L6.3 10.6 L11 10.6 Z" />
        </svg>
      </div>
      <div className="user-cursor__tag" ref={tagRef} aria-hidden="true">
        {name}
      </div>
    </>
  );
}
