import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Image as ImageIcon, Link as LinkIcon, ExternalLink, Smartphone, Monitor, Crop, AlignVerticalJustifyCenter, Info, ChevronDown, Check, X } from "lucide-react";
import { getImageUrl, cn } from "@/lib/utils";

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

const DESTINATION_GROUPS = [
  {
    group: "Main Pages",
    items: [
      { label: "Shop - All Products", value: "/shop" },
      { label: "About Us", value: "/about" },
      { label: "Contact Us", value: "/contact" },
    ],
  },
  {
    group: "Categories",
    items: [
      { label: "Men's Collection", value: "/shop?category=Men" },
      { label: "Women's Collection", value: "/shop?category=Women" },
      { label: "Kids' Collection", value: "/shop?category=Kids" },
    ],
  },
  {
    group: "Collections",
    items: [
      { label: "Trending Collection", value: "/shop?collection=Trending" },
      { label: "New Arrivals", value: "/shop?collection=New Arrival" },
      { label: "Sports Collection", value: "/shop?collection=Sports" },
      { label: "Casual Collection", value: "/shop?collection=Casual" },
      { label: "Formal Collection", value: "/shop?collection=Formal" },
    ],
  },
  {
    group: "Custom",
    items: [
      { label: "Custom Path / URL", value: "__custom__" },
    ],
  },
];

const ALL_PRESET_VALUES = DESTINATION_GROUPS.flatMap((g) => g.items.map((i) => i.value)).filter(
  (v) => v !== "__custom__"
);

function DestinationDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isPreset = ALL_PRESET_VALUES.includes(value);
  const activeItem = DESTINATION_GROUPS.flatMap((g) => g.items).find((i) => i.value === value);
  const displayLabel = isPreset
    ? activeItem?.label || value
    : "Custom Path / URL";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown trigger button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "w-full flex items-center justify-between gap-3 rounded-xl border bg-background/80 px-4 py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shadow-xs",
          open
            ? "border-primary ring-2 ring-primary/20 bg-background"
            : "border-input hover:border-primary/60 hover:bg-background"
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-foreground truncate">{displayLabel}</span>
          <span className="hidden sm:inline-block font-mono text-[11px] text-muted-foreground bg-muted/80 px-2 py-0.5 rounded">
            {value || "/shop"}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0",
            open && "rotate-180 text-primary"
          )}
        />
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-72 overflow-y-auto rounded-2xl border border-border bg-popover/95 backdrop-blur-xl p-2 shadow-2xl space-y-2 no-scrollbar"
          >
            {DESTINATION_GROUPS.map((group) => (
              <div key={group.group} className="space-y-1">
                <div className="px-2.5 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  {group.group}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isSelected =
                      item.value === "__custom__"
                        ? !isPreset
                        : item.value === value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          if (item.value === "__custom__") {
                            if (!value || isPreset) {
                              onChange(value || "/shop");
                            }
                          } else {
                            onChange(item.value);
                          }
                          setOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-xs text-left transition-colors cursor-pointer",
                          isSelected
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span>{item.label}</span>
                          {item.value !== "__custom__" && (
                            <span className="font-mono text-[10px] text-muted-foreground truncate">
                              {item.value}
                            </span>
                          )}
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Input if custom URL is chosen */}
      {!isPreset && (
        <div className="relative mt-2.5 animate-in fade-in duration-200">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
            <LinkIcon className="h-4 w-4" />
          </div>
          <input
            required
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="input-field w-full pl-10 text-xs sm:text-sm font-mono"
            placeholder="Enter custom path (e.g. /product/123 or https://...)"
          />
        </div>
      )}
    </div>
  );
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
          <h2 className="font-display text-lg font-bold text-foreground">Hero Banners</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure homepage hero carousel images, image fit/alignment, and destination links.
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

      {/* Recommended Dimension Banner Alert */}
      <div className="flex items-start gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-300">
        <Info className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-200">Tips for Perfect Banner Display</p>
          <p className="text-amber-300/90 leading-relaxed">
            • <strong>Recommended dimensions:</strong> 1920 × 1080 px (16:9 ratio).<br />
            • If your image has a model from head to toe, set <strong>Alignment</strong> to <em>Top</em> or <em>Bottom</em>, or set <strong>Image Fit</strong> to <em>Contain (Full View)</em> to prevent cropping.
          </p>
        </div>
      </div>

      {/* Slides list */}
      <div className="space-y-6">
        {heroSlides.map((slide, idx) => {
          const fit = slide.objectFit || "cover";
          const position = slide.objectPosition || "center";

          return (
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
                    Hero Banner #{idx + 1}
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

              {/* Live Preview - Exactly 16/9 matching homepage */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[360px] rounded-2xl overflow-hidden bg-stone-950 border border-border flex items-center justify-center group">
                {slide.bg ? (
                  <>
                    {fit === "contain" && (
                      <div
                        className="absolute inset-0 scale-110 blur-xl opacity-40 bg-cover bg-center pointer-events-none"
                        style={{
                          backgroundImage: `url(${getImageUrl(slide.bg, { width: 300, quality: 40 })})`,
                        }}
                      />
                    )}
                    <img
                      src={getImageUrl(slide.bg, { width: 1400, quality: 90 })}
                      alt={`Banner ${idx + 1}`}
                      className={cn(
                        "relative w-full h-full transition-all duration-300",
                        fit === "contain" ? "object-contain" : "object-cover",
                        position === "top"
                          ? "object-top"
                          : position === "bottom"
                          ? "object-bottom"
                          : "object-center"
                      )}
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1.5 text-stone-500 p-4 text-center">
                    <ImageIcon className="h-7 w-7 text-stone-600" />
                    <p className="text-xs font-medium">No banner image uploaded yet</p>
                  </div>
                )}

                {slide.to && (
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-stone-300 flex items-center gap-1.5 border border-white/10">
                    <LinkIcon className="h-3 w-3 text-primary" />
                    <span className="truncate max-w-[200px] sm:max-w-[320px]">{slide.to}</span>
                  </div>
                )}
              </div>

              {/* Inputs Grid */}
              <div className="grid gap-4 sm:grid-cols-2 pt-1">
                {/* 1. Desktop Image Source & Upload */}
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                      <Monitor className="h-3.5 w-3.5 text-primary" />
                      <span>Desktop Banner Image (16:9 Recommended)</span>
                    </label>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                    <div className="relative flex-1">
                      <input
                        required
                        value={slide.bg || ""}
                        onChange={(e) => updateHeroSlideField(idx, "bg", e.target.value)}
                        className="input-field w-full pl-3 pr-3 text-xs sm:text-sm"
                        placeholder="Image URL or uploaded path (e.g. https://... or /uploads/...)"
                      />
                    </div>
                    <label className="flex h-11 px-5 items-center justify-center rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 transition text-xs font-bold text-primary cursor-pointer whitespace-nowrap gap-2 shadow-xs">
                      <ImageIcon className="h-4 w-4" />
                      <span>Upload Desktop</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleHeroFileChange(e, idx)}
                      />
                    </label>
                  </div>
                </div>

                {/* 2. Mobile Image Source & Upload (Completely Optional) */}
                <div className="sm:col-span-2 space-y-2 rounded-2xl border border-border/60 bg-muted/20 p-3.5">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                      <Smartphone className="h-3.5 w-3.5 text-primary" />
                      <span>Mobile Banner Image</span>
                      <span className="rounded-full bg-muted border border-border/80 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground lowercase">
                        optional
                      </span>
                    </label>
                    {slide.mobileBg && (
                      <button
                        type="button"
                        onClick={() => updateHeroSlideField(idx, "mobileBg", "")}
                        className="flex items-center gap-1 text-[11px] font-medium text-destructive hover:underline cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                        <span>Clear mobile image</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Leave blank to automatically use the desktop image on mobile phones. Only upload here if you have a custom vertical/square portrait design for mobile.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch pt-0.5">
                    <div className="relative flex-1">
                      <input
                        value={slide.mobileBg || ""}
                        onChange={(e) => updateHeroSlideField(idx, "mobileBg", e.target.value)}
                        className="input-field w-full pl-3 pr-3 text-xs sm:text-sm"
                        placeholder="Optional mobile image URL (e.g. /uploads/... or https://...)"
                      />
                    </div>
                    {handleHeroMobileFileChange && (
                      <label className="flex h-11 px-5 items-center justify-center rounded-xl border border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 transition text-xs font-bold text-primary cursor-pointer whitespace-nowrap gap-2 shadow-xs">
                        <Smartphone className="h-4 w-4" />
                        <span>Upload Mobile</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => handleHeroMobileFileChange(e, idx)}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* 3. Image Display Fit (Cover vs Contain) */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                    <Crop className="h-3.5 w-3.5 text-primary" />
                    <span>Image Fit Mode</span>
                  </label>
                  <select
                    value={fit}
                    onChange={(e) => updateHeroSlideField(idx, "objectFit", e.target.value)}
                    className="input-field w-full text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="cover">Cover (Fill screen - standard)</option>
                    <option value="contain">Contain (Show entire image, no crop)</option>
                  </select>
                </div>

                {/* 4. Image Alignment / Focus Position */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                    <AlignVerticalJustifyCenter className="h-3.5 w-3.5 text-primary" />
                    <span>Vertical Alignment / Focal Point</span>
                  </label>
                  <select
                    value={position}
                    onChange={(e) => updateHeroSlideField(idx, "objectPosition", e.target.value)}
                    className="input-field w-full text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="center">Center (Default)</option>
                    <option value="top">Top (Preserves head & upper text)</option>
                    <option value="bottom">Bottom (Preserves shoes & legs)</option>
                  </select>
                </div>

                {/* 5. Destination Path / Click URL */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground">
                    <ExternalLink className="h-3.5 w-3.5 text-primary" />
                    <span>Destination Link Path</span>
                  </label>

                  <DestinationDropdown
                    value={slide.to || "/shop"}
                    onChange={(val) => updateHeroSlideField(idx, "to", val)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


