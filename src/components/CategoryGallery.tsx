import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { getImageUrl } from "@/lib/utils";
import "./CategoryGallery.css";

export type CategoryTile = {
  id: string;
  tag?: string;
  title: string;
  subtitle?: string;
  linkLabel: string;
  href: string;
  image: string;
  alt: string;
  variant?: "feature" | "wide";
  fallbackColor?: string;
  objectPosition?: string;
};

export const DEFAULT_GALLERY_TILES: CategoryTile[] = [
  {
    id: "mocs-urban-editorial",
    tag: "EDITORIAL CAMPAIGN",
    title: "Urban Elevation",
    subtitle: "Crafted for Every Step — Original MOCS Footwear",
    linkLabel: "Discover Collection",
    href: "/shop",
    image: "/images/mocs-model-editorial.jpg",
    alt: "Fashion models wearing original MOCS footwear in an urban architectural setting",
    variant: "feature",
    fallbackColor: "#181716",
    objectPosition: "center 20%",
  },
  {
    id: "mocs-lifestyle-modeling",
    tag: "PRODUCT MODELING",
    title: "Everyday Ease",
    subtitle: "Ultra-Lightweight MOCS Slides",
    linkLabel: "Shop Slides",
    href: "/shop?collection=Casual",
    image: "/images/mocs-lifestyle-model.jpg",
    alt: "Product modeling of model feet wearing original MOCS black slides",
    fallbackColor: "#211f1c",
    objectPosition: "center 72%",
  },
  {
    id: "mocs-studio-craft",
    tag: "STUDIO SHOWCASE",
    title: "Sculpted Comfort",
    subtitle: "Direct-Injection Molded PU Soles",
    linkLabel: "Explore Design",
    href: "/shop",
    image: "/images/mocs-sustainable-hero.jpg",
    alt: "Original MOCS sandals on architectural display pedestals",
    fallbackColor: "#151413",
    objectPosition: "center center",
  },
  {
    id: "mocs-signature-silk",
    tag: "SIGNATURE MOCS LINE",
    title: "Engineered For Motion",
    subtitle: "Premium Ergonomic PU Footwear Crafted for All-Day Wear",
    linkLabel: "Explore Full Range",
    href: "/shop",
    image: "/images/mocs-comfort-silk.jpg",
    alt: "Original MOCS sandals floating elegantly on orange and black silk",
    variant: "wide",
    fallbackColor: "#1d1916",
    objectPosition: "center 45%",
  },
];

const DEFAULT_FALLBACK_COLORS: readonly string[] = [
  "#181716",
  "#211f1c",
  "#151413",
  "#1d1916",
];

export interface CategoryGalleryProps {
  tiles?: CategoryTile[];
  className?: string;
}

