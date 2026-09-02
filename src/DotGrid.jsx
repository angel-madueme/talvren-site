import { useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

import './DotGrid.css';

gsap.registerPlugin(InertiaPlugin);

function hexToRgb(hex) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  };
}

const DotGrid = ({
  dotSize = 16,
  gap = 32,
  baseColor = '#5227FF',
  activeColor = '#5227FF',
  proximity = 150,
  speedTrigger = 100,
  shockRadius = 250,
  shockStrength = 5,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.5,
  className = '',
  style
}) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0
  });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const circlePath = useMemo(() => {
    if (typeof window === 'undefined' || !window.Path2D) return null;

    const p = new window.Path2D();
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return p;
  }, [dotSize]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = extraX / 2 + dotSize / 2;
    const startY = extraY / 2 + dotSize / 2;

    const dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        dots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  useEffect(() => {
    if (!circlePath) return;

    let rafId;
    const proxSq = proximity * proximity;
    const t0 = performance.now();
    const pr = pointerRef.current;
    let lastRipple = 0;
    let lastMouseRipple = 0;

    // Moderate push so dots glide rather than snap.
    const PUSH_SCALE = 0.72;

    // Real-cursor tracking (interaction on top of the ambient motion).
    const mouse = { x: 0, y: 0, vx: 0, vy: 0, active: false, lastX: 0, lastY: 0, lastT: 0 };
    const onMouseMove = (e) => {
      const cv = canvasRef.current;
      if (!cv) return;
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) {
        mouse.active = false;
        return;
      }
      const nowm = performance.now();
      const dt = mouse.lastT ? Math.max(1, nowm - mouse.lastT) : 16;
      mouse.vx = ((x - mouse.lastX) / dt) * 1000;
      mouse.vy = ((y - mouse.lastY) / dt) * 1000;
      mouse.lastX = x;
      mouse.lastY = y;
      mouse.lastT = nowm;
      mouse.x = x;
      mouse.y = y;
      mouse.active = true;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // One virtual pointer wanders the grid on a blend of two low frequencies
    // per axis — fluid, continuous, non-repeating motion (no fast jitter) so
    // the effect stays lively but smooth.
    const paths = [
      { fx: 0.5, gx: 0.31, fy: 0.42, gy: 0.27, ph: 0.0, prev: null }
    ];

    const applyInertia = (x, y, vx, vy, speed) => {
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - x, dot.cy - y);
        if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const pushX = (dot.cx - x) * PUSH_SCALE + vx * 0.005;
          const pushY = (dot.cy - y) * PUSH_SCALE + vy * 0.005;
          gsap.to(dot, {
            inertia: { xOffset: pushX, yOffset: pushY, resistance },
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: 'elastic.out(1,0.85)'
              });
              dot._inertiaApplied = false;
            }
          });
        }
      }
    };

    const draw = now => {
      const canvas = canvasRef.current;
      if (!canvas) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const w = rect.width || 1;
      const h = rect.height || 1;
      const t = (now - t0) * 0.001;

      // positions of both pointers — two blended low-freq sines per axis
      const pts = paths.map(p => ({
        x: w * (0.5 + 0.32 * Math.sin(t * p.fx + p.ph) + 0.14 * Math.sin(t * p.gx + p.ph + 1.1)),
        y: h * (0.5 + 0.32 * Math.sin(t * p.fy + p.ph + 1.7) + 0.14 * Math.cos(t * p.gy + p.ph))
      }));

      const doRipple = now - lastRipple > 36;
      pts.forEach((pt, i) => {
        const p = paths[i];
        if (p.prev && doRipple) {
          const dt = Math.max(1, now - p.prev.t);
          const vx = ((pt.x - p.prev.x) / dt) * 1000;
          const vy = ((pt.y - p.prev.y) / dt) * 1000;
          applyInertia(pt.x, pt.y, vx, vy, Math.hypot(vx, vy));
        }
        p.prev = { x: pt.x, y: pt.y, t: now };
      });
      if (doRipple) lastRipple = now;

      pr.x = pts[0].x;
      pr.y = pts[0].y;

      // While the cursor is over the grid, it drives the glow and adds ripples.
      if (mouse.active && now - mouse.lastT < 1200) {
        pr.x = mouse.x;
        pr.y = mouse.y;
        if (now - lastMouseRipple > 40) {
          applyInertia(mouse.x, mouse.y, mouse.vx, mouse.vy, Math.hypot(mouse.vx, mouse.vy));
          lastMouseRipple = now;
        }
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        rafId = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const dot of dotsRef.current) {
        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;

        // nearest of the two pointers drives the glow
        let dmin = Infinity;
        for (const pt of pts) {
          const dx = dot.cx - pt.x;
          const dy = dot.cy - pt.y;
          const dsq = dx * dx + dy * dy;
          if (dsq < dmin) dmin = dsq;
        }

        let style = baseColor;
        if (dmin <= proxSq) {
          const ti = 1 - Math.sqrt(dmin) / proximity;
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * ti);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * ti);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * ti);
          style = `rgb(${r},${g},${b})`;
        }

        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillStyle = style;
        ctx.fill(circlePath);
        ctx.restore();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [proximity, baseColor, activeRgb, baseRgb, circlePath, speedTrigger, resistance, returnDuration]);

  useEffect(() => {
    buildGrid();
    let ro = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(buildGrid);
      wrapperRef.current && ro.observe(wrapperRef.current);
    } else {
      window.addEventListener('resize', buildGrid);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', buildGrid);
    };
  }, [buildGrid]);

  return (
    <section className={`dot-grid ${className}`} style={style}>
      <div ref={wrapperRef} className="dot-grid__wrap">
        <canvas ref={canvasRef} className="dot-grid__canvas" />
      </div>
    </section>
  );
};

export default DotGrid;
