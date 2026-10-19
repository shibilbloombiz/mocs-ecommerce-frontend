import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@tanstack/react-router";

// Backward-compatible Slide types
export type Slide = {
  bg: string;
  mobileBg?: string;
  isMobileMain?: boolean;
  to?: string;
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  subtitle?: string;
  cta?: string;
  mobileFocus?: "center" | "left" | "right";
  rightFocus?: boolean;
  objectFit?: "cover" | "contain";
  objectPosition?: "center" | "top" | "bottom" | "left" | "right";
};

export const DEFAULT_HERO_SLIDES: Slide[] = [
  {
    bg: "/hero-comfort-banner.jpg",
    mobileBg: "/hero-comfort-banner.jpg",
    to: "/shop",
  },
];

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[100dvh] min-h-[640px] bg-[#050504] overflow-hidden flex items-center justify-center">
      <div className="w-24 h-24 rounded-full bg-[#ff6a00]/20 blur-3xl animate-pulse" />
    </div>
  );
}

/**
 * =========================================================================
 * MOCS FOOTWEAR - HERO PRODUCT CONFIGURATION
 * =========================================================================
 */
export const HERO_PRODUCTS = [
  {
    id: "aero-pulse-01",
    name: "AERO-PULSE 01",
    tagline: "Engineered Hyper-Responsive PU Foam",
    price: "$189",
    category: "HIGH-RESPONSE RUNNER",
    to: "/shop",
    colors: {
      upper: "#1c1c1f",
      toeCap: "#2a2a2e",
      accent: "#ff6a00",
      accentSecondary: "#ffa347",
      laces: "#ffffff",
      midsole: "#f4f4f6",
      midsoleAccent: "#ff6a00",
      outsole: "#0f0f12",
    },
    image: null,
  },
  {
    id: "hydro-drift-02",
    name: "HYDRO-DRIFT 02",
    tagline: "All-Terrain Hydrophobic Breathable Knit",
    price: "$215",
    category: "TRAIL & SLIPSTREAM",
    to: "/shop",
    colors: {
      upper: "#111114",
      toeCap: "#222226",
      accent: "#ff8c00",
      accentSecondary: "#ffc83b",
      laces: "#ff8c00",
      midsole: "#2b2b30",
      midsoleAccent: "#1a1a1d",
      outsole: "#ff8c00",
    },
    image: null,
  },
  {
    id: "solar-glide-03",
    name: "SOLAR-GLIDE 03",
    tagline: "Ultra-Lightweight Daily Recovery Moccasin",
    price: "$165",
    category: "LUXURY ERGONOMIC MOCCASIN",
    to: "/shop",
    colors: {
      upper: "#261e1b",
      toeCap: "#3b2b24",
      accent: "#ea580c",
      accentSecondary: "#f59e0b",
      laces: "#d8ccbc",
      midsole: "#faf7f2",
      midsoleAccent: "#ea580c",
      outsole: "#1a1614",
    },
    image: null,
  },
];

