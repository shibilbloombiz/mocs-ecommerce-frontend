import { Plus, Trash2, Image as ImageIcon, Link as LinkIcon, ExternalLink } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

interface HeroSlidesConfigProps {
  heroSlides: any[];
  updateHeroSlideField: (idx: number, field: string, value: any) => void;
  addHeroSlide: () => void;
  removeHeroSlide: (idx: number) => void;
  handleHeroFileChange: (e: React.ChangeEvent<HTMLInputElement>, idx: number) => void;
  openFocusIdx?: number | null;
  setOpenFocusIdx?: (idx: number | null) => void;
}

export function HeroSlidesConfig({
  heroSlides,
  updateHeroSlideField,
  addHeroSlide,
  removeHeroSlide,
  handleHeroFileChange,
}: HeroSlidesConfigProps) {
  return (
    <div id="hero-slideshow" className="space-y-6 scroll-mt-24">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Hero Advertising Banners</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure homepage hero banner images. Clicking on a banner navigates directly to its destination link.
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
            className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-soft space-y-5 transition-all"
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

            {/* Banner Preview Card */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Banner Image Preview
              </label>
              <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] rounded-2xl overflow-hidden bg-stone-900 border border-border flex items-center justify-center group">
                {slide.bg ? (
                  <img
                    src={getImageUrl(slide.bg, { width: 1200, quality: 90 })}
                    alt={`Hero Banner ${idx + 1}`}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-stone-500 p-6 text-center">
                    <ImageIcon className="h-8 w-8 text-stone-600" />
                    <p className="text-xs font-medium">No advertising image selected yet</p>
                    <p className="text-[11px] text-stone-600">Upload a high-resolution promotional graphic or enter an image URL below.</p>
                  </div>
                )}

                {slide.to && (
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono text-stone-300 flex items-center gap-1.5 border border-white/10">
                    <LinkIcon className="h-3 w-3 text-primary" />
                    <span className="truncate max-w-[200px] sm:max-w-[320px]">{slide.to}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Image Input & Upload */}
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Advertising Image Source
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <div className="relative flex-1">
                    <input
                      required
                      value={slide.bg || ""}
                      onChange={(e) => updateHeroSlideField(idx, "bg", e.target.value)}
                      className="input-field w-full pl-3 pr-3 text-xs sm:text-sm"
                      placeholder="Image URL (e.g. https://... or uploaded path)"
                    />
                  </div>
                  <label className="flex h-11 px-5 items-center justify-center rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 transition text-xs font-bold text-primary cursor-pointer whitespace-nowrap gap-2 shadow-xs">
                    <ImageIcon className="h-4 w-4" />
                    <span>Upload from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handleHeroFileChange(e, idx)}
                    />
                  </label>
                </div>
              </div>

              {/* Destination Path / URL */}
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Destination Path / Click URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                    <ExternalLink className="h-4 w-4" />
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
