import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { getImageUrl } from "@/lib/utils";

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
    <div className="relative w-full h-[100dvh] min-h-[640px] bg-[#030303] overflow-hidden flex items-center justify-center">
      <div className="w-24 h-24 rounded-full bg-[#ff6600]/15 blur-3xl animate-pulse" />
    </div>
  );
}

/**
 * =========================================================================
 * MOCS FOOTWEAR - HERO PRODUCT CONFIGURATION
 * =========================================================================
 */
export type HeroProduct = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  category: string;
  to: string;
  image: string;
  productId?: string;
  colors?: {
    upper?: string;
    toeCap?: string;
    accent?: string;
    accentSecondary?: string;
    laces?: string;
    midsole?: string;
    midsoleAccent?: string;
    outsole?: string;
  };
};

export const DEFAULT_HERO_PRODUCTS: HeroProduct[] = [
  {
    id: "ladies-buckle-slide",
    name: "LADIES BUCKLE SLIDE",
    tagline: "Contoured anatomical footbed with crystal-embellished buckle strap and toe post.",
    price: "₹399",
    category: "SIGNATURE SLIDE",
    to: "/product/ladies-buckle-slide",
    productId: "ladies-buckle-slide",
    image: "/about-products/trans_mocs-sandal-buckle.png",
    colors: {
      upper: "#141416",
      toeCap: "#222226",
      accent: "#ff6600",
      accentSecondary: "#ff9933",
      laces: "#ffffff",
      midsole: "#f4f4f6",
      midsoleAccent: "#ff6600",
      outsole: "#0f0f12",
    },
  },
  {
    id: "comfort-wedge-slide",
    name: "COMFORT WEDGE SLIDE",
    tagline: "Shock-absorbing PU wedge with wood-textured grain and rhinestone square buckle.",
    price: "₹499",
    category: "ELEVATED COMFORT",
    to: "/product/comfort-wedge-slide",
    productId: "comfort-wedge-slide",
    image: "/about-products/trans_mocs-wedge-slide.png",
    colors: {
      upper: "#1c1c20",
      toeCap: "#ff6600",
      accent: "#ff6600",
      accentSecondary: "#ffb366",
      laces: "#ff6600",
      midsole: "#2b2b30",
      midsoleAccent: "#1a1a1d",
      outsole: "#ff6600",
    },
  },
  {
    id: "patent-cross-slide",
    name: "PATENT CROSSOVER SLIDE",
    tagline: "High-gloss crossover straps engineered with lightweight arch contouring.",
    price: "₹349",
    category: "LIFESTYLE LUXURY",
    to: "/product/patent-cross-slide",
    productId: "patent-cross-slide",
    image: "/about-products/trans_mocs-cross-slide.png",
    colors: {
      upper: "#261e1b",
      toeCap: "#3b2b24",
      accent: "#ff6600",
      accentSecondary: "#ffa347",
      laces: "#d8ccbc",
      midsole: "#faf7f2",
      midsoleAccent: "#ff6600",
      outsole: "#1a1614",
    },
  },
];

export const HERO_PRODUCTS = DEFAULT_HERO_PRODUCTS;

/**
 * Resolves the destination route for the Hero "Shop now" CTA.
 * Guarantees direct navigation to the exact product detail page.
 */
export function resolveHeroProductDestination(
  product: HeroProduct | undefined,
  catalogProducts?: { id?: string; _id?: string; name?: string; slug?: string; artNumber?: string }[]
): string {
  if (!product) return "/shop";

  // 1. Explicit `to` if already set to a product detail route
  const rawTo = (product.to || "").trim();
  if (rawTo && rawTo !== "/shop") {
    if (rawTo.startsWith("/products/")) {
      return "/product/" + rawTo.slice("/products/".length);
    }
    if (rawTo.startsWith("/product/")) {
      return rawTo;
    }
    return rawTo;
  }

  // 2. Explicit productId
  if (product.productId) {
    return `/product/${product.productId}`;
  }

  // 3. Fallback presets mapping for default models: direct to their exact slug
  if (product.id === "ladies-buckle-slide") {
    return "/product/ladies-buckle-slide";
  }
  if (product.id === "comfort-wedge-slide") {
    return "/product/comfort-wedge-slide";
  }
  if (product.id === "patent-cross-slide") {
    return "/product/patent-cross-slide";
  }

  // 4. Match against catalog products
  if (catalogProducts && catalogProducts.length > 0) {
    // Match by ID / _id / slug / artNumber
    if (product.id) {
      const idMatch = catalogProducts.find(
        (p) =>
          p.id === product.id ||
          p._id === product.id ||
          p.slug === product.id ||
          p.artNumber === product.id
      );
      if (idMatch) {
        return `/product/${idMatch.slug || idMatch._id || idMatch.id}`;
      }
    }

    const prodName = (product.name || "").toLowerCase().trim();

    // Exact name match
    const exactNameMatch = catalogProducts.find(
      (p) => p.name && p.name.toLowerCase().trim() === prodName
    );
    if (exactNameMatch) {
      return `/product/${exactNameMatch.slug || exactNameMatch._id || exactNameMatch.id}`;
    }

    // Substring name match
    const partialNameMatch = catalogProducts.find(
      (p) =>
        p.name &&
        (prodName.includes(p.name.toLowerCase()) ||
          p.name.toLowerCase().includes(prodName))
    );
    if (partialNameMatch) {
      return `/product/${partialNameMatch.slug || partialNameMatch._id || partialNameMatch.id}`;
    }
  }

  // 5. If product.id is a 24-character hex Mongo ID
  if (product.id && /^[0-9a-fA-F]{24}$/.test(product.id)) {
    return `/product/${product.id}`;
  }

  // 6. Generic product id fallback
  if (product.id && product.id !== "new-hero-product") {
    return `/product/${product.id}`;
  }

  // 7. Fallback to first available catalog product
  if (catalogProducts && catalogProducts.length > 0) {
    return `/product/${catalogProducts[0].slug || catalogProducts[0]._id || catalogProducts[0].id}`;
  }

  return "/shop";
}

