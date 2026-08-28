import { Plus, Trash2, Image as ImageIcon, Link as LinkIcon, ExternalLink, Smartphone, Monitor } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface HeroSlidesConfigProps {
  heroSlides: any[];
  updateHeroSlideField: (idx: number, field: string, value: any) => void;
  addHeroSlide: () => void;
  removeHeroSlide: (idx: number) => void;
  handleHeroFileChange: (e: React.ChangeEvent<HTMLInputElement>, idx: number) => void;
  handleHeroMobileFileChange?: (e: React.ChangeEvent<HTMLInputElement>, idx: number) => void;
  openFocusIdx?: number | null;
  setOpenFocusIdx?: (idx: number | null) => void;
}

export function HeroSlidesConfig({
  heroSlides,
  updateHeroSlideField,
  addHeroSlide,
  removeHeroSlide,
  handleHeroFileChange,
  handleHeroMobileFileChange,
}: HeroSlidesConfigProps) {
  return (
    <div id="hero-slideshow" className="space-y-6 scroll-mt-24">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Hero Advertising Banners</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure homepage hero banner images for both Desktop and Mobile devices. Clicking on a banner navigates directly to its destination link.
          </p>
        </div>
        <button
          type="button"
          onClick={addHeroSlide}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground transition hover:opacity-90 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add Banner
        </button>
      </div>

      {/* Slides list */}
      <div className="space-y-6">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-6 transition-all"
          >
            {/* Top Bar with Banner Index and Delete Button */}
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                  {idx + 1}
                </span>
                <span className="font-display text-sm font-extrabold uppercase tracking-wide text-foreground">
                  Banner #{idx + 1}
                </span>
              </div>
              {heroSlides.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeHeroSlide(idx)}
                  className="flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/20 cursor-pointer"
                  aria-label={`Remove banner ${idx + 1}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            {/* Desktop & Mobile Previews Side-by-Side */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Desktop Preview (Takes 2 cols) */}
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <Monitor className="h-3.5 w-3.5 text-primary" />
                    <span>Desktop Banner Preview</span>
                  </label>
                </div>
                <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] rounded-2xl overflow-hidden bg-stone-900 border border-border flex items-center justify-center group">
                  {slide.bg ? (
                    <img
                      src={getImageUrl(slide.bg, { width: 1200, quality: 90 })}
                      alt={`Desktop Banner ${idx + 1}`}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5 text-stone-500 p-4 text-center">
                      <ImageIcon className="h-6 w-6 text-stone-600" />
                      <p className="text-xs font-medium">No desktop image selected</p>
                    </div>
                  )}

                  {slide.to && (
                    <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono text-stone-300 flex items-center gap-1 border border-white/10">
                      <LinkIcon className="h-2.5 w-2.5 text-primary" />
                      <span className="truncate max-w-[160px] sm:max-w-[240px]">{slide.to}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Preview (Takes 1 col) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <Smartphone className="h-3.5 w-3.5 text-primary" />
                    <span>Mobile Hero Preview</span>
                  </label>
                  {!slide.mobileBg && slide.bg && (
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      Using Desktop
                    </span>
                  )}
                </div>
                <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] md:aspect-[16/10] rounded-2xl overflow-hidden bg-stone-900 border border-border flex items-center justify-center group">
                  {slide.mobileBg || slide.bg ? (
                    <img
                      src={getImageUrl(slide.mobileBg || slide.bg, { width: 800, quality: 90 })}
                      alt={`Mobile Banner ${idx + 1}`}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5 text-stone-500 p-4 text-center">
                      <Smartphone className="h-6 w-6 text-stone-600" />
                      <p className="text-xs font-medium">No mobile image</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid gap-5 sm:grid-cols-2 pt-2 border-t border-border/60">
              {/* 1. Desktop Image Source & Upload */}
              <div className="sm:col-span-2 space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                  <Monitor className="h-3.5 w-3.5 text-primary" />
                  <span>Desktop Hero Image Source</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <div className="relative flex-1">
                    <input
                      required
                      value={slide.bg || ""}
                      onChange={(e) => updateHeroSlideField(idx, "bg", e.target.value)}
                      className="input-field w-full pl-3 pr-3 text-xs sm:text-sm"
                      placeholder="Desktop Image URL (e.g. https://... or uploaded path)"
                    />
                  </div>
                  <label className="flex h-11 px-5 items-center justify-center rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 transition text-xs font-bold text-primary cursor-pointer whitespace-nowrap gap-2 shadow-xs">
                    <ImageIcon className="h-4 w-4" />
                    <span>Upload Desktop Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handleHeroFileChange(e, idx)}
                    />
                  </label>
                </div>
              </div>

              {/* 2. Mobile Hero Image Source & Upload */}
              <div className="sm:col-span-2 space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                  <Smartphone className="h-3.5 w-3.5 text-primary" />
                  <span>Mobile Hero Section Image</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <div className="relative flex-1">
                    <input
                      value={slide.mobileBg || ""}
                      onChange={(e) => updateHeroSlideField(idx, "mobileBg", e.target.value)}
                      className="input-field w-full pl-3 pr-3 text-xs sm:text-sm"
                      placeholder="Mobile Image URL / Upload Path (optional - falls back to desktop image if empty)"
                    />
                  </div>
                  <label className="flex h-11 px-5 items-center justify-center rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 transition text-xs font-bold text-primary cursor-pointer whitespace-nowrap gap-2 shadow-xs">
                    <Smartphone className="h-4 w-4" />
                    <span>Upload Mobile Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handleHeroMobileFileChange?.(e, idx)}
                    />
                  </label>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Optional separate optimized image for mobile screens. If left blank, the desktop banner image will be used.
                </p>
              </div>

              {/* 3. Destination Path / URL */}
              <div className="sm:col-span-2 space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                  <ExternalLink className="h-3.5 w-3.5 text-primary" />
                  <span>Destination Path / Click URL</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <LinkIcon className="h-4 w-4" />
                  </div>
                  <input
                    required
                    value={slide.to || ""}
                    onChange={(e) => updateHeroSlideField(idx, "to", e.target.value)}
                    className="input-field w-full pl-10 text-xs sm:text-sm font-mono"
                    placeholder="e.g. /shop, /shop?category=Men, /collections/summer, or https://..."
                  />
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  When customers click on this hero advertising banner on the homepage, they will be navigated to this destination path or URL.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Add Button */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={addHeroSlide}
          className="inline-flex items-center gap-2 rounded-full border border-dashed border-border bg-card/60 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground hover:border-primary hover:bg-accent transition cursor-pointer"
        >
          <Plus className="h-4 w-4 text-primary" /> Add Another Banner Slide
        </button>
      </div>
    </div>
  );
}

