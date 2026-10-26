import React from "react";
import { Plus, Trash2, Upload, Sparkles, LayoutGrid, ArrowUpRight, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryTile } from "@/components/CategoryGallery";

const PRESET_GALLERY_IMAGES = [
  { label: "Urban Editorial (Clean Lookbook)", path: "/images/mocs-model-editorial.jpg" },
  { label: "Urban Editorial (Poster)", path: "/images/mocs-model-urban.png" },
  { label: "Everyday Slides (Feet)", path: "/images/mocs-lifestyle-model.jpg" },
  { label: "Studio Pedestals", path: "/images/mocs-sustainable-hero.jpg" },
  { label: "Silk Motion Showcase", path: "/images/mocs-comfort-silk.jpg" },
  { label: "Black Sandals Duo", path: "/images/mocs-black-sandals.png" },
  { label: "Relaxed Lifestyle", path: "/images/mocs-banner-relax.png" },
];

export interface CategoryGalleryConfigProps {
  tiles: CategoryTile[];
  selectedTileIdx: number;
  setSelectedTileIdx: (idx: number) => void;
  updateTileField: (idx: number, field: keyof CategoryTile, value: string) => void;
  addTile: () => void;
  removeTile: (idx: number) => void;
  handleGalleryFileUpload: (e: React.ChangeEvent<HTMLInputElement>, idx: number) => void;
  getImageUrl: (url: string) => string;
}

