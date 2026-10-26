import React, { useState, useMemo } from "react";
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
  Palette,
  Eye,
  ShoppingBag,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { HeroProduct } from "@/components/Hero";

const PRESET_SHOE_IMAGES = [
  { label: "Buckle Slide", path: "/about-products/trans_mocs-sandal-buckle.png" },
  { label: "Crossover Slide", path: "/about-products/trans_mocs-cross-slide.png" },
  { label: "Bow Sandal", path: "/about-products/trans_mocs-bow-sandal.png" },
  { label: "Rhinestone Sandal", path: "/about-products/trans_mocs-sandal-rhinestone.png" },
  { label: "Wedge Slide", path: "/about-products/trans_mocs-wedge-slide.png" },
];

const FLUID_PALETTE_PRESETS = [
  {
    name: "Signature Flame",
    accent: "#ff6600",
    accentSecondary: "#ff9933",
    upper: "#141416",
    toeCap: "#222226",
    laces: "#ffffff",
    midsole: "#f4f4f6",
    midsoleAccent: "#ff6600",
    outsole: "#0f0f12",
  },
  {
    name: "Royal Velvet",
    accent: "#a855f7",
    accentSecondary: "#c084fc",
    upper: "#120919",
    toeCap: "#1d1226",
    laces: "#ffffff",
    midsole: "#faf5ff",
    midsoleAccent: "#a855f7",
    outsole: "#0a040f",
  },
  {
    name: "Oceanic Azure",
    accent: "#06b6d4",
    accentSecondary: "#38bdf8",
    upper: "#08131d",
    toeCap: "#0e1f30",
    laces: "#ffffff",
    midsole: "#ecfeff",
    midsoleAccent: "#06b6d4",
    outsole: "#040b12",
  },
  {
    name: "Golden Sun",
    accent: "#eab308",
    accentSecondary: "#fde047",
    upper: "#18140c",
    toeCap: "#262013",
    laces: "#ffffff",
    midsole: "#fefce8",
    midsoleAccent: "#eab308",
    outsole: "#0e0b04",
  },
  {
    name: "Emerald Luxe",
    accent: "#10b981",
    accentSecondary: "#34d399",
    upper: "#08160f",
    toeCap: "#0e2419",
    laces: "#ffffff",
    midsole: "#ecfdf5",
    midsoleAccent: "#10b981",
    outsole: "#030e07",
  },
  {
    name: "Monochrome Dark",
    accent: "#94a3b8",
    accentSecondary: "#cbd5e1",
    upper: "#121214",
    toeCap: "#1e1e24",
    laces: "#ffffff",
    midsole: "#f8fafc",
    midsoleAccent: "#94a3b8",
    outsole: "#09090b",
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
  // Modal state for "Add from Catalog"
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState("ALL");

  // Inline product search filter for linking to destination URL
  const [linkSearchQuery, setLinkSearchQuery] = useState("");
  const [isLinkDropdownOpen, setIsLinkDropdownOpen] = useState(false);

  // Shader palette accordion
  const [showColorEditor, setShowColorEditor] = useState(false);

  const currentProduct: HeroProduct = heroProducts[selectedProductIdx] || {
    id: "new-hero-product",
    name: "NEW HERO MODEL",
    tagline: "Comfort engineered for every step.",
    price: "₹399",
    category: "SIGNATURE SLIDE",
    to: "/shop",
    image: "/about-products/trans_mocs-sandal-buckle.png",
    colors: FLUID_PALETTE_PRESETS[0],
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

  // Find currently linked product in catalog
  const linkedCatalogProduct = useMemo(() => {
    const toPath = currentProduct.to || "";
    return availableProducts.find((p) => {
      const id = p._id || p.id;
      const slug = p.slug;
      return (
        toPath === `/product/${id}` ||
        (slug && toPath === `/product/${slug}`) ||
        currentProduct.productId === id
      );
    });
  }, [availableProducts, currentProduct.to, currentProduct.productId]);

  // Helper to link a product from catalog to current hero product
  const handleLinkProduct = (prod: any, autoFillAll = false) => {
    const targetSlug = prod.slug || prod._id || prod.id;
    const path = `/product/${targetSlug}`;
    updateProductField(selectedProductIdx, "to", path);
    updateProductField(selectedProductIdx, "productId", prod._id || prod.id);

    if (autoFillAll) {
      if (prod.name) {
        updateProductField(selectedProductIdx, "name", prod.name.toUpperCase());
      }
      if (prod.price) {
        updateProductField(selectedProductIdx, "price", `₹${prod.price}`);
      }
      const catName = typeof prod.category === "string" ? prod.category : prod.category?.name;
      if (catName) {
        updateProductField(selectedProductIdx, "category", catName.toUpperCase());
      }
      if (prod.description) {
        const shortDesc = prod.description.slice(0, 95).trim() + (prod.description.length > 95 ? "..." : "");
        updateProductField(selectedProductIdx, "tagline", shortDesc);
      }
      // If product has an image and current product image is empty or default, suggest it
      const prodImg = (prod.images && prod.images[0]) || prod.image;
      if (prodImg && (!currentProduct.image || currentProduct.image.includes("trans_mocs-sandal-buckle"))) {
        updateProductField(selectedProductIdx, "image", prodImg);
      }
      toast.success(`Linked & auto-filled details from "${prod.name}"`);
    } else {
      toast.success(`Destination linked to "/product/${targetSlug}"`);
    }

    setIsLinkDropdownOpen(false);
    setLinkSearchQuery("");
  };

  // Helper to add a new model directly from a catalog product
  const handleCreateFromCatalog = (prod: any) => {
    const targetSlug = prod.slug || prod._id || prod.id;
    const catName = typeof prod.category === "string" ? prod.category : prod.category?.name;
    const prodImg = (prod.images && prod.images[0]) || prod.image || PRESET_SHOE_IMAGES[0].path;

    const shortDesc = prod.description
      ? prod.description.slice(0, 90).trim() + (prod.description.length > 90 ? "..." : "")
      : "Comfort engineered for every step with lightweight construction.";

    addProduct({
      name: (prod.name || "NEW MOCS MODEL").toUpperCase(),
      price: `₹${prod.price || 399}`,
      category: (catName || "SIGNATURE SLIDE").toUpperCase(),
      tagline: shortDesc,
      to: `/product/${targetSlug}`,
      productId: prod._id || prod.id,
      image: prodImg,
      colors: FLUID_PALETTE_PRESETS[heroProducts.length % FLUID_PALETTE_PRESETS.length],
    });

    setIsCatalogModalOpen(false);
    toast.success(`Created Hero Model for "${prod.name}"`);
  };

  // Helper to update colors
  const handleColorChange = (colorKey: string, hex: string) => {
    const prevColors = currentProduct.colors || FLUID_PALETTE_PRESETS[0];
    updateProductField(selectedProductIdx, "colors", {
      ...prevColors,
      [colorKey]: hex,
    });
  };

  // Helper to apply preset colors
  const applyPalettePreset = (preset: typeof FLUID_PALETTE_PRESETS[0]) => {
    updateProductField(selectedProductIdx, "colors", { ...preset });
    toast.success(`Applied "${preset.name}" fluid palette`);
  };

  const accentColor = currentProduct.colors?.accent || "#ff6600";

  return (
    <div id="hero-models" className="space-y-6 pt-6 border-t border-border scroll-mt-24 font-sans text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>WebGL 3D Fluid Carousel</span>
          </div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
            Hero Section Models
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Full CRUD: customize hero models, cutout shoes, fluid shader colors, and easily link each model directly to its product detail page.
          </p>
        </div>

        {/* Action Buttons: Add Blank & Add from Catalog */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsCatalogModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-sm cursor-pointer"
            title="Browse your catalog and add a hero model in one click"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>+ Add from Catalog</span>
          </button>

          <button
            type="button"
            onClick={() => addProduct()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-xs font-bold active:scale-95 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-orange-500" />
            <span>New Model</span>
          </button>
        </div>
      </div>

      {/* Model Tabs Bar with Reorder (< / >) & Duplicate */}
      <div className="bg-card/60 backdrop-blur-sm border border-border/70 rounded-2xl p-2.5 space-y-2">
        <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <span>Hero Models</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-orange-500/15 text-orange-400 font-bold">
              {heroProducts.length}
            </span>
          </span>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            Use arrows (<ChevronLeft className="w-3 h-3 inline" /> <ChevronRight className="w-3 h-3 inline" />) to reorder carousel sequence
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none items-center">
          {heroProducts.map((prod, idx) => {
            const isSelected = selectedProductIdx === idx;
            const tabAccent = prod.colors?.accent || "#ff6600";
            return (
              <div
                key={prod.id || `prod-${idx}`}
                className={cn(
                  "flex items-center rounded-xl border transition-all shrink-0",
                  isSelected
                    ? "bg-card border-orange-500/80 shadow-md ring-1 ring-orange-500/40"
                    : "bg-background/80 border-border/80 hover:bg-muted/40 text-muted-foreground"
                )}
              >
                {/* Select button */}
                <button
                  type="button"
                  onClick={() => setSelectedProductIdx(idx)}
                  className="px-3 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: tabAccent }}
                  />
                  <span className="text-[10px] font-mono text-muted-foreground opacity-80">
                    #{idx + 1}
                  </span>
                  <span className={cn("max-w-[140px] truncate", isSelected ? "text-foreground font-extrabold" : "")}>
                    {prod.name || `Model #${idx + 1}`}
                  </span>
                  <span className="text-[10px] font-mono text-orange-400 font-semibold">
                    {prod.price || "₹0"}
                  </span>
                </button>

                {/* Reorder and Quick Action Controls */}
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
                        title="Move Earlier in Hero Carousel"
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
                        title="Move Later in Hero Carousel"
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
                        toast.success(`Duplicated "${prod.name}"`);
                      }}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Duplicate Model"
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
                        toast.warning("You must keep at least one hero model.");
                        return;
                      }
                      removeProduct(idx);
                      toast.info(`Removed model #${idx + 1}`);
                    }}
                    className="p-1 rounded hover:bg-destructive/15 text-muted-foreground hover:text-destructive disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer"
                    title={heroProducts.length <= 1 ? "At least one model required" : "Delete Model"}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left = Realistic Storefront Simulation Box, Right = Edit Controls Form */}
      <div className="grid gap-6 lg:grid-cols-12 items-start pt-1">
        {/* Left Column: Live Hero Simulation Box */}
        <div className="lg:col-span-5 rounded-3xl border border-border bg-[#050505] p-5 shadow-soft space-y-4 text-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Live Simulation</span>
            </span>
            <span className="text-[10px] text-white/60 bg-white/10 px-2 py-0.5 rounded-full font-mono">
              Model {selectedProductIdx + 1} of {heroProducts.length}
            </span>
          </div>

          {/* Interactive Simulation Frame */}
          <div
            className="relative overflow-hidden rounded-2xl border aspect-[4/3] flex flex-col justify-between p-5 transition-all duration-300"
            style={{
              backgroundColor: currentProduct.colors?.upper || "#0a0a0c",
              borderColor: `${accentColor}40`,
            }}
          >
            {/* Ambient dynamic fluid glow matching current accent */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full blur-3xl pointer-events-none transition-all duration-500 opacity-30"
              style={{ backgroundColor: accentColor }}
              aria-hidden="true"
            />

            {/* Top Category Badge */}
            <div className="relative z-10 flex justify-center">
              <span
                className="inline-block text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full transition-colors border"
                style={{
                  backgroundColor: `${accentColor}25`,
                  color: "#ffffff",
                  borderColor: `${accentColor}50`,
                }}
              >
                {currentProduct.category || "SIGNATURE MODEL"}
              </span>
            </div>

            {/* Center Shoe Cutout Image */}
            <div className="relative z-10 flex-1 flex items-center justify-center p-2 min-h-0">
              {currentProduct.image ? (
                <img
                  src={getImageUrl(currentProduct.image)}
                  alt={currentProduct.name}
                  className="max-h-[145px] max-w-[85%] object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.9)] -rotate-3 transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-white/40 text-xs">
                  <ImageIcon className="w-8 h-8 mb-1 stroke-1" />
                  <span>No Shoe Image</span>
                </div>
              )}
            </div>

            {/* Bottom Content Preview */}
            <div className="relative z-10 text-center space-y-1 pt-2 border-t border-white/10">
              <h4 className="font-['Unbounded',sans-serif] text-sm sm:text-base font-black uppercase tracking-tight text-white line-clamp-1">
                {currentProduct.name || "MODEL NAME"}
              </h4>
              <p className="text-[11px] text-white/70 line-clamp-2 max-w-xs mx-auto leading-tight">
                {currentProduct.tagline || "Product description tagline..."}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <span className="font-['Unbounded',sans-serif] text-xs font-bold text-white">
                  {currentProduct.price || "₹0"}
                </span>
                <a
                  href={currentProduct.to || "/shop"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-black font-bold text-[10px] px-3 py-1 rounded-full transition-transform active:scale-95 shadow-md"
                  style={{ backgroundColor: accentColor }}
                  title={`Test Link: ${currentProduct.to || "/shop"}`}
                >
                  <span>Shop now</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Destination URL Live Badge */}
          <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-xs space-y-1">
            <div className="flex items-center justify-between text-white/60 text-[11px]">
              <span className="flex items-center gap-1 text-orange-400 font-semibold">
                <Link2 className="w-3 h-3" />
                <span>Shop Now Button Path:</span>
              </span>
              <a
                href={currentProduct.to || "/shop"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-orange-300 inline-flex items-center gap-1 text-[10px] underline"
              >
                <span>Test Page</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <p className="font-mono text-white text-[11px] truncate bg-black/40 px-2 py-1 rounded border border-white/5">
              {currentProduct.to || "/shop"}
            </p>
            {linkedCatalogProduct && (
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 pt-0.5">
                <Check className="w-3 h-3 shrink-0" />
                <span>Matched to Catalog: &quot;{linkedCatalogProduct.name}&quot; (₹{linkedCatalogProduct.price})</span>
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Edit Controls Form */}
        <div className="lg:col-span-7 rounded-3xl border border-border bg-card p-6 shadow-soft space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm font-bold text-foreground">
                  Editing Model #{selectedProductIdx + 1}
                </h3>
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: accentColor }}
                  title="Model Accent Color"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update content, link product detail path, and customize colors.
              </p>
            </div>

            {heroProducts.length > 1 && (
              <button
                type="button"
                onClick={() => removeProduct(selectedProductIdx)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive text-xs font-semibold hover:bg-destructive/10 transition-colors cursor-pointer"
                title="Delete this hero product"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>

          {/* Model Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Product Model Name
            </label>
            <input
              type="text"
              value={currentProduct.name}
              onChange={(e) => updateProductField(selectedProductIdx, "name", e.target.value)}
              placeholder="e.g. LADIES BUCKLE SLIDE"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            />
          </div>

          {/* Category Badge & Price Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Category / Badge
              </label>
              <input
                type="text"
                value={currentProduct.category}
                onChange={(e) => updateProductField(selectedProductIdx, "category", e.target.value)}
                placeholder="e.g. SIGNATURE SLIDE"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Price Display
              </label>
              <input
                type="text"
                value={currentProduct.price}
                onChange={(e) => updateProductField(selectedProductIdx, "price", e.target.value)}
                placeholder="e.g. ₹399"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              />
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Tagline / Subtitle
            </label>
            <textarea
              rows={2}
              value={currentProduct.tagline}
              onChange={(e) => updateProductField(selectedProductIdx, "tagline", e.target.value)}
              placeholder="e.g. Contoured anatomical footbed with crystal-embellished buckle strap..."
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs resize-none"
            />
          </div>

          {/* =========================================================================
              DESTINATION URL & INTERACTIVE PRODUCT DETAIL PATH PICKER
              ========================================================================= */}
          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-orange-500" />
                <label className="text-xs font-bold uppercase tracking-wider text-foreground block">
                  Product Detail Page Path (`Shop now` link)
                </label>
              </div>
              <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
                Interactive Linker
              </span>
            </div>

            {/* Quick Catalog Product Search & Link */}
            {availableProducts.length > 0 && (
              <div className="space-y-2">
                <div className="relative">
                  <div className="relative flex items-center">
                    <Search className="w-3.5 h-3.5 absolute left-3 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      value={linkSearchQuery}
                      onChange={(e) => {
                        setLinkSearchQuery(e.target.value);
                        setIsLinkDropdownOpen(true);
                      }}
                      onFocus={() => setIsLinkDropdownOpen(true)}
                      placeholder="🔍 Search catalog products by name, art #, or category to link..."
                      className="w-full rounded-xl border border-border bg-background pl-9 pr-8 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
                    />
                    {linkSearchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setLinkSearchQuery("");
                          setIsLinkDropdownOpen(false);
                        }}
                        className="absolute right-2.5 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Search Dropdown Results */}
                  {isLinkDropdownOpen && inlineFilteredProducts.length > 0 && (
                    <div className="absolute z-30 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl border border-border bg-card shadow-xl p-1 space-y-1">
                      <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground flex items-center justify-between border-b border-border/50">
                        <span>Click product to link path directly</span>
                        <span>{inlineFilteredProducts.length} results</span>
                      </div>
                      {inlineFilteredProducts.map((p) => {
                        const targetSlug = p.slug || p._id || p.id;
                        const isCurrent = currentProduct.to === `/product/${targetSlug}`;
                        return (
                          <div
                            key={p._id || p.id}
                            className={cn(
                              "flex items-center justify-between p-2 rounded-lg text-xs transition-colors hover:bg-muted/80 gap-2",
                              isCurrent ? "bg-orange-500/10 border border-orange-500/30" : ""
                            )}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={getImageUrl((p.images && p.images[0]) || p.image || "/placeholder.svg")}
                                alt={p.name}
                                className="w-8 h-8 rounded-md object-contain bg-muted/40 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-foreground truncate text-xs">{p.name}</p>
                                <p className="text-[10px] text-muted-foreground truncate">
                                  {p.artNumber ? `Art: ${p.artNumber} • ` : ""}₹{p.price} • {typeof p.category === "string" ? p.category : p.category?.name || "Footwear"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleLinkProduct(p, false)}
                                className="px-2 py-1 rounded bg-muted hover:bg-orange-500 hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
                                title={`Set path to /product/${targetSlug}`}
                              >
                                Link Path
                              </button>
                              <button
                                type="button"
                                onClick={() => handleLinkProduct(p, true)}
                                className="px-2 py-1 rounded bg-orange-500 text-white hover:bg-orange-600 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                                title="Link path AND auto-fill model name, price, category, tagline"
                              >
                                <Wand2 className="w-2.5 h-2.5" />
                                <span>Auto-fill All</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Currently linked banner with Auto-Fill helper */}
                {linkedCatalogProduct && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-background border border-border text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold text-foreground truncate block">
                          Linked to: {linkedCatalogProduct.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          ₹{linkedCatalogProduct.price} • {linkedCatalogProduct.artNumber || "In Stock"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleLinkProduct(linkedCatalogProduct, true)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 text-[11px] font-bold transition-all cursor-pointer"
                        title="Re-sync Model Name, Price, and Category from this product"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Sync Content</span>
                      </button>

                      {linkedCatalogProduct.images?.[0] && (
                        <button
                          type="button"
                          onClick={() => {
                            updateProductField(selectedProductIdx, "image", linkedCatalogProduct.images[0]);
                            toast.success("Applied product photo as cutout image");
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted text-foreground hover:bg-muted/80 text-[11px] font-medium transition-all cursor-pointer"
                          title="Use this product's first catalog photo as cutout image"
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>Use Photo</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Manual Path Input */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground block">
                Destination URL Path:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentProduct.to || ""}
                  onChange={(e) => updateProductField(selectedProductIdx, "to", e.target.value)}
                  placeholder="e.g. /product/ladies-buckle-slide or /shop"
                  className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-mono font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                />
                <a
                  href={currentProduct.to || "/shop"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted text-xs font-semibold shrink-0"
                  title="Open destination URL in a new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Test</span>
                </a>
              </div>
            </div>

            {/* Quick URL Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Presets:</span>
              {[
                { label: "All Products (/shop)", path: "/shop" },
                { label: "Women Collection", path: "/shop?category=Women" },
                { label: "Men Collection", path: "/shop?category=Men" },
                { label: "New Arrivals", path: "/shop?sort=newest" },
              ].map((p) => (
                <button
                  key={p.path}
                  type="button"
                  onClick={() => {
                    updateProductField(selectedProductIdx, "to", p.path);
                    toast.info(`Set path to ${p.path}`);
                  }}
                  className="px-2 py-0.5 rounded-md bg-muted/60 hover:bg-muted text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer border border-border/50"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Shoe Cutout Image Upload & Selector */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Shoe Cutout Image (Transparent PNG)
            </label>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                type="text"
                value={currentProduct.image}
                onChange={(e) => updateProductField(selectedProductIdx, "image", e.target.value)}
                placeholder="/about-products/... or image URL"
                className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              />

              <label className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold cursor-pointer transition-all shadow-sm shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload PNG</span>
                <input
                  type="file"
                  accept="image/png,image/webp,image/jpeg"
                  className="hidden"
                  onChange={(e) => handleShoeFileUpload(e, selectedProductIdx)}
                />
              </label>
            </div>

            {/* Presets selector */}
            <div className="pt-1">
              <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                Quick Select MOCS Cutout Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_SHOE_IMAGES.map((preset) => (
                  <button
                    key={preset.path}
                    type="button"
                    onClick={() => updateProductField(selectedProductIdx, "image", preset.path)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all flex items-center gap-1.5 cursor-pointer",
                      currentProduct.image === preset.path
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

          {/* =========================================================================
              FLUID SHADER COLOR PALETTE CUSTOMIZER
              ========================================================================= */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <button
              type="button"
              onClick={() => setShowColorEditor(!showColorEditor)}
              className="w-full flex items-center justify-between text-left p-3 rounded-xl bg-muted/40 hover:bg-muted border border-border/70 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  WebGL 3D Fluid Colors & Shader Theme
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: accentColor }}
                />
                <span className="text-xs text-muted-foreground">
                  {showColorEditor ? "Hide" : "Customize"}
                </span>
              </div>
            </button>

            {showColorEditor && (
              <div className="p-4 rounded-2xl bg-card border border-border space-y-4">
                {/* 1-Click Palette Presets */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                    1-Click Shader Theme Presets:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {FLUID_PALETTE_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => applyPalettePreset(preset)}
                        className="flex items-center gap-2 p-2 rounded-xl border border-border hover:border-orange-500/50 bg-background hover:bg-muted/60 text-left transition-all cursor-pointer text-xs"
                      >
                        <div className="flex items-center -space-x-1 shrink-0">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-background shadow-xs"
                            style={{ backgroundColor: preset.accent }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-background shadow-xs"
                            style={{ backgroundColor: preset.accentSecondary }}
                          />
                        </div>
                        <span className="font-semibold text-foreground truncate text-[11px]">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Individual Color Controls */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border/60">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block truncate">
                      Primary Accent
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentProduct.colors?.accent || "#ff6600"}
                        onChange={(e) => handleColorChange("accent", e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                      />
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {currentProduct.colors?.accent || "#ff6600"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block truncate">
                      Secondary Glow
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentProduct.colors?.accentSecondary || "#ff9933"}
                        onChange={(e) => handleColorChange("accentSecondary", e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                      />
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {currentProduct.colors?.accentSecondary || "#ff9933"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block truncate">
                      Fluid Upper Base
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentProduct.colors?.upper || "#141416"}
                        onChange={(e) => handleColorChange("upper", e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                      />
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {currentProduct.colors?.upper || "#141416"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block truncate">
                      Midsole Crest
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentProduct.colors?.midsole || "#f4f4f6"}
                        onChange={(e) => handleColorChange("midsole", e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-border bg-transparent p-0.5"
                      />
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {currentProduct.colors?.midsole || "#f4f4f6"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: ADD HERO MODEL FROM PRODUCT CATALOG
          ========================================================================= */}
      {isCatalogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-500">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Add Hero Model from Catalog
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Choose a product to instantly create a new Hero Model with its name, price, and product page link.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCatalogModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search & Filters */}
            <div className="p-4 border-b border-border space-y-3 bg-background">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search products by title, SKU / Art #, or category..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                  autoFocus
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {productCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCatalogCategoryFilter(cat)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                      catalogCategoryFilter === cat
                        ? "bg-orange-500 text-white shadow-xs"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Product List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredCatalogProducts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-semibold">No catalog products found</p>
                  <p className="text-xs text-muted-foreground mt-1">Try adjusting your search query or category filter.</p>
                </div>
              ) : (
                filteredCatalogProducts.map((p) => {
                  const targetSlug = p.slug || p._id || p.id;
                  const catName = typeof p.category === "string" ? p.category : p.category?.name || "Footwear";
                  const thumb = (p.images && p.images[0]) || p.image || "/placeholder.svg";

                  return (
                    <div
                      key={p._id || p.id}
                      className="flex items-center justify-between p-3 rounded-2xl border border-border hover:border-orange-500/40 bg-card hover:bg-muted/40 transition-all gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={getImageUrl(thumb)}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-contain bg-muted/60 p-1 shrink-0 border border-border/50"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-foreground truncate">{p.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <span className="font-mono text-orange-400 font-bold">₹{p.price}</span>
                            <span>•</span>
                            <span className="truncate">{catName}</span>
                            {p.artNumber && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-[10px] bg-muted px-1.5 py-0.2 rounded">
                                  Art: {p.artNumber}
                                </span>
                              </>
                            )}
                          </div>
                          <p className="text-[10px] font-mono text-muted-foreground/80 truncate mt-0.5">
                            Path: /product/{targetSlug}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCreateFromCatalog(p)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Hero</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
              <span>Showing {filteredCatalogProducts.length} of {availableProducts.length} catalog products</span>
              <button
                type="button"
                onClick={() => setIsCatalogModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border bg-background hover:bg-muted text-foreground font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