// Procedural 1024x640 Canvas Shoe Generator
function createShoeTextureCanvas(product: typeof HERO_PRODUCTS[0]) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const c = product.colors;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(512, 340);
  ctx.rotate(-0.08); // ~4.6 deg toe-up angle
  ctx.translate(-512, -340);

  // Soft Ambient Cast Shadow under Upper onto Midsole
  ctx.save();
  ctx.filter = "blur(12px)";
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.beginPath();
  ctx.ellipse(512, 420, 360, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Outsole
  const outsolePath = new Path2D();
  outsolePath.moveTo(210, 420);
  outsolePath.bezierCurveTo(210, 455, 320, 465, 480, 460);
  outsolePath.bezierCurveTo(640, 455, 780, 435, 845, 385);
  outsolePath.lineTo(840, 375);
  outsolePath.bezierCurveTo(775, 420, 635, 442, 480, 448);
  outsolePath.bezierCurveTo(320, 452, 215, 440, 210, 420);
  outsolePath.closePath();

  const outGrad = ctx.createLinearGradient(200, 460, 850, 400);
  outGrad.addColorStop(0, c.outsole);
  outGrad.addColorStop(0.5, c.accent);
  outGrad.addColorStop(1, c.outsole);
  ctx.fillStyle = outGrad;
  ctx.fill(outsolePath);

  // Tread Grooves
  ctx.save();
  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.lineWidth = 3;
  for (let x = 280; x < 800; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, 430);
    ctx.lineTo(x + 16, 455);
    ctx.stroke();
  }
  ctx.restore();

  // Midsole
  const midPath = new Path2D();
  midPath.moveTo(205, 400);
  midPath.bezierCurveTo(200, 430, 215, 448, 290, 452);
  midPath.bezierCurveTo(440, 458, 620, 444, 760, 412);
  midPath.bezierCurveTo(810, 400, 848, 382, 855, 360);
  midPath.bezierCurveTo(845, 360, 800, 372, 730, 376);
  midPath.bezierCurveTo(620, 382, 450, 384, 340, 380);
  midPath.bezierCurveTo(270, 378, 220, 382, 205, 400);
  midPath.closePath();

  const midGrad = ctx.createLinearGradient(200, 360, 850, 460);
  midGrad.addColorStop(0, c.midsole);
  midGrad.addColorStop(0.4, "#ffffff");
  midGrad.addColorStop(0.7, c.midsole);
  midGrad.addColorStop(1, c.midsole);
  ctx.fillStyle = midGrad;
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 10;
  ctx.fill(midPath);
  ctx.shadowColor = "transparent";

  // Midsole Air Core Chamber
  const chamberPath = new Path2D();
  chamberPath.moveTo(270, 418);
  chamberPath.bezierCurveTo(340, 415, 430, 420, 490, 425);
  chamberPath.bezierCurveTo(490, 438, 430, 444, 340, 442);
  chamberPath.bezierCurveTo(270, 440, 260, 430, 270, 418);
  chamberPath.closePath();

  const chGrad = ctx.createLinearGradient(270, 420, 490, 435);
  chGrad.addColorStop(0, c.accent);
  chGrad.addColorStop(0.5, c.accentSecondary);
  chGrad.addColorStop(1, c.accent);
  ctx.fillStyle = chGrad;
  ctx.fill(chamberPath);

  // MOCS Branding
  ctx.save();
  ctx.font = "800 13px 'Unbounded', sans-serif";
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillText("MOCS PU•CORE", 330, 410);
  ctx.restore();

  // Upper Body
  const upperPath = new Path2D();
  upperPath.moveTo(215, 385);
  upperPath.bezierCurveTo(210, 340, 225, 270, 270, 220);
  upperPath.bezierCurveTo(285, 205, 320, 215, 350, 245);
  upperPath.bezierCurveTo(380, 265, 430, 230, 475, 185);
  upperPath.bezierCurveTo(520, 205, 620, 265, 720, 310);
  upperPath.bezierCurveTo(780, 335, 830, 345, 848, 358);
  upperPath.bezierCurveTo(840, 368, 780, 375, 710, 376);
  upperPath.bezierCurveTo(560, 380, 380, 382, 215, 385);
  upperPath.closePath();

  const upperGrad = ctx.createLinearGradient(240, 180, 780, 380);
  upperGrad.addColorStop(0, c.upper);
  upperGrad.addColorStop(0.45, "#25252b");
  upperGrad.addColorStop(1, c.upper);
  ctx.fillStyle = upperGrad;
  ctx.fill(upperPath);

  // Texture Hatch Lines
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 28; i++) {
    ctx.beginPath();
    ctx.moveTo(320 + i * 16, 230 + i * 4);
    ctx.bezierCurveTo(400 + i * 14, 270 + i * 3, 500 + i * 12, 330, 520 + i * 10, 378);
    ctx.stroke();
  }
  ctx.restore();

  // Heel Counter
  const heelPath = new Path2D();
  heelPath.moveTo(215, 385);
  heelPath.bezierCurveTo(210, 330, 225, 265, 270, 225);
  heelPath.bezierCurveTo(285, 245, 290, 290, 285, 340);
  heelPath.bezierCurveTo(280, 368, 260, 382, 215, 385);
  heelPath.closePath();

  const heelGrad = ctx.createLinearGradient(210, 230, 285, 380);
  heelGrad.addColorStop(0, c.toeCap);
  heelGrad.addColorStop(1, "#0d0d0f");
  ctx.fillStyle = heelGrad;
  ctx.fill(heelPath);

  // Toe Cap
  const toePath = new Path2D();
  toePath.moveTo(710, 345);
  toePath.bezierCurveTo(760, 325, 820, 338, 848, 358);
  toePath.bezierCurveTo(840, 372, 790, 376, 725, 376);
  toePath.bezierCurveTo(705, 374, 695, 355, 710, 345);
  toePath.closePath();

  const toeGrad = ctx.createLinearGradient(700, 330, 850, 375);
  toeGrad.addColorStop(0, c.toeCap);
  toeGrad.addColorStop(1, c.upper);
  ctx.fillStyle = toeGrad;
  ctx.fill(toePath);

  // MOCS Dynamic Wave Wing Stripe
  const wingPath = new Path2D();
  wingPath.moveTo(330, 310);
  wingPath.bezierCurveTo(450, 290, 600, 280, 740, 335);
  wingPath.bezierCurveTo(680, 345, 540, 352, 400, 356);
  wingPath.bezierCurveTo(360, 355, 335, 335, 330, 310);
  wingPath.closePath();

  const wingGrad = ctx.createLinearGradient(330, 300, 740, 350);
  wingGrad.addColorStop(0, c.accent);
  wingGrad.addColorStop(0.65, c.accentSecondary);
  wingGrad.addColorStop(1, c.accent);
  ctx.fillStyle = wingGrad;
  ctx.shadowColor = c.accent;
  ctx.shadowBlur = 18;
  ctx.fill(wingPath);
  ctx.shadowColor = "transparent";

  // White Speed Ribbon
  const ribbonPath = new Path2D();
  ribbonPath.moveTo(380, 290);
  ribbonPath.bezierCurveTo(480, 265, 590, 280, 690, 328);
  ribbonPath.lineTo(670, 334);
  ribbonPath.bezierCurveTo(570, 290, 470, 275, 380, 298);
  ribbonPath.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.globalAlpha = 0.85;
  ctx.fill(ribbonPath);
  ctx.globalAlpha = 1.0;

  // Laces
  ctx.save();
  ctx.lineWidth = 5.5;
  ctx.lineCap = "round";
  ctx.strokeStyle = c.laces;
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 6;
  const laceCoords = [
    [415, 235, 455, 220],
    [445, 255, 495, 238],
    [480, 275, 535, 258],
    [520, 295, 575, 280],
    [565, 312, 615, 300],
  ];
  laceCoords.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(x1 + 15, y1 - 10, x2 - 15, y2 - 5, x2, y2);
    ctx.stroke();

    ctx.fillStyle = "#a1a1aa";
    ctx.beginPath();
    ctx.arc(x1, y1, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x2, y2, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // Heel Pull-Tab
  const tabPath = new Path2D();
  tabPath.moveTo(260, 225);
  tabPath.bezierCurveTo(245, 200, 235, 175, 250, 165);
  tabPath.bezierCurveTo(260, 160, 270, 185, 275, 215);
  tabPath.closePath();
  ctx.fillStyle = c.accent;
  ctx.fill(tabPath);

  // Specular Top Rim Highlight
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.38)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(480, 190);
  ctx.bezierCurveTo(550, 230, 680, 290, 810, 340);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
  return canvas;
}