export function CategoryGalleryConfig({
  tiles,
  selectedTileIdx,
  setSelectedTileIdx,
  updateTileField,
  addTile,
  removeTile,
  handleGalleryFileUpload,
  getImageUrl,
}: CategoryGalleryConfigProps): React.JSX.Element {
  const currentTile: CategoryTile = tiles[selectedTileIdx] || {
    id: "tile-new",
    title: "New Gallery Showcase",
    subtitle: "Original MOCS Footwear",
    linkLabel: "Discover Collection",
    href: "/shop",
    image: "/images/mocs-model-urban.png",
    alt: "MOCS product modeling photography",
    variant: "standard",
    objectPosition: "center center",
  };

  return (
    <div id="category-gallery-section" className="space-y-6 pt-6 border-t border-border scroll-mt-24 font-sans text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold mb-1">
            <LayoutGrid className="w-3.5 h-3.5 text-orange-400" />
            <span>Product Modeling & Lifestyle Bento</span>
          </div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">Category Gallery Bento Section</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Configure the 4-tile bento showcase placed below the Hero. Update editorial lifestyle photography, headlines, and collection routes.
          </p>
        </div>

        <button
          type="button"
          onClick={addTile}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tile</span>
        </button>
      </div>

      {/* Tiles Tab Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border/60">
        {tiles.map((tile, idx) => (
          <button
            key={tile.id || `tile-${idx}`}
            type="button"
            onClick={() => setSelectedTileIdx(idx)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap border flex items-center gap-2",
              selectedTileIdx === idx
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>{tile.title || `Tile #${idx + 1}`}</span>
            <span className="text-[10px] opacity-70 uppercase">
              ({tile.variant || "standard"})
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start pt-2">
        {/* Left Column: Live Bento Tile Preview */}
        <div className="lg:col-span-5 rounded-3xl border border-border bg-[#050505] p-5 shadow-soft space-y-4 text-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
              Live Tile Preview
            </span>
            <span className="text-[10px] text-white/50 bg-white/10 px-2 py-0.5 rounded-full capitalize">
              {currentTile.variant || "standard"} layout
            </span>
          </div>

          {/* Bento Tile Simulation Box */}
          <div
            className={cn(
              "relative overflow-hidden rounded-2xl bg-stone-900 border border-white/10 flex flex-col justify-end p-5 text-left group",
              currentTile.variant === "feature"
                ? "aspect-[3/4] min-h-[320px]"
                : currentTile.variant === "wide"
                  ? "aspect-[16/7] min-h-[220px]"
                  : "aspect-square min-h-[260px]"
            )}
          >
            {/* Background Image */}
            {currentTile.image ? (
              <img
                src={getImageUrl(currentTile.image)}
                alt={currentTile.alt || currentTile.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: currentTile.objectPosition || "center center" }}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 text-xs bg-stone-900">
                <ImageIcon className="w-8 h-8 mb-1 stroke-1" />
                <span>No Image</span>
              </div>
            )}

            {/* Gradient Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

            {/* Content Layer */}
            <div className="relative z-10 space-y-2">
              {currentTile.tag && (
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase bg-white/15 text-white/90 backdrop-blur-md border border-white/20">
                  {currentTile.tag}
                </span>
              )}

              <h4 className="font-['Unbounded',sans-serif] text-base sm:text-lg font-black uppercase text-white leading-tight">
                {currentTile.title || "TITLE"}
              </h4>

              {currentTile.subtitle && (
                <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                  {currentTile.subtitle}
                </p>
              )}

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black font-bold text-[11px] group-hover:bg-[#ff6600] group-hover:text-black transition-colors">
                  <span>{currentTile.linkLabel || "Discover"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-white/40 leading-relaxed text-center">
            The Bento Gallery features full-bleed editorial imagery. Use &apos;objectPosition&apos; to adjust photo alignment.
          </p>
        </div>

        {/* Right Column: Form Controls */}
        <div className="lg:col-span-7 rounded-3xl border border-border bg-card p-6 shadow-soft space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="font-display text-sm font-bold text-foreground">
                Edit Tile #{selectedTileIdx + 1}
              </h3>
              <p className="text-xs text-muted-foreground">Customize editorial texts, variant & image</p>
            </div>

            {tiles.length > 1 && (
              <button
                type="button"
                onClick={() => removeTile(selectedTileIdx)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive text-xs font-semibold hover:bg-destructive/10 transition-colors"
                title="Delete this gallery tile"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>

          {/* Title & Tag Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Tile Title
              </label>
              <input
                type="text"
                value={currentTile.title}
                onChange={(e) => updateTileField(selectedTileIdx, "title", e.target.value)}
                placeholder="e.g. Urban Elevation"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Badge / Tag
              </label>
              <input
                type="text"
                value={currentTile.tag || ""}
                onChange={(e) => updateTileField(selectedTileIdx, "tag", e.target.value)}
                placeholder="e.g. EDITORIAL CAMPAIGN"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              />
            </div>
          </div>

          {/* Subtitle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Subtitle / Caption
            </label>
            <input
              type="text"
              value={currentTile.subtitle || ""}
              onChange={(e) => updateTileField(selectedTileIdx, "subtitle", e.target.value)}
              placeholder="e.g. Crafted for Every Step — Original MOCS Footwear"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            />
          </div>

          {/* Button Label & Link Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Button Label
              </label>
              <input
                type="text"
                value={currentTile.linkLabel}
                onChange={(e) => updateTileField(selectedTileIdx, "linkLabel", e.target.value)}
                placeholder="e.g. Discover Collection"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Destination Link (`href`)
              </label>
              <input
                type="text"
                value={currentTile.href}
                onChange={(e) => updateTileField(selectedTileIdx, "href", e.target.value)}
                placeholder="e.g. /shop or /shop?collection=Casual"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              />
            </div>
          </div>

          {/* Layout Variant & Object Position */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Grid Tile Variant
              </label>
              <select
                value={currentTile.variant?.toLowerCase() || (selectedTileIdx === 0 ? "feature" : selectedTileIdx === 3 ? "wide" : "standard")}
                onChange={(e) => updateTileField(selectedTileIdx, "variant", e.target.value.toLowerCase())}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              >
                <option value="feature">Feature (Tall Left Tile — 2x2)</option>
                <option value="standard">Standard (Right Box)</option>
                <option value="wide">Wide (Bottom Span Banner — 2x1)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Image Object Position
              </label>
              <select
                value={currentTile.objectPosition || "center center"}
                onChange={(e) => updateTileField(selectedTileIdx, "objectPosition", e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              >
                <option value="center 28%">center 28% (Upper - Standing Models)</option>
                <option value="center 72%">center 72% (Lower - Feet / Footwear)</option>
                <option value="center 45%">center 45% (Center-High)</option>
                <option value="center center">center center (Dead Center)</option>
                <option value="top center">top center</option>
                <option value="bottom center">bottom center</option>
              </select>
            </div>
          </div>

          {/* Image Upload & Presets */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Editorial Lifestyle Photography
            </label>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                type="text"
                value={currentTile.image}
                onChange={(e) => updateTileField(selectedTileIdx, "image", e.target.value)}
                placeholder="/uploads/category-gallery/... or URL"
                className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              />

              <label className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold cursor-pointer transition-all shadow-sm shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => handleGalleryFileUpload(e, selectedTileIdx)}
                />
              </label>
            </div>

            {/* Presets selector */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                Quick Select MOCS Photography Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_GALLERY_IMAGES.map((preset) => (
                  <button
                    key={preset.path}
                    type="button"
                    onClick={() => updateTileField(selectedTileIdx, "image", preset.path)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all flex items-center gap-1.5",
                      currentTile.image === preset.path
                        ? "bg-orange-500/15 border-orange-500 text-orange-400 font-bold"
                        : "bg-muted/40 border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Alt text for SEO & Accessibility */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Image Alt Text (SEO & Accessibility)
            </label>
            <input
              type="text"
              value={currentTile.alt}
              onChange={(e) => updateTileField(selectedTileIdx, "alt", e.target.value)}
              placeholder="e.g. Models wearing original MOCS footwear..."
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
