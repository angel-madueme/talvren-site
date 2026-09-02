import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import "./StarSwipe.css";

// Original conformal (log-polar) star-warp shader with a slow angular sweep,
// tinted with a blue -> purple blend. Full-screen fragment effect via ogl.

const hexToRgb = (hex) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return new Float32Array([1, 1, 1]);
  return new Float32Array([
    parseInt(m[1], 16) / 255,
    parseInt(m[2], 16) / 255,
    parseInt(m[3], 16) / 255,
  ]);
};

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uSweep;
uniform float uDensity;
uniform float uBrightness;
uniform float uOpacity;
uniform vec3 uColorA;
uniform vec3 uColorB;
out vec4 fragColor;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
  float r = length(uv) + 1e-3;
  float a = atan(uv.y, uv.x);
  float t = iTime;

  // Layered star tunnel in conformal log-polar space, streaming + sweeping.
  vec3 stars = vec3(0.0);
  const int LAYERS = 5;
  for (int i = 0; i < LAYERS; i++) {
    float fi = float(i);
    float depth = fract(-log(r) * 0.35 + t * uSpeed * (0.5 + 0.12 * fi) + fi * 0.2);
    float scale = mix(34.0, 7.0, depth) * uDensity;
    float ang = a + t * uSweep * (0.45 + 0.08 * fi);
    vec2 cell = vec2(ang / 6.28318 * scale, depth * scale);
    vec2 id = floor(cell);
    vec2 f = fract(cell) - 0.5;
    float h = hash21(id + fi * 23.0);
    if (h > 0.8) {
      vec2 sp = (fract(vec2(h * 41.0, h * 97.0)) - 0.5) * 0.6;
      vec2 df = (f - sp) * vec2(1.0, 0.4); // streak radially
      float d = length(df);
      float star = smoothstep(0.09, 0.0, d);
      float twinkle = 0.65 + 0.35 * sin(t * 3.0 + h * 40.0);
      float fade = smoothstep(0.0, 0.12, depth) * smoothstep(1.0, 0.72, depth);
      stars += star * twinkle * fade * (0.25 + 0.75 * depth);
    }
  }

  // Blue -> purple blend that also sweeps around, for a seamless mix.
  float mixT = clamp(0.5 + 0.5 * sin(a * 1.3 + t * 0.22), 0.0, 1.0);
  vec3 tint = mix(uColorA, uColorB, mixT);

  // Deep blended background glow toward the centre.
  float glow = smoothstep(1.15, 0.0, r);
  vec3 bg = mix(uColorB * 0.07, uColorA * 0.16, glow);

  vec3 col = bg + stars * tint * 2.3;
  col *= uBrightness;
  col = clamp(col, 0.0, 1.0);
  fragColor = vec4(col, uOpacity);
}
`;

export default function StarSwipe({
  colorA = "#98C1FF",
  colorB = "#BE9DFF",
  speed = 0.12,
  sweep = 0.06,
  density = 1.0,
  brightness = 1.0,
  opacity = 1.0,
  className = "",
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    mount.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iResolution: { value: new Float32Array([1, 1]) },
        iTime: { value: 0 },
        uSpeed: { value: speed },
        uSweep: { value: sweep },
        uDensity: { value: density },
        uBrightness: { value: brightness },
        uOpacity: { value: opacity },
        uColorA: { value: hexToRgb(colorA) },
        uColorB: { value: hexToRgb(colorB) },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const renderFrame = () => renderer.render({ scene: mesh });

    const setSize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h);
      const res = program.uniforms.iResolution.value;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
      renderFrame();
    };
    setSize();

    const ro = new ResizeObserver(setSize);
    ro.observe(mount);

    let frameId = null;
    let visible = false;
    let pageVisible = !document.hidden;
    const t0 = performance.now();

    const loop = (now) => {
      program.uniforms.iTime.value = (now - t0) * 0.001;
      renderFrame();
      frameId = requestAnimationFrame(loop);
    };
    const start = () => {
      if (visible && pageVisible && frameId === null) {
        frameId = requestAnimationFrame(loop);
      }
    };
    const stop = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        visible ? start() : stop();
      },
      { rootMargin: "100px" }
    );
    io.observe(mount);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      pageVisible ? start() : stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      program.remove();
      geometry.remove();
      renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
      if (mount.contains(canvas)) mount.removeChild(canvas);
    };
    // Props are static per placement; the scene builds once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={`star-swipe ${className}`.trim()} aria-hidden="true" />;
}