// WebGL Shaders
const VERTEX_SHADER_SRC = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision highp float;

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uS;
  uniform float uSurge;
  uniform sampler2D uShoeTex;

  const mat2 m = mat2(1.6, 1.2, -1.2, 1.6);

  float hash(vec2 p) {
    p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
    return -1.0 + 2.0 * fract(p.x * p.y * (p.x + p.y));
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)),
                   hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)),
                   hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p) {
    float val = 0.0;
    val += 0.5000 * noise(p); p = m * p;
    val += 0.2500 * noise(p); p = m * p;
    val += 0.1250 * noise(p); p = m * p;
    val += 0.0625 * noise(p); p = m * p;
    val += 0.03125 * noise(p);
    return val * 0.5 + 0.5;
  }

  float getFluid(vec2 p, float t, out vec2 outQ, out vec2 outR) {
    vec2 q = vec2(
      fbm(p + vec2(t)),
      fbm(p + vec2(5.2, 1.3) - t * 1.2)
    );

    vec2 r = vec2(
      fbm(p + 3.5 * q + vec2(1.7, 9.2) + t * 1.5),
      fbm(p + 3.5 * q + vec2(8.3, 2.8) - t)
    );

    outQ = q;
    outR = r;
    return fbm(p + 3.5 * r);
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);

    vec2 p = (uv - 0.5) * aspect * 1.6;
    float t = uTime * 0.09;

    // Mouse Interaction
    vec2 mouseP = (uMouse - 0.5) * aspect * 1.6;
    vec2 mDelta = p - mouseP;
    float mDist = length(mDelta);
    float mForce = smoothstep(0.72, 0.0, mDist);
    p += vec2(-mDelta.y, mDelta.x) * (mForce * 0.38) + mDelta * (mForce * 0.18);

    // Transition Surge Vortex
    vec2 cDelta = p - vec2(0.0, (0.57 - 0.5) * 1.6);
    float cDist = length(cDelta);
    float swirl = uSurge * 2.6 * exp(-cDist * 1.55);
    float cosS = cos(swirl);
    float sinS = sin(swirl);
    p = vec2(p.x * cosS - p.y * sinS, p.x * sinS + p.y * cosS);

    // Domain Warped Fluid
    vec2 q, r;
    float f = getFluid(p, t, q, r);

    // Finite Differences Normal
    float eps = 0.02;
    vec2 dummyQ, dummyR;
    float fRight = getFluid(p + vec2(eps, 0.0), t, dummyQ, dummyR);
    float fUp    = getFluid(p + vec2(0.0, eps), t, dummyQ, dummyR);

    float dfdx = (fRight - f) / eps;
    float dfdy = (fUp - f) / eps;
    vec3 nor = normalize(vec3(-dfdx * 35.0, -dfdy * 35.0, 1.0));

    vec3 lightDir = normalize(vec3(-0.5, 0.6, 0.65));
    float diff = clamp(dot(nor, lightDir), 0.0, 1.0);

    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(clamp(dot(nor, halfDir), 0.0, 1.0), 22.0);

    // Color Ramp
    vec3 col = vec3(0.02, 0.02, 0.016);
    col = mix(col, vec3(0.60, 0.15, 0.02), smoothstep(0.30, 0.48, f));
    col = mix(col, vec3(1.0, 0.416, 0.0), smoothstep(0.46, 0.62, f));
    col = mix(col, vec3(1.0, 0.68, 0.25), smoothstep(0.62, 0.80, f));

    col *= 1.0 - smoothstep(0.42, 0.88, q.y) * 0.72;
    col *= (0.65 + 0.50 * diff);

    float isOrange = smoothstep(0.30, 0.50, f);
    col += spec * vec3(1.0, 0.88, 0.65) * 1.35 * isOrange;

    float edge = 1.0 - smoothstep(0.0, 0.018, abs(f - 0.48));
    col += edge * vec3(1.0, 0.75, 0.35) * 0.82;

    // Dark Radial Vignette behind Shoe
    vec2 shoeCenterPos = vec2(0.5, 0.57);
    float shoeDist = length((uv - shoeCenterPos) * aspect);
    float shoeBgVig = smoothstep(0.16, 0.46, shoeDist);
    col *= mix(0.40, 1.0, shoeBgVig);

    // Edge Vignette
    float edgeVig = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y) * 16.0;
    col *= clamp(pow(edgeVig, 0.25), 0.0, 1.0);

    // Shoe Rendering & Liquid Transition
    float shoeAspect = 1024.0 / 640.0;
    float shoeW = min(uResolution.x * 0.86, uResolution.y * 0.5 * shoeAspect);
    float shoeH = shoeW / shoeAspect;

    vec2 shoeSizeUV = vec2(shoeW / uResolution.x, shoeH / uResolution.y);

    float bob = sin(uTime * 1.2) * 0.012;
    float sinkOffset = -uS * (0.28 * shoeSizeUV.y);
    vec2 currentCenter = vec2(0.5, 0.57 + bob + sinkOffset);

    float currentScale = mix(1.0, 0.82, uS);
    vec2 effectiveSize = shoeSizeUV * currentScale;

    // Contact Shadow
    vec2 shadowOrigin = vec2(0.5, 0.57 - shoeSizeUV.y * 0.45);
    vec2 shadowDistVec = (uv - shadowOrigin) * aspect;
    float shadowRadius = length(vec2(shadowDistVec.x / (shoeSizeUV.x * 0.42 * aspect.x), shadowDistVec.y / (shoeSizeUV.y * 0.11)));
    float contactShadow = smoothstep(1.0, 0.0, shadowRadius) * 0.65 * (1.0 - uS);
    col *= (1.0 - contactShadow);

    float tilt = (uMouse.x - 0.5) * -0.06;
    float cosT = cos(tilt);
    float sinT = sin(tilt);

    vec2 delta = uv - currentCenter;
    delta.x *= aspect.x;
    vec2 rotDelta = vec2(delta.x * cosT - delta.y * sinT, delta.x * sinT + delta.y * cosT);
    rotDelta.x /= aspect.x;

    vec2 shoeUV = rotDelta / effectiveSize + 0.5;

    if (shoeUV.x >= 0.0 && shoeUV.x <= 1.0 && shoeUV.y >= 0.0 && shoeUV.y <= 1.0) {
      vec2 sampleUV = shoeUV;
      vec2 wobble = vec2(
        sin(shoeUV.y * 24.0 + uTime * 4.2),
        cos(shoeUV.x * 22.0 + uTime * 3.6)
      ) * (0.026 * uS);
      sampleUV += wobble;
      sampleUV = clamp(sampleUV, 0.002, 0.998);

      vec4 shoeTex = texture2D(uShoeTex, sampleUV);

      if (shoeTex.a > 0.008) {
        float xPhase = shoeUV.x * 7.0 + uTime * 2.4;
        float waveRipple = 0.04 * sin(xPhase) + 0.016 * sin(shoeUV.x * 18.0 - uTime * 3.8);
        float surf = mix(-0.5, 0.5, uS) + waveRipple;

        float shoeRelY = shoeUV.y - 0.5;
        float dSurf = shoeRelY - surf;

        vec3 underwaterCol = mix(col * 0.70, shoeTex.rgb * 0.22, 0.32);
        float underwaterAlpha = shoeTex.a * 0.32;

        float aboveFactor = smoothstep(-0.018, 0.018, dSurf);
        vec3 shoeColor = mix(underwaterCol, shoeTex.rgb, aboveFactor);
        float shoeAlpha = mix(underwaterAlpha, shoeTex.a, aboveFactor);

        float rimDist = abs(dSurf);
        float rim = (1.0 - smoothstep(0.0, 0.038, rimDist)) * shoeTex.a;
        float rimIntensity = (0.35 + 1.65 * sin(uS * 3.14159));
        vec3 rimColor = vec3(1.0, 0.65, 0.18) * 2.6;

        col = mix(col, shoeColor, shoeAlpha);
        col += rim * rimColor * rimIntensity;
      }
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ─── Main Hero Component ──────────────────────────────────────────────────────
export function Hero({
  slides = [],
}: {
  slides?: Slide[];
  collageImages?: any[];
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [textPhase, setTextPhase] = useState<"in" | "out">("in");

  // Keep references for animation loop
  const stateRef = useRef({
    currentIndex: 0,
    targetIndex: 0,
    isTransitioning: false,
    uS: 0.0,
    uSurge: 0.0,
    uTime: 0.0,
    integratedTime: 0.0,
    lastTime: performance.now(),
    targetMouse: { x: 0.5, y: 0.5 },
    smoothedMouse: { x: 0.5, y: 0.5 },
    gl: null as WebGLRenderingContext | null,
    program: null as WebGLProgram | null,
    textures: [] as WebGLTexture[],
    uniforms: {} as Record<string, WebGLUniformLocation>,
    animId: 0,
  });

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Navigation Trigger
  const navigate = useCallback(
    (newIndex: number) => {
      const state = stateRef.current;
      if (state.isTransitioning) return;

      const count = HERO_PRODUCTS.length;
      const target = (newIndex % count + count) % count;
      if (target === state.currentIndex) return;

      state.targetIndex = target;
      state.isTransitioning = true;
      setIsTransitioning(true);

      // Trigger Text Out animation
      setTextPhase("out");

      const sinkDuration = 1150;
      const riseDuration = 1400;
      const startTime = performance.now();

      const stepSink = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const p = Math.min(elapsed / sinkDuration, 1.0);

        state.uS = easeInOutCubic(p);
        state.uSurge = Math.sin(p * Math.PI * 0.5);

        if (p < 1.0) {
          requestAnimationFrame(stepSink);
        } else {
          // Midpoint swap
          state.currentIndex = state.targetIndex;
          setCurrentIndex(state.targetIndex);

          if (state.gl && state.textures[state.targetIndex]) {
            state.gl.activeTexture(state.gl.TEXTURE0);
            state.gl.bindTexture(state.gl.TEXTURE_2D, state.textures[state.targetIndex]);
          }

          // Trigger Text In
          setTextPhase("in");

          // Phase 2: Rise
          const riseStartTime = performance.now();
          const stepRise = (riseCurrentTime: number) => {
            const riseElapsed = riseCurrentTime - riseStartTime;
            const riseP = Math.min(riseElapsed / riseDuration, 1.0);

            state.uS = 1.0 - easeInOutCubic(riseP);
            state.uSurge = Math.cos(riseP * Math.PI * 0.5);

            if (riseP < 1.0) {
              requestAnimationFrame(stepRise);
            } else {
              state.uS = 0.0;
              state.uSurge = 0.0;
              state.isTransitioning = false;
              setIsTransitioning(false);
            }
          };

          requestAnimationFrame(stepRise);
        }
      };

      requestAnimationFrame(stepSink);
    },
    []
  );

  // WebGL & Render Loop Setup
  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl =
      canvas.getContext("webgl", { antialias: true, powerPreference: "high-performance" }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) return;
    const state = stateRef.current;
    state.gl = gl;

    // Helper: Compile shader
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    state.program = prog;
    gl.useProgram(prog);

    // Fullscreen single triangle buffer
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    state.uniforms = {
      uResolution: gl.getUniformLocation(prog, "uResolution")!,
      uTime: gl.getUniformLocation(prog, "uTime")!,
      uMouse: gl.getUniformLocation(prog, "uMouse")!,
      uS: gl.getUniformLocation(prog, "uS")!,
      uSurge: gl.getUniformLocation(prog, "uSurge")!,
      uShoeTex: gl.getUniformLocation(prog, "uShoeTex")!,
    };

    // Textures Creation
    state.textures = HERO_PRODUCTS.map((prod) => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      const offCanvas = createShoeTextureCanvas(prod);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, offCanvas);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      return tex;
    });

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, state.textures[0]);
    gl.uniform1i(state.uniforms.uShoeTex, 0);

    // Resize Handler
    const handleResize = () => {
      if (!canvas) return;
      const rawDpr = window.devicePixelRatio || 1;
      let dpr = Math.min(rawDpr, 1.25);
      if (window.innerWidth < 700) dpr *= 0.8;

      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // Mouse Tracking
    const handlePointer = (e: PointerEvent) => {
      state.targetMouse.x = e.clientX / window.innerWidth;
      state.targetMouse.y = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });

    // Render Loop
    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - state.lastTime) * 0.001, 0.1);
      state.lastTime = currentTime;

      state.integratedTime += dt * (1.0 + state.uSurge * 2.5);

      state.smoothedMouse.x += (state.targetMouse.x - state.smoothedMouse.x) * 0.05;
      state.smoothedMouse.y += (state.targetMouse.y - state.smoothedMouse.y) * 0.05;

      gl.useProgram(prog);
      gl.uniform2f(state.uniforms.uResolution, canvas.width, canvas.height);
      gl.uniform1f(state.uniforms.uTime, state.integratedTime);
      gl.uniform2f(state.uniforms.uMouse, state.smoothedMouse.x, state.smoothedMouse.y);
      gl.uniform1f(state.uniforms.uS, state.uS);
      gl.uniform1f(state.uniforms.uSurge, state.uSurge);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      state.animId = requestAnimationFrame(loop);
    };

    state.animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointer);
      cancelAnimationFrame(state.animId);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        navigate(currentIndex + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        navigate(currentIndex - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, navigate]);

  // Touch Swipe
  const touchStartRef = useRef({ x: 0, y: 0 });
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        navigate(currentIndex + 1);
      } else {
        navigate(currentIndex - 1);
      }
    }
  };

  // Autoplay (5.6s)
  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      if (!stateRef.current.isTransitioning) {
        navigate(currentIndex + 1);
      }
    }, 5600);
    return () => clearInterval(timer);
  }, [currentIndex, navigate, prefersReducedMotion]);

  const activeProduct = HERO_PRODUCTS[currentIndex];

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="MOCS Footwear Real-Time Liquid Hero"
      className="relative w-full h-[100dvh] min-h-[660px] overflow-hidden bg-[#050504] select-none text-white"
    >
      {/* ── Real-Time WebGL Fluid Background & Shoe Canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-[1] pointer-events-auto"
      />

      {/* ── Bottom 44% Dark Readability Gradient ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-[44%] z-[2] pointer-events-none bg-gradient-to-t from-[#050504]/95 via-[#050504]/70 to-transparent"
        aria-hidden="true"
      />

      {/* ── Center Product Content (Under the Shoe) ── */}
      <div className="absolute inset-x-0 bottom-[clamp(88px,13.5vh,140px)] z-[5] flex flex-col items-center text-center px-4 pointer-events-none">
        <div className="flex flex-col items-center max-w-4xl pointer-events-auto">
          {/* Counter */}
          <div
            className={`text-xs font-bold tracking-[0.28em] uppercase text-[#ff6a00] mb-2 drop-shadow-[0_0_14px_rgba(255,106,0,0.5)] transition-all duration-500 ease-in ${
              textPhase === "in"
                ? "opacity-100 translate-y-0 blur-0 delay-0 duration-900 ease-[cubic-bezier(0.16,1,0.3,1)]"
                : "opacity-0 translate-y-7 blur-[10px]"
            }`}
          >
            0{currentIndex + 1} / 0{HERO_PRODUCTS.length}
          </div>

          {/* Title */}
          <h1
            className={`font-['Unbounded',sans-serif] text-[clamp(26px,5.2vw,64px)] font-extrabold uppercase tracking-tight text-white mb-2 drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] transition-all duration-500 ease-in ${
              textPhase === "in"
                ? "opacity-100 translate-y-0 blur-0 delay-[90ms] duration-900 ease-[cubic-bezier(0.16,1,0.3,1)]"
                : "opacity-0 translate-y-7 blur-[10px]"
            }`}
          >
            {activeProduct.name}
          </h1>

          {/* Tagline */}
          <p
            className={`font-['Space_Grotesk',sans-serif] text-[clamp(13px,1.4vw,17px)] font-normal text-white/75 tracking-wider mb-5 max-w-xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] transition-all duration-500 ease-in ${
              textPhase === "in"
                ? "opacity-100 translate-y-0 blur-0 delay-[180ms] duration-900 ease-[cubic-bezier(0.16,1,0.3,1)]"
                : "opacity-0 translate-y-7 blur-[10px]"
            }`}
          >
            {activeProduct.tagline}
          </p>

          {/* Action Row */}
          <div
            className={`inline-flex items-center gap-5 transition-all duration-500 ease-in ${
              textPhase === "in"
                ? "opacity-100 translate-y-0 blur-0 delay-[270ms] duration-900 ease-[cubic-bezier(0.16,1,0.3,1)]"
                : "opacity-0 translate-y-7 blur-[10px]"
            }`}
          >
            <span className="font-['Unbounded',sans-serif] text-[clamp(18px,2vw,24px)] font-bold text-white tracking-tight">
              {activeProduct.price}
            </span>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2.5 bg-[#ff6a00] hover:bg-[#ff7b1c] text-[#050504] font-['Space_Grotesk',sans-serif] font-bold text-[clamp(13px,1.2vw,15px)] px-7 py-3 rounded-full shadow-[0_4px_24px_rgba(255,106,0,0.45)] hover:shadow-[0_8px_32px_rgba(255,106,0,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group"
            >
              <span>Shop now</span>
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="w-4 h-4 transition-transform duration-250 group-hover:translate-x-1"
              >
                <path
                  d="M4 10H16M16 10L11 5M16 10L11 15"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom Controls: Dots & Navigation Arrows ── */}
      <footer className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-6 sm:px-12 pb-[calc(clamp(16px,2.5vh,28px)+env(safe-area-inset-bottom,0px))] pointer-events-none">
        {/* Progress Dots */}
        <div
          className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-3.5 py-2 rounded-full backdrop-blur-md pointer-events-auto"
          role="tablist"
          aria-label="Shoe Selection"
        >
          {HERO_PRODUCTS.map((prod, idx) => (
            <button
              key={prod.id}
              onClick={() => navigate(idx)}
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={prod.name}
              className={`h-2.5 rounded-full transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                idx === currentIndex
                  ? "w-8 bg-[#ff6a00] shadow-[0_0_12px_rgba(255,106,0,0.7)]"
                  : "w-2.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Prev / Next Arrows */}
        <div className="inline-flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => navigate(currentIndex - 1)}
            aria-label="Previous Shoe"
            disabled={isTransitioning}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/5 hover:bg-[#ff6a00] border border-white/10 hover:border-[#ff6a00] text-white hover:text-[#050504] flex items-center justify-center backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-250 hover:shadow-[0_4px_20px_rgba(255,106,0,0.45)] disabled:opacity-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={() => navigate(currentIndex + 1)}
            aria-label="Next Shoe"
            disabled={isTransitioning}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/5 hover:bg-[#ff6a00] border border-white/10 hover:border-[#ff6a00] text-white hover:text-[#050504] flex items-center justify-center backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-250 hover:shadow-[0_4px_20px_rgba(255,106,0,0.45)] disabled:opacity-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </footer>
    </section>
  );
}