// 1024x640 High-Res Shoe Canvas Generator with Real Product Image Support
function createShoeTextureCanvas(
  product: (typeof HERO_PRODUCTS)[0],
  onLoaded?: (canvas: HTMLCanvasElement) => void
) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const renderProductImage = (img: HTMLImageElement) => {
    ctx.clearRect(0, 0, 1024, 640);
    // Real footwear products: fit cleanly and prominently in the center
    const maxW = 760;
    const maxH = 520;
    const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;

    ctx.save();
    ctx.translate(512, 330);
    // Subtle, sleek 1.2-degree elevation (-0.02 rad)
    ctx.rotate(-0.02);
    ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();

    if (onLoaded) {
      onLoaded(canvas);
    }
  };

  if (product.image) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => renderProductImage(img);
    img.onerror = () => {
      const fallbackImg = new Image();
      fallbackImg.onload = () => renderProductImage(fallbackImg);
      fallbackImg.src = getImageUrl(product.image);
    };
    img.src = getImageUrl(product.image);
    if (img.complete && img.naturalWidth > 0) {
      renderProductImage(img);
    }
    return canvas;
  }

  const c = {
    upper: product.colors?.upper || "#141416",
    toeCap: product.colors?.toeCap || "#222226",
    accent: product.colors?.accent || "#ff6600",
    accentSecondary: product.colors?.accentSecondary || "#ff9933",
    laces: product.colors?.laces || "#ffffff",
    midsole: product.colors?.midsole || "#f4f4f6",
    midsoleAccent: product.colors?.midsoleAccent || "#ff6600",
    outsole: product.colors?.outsole || "#0f0f12",
  };
  ctx.clearRect(0, 0, 1024, 640);

  ctx.save();
  ctx.translate(512, 340);
  ctx.rotate(-0.08); // ~4.6 deg toe-up rotation
  ctx.translate(-512, -340);

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

  // Sipes
  ctx.save();
  ctx.strokeStyle = "rgba(0,0,0,0.45)";
  ctx.lineWidth = 3;
  for (let x = 280; x < 800; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, 430);
    ctx.lineTo(x + 16, 455);
    ctx.stroke();
  }
  ctx.restore();

  // Sculpted Midsole
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
  ctx.fill(midPath);

  // Accent chamber
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

  // Debossed branding
  ctx.save();
  ctx.font = "800 13px 'Unbounded', sans-serif";
  ctx.fillStyle = "rgba(0,0,0,0.3)";
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
  upperGrad.addColorStop(0.5, "#25252b");
  upperGrad.addColorStop(1, c.upper);
  ctx.fillStyle = upperGrad;
  ctx.fill(upperPath);

  // Heel Counter
  const heelPath = new Path2D();
  heelPath.moveTo(215, 385);
  heelPath.bezierCurveTo(210, 330, 225, 265, 270, 225);
  heelPath.bezierCurveTo(285, 245, 290, 290, 285, 340);
  heelPath.bezierCurveTo(280, 368, 260, 382, 215, 385);
  heelPath.closePath();
  ctx.fillStyle = c.toeCap;
  ctx.fill(heelPath);

  // Toe Cap
  const toePath = new Path2D();
  toePath.moveTo(710, 345);
  toePath.bezierCurveTo(760, 325, 820, 338, 848, 358);
  toePath.bezierCurveTo(840, 372, 790, 376, 725, 376);
  toePath.bezierCurveTo(705, 374, 695, 355, 710, 345);
  toePath.closePath();
  ctx.fillStyle = c.toeCap;
  ctx.fill(toePath);

  // Accent Wing Stripe
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
  ctx.fill(wingPath);

  // Laces
  ctx.save();
  ctx.strokeStyle = c.laces;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  const lacePairs = [
    [445, 235, 490, 215],
    [480, 248, 525, 230],
    [518, 262, 560, 245],
    [555, 278, 595, 262],
    [590, 295, 628, 280],
  ];
  for (const [x1, y1, x2, y2] of lacePairs) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(x1 + 10, y1 - 10, x2 - 10, y2 - 5, x2, y2);
    ctx.stroke();
  }
  ctx.restore();

  ctx.restore();
  return canvas;
}