export function CategoryGallery({
  tiles = DEFAULT_GALLERY_TILES,
  className = "",
}: CategoryGalleryProps): React.JSX.Element {
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const totalTiles = tiles.length;

  const handleNext = useCallback(() => {
    setActiveMobileIdx((prev) => (prev + 1) % totalTiles);
  }, [totalTiles]);

  const handlePrev = useCallback(() => {
    setActiveMobileIdx((prev) => (prev - 1 + totalTiles) % totalTiles);
  }, [totalTiles]);

  // Auto-advance mobile carousel every 4 seconds
  useEffect(() => {
    if (totalTiles <= 1 || isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [totalTiles, isPaused, handleNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null && touchStartYRef.current !== null) {
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
      const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    setIsPaused(false);
  };

  return (
    <section
      aria-labelledby="mocs-gallery-heading"
      className={`category-gallery-section ${className}`.trim()}
    >
      <div className="category-gallery-container">
        {/* Visually hidden accessible heading */}
        <h2 id="mocs-gallery-heading" className="sr-only">
          MOCS Product & Modeling Gallery
        </h2>

        {/* ── Mobile View: Auto-playing Single-Image Carousel ── */}
        <div
          className="category-mobile-carousel relative w-full overflow-hidden block sm:hidden select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Sliding Track */}
          <div
            className="category-mobile-track flex w-full"
            style={{
              transform: `translate3d(-${activeMobileIdx * 100}%, 0, 0)`,
              transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {tiles.map((tile, index) => {
              const fallbackBg =
                tile.fallbackColor ||
                DEFAULT_FALLBACK_COLORS[index % DEFAULT_FALLBACK_COLORS.length];

              return (
                <article
                  key={tile.id || `mobile-tile-${index}`}
                  className="w-full shrink-0 relative h-[460px] xs:h-[500px] overflow-hidden"
                  style={{ backgroundColor: fallbackBg }}
                >
                  {/* Full-bleed image */}
                  <img
                    src={getImageUrl(tile.image)}
                    alt={tile.alt || tile.title}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: tile.objectPosition || "center center" }}
                  />

                  {/* Gradient overlay for contrast */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15 pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Content (No badges) */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 pb-16 z-10 pointer-events-none">
                    <div className="pointer-events-auto">
                      <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-[26px] xs:text-[28px] font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                        {tile.title}
                      </h3>
                      {tile.subtitle && (
                        <p className="font-['Inter',sans-serif] text-xs xs:text-sm text-white/85 mt-1.5 font-medium drop-shadow-sm">
                          {tile.subtitle}
                        </p>
                      )}
                      <Link
                        to={tile.href as unknown as "/shop"}
                        className="inline-flex items-center gap-1.5 text-white font-['Inter',sans-serif] text-sm font-bold underline underline-offset-6 decoration-[#ff6600] decoration-2 mt-3.5 hover:text-[#ff8a3d] transition-colors"
                      >
                        {tile.linkLabel} →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Carousel Footer: Dot Indicators + Counter + Chevrons */}
          <div className="absolute bottom-4 inset-x-5 z-20 flex items-center justify-between pointer-events-auto">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {tiles.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveMobileIdx(idx)}
                  aria-label={`Go to image ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeMobileIdx
                      ? "w-6 bg-[#ff6600]"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* Navigation Chevrons & Counter */}
            <div className="flex items-center gap-2">
              <span className="font-['Unbounded',sans-serif] text-[11px] font-bold tracking-wider text-white/80 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10">
                0{activeMobileIdx + 1} <span className="text-white/40">/</span> 0{totalTiles}
              </span>

              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous image"
                className="w-7 h-7 rounded-full bg-black/50 border border-white/15 text-white flex items-center justify-center backdrop-blur-xs active:scale-95 transition-transform cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next image"
                className="w-7 h-7 rounded-full bg-black/50 border border-white/15 text-white flex items-center justify-center backdrop-blur-xs active:scale-95 transition-transform cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Desktop & Tablet View: Full Page Bento Grid (No badges) ── */}
        <div className="category-bento-grid hidden sm:grid">
          {tiles.map((tile, index) => {
            const rawVariant = (tile.variant || "").toLowerCase().trim();
            const isFeature =
              rawVariant === "feature" ||
              (index === 0 && rawVariant !== "standard" && rawVariant !== "wide");
            const isWide =
              rawVariant === "wide" ||
              (index === 3 && rawVariant !== "feature" && rawVariant !== "standard");

            const tileVariantClass = isFeature
              ? "category-tile-feature"
              : isWide
                ? "category-tile-wide"
                : "category-tile-standard";

            const contentAlignmentClass = isFeature
              ? "category-tile-content-feature"
              : "category-tile-content-centered";

            const titleClass = isFeature
              ? "category-tile-title-feature"
              : "category-tile-title-centered";

            const fallbackBg =
              tile.fallbackColor ||
              DEFAULT_FALLBACK_COLORS[index % DEFAULT_FALLBACK_COLORS.length];

            const objectPos =
              tile.objectPosition ||
              (isFeature ? "center 28%" : "center center");

            return (
              <article
                key={tile.id || `tile-${index}`}
                className={`category-tile ${tileVariantClass}`}
                style={{ backgroundColor: fallbackBg }}
              >
                {/* Full-bleed original MOCS photo */}
                <img
                  src={getImageUrl(tile.image)}
                  alt={tile.alt || tile.title}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  className="category-tile-image"
                  style={{ objectPosition: objectPos }}
                />

                {/* Dark gradient overlay for contrast */}
                <div
                  className={`category-tile-overlay ${isFeature ? "category-tile-overlay-feature" : ""}`}
                  aria-hidden="true"
                />

                {/* Content layer (No badges) */}
                <div className={`category-tile-content ${contentAlignmentClass}`}>
                  {isFeature ? (
                    /* Feature tile: Top-left aligned headline & link */
                    <div className="category-tile-feature-box">
                      <h3 className={titleClass}>{tile.title}</h3>
                      {tile.subtitle && (
                        <p className="category-tile-subtitle">{tile.subtitle}</p>
                      )}
                      <Link
                        to={tile.href as unknown as "/shop"}
                        className="category-tile-link"
                      >
                        {tile.linkLabel} →
                      </Link>
                    </div>
                  ) : (
                    /* Centered tiles: Tile 2, Tile 3, and Tile 4 */
                    <div className="category-tile-centered-box">
                      <h3 className={titleClass}>{tile.title}</h3>
                      {tile.subtitle && (
                        <p className="category-tile-subtitle">{tile.subtitle}</p>
                      )}
                      <Link
                        to={tile.href as unknown as "/shop"}
                        className="category-tile-link"
                      >
                        {tile.linkLabel} →
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CategoryGallery;
