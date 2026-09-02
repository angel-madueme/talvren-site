import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import "./StarSwipe.css";

// Soft flowing warped light-bands (blue -> purple) on a light ground, with a
// gentle sweep and film grain. Full-screen fragment effect via ogl.

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
uniform float uScale;
uniform float uRotation;
uniform float uWarpStrength;
uniform float uWarpCurvature;
uniform float uWarpFalloff;
uniform float uNoise;
uniform float uIntensity;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uBackground;
out vec4 fragColor;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
  uv /= uScale;
  float ca = cos(uRotation);
  float sa = sin(uRotation);
  uv = mat2(ca, -sa, sa, ca) * uv;

  float t = iTime * uSpeed;

  // Domain warp for the flowing, curved look.
  float warp = 0.0;
  warp += sin(uv.y * uWarpCurvature * 0.55 + t * 1.2) * 0.5;
  warp += sin((uv.x + uv.y) * 1.1 - t * 0.8) * 0.35;
  warp *= uWarpStrength;
  warp *= 1.0 / (1.0 + uWarpFalloff * 0.04 * dot(uv, uv)); // soften toward edges

  // Overlapping soft bands.
  float v = 0.0;
  v += sin(uv.x * 2.1 + warp * 3.0 + t) * 0.5 + 0.5;
  v += sin(uv.x * 1.3 - uv.y * 0.55 + warp * 2.0 - t * 0.7) * 0.25 + 0.25;
  v *= 0.6667;
  v = smoothstep(0.22, 0.95, v);

  // Blue <-> purple blend woven through the field.
  float cm = clamp(0.5 + 0.5 * sin(uv.y * 0.9 + warp + t * 0.4), 0.0, 1.0);
  vec3 ribbon = mix(uColorA, uColorB, cm);

  vec3 col = mix(uBackground, ribbon, v * uIntensity);

  // Film grain.
  float g = hash21(gl_FragCoord.xy + mod(iTime, 64.0) * 13.0);
  col += (g - 0.5) * uNoise * 0.05;

  col = clamp(col, 0.0, 1.0);
  fragColor = vec4(col, 1.0);
}
`;

export default function StarSwipe({
  colorA = "#98C1FF",
  colorB = "#BE9DFF",
  background = "#F4F4F4",
  speed = 0.34,
  scale = 1.3,
  rotation = 0.7,
  warpStrength = 1.2,
  warpCurvature = 5.6,
  warpFalloff = 4.0,
  noise = 0.84,
  intensity = 0.55,
  className = "",
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
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
        uScale: { value: scale },
        uRotation: { value: rotation },
        uWarpStrength: { value: warpStrength },
        uWarpCurvature: { value: warpCurvature },
        uWarpFalloff: { value: warpFalloff },
        uNoise: { value: noise },
        uIntensity: { value: intensity },
        uColorA: { value: hexToRgb(colorA) },
        uColorB: { value: hexToRgb(colorB) },
        uBackground: { value: hexToRgb(background) },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={`star-swipe ${className}`.trim()} aria-hidden="true" />;
}