// =========================================================================
// RAW WEBGL1 SHADERS (HIGH-EFFICIENCY 3-OCTAVE VISCOUS FLUID)
// =========================================================================
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
  uniform float uTilt;
  uniform float uS;
  uniform float uSurge;
  uniform sampler2D uShoeTex;

  // 3-octave rotation matrix for smooth, broad, viscous shapes
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
                   hash(i + vec2(1.0, 1.0)), u.x), u.y) * 0.5 + 0.5;
  }

  // Fractional Brownian Motion (fBM) with ONLY 3 octaves for high performance
  float fbm(vec2 p) {
    float val = 0.0;
    val += 0.5333 * noise(p); p = m * p;
    val += 0.2667 * noise(p); p = m * p;
    val += 0.1333 * noise(p);
    return val * (1.0 / 0.9333);
  }

  // Fast 2-octave fBM for normal finite differences
  float fbmFast(vec2 p) {
    float val = 0.5333 * noise(p); p = m * p;
    val += 0.2667 * noise(p);
    return val * (1.0 / 0.8);
  }

  // Domain-warped viscous fluid
  float getFluid(vec2 p, float t) {
    vec2 q = vec2(
      fbm(p + vec2(t)),
      fbm(p + vec2(5.2, 1.3) - t * 1.2)
    );

    vec2 r = vec2(
      fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 1.5),
      fbm(p + 3.0 * q + vec2(8.3, 2.8) - t)
    );

    return fbm(p + 3.0 * r);
  }

  float getFluidFast(vec2 p, float t) {
    vec2 q = vec2(
      fbmFast(p + vec2(t)),
      fbmFast(p + vec2(5.2, 1.3) - t * 1.2)
    );
    return fbmFast(p + 3.0 * q + vec2(1.7, 9.2));
  }

  // Physical paint ridge height function centered at the 65% orange / 35% black boundary
  float H(float val) {
    float diff = (val - 0.34) * 7.2;
    return val * 0.7 + exp(-diff * diff) * 0.25;
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);

    // Coordinate space: slow, luxurious viscous movement
    vec2 p = (uv - 0.5) * aspect * 1.25;
    float t = uTime * 0.015;

    // Subtle cursor push
    vec2 mouseP = (uMouse - 0.5) * aspect * 1.25;
    vec2 d = p - mouseP;
    p -= d * exp(-dot(d, d) * 9.0) * 0.5;

    // Transition surge swirl around center
    vec2 centerP = vec2(0.0, (0.63 - 0.5) * 1.25);
    vec2 c = p - centerP;
    p += vec2(-c.y, c.x) * (uSurge * 2.2 * exp(-dot(c, c) * 3.5));

    // Fluid field evaluation
    float f = getFluid(p, t);

    // Two separate paints: calibrated to 65% orange, 35% deep glossy black
    float pm = smoothstep(0.26, 0.42, f);

    // Flat, natural burnt-orange shading (strictly NO glow, bloom, or neon)
    vec3 deepOrange = vec3(0.55, 0.12, 0.01);
    vec3 pureOrange = vec3(1.0, 0.40, 0.02);
    vec3 orangeShade = mix(deepOrange, pureOrange, smoothstep(0.32, 0.52, f));
    vec3 basePaint = mix(vec3(0.012), orangeShade, pm);

    // Normal derived from finite differences of H(f) with optimized normal sampler
    float eps = 0.015;
    float fR = getFluidFast(p + vec2(eps, 0.0), t);
    float fU = getFluidFast(p + vec2(0.0, eps), t);
    float hC = H(f);
    float dhdx = (H(fR) - hC) / eps;
    float dhdy = (H(fU) - hC) / eps;
    vec3 n = normalize(vec3(-dhdx * 16.0, -dhdy * 16.0, 1.0));

    // Dual-light diffuse lighting
    vec3 L1 = normalize(vec3(-0.5, 0.6, 0.65));
    vec3 L2 = normalize(vec3(0.7, -0.4, 0.5));
    vec3 col = basePaint * (0.6 + 0.55 * max(dot(n, L1), 0.0) + 0.2 * max(dot(n, L2), 0.0));

    // Soft white specular highlight
    col += vec3(1.0, 0.9, 0.8) * pow(max(dot(reflect(-L1, n), vec3(0.0, 0.0, 1.0)), 0.0), 45.0) * 0.4;

    // Subtle readability vignette behind shoe
    vec2 cVig = (uv - vec2(0.5, 0.63)) * aspect;
    col *= (1.0 - (0.28 * (1.0 - uSurge * 0.4)) * exp(-dot(cVig * vec2(0.8, 1.1), cVig * vec2(0.8, 1.1)) * 2.2));

    // Light edge vignette
    vec2 edgeDist = (uv - 0.5) * 2.0;
    col *= clamp(1.0 - 0.12 * dot(edgeDist, edgeDist), 0.0, 1.0);

    // Shoe placement: elevated to upper-center so text sits clearly underneath
    float shoeAspect = 1.6;
    float isMobile = uResolution.x < 768.0 ? 1.0 : 0.0;
    float maxShoeHeightFactor = mix(0.44, 0.38, isMobile);
    float shoeW = min(uResolution.x * (isMobile > 0.5 ? 0.90 : 0.84), uResolution.y * maxShoeHeightFactor * shoeAspect);
    float shoeH = shoeW / shoeAspect;
    vec2 shoeSizeUV = vec2(shoeW / uResolution.x, shoeH / uResolution.y);

    // Dynamic contact shadow under the shoe
    float shoeYCenter = mix(0.63, 0.60, isMobile);
    vec2 shadowDelta = (uv - vec2(0.5, shoeYCenter - shoeSizeUV.y * 0.35)) * aspect;
    col *= (1.0 - exp(-dot(shadowDelta * vec2(1.0, 4.4), shadowDelta * vec2(1.0, 4.4)) * 14.0) * 0.42 * (1.0 - uS));

    // Downward offset and scale during sink transition (gets submerged inside the liquid)
    float shoeScale = mix(1.0, 0.82, uS);
    float downOffset = 0.28 * shoeSizeUV.y * uS;
    vec2 shoeCenter = vec2(0.5, shoeYCenter + sin(uTime * 0.6) * 0.008 - downOffset);

    vec2 shoeUV = (uv - shoeCenter) / (shoeSizeUV * shoeScale);
    float cosT = cos(uTilt);
    float sinT = sin(uTilt);
    shoeUV = vec2(shoeUV.x * cosT - shoeUV.y * sinT, shoeUV.x * sinT + shoeUV.y * cosT);
    vec2 texCoord = shoeUV + 0.5;

    // Real-time Liquid Immersion: First product sinks inside the liquid, next product rises out
    if (texCoord.x >= 0.0 && texCoord.x <= 1.0 && texCoord.y >= 0.0 && texCoord.y <= 1.0) {
      vec2 wobble = vec2(
        sin(texCoord.y * 10.0 + uTime * 1.5) * 0.020 * uS,
        cos(texCoord.x * 9.0 + uTime * 1.2) * 0.015 * uS
      );
      vec4 shoeTex = texture2D(uShoeTex, clamp(texCoord + wobble, 0.0, 1.0));

      if (shoeTex.a > 0.01) {
        float shoeLocalX = (texCoord.x - 0.5) * 6.0;
        float waveRipple = 0.03 * sin(shoeLocalX * 5.0 + uTime * 1.2) + (noise(vec2(shoeLocalX * 3.5, uTime * 0.6)) - 0.5) * 0.025;
        float surfThreshold = mix(-0.55, 0.55, uS) + waveRipple;
        float localY = texCoord.y - 0.5;

        float distToSurf = abs(localY - surfThreshold);
        float rim = (1.0 - smoothstep(0.0, 0.035, distToSurf)) * (1.0 - uS * 0.5);

        if (localY >= surfThreshold) {
          // Above fluid surface: crisp shoe with subtle viscous meniscus rim
          vec3 shoeCol = mix(shoeTex.rgb, vec3(1.0, 0.45, 0.05), rim * 0.40);
          col = mix(col, shoeCol, shoeTex.a);
        } else {
          // Submerged inside fluid: gets swallowed by the liquid paint and fades into depth
          float ghostAlpha = 0.30 * (1.0 - uS) * shoeTex.a;
          col = mix(col, shoeTex.rgb * vec3(0.12, 0.05, 0.02), ghostAlpha);
        }
      }
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ─── Main Hero Component ──────────────────────────────────────────────────────
export interface HeroProps {
  slides?: Slide[];
  heroProducts?: HeroProduct[];
  products?: any[];
  collageImages?: any[];
}

export function Hero({
  slides = [],
  heroProducts,
  products = [],
}: HeroProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [textPhase, setTextPhase] = useState<"in" | "out">("in");
  const [webglFailed, setWebglFailed] = useState(false);

  // ── Custom Interactive Carousel Cursor Direct Hardware Refs (0% React churn) ──
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorInnerRef = useRef<HTMLDivElement | null>(null);
  const cursorLeftRef = useRef<SVGSVGElement | null>(null);
  const cursorRightRef = useRef<SVGSVGElement | null>(null);

  const productsList = useMemo(() => {
    if (heroProducts && Array.isArray(heroProducts) && heroProducts.length > 0) {
      return heroProducts;
    }
    return DEFAULT_HERO_PRODUCTS;
  }, [heroProducts]);

  // Mutable state preserved across RAF loops without triggering re-renders
  const stateRef = useRef({
    currentIndex: 0,
    targetIndex: 0,
    isTransitioning: false,
    needsRedraw: true,
    settleFrames: 10,
    uS: 0.0,
    uSurge: 0.0,
    integratedTime: 0.0,
    lastTime: performance.now(),
    targetMouse: { x: 0.5, y: 0.5 },
    smoothedMouse: { x: 0.5, y: 0.5 },
    smoothedTilt: 0.0,
    gl: null as WebGLRenderingContext | null,
    program: null as WebGLProgram | null,
    textures: [] as WebGLTexture[],
    uniforms: {} as Record<string, WebGLUniformLocation>,
    animId: 0,
    isVisible: true,
    isPageActive: true,
  });

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Navigation Transition Trigger
  const navigate = useCallback(
    (newIndex: number) => {
      const state = stateRef.current;
      if (state.isTransitioning) return;

      const count = productsList.length;
      const target = ((newIndex % count) + count) % count;
      if (target === state.currentIndex) return;

      state.targetIndex = target;
      state.isTransitioning = true;
      state.needsRedraw = true;
      setIsTransitioning(true);

      // Trigger Text Out: fade, translateY(28px), blur(10px) in 0.5s
      setTextPhase("out");

      const sinkDuration = 1150;
      const riseDuration = 1400;
      const startTime = performance.now();

      const stepSink = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const p = Math.min(elapsed / sinkDuration, 1.0);

        state.uS = easeInOutCubic(p);
        state.uSurge = Math.sin(p * Math.PI * 0.5);
        state.needsRedraw = true;

        if (p < 1.0) {
          requestAnimationFrame(stepSink);
        } else {
          // Midpoint swap
          state.currentIndex = state.targetIndex;
          setCurrentIndex(state.targetIndex);

          if (state.gl && state.textures[state.targetIndex] && state.gl.isTexture(state.textures[state.targetIndex])) {
            state.gl.activeTexture(state.gl.TEXTURE0);
            state.gl.bindTexture(state.gl.TEXTURE_2D, state.textures[state.targetIndex]);
          }

          // Trigger Text In (staggered CSS animations)
          setTextPhase("in");

          const riseStartTime = performance.now();
          const stepRise = (riseCurrentTime: number) => {
            const riseElapsed = riseCurrentTime - riseStartTime;
            const riseP = Math.min(riseElapsed / riseDuration, 1.0);

            state.uS = 1.0 - easeInOutCubic(riseP);
            state.uSurge = Math.cos(riseP * Math.PI * 0.5);
            state.needsRedraw = true;

            if (riseP < 1.0) {
              requestAnimationFrame(stepRise);
            } else {
              state.uS = 0.0;
              state.uSurge = 0.0;
              state.isTransitioning = false;
              state.settleFrames = 8;
              state.needsRedraw = true;
              setIsTransitioning(false);
            }
          };

          requestAnimationFrame(stepRise);
        }
      };

      requestAnimationFrame(stepSink);
    },
    [productsList]
  );

  // WebGL Setup & Animation Loop with Viewport + Visibility Pause
  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current) return;
    let isDisposed = false;

    const canvas = canvasRef.current;
    const gl =
      canvas.getContext("webgl", {
        alpha: false,
        depth: false,
        antialias: false,
        stencil: false,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
      }) ||
      (canvas.getContext("experimental-webgl", {
        preserveDrawingBuffer: true,
      }) as WebGLRenderingContext | null);

    if (!gl) {
      setWebglFailed(true);
      return;
    }

    const state = stateRef.current;
    state.gl = gl;

    // Shader Compilation
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("WebGL Shader error:", gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) {
      setWebglFailed(true);
      return;
    }

    const prog = gl.createProgram();
    if (!prog) {
      setWebglFailed(true);
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("WebGL Program link error:", gl.getProgramInfoLog(prog));
      setWebglFailed(true);
      return;
    }

    state.program = prog;
    gl.useProgram(prog);

    // Fullscreen single triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniform Locations
    state.uniforms = {
      uResolution: gl.getUniformLocation(prog, "uResolution")!,
      uTime: gl.getUniformLocation(prog, "uTime")!,
      uMouse: gl.getUniformLocation(prog, "uMouse")!,
      uTilt: gl.getUniformLocation(prog, "uTilt")!,
      uS: gl.getUniformLocation(prog, "uS")!,
      uSurge: gl.getUniformLocation(prog, "uSurge")!,
      uShoeTex: gl.getUniformLocation(prog, "uShoeTex")!,
    };
    gl.uniform1i(state.uniforms.uShoeTex, 0);

    // Textures Creation with Async Image Upload Support
    state.textures = productsList.map((prod, idx) => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

      const offCanvas = createShoeTextureCanvas(prod, (loadedCanvas) => {
        if (isDisposed || !state.gl || !tex || !state.gl.isTexture(tex)) return;
        try {
          state.gl.bindTexture(state.gl.TEXTURE_2D, tex);
          state.gl.pixelStorei(state.gl.UNPACK_FLIP_Y_WEBGL, true);
          state.gl.pixelStorei(state.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
          state.gl.texImage2D(
            state.gl.TEXTURE_2D,
            0,
            state.gl.RGBA,
            state.gl.RGBA,
            state.gl.UNSIGNED_BYTE,
            loadedCanvas
          );
          if (state.currentIndex === idx && state.gl.isTexture(tex)) {
            state.gl.activeTexture(state.gl.TEXTURE0);
            state.gl.bindTexture(state.gl.TEXTURE_2D, tex);
          }
          state.needsRedraw = true;
          state.settleFrames = 4;
        } catch {
          // Texture or context was disposed
        }
      });

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, offCanvas);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return tex;
    });

    gl.activeTexture(gl.TEXTURE0);
    if (state.textures[0] && gl.isTexture(state.textures[0])) {
      gl.bindTexture(gl.TEXTURE_2D, state.textures[0]);
    }

    // High-Performance Resolution Management (Balanced DPR: 0.75 mobile, 0.85 desktop)
    const handleResize = () => {
      if (!canvas) return;
      const isMobile = window.innerWidth < 768;
      const dprCap = isMobile ? 0.75 : 0.85;
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);

      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        state.needsRedraw = true;
        state.settleFrames = 3;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // Desktop Cursor Push (Touch is handled cleanly on gesture end)
    const handlePointer = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && state.isVisible && state.isPageActive) {
        state.targetMouse.x = e.clientX / window.innerWidth;
        state.targetMouse.y = 1.0 - e.clientY / window.innerHeight;
        state.needsRedraw = true;
      }
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });

    // Context loss resilience
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(state.animId);
    };
    canvas.addEventListener("webglcontextlost", handleContextLost, false);

    // Optimized Render Loop with 0% Idle GPU Suspension
    const loop = (currentTime: number) => {
      // Pause completely if hero is scrolled out of view or tab is hidden
      if (!state.isVisible || !state.isPageActive) {
        state.animId = requestAnimationFrame(loop);
        return;
      }

      const dt = Math.min((currentTime - state.lastTime) * 0.001, 0.1);
      state.lastTime = currentTime;

      // Smooth cursor lerp
      const mouseDx = Math.abs(state.targetMouse.x - state.smoothedMouse.x);
      const mouseDy = Math.abs(state.targetMouse.y - state.smoothedMouse.y);
      const isMouseActive = mouseDx > 0.0001 || mouseDy > 0.0001;

      if (isMouseActive) {
        state.smoothedMouse.x += (state.targetMouse.x - state.smoothedMouse.x) * 0.06;
        state.smoothedMouse.y += (state.targetMouse.y - state.smoothedMouse.y) * 0.06;
        const targetTilt = (state.smoothedMouse.x - 0.5) * 0.09;
        state.smoothedTilt += (targetTilt - state.smoothedTilt) * 0.06;
      }

      // Fluid ONLY moves when the carousel changes, otherwise fixed
      if (state.isTransitioning) {
        state.integratedTime += dt * (1.2 + state.uSurge * 2.2);
      }

      const shouldDraw =
        state.isTransitioning ||
        isMouseActive ||
        state.needsRedraw ||
        state.settleFrames > 0;

      if (shouldDraw) {
        if (state.settleFrames > 0 && !state.isTransitioning && !isMouseActive) {
          state.settleFrames--;
        }
        state.needsRedraw = false;

        gl.useProgram(prog);
        gl.activeTexture(gl.TEXTURE0);
        const curTex = state.textures[state.currentIndex];
        if (curTex && gl.isTexture(curTex)) {
          gl.bindTexture(gl.TEXTURE_2D, curTex);
        }
        gl.uniform2f(state.uniforms.uResolution, canvas.width, canvas.height);
        gl.uniform1f(state.uniforms.uTime, state.integratedTime);
        gl.uniform2f(state.uniforms.uMouse, state.smoothedMouse.x, state.smoothedMouse.y);
        gl.uniform1f(state.uniforms.uTilt, state.smoothedTilt);
        gl.uniform1f(state.uniforms.uS, state.uS);
        gl.uniform1f(state.uniforms.uSurge, state.uSurge);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      state.animId = requestAnimationFrame(loop);
    };

    state.animId = requestAnimationFrame(loop);

    // IntersectionObserver: Pause rendering when scrolled outside viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        state.isVisible = entry.isIntersecting;
        if (entry.isIntersecting) {
          state.lastTime = performance.now();
          state.needsRedraw = true;
          state.settleFrames = 4;
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // VisibilityChange: Pause rendering when browser tab is hidden
    const handleVisibilityChange = () => {
      state.isPageActive = !document.hidden;
      if (!document.hidden) {
        state.lastTime = performance.now();
        state.needsRedraw = true;
        state.settleFrames = 4;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isDisposed = true;
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      observer.disconnect();
      cancelAnimationFrame(state.animId);

      // Cleanup GPU Resources
      state.textures.forEach((t) => {
        if (gl.isTexture(t)) {
          gl.deleteTexture(t);
        }
      });
      state.textures = [];
      if (buf) gl.deleteBuffer(buf);
      if (prog) gl.deleteProgram(prog);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      state.gl = null;
      state.program = null;
    };
  }, [productsList]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        navigate(currentIndex + 1);
      } else if (e.key === "ArrowLeft") {
        navigate(currentIndex - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, navigate]);

  // Touch Swipe Navigation (> 50px)
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
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      if (dx < 0) {
        navigate(currentIndex + 1);
      } else {
        navigate(currentIndex - 1);
      }
    }
  };

  // Autoplay (7.0s)
  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setInterval(() => {
      if (!stateRef.current.isTransitioning) {
        navigate(currentIndex + 1);
      }
    }, 7000);
    return () => clearInterval(timer);
  }, [currentIndex, navigate, prefersReducedMotion]);

  // Global mouseup listener to reset button press state cleanly
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (cursorInnerRef.current) {
        cursorInnerRef.current.style.transform = "scale(1)";
        cursorInnerRef.current.classList.remove("scale-90", "bg-[#ff6600]", "text-[#030303]", "border-[#ff6600]", "shadow-[0_0_35px_rgba(255,102,0,0.85)]");
      }
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  // Hardware-accelerated cursor handling within Hero (100% zero React re-render overhead)
  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!cursorRef.current) return;
    cursorRef.current.style.opacity = "1";
    cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(1)`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current || !cursorRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;

    const relativeX = e.clientX - rect.left;
    const isLeft = relativeX < rect.width / 2;
    if (cursorLeftRef.current && cursorRightRef.current) {
      cursorLeftRef.current.style.display = isLeft ? "block" : "none";
      cursorRightRef.current.style.display = isLeft ? "none" : "block";
    }

    const target = e.target as HTMLElement | null;
    const isInteractive = Boolean(
      target?.closest("a, button, [role='button'], [role='tab'], input, textarea, select")
    );
    cursorRef.current.style.opacity = isInteractive ? "0" : "1";
  };

  const handleMouseLeave = () => {
    if (cursorRef.current) {
      cursorRef.current.style.opacity = "0";
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement | null;
    if (!target?.closest("a, button, [role='button'], [role='tab'], input, textarea, select")) {
      if (cursorInnerRef.current) {
        cursorInnerRef.current.style.transform = "scale(0.9)";
        cursorInnerRef.current.classList.add("bg-[#ff6600]", "text-[#030303]", "border-[#ff6600]", "shadow-[0_0_35px_rgba(255,102,0,0.85)]");
      }
    }
  };

  const handleMouseUp = () => {
    if (cursorInnerRef.current) {
      cursorInnerRef.current.style.transform = "scale(1)";
      cursorInnerRef.current.classList.remove("bg-[#ff6600]", "text-[#030303]", "border-[#ff6600]", "shadow-[0_0_35px_rgba(255,102,0,0.85)]");
    }
  };

  const handleHeroClick = (e: React.MouseEvent<HTMLElement>) => {
    // If clicked inside an interactive button/link (e.g. "Shop now", footer dots, buttons), let the child handle it
    const target = e.target as HTMLElement | null;
    if (target?.closest("a, button, [role='button'], [role='tab'], input, textarea, select")) {
      return;
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isLeft = clickX < rect.width / 2;

    if (isLeft) {
      navigate(currentIndex - 1);
    } else {
      navigate(currentIndex + 1);
    }
  };

  const activeProduct = productsList[currentIndex % productsList.length] || productsList[0];
  const destinationUrl = useMemo(
    () => resolveHeroProductDestination(activeProduct, products),
    [activeProduct, products]
  );

  return (
    <section
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleHeroClick}
      aria-label="MOCS Footwear Real-Time Liquid Hero"
      className="relative w-full h-[100dvh] min-h-[660px] overflow-hidden bg-[#030303] select-none text-white md:cursor-none"
    >
      {/* ── Custom Interactive Carousel Cursor (Desktop Left / Right Arrow Button Model) ── */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        style={{ zIndex: 9999 }}
        className="hidden md:flex fixed top-0 left-0 pointer-events-none items-center justify-center opacity-0 transition-[opacity] duration-150 will-change-transform"
      >
        <div
          ref={cursorInnerRef}
          className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-150 scale-100 bg-[#070709]/85 text-[#ff6600] border-[#ff6600]/80 shadow-[0_4px_24px_rgba(0,0,0,0.85),0_0_22px_rgba(255,102,0,0.4)]"
        >
          <svg
            ref={cursorLeftRef}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 -translate-x-0.5 transition-transform"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <svg
            ref={cursorRightRef}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ display: "none" }}
            className="w-6 h-6 translate-x-0.5 transition-transform"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
      {/* ── WebGL Fluid Background or CSS Fallback (z-index: 0) ── */}
      {!webglFailed ? (
        <canvas
          ref={canvasRef}
          style={{ zIndex: 0 }}
          className="absolute inset-0 w-full h-full block z-0 pointer-events-auto transform-gpu will-change-transform"
        />
      ) : (
        <div
          style={{ zIndex: 0 }}
          className="absolute inset-0 w-full h-full z-0 bg-[radial-gradient(ellipse_at_50%_45%,#8c2a00_0%,#1a0802_45%,#030303_75%)]"
          aria-hidden="true"
        />
      )}

      {/* ── Fallback Product Shoe Image (Only if WebGL is unavailable) ── */}
      {webglFailed && (
        <div
          className="absolute inset-x-0 top-[12%] bottom-[38%] flex items-center justify-center pointer-events-none select-none z-[1]"
          data-layer="product-image-fallback"
        >
          <img
            key={activeProduct.id}
            src={getImageUrl(activeProduct.image)}
            alt={activeProduct.name}
            className={`max-h-[85%] max-w-[85%] sm:max-w-[70%] object-contain drop-shadow-[0_24px_45px_rgba(0,0,0,0.85)] -rotate-1 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              textPhase === "in"
                ? "opacity-100 scale-100 translate-y-0 filter-none"
                : "opacity-0 scale-85 translate-y-8 blur-sm"
            }`}
          />
        </div>
      )}

      {/* ── Bottom Dark Readability Gradient (z-index: 0) ── */}
      <div
        style={{ zIndex: 0 }}
        className="absolute inset-x-0 bottom-0 h-[38%] z-0 pointer-events-none bg-gradient-to-t from-[#030303]/96 via-[#030303]/60 to-transparent"
        aria-hidden="true"
      />

      {/* ── Product Text Content (z-index: 0, positioned under product image) ── */}
      <div
        className="absolute inset-x-0 bottom-[130px] sm:bottom-[clamp(68px,9.5vh,100px)] z-0 flex flex-col items-center text-center px-4 pointer-events-none"
        style={{ zIndex: 0 }}
        data-layer="text-content"
      >
        <div className="flex flex-col items-center max-w-3xl pointer-events-auto">
          {/* Title with tight line spacing, sitting clearly below the product shoe */}
          <h1
            className={`font-['Unbounded',sans-serif] text-[clamp(22px,3.8vw,48px)] font-black uppercase tracking-tight text-white leading-[1.0] mb-2 drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] transition-all ${
              textPhase === "in"
                ? "opacity-100 translate-y-0 blur-none duration-900 delay-[90ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                : "opacity-0 translate-y-6 blur-sm duration-500 ease-in"
            }`}
          >
            {activeProduct.name}
          </h1>

          {/* Tagline */}
          <p
            className={`font-['Space_Grotesk',sans-serif] text-[clamp(12px,1.15vw,15px)] font-normal text-white/80 tracking-wide mb-4 max-w-lg drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] line-clamp-2 transition-all ${
              textPhase === "in"
                ? "opacity-100 translate-y-0 blur-none duration-950 delay-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                : "opacity-0 translate-y-6 blur-sm duration-500 ease-in"
            }`}
          >
            {activeProduct.tagline}
          </p>

          {/* Action Row: Shop now only (navigates directly to active product detail page) */}
          <div
            className={`inline-flex items-center transition-all ${
              textPhase === "in"
                ? "opacity-100 translate-y-0 blur-none duration-1000 delay-[270ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                : "opacity-0 translate-y-6 blur-sm duration-500 ease-in"
            }`}
          >
            {destinationUrl.startsWith("http://") || destinationUrl.startsWith("https://") ? (
              <a
                href={destinationUrl}
                className="inline-flex items-center gap-2 bg-[#ff6600] hover:bg-[#ff781a] text-[#030303] font-['Space_Grotesk',sans-serif] font-bold text-[clamp(12px,1.05vw,14px)] px-7 py-3 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group shadow-md cursor-pointer"
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
              </a>
            ) : destinationUrl.startsWith("/product/") ? (
              <Link
                to="/product/$id"
                params={{ id: destinationUrl.replace("/product/", "").split("?")[0].split("#")[0] }}
                className="inline-flex items-center gap-2 bg-[#ff6600] hover:bg-[#ff781a] text-[#030303] font-['Space_Grotesk',sans-serif] font-bold text-[clamp(12px,1.05vw,14px)] px-7 py-3 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group shadow-md cursor-pointer"
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
            ) : (
              <Link
                to={destinationUrl as any}
                className="inline-flex items-center gap-2 bg-[#ff6600] hover:bg-[#ff781a] text-[#030303] font-['Space_Grotesk',sans-serif] font-bold text-[clamp(12px,1.05vw,14px)] px-7 py-3 rounded-full hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group shadow-md cursor-pointer"
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
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Direct Side Navigation Arrows ── */}
      <div className="sm:hidden absolute inset-x-2.5 top-[44%] -translate-y-1/2 z-30 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(currentIndex - 1);
          }}
          disabled={isTransitioning}
          aria-label="Previous product"
          className="w-10 h-10 rounded-full bg-black/60 hover:bg-[#ff6600] active:bg-[#ff6600] border border-white/20 text-white hover:text-black flex items-center justify-center backdrop-blur-md active:scale-95 transition-all pointer-events-auto shadow-xl disabled:opacity-40 cursor-pointer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(currentIndex + 1);
          }}
          disabled={isTransitioning}
          aria-label="Next product"
          className="w-10 h-10 rounded-full bg-black/60 hover:bg-[#ff6600] active:bg-[#ff6600] border border-white/20 text-white hover:text-black flex items-center justify-center backdrop-blur-md active:scale-95 transition-all pointer-events-auto shadow-xl disabled:opacity-40 cursor-pointer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* ── Bottom Controls: Carousel Counter (Right) ── */}
      <footer className="absolute inset-x-0 bottom-[74px] sm:bottom-0 z-30 flex items-center justify-end px-6 sm:px-12 pb-[calc(clamp(16px,2.5vh,28px)+env(safe-area-inset-bottom,0px))] pointer-events-none">
        {/* Carousel Count in the Bottom Right Corner */}
        <div className="inline-flex items-center gap-2 pointer-events-auto">
          <span className="font-['Unbounded',sans-serif] text-xs sm:text-sm font-bold tracking-[0.24em] uppercase text-[#ff6600] bg-black/40 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none px-3 py-1.5 sm:p-0 rounded-full border border-white/10 sm:border-0 shadow-sm sm:shadow-none">
            0{currentIndex + 1} <span className="text-white/35 font-normal">/</span> 0{productsList.length}
          </span>
        </div>
      </footer>
    </section>
  );
}
