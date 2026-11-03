import React, { useState, useMemo, useRef } from "react";
import {
  Plus,
  Trash2,
  Upload,
  Sparkles,
  ExternalLink,
  Image as ImageIcon,
  Search,
  Copy,
  ChevronLeft,
  ChevronRight,
  Link2,
  Check,
  X,
  Eye,
  ShoppingBag,
  ArrowRight,
  FolderOpen,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { HeroProduct } from "@/components/Hero";

const CAMPAIGN_PRESET_IMAGES = [
  {
    label: "Bronze Double Bow Slide",
    tag: "Campaign Slide 1",
    path: "/images/hero-bronze-slide.jpg",
  },
  {
    label: "Crystal Rhinestone Wedge",
    tag: "Campaign Slide 2",
    path: "/images/hero-wedge-rhinestone.jpg",
  },
  {
    label: "Resort Script Bow Slide",
    tag: "Campaign Slide 3",
    path: "/images/hero-script-bow.jpg",
  },
  {
    label: "Footbed Product Modeling",
    tag: "Editorial",
    path: "/images/mocs-lifestyle-model.jpg",
  },
  {
    label: "Urban Architecture Editorial",
    tag: "Lifestyle",
    path: "/images/mocs-model-editorial.jpg",
  },
  {
    label: "Signature Silk Luxury",
    tag: "Studio",
    path: "/images/mocs-comfort-silk.jpg",
  },
  {
    label: "Minimalist Pedestal Showcase",
    tag: "Architecture",
    path: "/images/mocs-sustainable-hero.jpg",
  },
];

export interface HeroSectionConfigProps {
  heroProducts: HeroProduct[];
  selectedProductIdx: number;
  setSelectedProductIdx: (idx: number) => void;
  updateProductField: (idx: number, field: keyof HeroProduct, value: any) => void;
  addProduct: (initialData?: Partial<HeroProduct>) => void;
  duplicateProduct?: (idx: number) => void;
  reorderProduct?: (fromIdx: number, toIdx: number) => void;
  removeProduct: (idx: number) => void;
  handleShoeFileUpload: (e: React.ChangeEvent<HTMLInputElement>, idx: number) => void;
  getImageUrl: (url: string) => string;
  availableProducts?: any[];
}

export function HeroSectionConfig({
  heroProducts,
  selectedProductIdx,
  setSelectedProductIdx,
  updateProductField,
  addProduct,
  duplicateProduct,
  reorderProduct,
  removeProduct,
  handleShoeFileUpload,
  getImageUrl,
  availableProducts = [],
}: HeroSectionConfigProps): React.JSX.Element {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Modal state for "Add from Catalog"
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState("ALL");

  // Inline product search filter for linking to destination URL
  const [linkSearchQuery, setLinkSearchQuery] = useState("");
  const [isLinkDropdownOpen, setIsLinkDropdownOpen] = useState(false);

  const safeIdx = Math.max(0, Math.min(selectedProductIdx, heroProducts.length - 1));
  const currentProduct: HeroProduct = heroProducts[safeIdx] || {
    id: "hero-slide-default",
    name: "NEW HERO SLIDE",
    eyebrow: "YOUR WORLD UPGRADED",
    title: "SCULPTED LUXURY FOR EVERYDAY STRIDE",
    tagline: "Handcrafted silhouette on an anatomical PU footbed, engineered to stay plush from sunrise to sunset.",
    price: "₹399",
    category: "Women",
    to: "/shop?category=Women",
    image: "/images/hero-bronze-slide.jpg",
  };

  // Distinct categories from available products
  const productCategories = useMemo(() => {
    const set = new Set<string>();
    availableProducts.forEach((p) => {
      const cat = typeof p.category === "string" ? p.category : p.category?.name;
      if (cat) set.add(cat);
    });
    return ["ALL", ...Array.from(set)];
  }, [availableProducts]);

  // Filtered products for modal
  const filteredCatalogProducts = useMemo(() => {
    return availableProducts.filter((p) => {
      const cat = typeof p.category === "string" ? p.category : p.category?.name || "";
      const matchesCategory =
        catalogCategoryFilter === "ALL" ||
        cat.toLowerCase() === catalogCategoryFilter.toLowerCase();

      const q = catalogSearch.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesQuery =
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.artNumber && p.artNumber.toLowerCase().includes(q)) ||
        (p.slug && p.slug.toLowerCase().includes(q)) ||
        cat.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [availableProducts, catalogSearch, catalogCategoryFilter]);

  // Filtered products for inline destination search
  const inlineFilteredProducts = useMemo(() => {
    if (!linkSearchQuery.trim()) return availableProducts.slice(0, 8);
    const q = linkSearchQuery.toLowerCase().trim();
    return availableProducts.filter((p) => {
      const cat = typeof p.category === "string" ? p.category : p.category?.name || "";
      return (
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.artNumber && p.artNumber.toLowerCase().includes(q)) ||
        (p.slug && p.slug.toLowerCase().includes(q)) ||
        cat.toLowerCase().includes(q)
      );
    }).slice(0, 10);
  }, [availableProducts, linkSearchQuery]);

  // Helper to link a product from catalog to current hero product
  const handleLinkProduct = (prod: any, autoFillAll = false) => {
    const targetSlug = prod.slug || prod._id || prod.id;
    const path = `/product/${targetSlug}`;
    updateProductField(safeIdx, "to", path);
    updateProductField(safeIdx, "productId", prod._id || prod.id);

    if (autoFillAll) {
      if (prod.name) {
        updateProductField(safeIdx, "title", prod.name.toUpperCase());
        updateProductField(safeIdx, "name", prod.name.toUpperCase());
      }
      if (prod.price) {
        updateProductField(safeIdx, "price", `₹${prod.price}`);
      }
      const catName = typeof prod.category === "string" ? prod.category : prod.category?.name;
      if (catName) {
        updateProductField(safeIdx, "category", catName.toUpperCase());
        updateProductField(safeIdx, "eyebrow", `SIGNATURE ${catName.toUpperCase()} COLLECTION`);
      }
      if (prod.description) {
        const shortDesc = prod.description.slice(0, 110).trim() + (prod.description.length > 110 ? "..." : "");
        updateProductField(safeIdx, "tagline", shortDesc);
      }
      const prodImg = (prod.images && prod.images[0]) || prod.image;
      if (prodImg && (!currentProduct.image || currentProduct.image.includes("trans_mocs-sandal-buckle"))) {
        updateProductField(safeIdx, "image", prodImg);
      }
      toast.success(`Linked & auto-filled slide from "${prod.name}"`);
    } else {
      toast.success(`Destination linked to "/product/${targetSlug}"`);
    }

    setIsLinkDropdownOpen(false);
    setLinkSearchQuery("");
  };

  // Helper to add a new slide directly from a catalog product
  const handleCreateFromCatalog = (prod: any) => {
    const targetSlug = prod.slug || prod._id || prod.id;
    const catName = typeof prod.category === "string" ? prod.category : prod.category?.name;
    const prodImg = (prod.images && prod.images[0]) || prod.image || CAMPAIGN_PRESET_IMAGES[0].path;

    const shortDesc = prod.description
      ? prod.description.slice(0, 110).trim() + (prod.description.length > 110 ? "..." : "")
      : "Handcrafted silhouette on an anatomical PU footbed, engineered to stay plush from sunrise to sunset.";

    addProduct({
      id: `hero-slide-${Date.now()}`,
      name: (prod.name || "NEW HERO SLIDE").toUpperCase(),
      eyebrow: `SIGNATURE ${(catName || "WOMEN").toUpperCase()} EDIT`,
      title: (prod.name || "SCULPTED LUXURY FOR EVERYDAY STRIDE").toUpperCase(),
      price: `₹${prod.price || 399}`,
      category: (catName || "Women").toUpperCase(),
      tagline: shortDesc,
      to: `/product/${targetSlug}`,
      productId: prod._id || prod.id,
      image: prodImg,
    });

    setIsCatalogModalOpen(false);
    toast.success(`Created Hero Slide for "${prod.name}"`);
  };

  const handleAddNewBlank = () => {
    addProduct({
      id: `hero-slide-${Date.now()}`,
      name: "NEW HERO SLIDE",
      eyebrow: "YOUR WORLD UPGRADED",
      title: "SCULPTED LUXURY FOR EVERYDAY STRIDE",
      tagline: "Handcrafted double-bow silhouette on an anatomical PU footbed, engineered for effortless comfort.",
      price: "₹399",
      category: "Women",
      to: "/shop",
      image: CAMPAIGN_PRESET_IMAGES[heroProducts.length % CAMPAIGN_PRESET_IMAGES.length].path,
    });
    toast.success("Added new blank hero slide");
  };

  return (
    <div id="hero-models" className="space-y-6 pt-6 border-t border-border scroll-mt-24 font-sans text-left">
      
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Homepage Hero Carousel</span>
          </div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
            Hero Section Slides & Content
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
            Manage the full-bleed 16:9 hero carousel on the homepage. Upload high-res photography, edit headlines, descriptions, and link slides directly to products in your store.
          </p>
        </div>

        {/* Action Buttons: Add Blank & Add from Catalog */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsCatalogModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-sm cursor-pointer"
            title="Browse your catalog and create a hero slide in one click"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>+ Add from Catalog</span>
          </button>

          <button
            type="button"
            onClick={handleAddNewBlank}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-xs font-bold active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-orange-500" />
            <span>New Slide</span>
          </button>
        </div>
      </div>

      {/* ── Slide Tabs Strip with Reorder, Duplicate & Delete ── */}
      <div className="bg-card/70 backdrop-blur-sm border border-border/80 rounded-2xl p-2.5 space-y-2">
        <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <span>Hero Slides</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 font-bold">
              {heroProducts.length} Active
            </span>
          </span>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            Use arrows (<ChevronLeft className="w-3 h-3 inline" /> <ChevronRight className="w-3 h-3 inline" />) to reorder carousel sequence
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none items-center">
          {heroProducts.map((prod, idx) => {
            const isSelected = safeIdx === idx;
            return (
              <div
                key={prod.id || `prod-${idx}`}
                className={cn(
                  "flex items-center rounded-xl border transition-all shrink-0",
                  isSelected
                    ? "bg-card border-orange-500 shadow-md ring-1 ring-orange-500/40"
                    : "bg-background/80 border-border/80 hover:bg-muted/40 text-muted-foreground"
                )}
              >
                {/* Select button with image thumbnail */}
                <button
                  type="button"
                  onClick={() => setSelectedProductIdx(idx)}
                  className="px-2.5 py-1.5 text-xs font-bold flex items-center gap-2.5 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-stone-900 border border-white/10 shrink-0">
                    {prod.image ? (
                      <img
                        src={getImageUrl(prod.image)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-500">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-muted-foreground opacity-80">
                        #{idx + 1}
                      </span>
                      <span className={cn("max-w-[130px] truncate text-xs", isSelected ? "text-foreground font-extrabold" : "")}>
                        {prod.title || prod.name || `Slide #${idx + 1}`}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-orange-400 font-semibold block">
                      {prod.price || "₹0"}
                    </span>
                  </div>
                </button>

                {/* Reorder and Action Controls */}
                <div className="flex items-center pr-1.5 gap-0.5 border-l border-border/50 pl-1">
                  {reorderProduct && (
                    <>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          reorderProduct(idx, idx - 1);
                        }}
                        className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer"
                        title="Move Earlier in Carousel"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === heroProducts.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          reorderProduct(idx, idx + 1);
                        }}
                        className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer"
                        title="Move Later in Carousel"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </>
                  )}

                  {duplicateProduct && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateProduct(idx);
                        toast.success(`Duplicated slide #${idx + 1}`);
                      }}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Duplicate Slide"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={heroProducts.length <= 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (heroProducts.length <= 1) {
                        toast.warning("You must keep at least one hero slide.");
                        return;
                      }
                      removeProduct(idx);
                      toast.info(`Removed slide #${idx + 1}`);
                    }}
                    className="p-1 rounded hover:bg-destructive/15 text-muted-foreground hover:text-destructive disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer"
                    title={heroProducts.length <= 1 ? "At least one slide required" : "Delete Slide"}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Main Two-Column Layout: Left = Exact 16:9 Storefront Preview, Right = Edit Controls ── */}
      <div className="grid gap-6 lg:grid-cols-12 items-start pt-1">
        
        {/* ── Left Column: Live 16:9 Storefront Hero Simulation ── */}
        <div className="lg:col-span-6 rounded-3xl border border-border bg-[#050505] p-5 shadow-soft space-y-4 text-white sticky top-24">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Exact Storefront Preview (16:9 Full Bleed)</span>
            </span>
            <span className="text-[10px] text-white/60 bg-white/10 px-2 py-0.5 rounded-full font-mono">
              Slide {safeIdx + 1} of {heroProducts.length}
            </span>
          </div>

          {/* Interactive Simulation Frame Matching Hero.tsx */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 aspect-[16/9] w-full flex flex-col justify-end p-5 select-none bg-black">
            
            {/* Background Lifestyle Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden bg-black z-0 pointer-events-none">
              {currentProduct.image ? (
                <img
                  src={getImageUrl(currentProduct.image)}
                  alt={currentProduct.title || currentProduct.name}
                  className="w-full h-full object-cover object-[center_78%] transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/30 text-xs">
                  <ImageIcon className="w-10 h-10 mb-2 stroke-1" />
                  <span>No Hero Image Uploaded</span>
                </div>
              )}
            </div>

            {/* Bottom Content Layer Matching Live Storefront */}
            <div className="relative z-10 w-full flex items-end justify-between gap-4">
              
              {/* Left Text Block */}
              <div className="max-w-[70%] text-left space-y-1">
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 text-white font-['Space_Grotesk',sans-serif] text-[9px] font-semibold uppercase tracking-[0.2em] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  <span className="w-4 h-[1px] bg-white/70" />
                  <span>{currentProduct.eyebrow || "YOUR WORLD UPGRADED"}</span>
                  <span className="w-4 h-[1px] bg-white/70" />
                </div>

                {/* Main Heading */}
                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-black text-sm sm:text-base md:text-lg uppercase text-white leading-tight drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)] line-clamp-2">
                  {currentProduct.title || currentProduct.name || "HEADLINE TITLE"}
                </h3>

                {/* Tagline */}
                <p className="font-['Space_Grotesk',sans-serif] text-[10px] text-white/95 leading-tight line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] max-w-sm">
                  {currentProduct.tagline || "Product description tagline goes here..."}
                </p>

                {/* Shop Now CTA Button */}
                <div className="pt-2">
                  <div className="inline-flex items-center gap-1.5 bg-white text-stone-950 font-['Space_Grotesk',sans-serif] font-bold text-[10px] uppercase px-4 py-1.5 rounded-full shadow-lg">
                    <span>SHOP NOW</span>
                    <ArrowRight className="w-3 h-3 text-stone-950" />
                  </div>
                </div>
              </div>

              {/* Right Indicators & Arrows Simulation */}
              <div className="flex items-center gap-2 self-end">
                {/* Progress Dashes */}
                <div className="flex items-center gap-1.5">
                  {heroProducts.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedProductIdx(i)}
                      className={cn(
                        "h-1 rounded-full transition-all cursor-pointer",
                        safeIdx === i
                          ? "w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                          : "w-2.5 bg-white/40 hover:bg-white/70"
                      )}
                    />
                  ))}
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedProductIdx(safeIdx === 0 ? heroProducts.length - 1 : safeIdx - 1)}
                    className="w-6 h-6 rounded-full border border-white/30 text-white bg-black/45 flex items-center justify-center cursor-pointer hover:bg-black/75 transition-all"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedProductIdx((safeIdx + 1) % heroProducts.length)}
                    className="w-6 h-6 rounded-full border border-white/30 text-white bg-black/45 flex items-center justify-center cursor-pointer hover:bg-black/75 transition-all"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Destination Link Information Bar */}
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-white/60 text-[11px]">
              <span className="flex items-center gap-1 text-orange-400 font-semibold">
                <Link2 className="w-3.5 h-3.5" />
                <span>CTA Button Destination:</span>
              </span>
              <a
                href={currentProduct.to || "/shop"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-orange-300 inline-flex items-center gap-1 text-[11px] underline"
              >
                <span>Test Link</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="font-mono text-[11px] text-white/90 bg-black/40 px-2.5 py-1 rounded border border-white/10 truncate">
              {currentProduct.to || "/shop"}
            </div>
          </div>

        </div>

        {/* ── Right Column: Edit Controls Form ── */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Card 1: Image Upload & Presets */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-orange-500" />
                <span>Hero Slide Image (16:9 Landscape)</span>
              </label>
              <span className="text-[11px] text-muted-foreground">
                High-res JPG / PNG / WebP
              </span>
            </div>

            {/* Drag & Drop File Upload Box */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleShoeFileUpload(e, safeIdx)}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="group border-2 border-dashed border-border hover:border-orange-500 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 cursor-pointer bg-muted/20 hover:bg-orange-500/5 transition-all text-center sm:text-left"
            >
              <div className="w-16 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-0.5 flex-1">
                <p className="text-xs font-bold text-foreground">
                  Click or drag file to upload custom hero photo
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Direct upload via backend storage. Optimal resolution: 1920×1080.
                </p>
              </div>
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-bold shadow-xs hover:bg-orange-600 active:scale-95 transition-all pointer-events-none"
              >
                Browse File
              </button>
            </div>

            {/* Direct Image URL Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">
                Or enter local / external image path:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentProduct.image || ""}
                  onChange={(e) => updateProductField(safeIdx, "image", e.target.value)}
                  placeholder="/images/hero-bronze-slide.jpg or https://..."
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-xs font-mono focus:border-orange-500 focus:outline-none"
                />
                {currentProduct.image && (
                  <button
                    type="button"
                    onClick={() => updateProductField(safeIdx, "image", "")}
                    className="p-2 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Clear Image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Campaign Presets Grid */}
            <div className="space-y-2 pt-2 border-t border-border/70">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
                  <FolderOpen className="w-3.5 h-3.5 text-orange-400" />
                  <span>Curated Lifestyle Campaign Presets</span>
                </span>
                <span className="text-[10px] text-muted-foreground">1-click select</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CAMPAIGN_PRESET_IMAGES.map((preset) => {
                  const isCurrent = currentProduct.image === preset.path;
                  return (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() => {
                        updateProductField(safeIdx, "image", preset.path);
                        toast.success(`Selected preset: ${preset.label}`);
                      }}
                      className={cn(
                        "relative p-1.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer",
                        isCurrent
                          ? "bg-orange-500/10 border-orange-500 ring-1 ring-orange-500/30"
                          : "bg-background border-border hover:border-orange-400 hover:bg-muted/40"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-stone-900 shrink-0">
                        <img
                          src={getImageUrl(preset.path)}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-[10px] font-bold text-foreground truncate">
                          {preset.label}
                        </span>
                        <span className="block text-[9px] text-muted-foreground truncate">
                          {preset.tag}
                        </span>
                      </div>
                      {isCurrent && (
                        <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Card 2: Typography & Content */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Slide Headlines & Storytelling</span>
            </h3>

            {/* Eyebrow Tag */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-foreground">
                Eyebrow Badge Text
              </label>
              <input
                type="text"
                value={currentProduct.eyebrow || ""}
                onChange={(e) => updateProductField(safeIdx, "eyebrow", e.target.value.toUpperCase())}
                placeholder="YOUR WORLD UPGRADED"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs uppercase tracking-wider font-semibold focus:border-orange-500 focus:outline-none"
              />
              <span className="text-[10px] text-muted-foreground">
                Displays above the main headline with decorative rule lines.
              </span>
            </div>

            {/* Main Title / Headline */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-foreground">
                Main Headline Title
              </label>
              <input
                type="text"
                value={currentProduct.title || currentProduct.name || ""}
                onChange={(e) => {
                  updateProductField(safeIdx, "title", e.target.value.toUpperCase());
                  updateProductField(safeIdx, "name", e.target.value.toUpperCase());
                }}
                placeholder="SCULPTED LUXURY FOR EVERYDAY STRIDE"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs uppercase font-extrabold tracking-tight focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Tagline / Subtitle */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-foreground">
                Subtitle Description
              </label>
              <textarea
                rows={2}
                value={currentProduct.tagline || ""}
                onChange={(e) => updateProductField(safeIdx, "tagline", e.target.value)}
                placeholder="Handcrafted double-bow silhouette on an anatomical PU footbed..."
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs leading-relaxed focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>

            {/* Secondary Metadata Badges (Category & Price) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground">
                  Category Tag
                </label>
                <input
                  type="text"
                  value={currentProduct.category || ""}
                  onChange={(e) => updateProductField(safeIdx, "category", e.target.value)}
                  placeholder="Women"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-foreground">
                  Display Price
                </label>
                <input
                  type="text"
                  value={currentProduct.price || ""}
                  onChange={(e) => updateProductField(safeIdx, "price", e.target.value)}
                  placeholder="₹399"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-mono focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

          </div>

          {/* Card 3: Destination URL & Quick Catalog Linker */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-orange-500" />
                <span>"Shop Now" Button Link Destination</span>
              </h3>
              {currentProduct.to && (
                <a
                  href={currentProduct.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-orange-500 hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Path Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-muted-foreground">
                Target URL / Route:
              </label>
              <input
                type="text"
                value={currentProduct.to || ""}
                onChange={(e) => updateProductField(safeIdx, "to", e.target.value)}
                placeholder="/shop?category=Women or /product/comfort-wedge-slide"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs font-mono focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Quick Catalog Linker Dropdown */}
            <div className="space-y-2 pt-2 border-t border-border/70">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
                  <Search className="w-3.5 h-3.5 text-orange-400" />
                  <span>Link Directly to a Catalog Product</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsLinkDropdownOpen(!isLinkDropdownOpen)}
                  className="text-[11px] text-orange-500 font-bold hover:underline cursor-pointer"
                >
                  {isLinkDropdownOpen ? "Hide Search" : "Search Products"}
                </button>
              </div>

              {isLinkDropdownOpen && (
                <div className="space-y-2 p-3 bg-muted/30 rounded-xl border border-border">
                  <input
                    type="text"
                    value={linkSearchQuery}
                    onChange={(e) => setLinkSearchQuery(e.target.value)}
                    placeholder="Search by name, art number, or category..."
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs focus:border-orange-500 focus:outline-none"
                    autoFocus
                  />

                  <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                    {inlineFilteredProducts.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground py-2 text-center">
                        No matching products found.
                      </p>
                    ) : (
                      inlineFilteredProducts.map((p) => {
                        const slug = p.slug || p._id || p.id;
                        const targetPath = `/product/${slug}`;
                        const isSelected = currentProduct.to === targetPath;
                        return (
                          <div
                            key={p._id || p.id}
                            className={cn(
                              "flex items-center justify-between p-2 rounded-lg border text-xs transition-colors",
                              isSelected
                                ? "bg-orange-500/10 border-orange-500"
                                : "bg-card border-border/70 hover:bg-muted"
                            )}
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <span className="font-bold text-foreground block truncate">
                                {p.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {p.artNumber || "Art #"} • ₹{p.price}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleLinkProduct(p, false)}
                                className="px-2.5 py-1 rounded bg-muted hover:bg-orange-500 hover:text-white text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                Link Only
                              </button>
                              <button
                                type="button"
                                onClick={() => handleLinkProduct(p, true)}
                                className="px-2.5 py-1 rounded bg-orange-500 text-white hover:bg-orange-600 text-[10px] font-bold transition-colors cursor-pointer"
                                title="Auto-fill Title, Tagline, Price and Link"
                              >
                                Auto-Fill All
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* ── Catalog Browser Modal ("Add from Catalog") ── */}
      {isCatalogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-left">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-orange-500" />
                  <span>Add New Hero Slide from Catalog</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select any product from your store to automatically create a dedicated hero slide.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCatalogModalOpen(false)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="p-4 border-b border-border/80 bg-muted/20 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search products by name or art number..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-xs focus:border-orange-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <select
                value={catalogCategoryFilter}
                onChange={(e) => setCatalogCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold focus:border-orange-500 focus:outline-none"
              >
                {productCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Product List */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {filteredCatalogProducts.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-xs">
                  No products found matching your search.
                </div>
              ) : (
                filteredCatalogProducts.map((p) => {
                  const prodImg = (p.images && p.images[0]) || p.image;
                  return (
                    <div
                      key={p._id || p.id}
                      className="flex items-center justify-between p-3 rounded-2xl border border-border bg-card hover:bg-muted/40 transition-colors gap-3"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-900 border border-white/10 shrink-0">
                        {prodImg ? (
                          <img
                            src={getImageUrl(prodImg)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-500">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-xs truncate">
                            {p.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                            {p.artNumber || "Art #"}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {p.description || "No description available"}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs font-bold text-orange-500 block">
                          ₹{p.price}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCreateFromCatalog(p)}
                          className="mt-1 px-3 py-1.5 rounded-xl bg-orange-500 text-white font-bold text-[11px] hover:bg-orange-600 active:scale-95 transition-all shadow-xs cursor-pointer"
                        >
                          + Create Slide
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
