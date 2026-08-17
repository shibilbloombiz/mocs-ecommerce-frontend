import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { isAuthed } from "@/lib/auth";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Minus,
  Plus,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import {
  getProduct,
  getRelated,
  getReviews,
  products as mockProducts,
  type Product,
  type ProductView,
} from "@/lib/products";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { ProductCard } from "@/components/ProductCard";
import { Reveal, Stagger } from "@/components/Reveal";
import { cn, getImageUrl } from "@/lib/utils";
import { apiClient, API_BASE_URL, formatUserError } from "@/lib/api";
import { formatApiProducts } from "@/routes/index";

export const Route = createFileRoute("/product/$id")({
  shouldReload: true,
  loader: async ({ params }) => {
    // Try to load product from API first
    try {
      const p = await apiClient.products.get(params.id);
      if (p) {
        const mappedProduct: Product = {
          id: p._id || p.id || params.id,
          _id: p._id,
          artNumber: p.artNumber || "",
          name: p.name,
          category: (p.category?.name || p.category || "Men") as any,
          collection: (p.collection || "Casual") as any,
          type: "Running",
          price: p.price,
          oldPrice: p.oldPrice,
          rating: p.rating || 5,
          reviews: p.reviewCount || 0,
          stock: p.stock || 0,
          image: getImageUrl(p.coverImage),
          colors: p.colors && p.colors.length > 0
            ? p.colors.map((c: any) => ({ name: c.name, hex: c.hex, stock: c.stock }))
            : [{ name: "Default", hex: "#000000", stock: p.stock }],
          sizes: p.sizes || [7, 8, 9, 10, 11, 12],
          outOfStockSizes: p.outOfStockSizes || [],
          description: p.description,
          isNew: p.isNew,
          views: p.additionalImages && p.additionalImages.length > 0
            ? [
                { label: "Front", src: getImageUrl(p.coverImage) },
                ...p.additionalImages.map((img: any) => ({
                  label: img.label || "Side",
                  src: getImageUrl(img.url)
                }))
              ]
            : [{ label: "Front", src: getImageUrl(p.coverImage) }]
        };
        return { product: mappedProduct };
      }
    } catch (err) {
      console.warn("Product not found on backend MERN server, loading fallback mock data...", err);
    }

    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    return {
      meta: [
        { title: p ? `${p.name} — MOCS` : "Product — MOCS" },
        {
          name: "description",
          content: p?.description ?? "Premium MOCS footwear.",
        },
        { property: "og:title", content: p ? `${p.name} — MOCS` : "MOCS" },
        { property: "og:description", content: p?.description ?? "Premium MOCS footwear." },
        ...(p ? [{ property: "og:image", content: p.image }] : []),
      ],
    };
  },
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block font-semibold text-primary">
          Back to shop
        </Link>
      </div>
    </div>
  ),
});

function ProductDetail() {
  const { product }: { product: Product } = Route.useLoaderData();
  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    setCartOpen,
    pushRecentlyViewed,
    recentlyViewed,
  } = useStore();

  const [allVariants, setAllVariants] = useState<Product[]>([]);
  const [allBackendProducts, setAllBackendProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchVariants = async () => {
      if (!product.artNumber) return;
      try {
        const res = await apiClient.products.list(`artNumber=${encodeURIComponent(product.artNumber)}&limit=50`);
        if (res && res.items) {
          const apiVariants = res.items
            .filter((p: any) => p.artNumber === product.artNumber)
            .map((p: any) => ({
              id: p._id,
              artNumber: p.artNumber || "",
              name: p.name,
              category: p.category?.name || p.category || "Men",
              collection: p.collection || "Casual",
              price: p.price,
              oldPrice: p.oldPrice,
              rating: p.rating || 5,
              reviews: p.reviewCount || 0,
              stock: p.stock || 0,
              image: getImageUrl(p.coverImage),
              colors: p.colors && p.colors.length > 0
                ? p.colors.map((c: any) => ({ name: c.name, hex: c.hex }))
                : [{ name: "Default", hex: "#000000" }],
              sizes: p.sizes || [7, 8, 9, 10, 11, 12],
              description: p.description,
              isNew: p.isNew,
            }));
          setAllVariants(apiVariants);
        }
      } catch (err) {
        console.warn("Failed to fetch variants for art number", err);
      }
    };

    const loadAllProducts = async () => {
      try {
        const res = await apiClient.products.list("limit=100");
        if (res && res.items) {
          setAllBackendProducts(formatApiProducts(res.items));
        }
      } catch (err) {
        console.warn("Failed to load products for detail page fallback", err);
      }
    };

    fetchVariants();
    loadAllProducts();
  }, [product.artNumber]);

  const colorOptions = useMemo(() => {
    if (allVariants.length > 0) {
      const options: { name: string; hex: string; productId: string }[] = [];
      allVariants.forEach((v) => {
        (v.colors || []).forEach((c) => {
          if (!options.some((opt) => opt.name === c.name)) {
            options.push({ name: c.name, hex: c.hex, productId: v.id });
          }
        });
      });
      return options;
    } else {
      return (product.colors || []).map((c) => ({ name: c.name, hex: c.hex, productId: product.id }));
    }
  }, [allVariants, product]);

  // Multi-view gallery: front / side / back / top / sole / lifestyle
  const gallery: ProductView[] = useMemo(() => {
    if (product.views && product.views.length > 0) return product.views;
    return [
      { label: "Front", src: product.image },
      ...allBackendProducts
        .filter((p) => p.id !== product.id)
        .slice(0, 3)
        .map<ProductView>((p) => ({ label: "Side", src: p.image })),
    ];
  }, [product, allBackendProducts]);

  const [active, setActive] = useState(0);
  const [size, setSize] = useState<number | null>(null);
  const [color, setColor] = useState(product.colors?.[0]?.name || "Default");
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [showSizePrompt, setShowSizePrompt] = useState(false);
  const [sizePromptAction, setSizePromptAction] = useState<"cart" | "buy">("cart");

  const currentVariantStock = useMemo(() => {
    const variant = product.colors?.find((c: any) => c.name === color);
    if (variant) {
      return typeof variant.stock === "number" ? variant.stock : product.stock;
    }
    return product.stock;
  }, [product, color]);

  useEffect(() => {
    if (qty > currentVariantStock) {
      setQty(Math.max(1, currentVariantStock));
    }
  }, [currentVariantStock, qty]);

  // Responsive window resize state for slides per page in carousels
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cardsPerView = windowWidth >= 1024 ? 4.2 : windowWidth >= 768 ? 2.2 : 1.2;

  // Offset indices for carousels
  const [relatedIdx, setRelatedIdx] = useState(0);
  const [recentIdx, setRecentIdx] = useState(0);
  const [promoTexts, setPromoTexts] = useState<string[]>([
    (product as any).promo1 || "Easy shipping",
    (product as any).promo2 || "3-day returns",
    (product as any).promo3 || "3-months warranty"
  ]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  useEffect(() => {
    setPromoTexts([
      (product as any).promo1 || "Easy shipping",
      (product as any).promo2 || "3-day returns",
      (product as any).promo3 || "3-months warranty"
    ]);
  }, [product]);
  const [userReviews, setUserReviews] = useState<
    {
      name: string;
      rating: number;
      text: string;
      days: number;
      color: string;
      verified: boolean;
      size?: number | null;
    }[]
  >([]);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [writeReviewModalOpen, setWriteReviewModalOpen] = useState(false);
  const [rvRating, setRvRating] = useState(5);
  const [rvHoverRating, setRvHoverRating] = useState<number | null>(null);
  const [rvText, setRvText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Live review count & average rating reactively computed from userReviews state!
  const liveReviews = userReviews;
  const liveReviewCount = reviewsLoaded ? liveReviews.length : (product.reviews || 0);
  const liveRating = useMemo(() => {
    if (liveReviews.length > 0) {
      const sum = liveReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
      return Math.round((sum / liveReviews.length) * 10) / 10;
    }
    return product.rating || 5;
  }, [liveReviews, product.rating]);

  useEffect(() => {
    pushRecentlyViewed(product.id);
    setColor(product.colors?.[0]?.name || "Default");
    setSize(null);
    setQty(1);
    setActive(0);
    setZoom(false);
    setCurrentReviewIndex(0);
    setReviewsLoaded(false);

    const fetchReviews = async () => {
      try {
        const res = await apiClient.reviews.list(product.id);
        if (res && Array.isArray(res) && res.length > 0) {
          const mapped = res.map((r: any) => ({
            name: r.user?.name || r.name || "Customer",
            rating: Number(r.rating) || 5,
            text: r.comment || r.text || "",
            days: Math.round((Date.now() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24)) || 0,
            color: r.color || "Default",
            verified: r.isVerifiedPurchase ?? r.verifiedPurchase ?? true,
            size: r.size || null,
          }));
          setUserReviews(mapped);
          setReviewsLoaded(true);
          return;
        }
      } catch (err) {
        // Handled silently with local fallback
      }
      const localReviews = getReviews(product.id);
      if (localReviews && localReviews.length > 0) {
        setUserReviews(localReviews);
      }
      setReviewsLoaded(true);
    };
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const handleDirectReviewSubmit = async () => {
    if (!isAuthed()) {
      navigate({ to: "/auth", search: { redirect: `/product/${product.id}` } });
      return;
    }
    if (!rvText.trim()) {
      toast.error("Please enter a short review comment before submitting.");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await apiClient.reviews.create({
        productId: product.id,
        rating: rvRating,
        text: rvText.trim(),
        color: color || product.colors[0]?.name || "Default",
        size: size || undefined,
      });

      toast.success("Thank you! Your review was submitted successfully.");
      setWriteReviewModalOpen(false);
      setRvText("");
      setRvRating(5);

      // Instantly update reviews live without reloading
      setUserReviews((prev) => {
        const newEntry = {
          name: res?.user?.name || "You",
          rating: rvRating,
          text: rvText.trim(),
          days: 0,
          color: color || product.colors[0]?.name || "Default",
          verified: true,
          size: size || null,
        };
        const existingIdx = prev.findIndex(
          (r) => r.name === (res?.user?.name || "You") || r.name === "You"
        );
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = newEntry;
          return updated;
        }
        return [newEntry, ...prev];
      });
    } catch (err: any) {
      toast.error(formatUserError(err, "Failed to submit review. Please try again."));
    } finally {
      setSubmittingReview(false);
    }
  };

  const reviews = userReviews;

  useEffect(() => {
    setCurrentReviewIndex(0);
  }, [reviews.length]);

  const nextReview = () => {
    if (reviews.length <= 1) return;
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    if (reviews.length <= 1) return;
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const recentProducts = recentlyViewed
    .filter((id) => id !== product.id)
    .map((id) => allBackendProducts.find((p) => p.id === id))
    .filter((p): p is Product => !!p)
    .slice(0, 10);

  const relatedProducts = useMemo(() => {
    const current = product;
    const same = allBackendProducts.filter((p) => p.id !== current.id && p.category === current.category);
    const others = allBackendProducts.filter((p) => p.id !== current.id && p.category !== current.category);
    return [...same, ...others].slice(0, 12);
  }, [allBackendProducts, product]);

  const wished = isWishlisted(product.id);
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const navigate = useNavigate();
  const handleColorClick = (opt: { name: string; hex: string; productId: string }) => {
    if (opt.productId !== product.id) {
      navigate({ to: "/product/$id", params: { id: opt.productId } });
    } else {
      setColor(opt.name);
    }
  };

  const handleAdd = (buyNow = false) => {
    if (!isAuthed()) {
      navigate({ to: "/auth", search: { redirect: `/product/${product.id}` } });
      return;
    }
    if (product.sizes && product.sizes.length > 0 && !size) {
      const hasAnyInStock = product.sizes.some((s) => !product.outOfStockSizes?.includes(s));
      if (!hasAnyInStock) {
        toast.error("This product is completely out of stock in all sizes.");
        return;
      }
      setSizePromptAction(buyNow ? "buy" : "cart");
      setShowSizePrompt(true);
      return;
    }
    addToCart(product, size || undefined, color, qty);
    if (buyNow) setCartOpen(true);
  };

  return (
    <div key={product.id} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/shop" className="hover:text-foreground">Shop</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/shop" className="hover:text-foreground">{product.category}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div
            className="relative max-w-[450px] mx-auto aspect-square overflow-hidden rounded-3xl bg-muted border border-border/80 transition-all hover:border-primary/40 hover:shadow-lift"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={handleMouseMove}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={active}
                src={getImageUrl(gallery[active]?.src || product.image)}
                alt={`${product.name} — ${gallery[active]?.label || "Front"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ transformOrigin: zoom ? `${mousePos.x}% ${mousePos.y}%` : "center" }}
                className={cn(
                  "h-full w-full object-cover transition-transform duration-200",
                  zoom && "scale-[2.5] cursor-zoom-in",
                )}
              />
            </AnimatePresence>
            {discount > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                -{discount}%
              </span>
            )}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6 max-w-[450px] mx-auto">
            {gallery.map((view, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                aria-label={view?.label || "View"}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-xl border-2 bg-muted transition cursor-pointer",
                  active === i ? "border-primary" : "border-transparent hover:border-border",
                )}
              >
                <img
                  src={getImageUrl(view?.src || product.image)}
                  alt={view?.label || "View"}
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent py-1 text-center text-[10px] font-semibold uppercase tracking-wide">
                  {view?.label || "View"}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {product.collection} · {product.category}
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <span className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4 transition-colors",
                    i < Math.round(liveRating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground/40",
                  )}
                />
              ))}
            </span>
            <span className="text-sm font-bold text-foreground">{liveRating}</span>
            <span className="text-sm text-muted-foreground">({liveReviewCount} {liveReviewCount === 1 ? "review" : "reviews"})</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold">₹{product.price}</span>
            {product.oldPrice && (
              <span className="text-lg text-muted-foreground line-through">₹{product.oldPrice}</span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                Save ₹{product.oldPrice! - product.price}
              </span>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-muted-foreground">{product.description}</p>

          {product.stock <= 6 && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
              🔥 Only {product.stock} left in stock — order soon
            </p>
          )}

          <div className="mt-7">
            <p className="mb-3 text-sm font-bold uppercase tracking-wide">Colour: {color}</p>
            <div className="flex gap-3">
              {colorOptions.map((opt) => (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => handleColorClick(opt)}
                  aria-label={opt.name}
                  title={opt.name}
                  className={cn(
                    "h-10 w-10 rounded-full border-2 transition cursor-pointer",
                    color === opt.name
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border hover:border-primary",
                  )}
                  style={{ backgroundColor: opt.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-wide">Select size </p>
              <button className="text-xs font-medium text-primary">Size guide</button>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {product.sizes.map((s) => {
                const isOutOfStock = product.outOfStockSizes?.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => setSize(s)}
                    className={cn(
                      "grid h-12 place-items-center rounded-xl border-2 text-sm font-semibold transition",
                      isOutOfStock
                        ? "border-dashed border-stone-200/60 text-stone-400 line-through bg-stone-50/50 cursor-not-allowed opacity-50"
                        : size === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary",
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-7 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-border">
              <button
                type="button"
                aria-label="Decrease"
                disabled={qty <= 1}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className={cn(
                  "grid h-12 w-12 place-items-center transition",
                  qty <= 1 ? "opacity-30 cursor-not-allowed" : "hover:text-primary"
                )}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <button
                type="button"
                aria-label="Increase"
                disabled={qty >= currentVariantStock}
                onClick={() => setQty((q) => q + 1)}
                className={cn(
                  "grid h-12 w-12 place-items-center transition",
                  qty >= currentVariantStock ? "opacity-30 cursor-not-allowed" : "hover:text-primary"
                )}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-label="Wishlist"
              className="grid h-12 w-12 place-items-center rounded-full border border-border transition hover:border-primary hover:text-primary"
            >
              <Heart className={cn("h-5 w-5", wished && "fill-primary text-primary")} />
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={currentVariantStock <= 0}
              onClick={() => handleAdd(false)}
              className={cn(
                "group flex flex-1 items-center justify-center gap-2 rounded-full py-4 text-sm font-bold uppercase tracking-wide transition-all",
                currentVariantStock <= 0
                  ? "bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed opacity-60"
                  : "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:bg-primary-glow hover:shadow-lift"
              )}
            >
              <ShoppingBag className="h-4 w-4" /> {currentVariantStock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            <button
              type="button"
              disabled={currentVariantStock <= 0}
              onClick={() => handleAdd(true)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-full py-4 text-sm font-bold uppercase tracking-wide transition-all",
                currentVariantStock <= 0
                  ? "bg-stone-200 text-stone-400 cursor-not-allowed opacity-60"
                  : "bg-secondary text-secondary-foreground hover:-translate-y-0.5"
              )}
            >
              {currentVariantStock <= 0 ? "Unavailable" : "Buy Now"}
            </button>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3 border-t border-border pt-6 text-center">
            {[
              { icon: Truck, t: promoTexts[0] },
              { icon: RotateCcw, t: promoTexts[1] },
              { icon: ShieldCheck, t: promoTexts[2] },
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <f.icon className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">{f.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-20 text-left">
        <Reveal className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-foreground">Customer Reviews</h2>
            <div className="mt-2 flex items-center gap-2.5">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5 transition-colors",
                      i < Math.round(liveRating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/30",
                    )}
                  />
                ))}
              </div>
              <span className="font-display text-xl font-bold text-foreground">{liveRating}</span>
              <span className="text-sm text-muted-foreground">/ 5 ({liveReviewCount} {liveReviewCount === 1 ? "review" : "reviews"})</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!isAuthed()) {
                navigate({ to: "/auth", search: { redirect: `/product/${product.id}` } });
                return;
              }
              setWriteReviewModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-full bg-stone-900 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-primary hover:shadow-md cursor-pointer"
          >
            <Star className="h-4 w-4 fill-white text-white" />
            Write a Review
          </button>
        </Reveal>

        {reviews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-200 bg-stone-50/50 py-12 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-stone-300" />
            <p className="mt-3 font-semibold text-stone-700">No reviews yet for this product</p>
            <p className="mt-1 text-xs text-muted-foreground">Be the first to share your thoughts!</p>
            <button
              type="button"
              onClick={() => {
                if (!isAuthed()) {
                  navigate({ to: "/auth", search: { redirect: `/product/${product.id}` } });
                  return;
                }
                setWriteReviewModalOpen(true);
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-primary-glow transition cursor-pointer shadow-sm"
            >
              Write First Review
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl py-4 text-left">
            {reviews.map((review, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card p-5 shadow-soft w-full text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                      ))}
                    </div>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-semibold">
                        <Check className="h-3 w-3" /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-stone-700 font-medium leading-relaxed">"{review.text}"</p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-stone-900">{review.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {review.days === 0 ? "Today" : `${review.days} days ago`} {review.color ? `· ${review.color}` : ""}{review.size ? ` · Size ${review.size}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {relatedProducts.length > 0 && (
        <section className="mt-20 text-left">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-extrabold">You May Also Like</h2>
            {relatedProducts.length > cardsPerView && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRelatedIdx((prev) => Math.max(0, prev - 1))}
                  disabled={relatedIdx === 0}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 hover:border-primary hover:text-primary transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setRelatedIdx((prev) => Math.min(relatedProducts.length - cardsPerView, prev + 1))}
                  disabled={relatedIdx >= relatedProducts.length - cardsPerView}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 hover:border-primary hover:text-primary transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-sm"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="relative -mx-4 px-4 overflow-hidden pt-4 pb-6">
            <div 
              className="flex gap-6 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                transform: `translateX(calc(-${relatedIdx} * (100% / ${cardsPerView}) - ${relatedIdx * 24 / cardsPerView}px))`
              }}
            >
              {relatedProducts.map((p, i) => (
                <div 
                  key={p.id} 
                  className={cn(
                    "shrink-0",
                    cardsPerView === 4.2 
                      ? "w-[calc(23.8%-18px)]" 
                      : cardsPerView === 2.2 
                        ? "w-[calc(45.45%-14px)]" 
                        : "w-[calc(83.33%-10px)]"
                  )}
                >
                  <ProductCard product={p} index={i} variant="simple" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {recentProducts.length > 0 && (
        <section className="mt-20 text-left">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-extrabold">Recently Viewed</h2>
            {recentProducts.length > cardsPerView && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRecentIdx((prev) => Math.max(0, prev - 1))}
                  disabled={recentIdx === 0}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 hover:border-primary hover:text-primary transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setRecentIdx((prev) => Math.min(recentProducts.length - cardsPerView, prev + 1))}
                  disabled={recentIdx >= recentProducts.length - cardsPerView}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 hover:border-primary hover:text-primary transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-sm"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="relative -mx-4 px-4 overflow-hidden pt-4 pb-6">
            <div 
              className="flex gap-6 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                transform: `translateX(calc(-${recentIdx} * (100% / ${cardsPerView}) - ${recentIdx * 24 / cardsPerView}px))`
              }}
            >
              {recentProducts.map((p, i) => (
                <div 
                  key={p.id} 
                  className={cn(
                    "shrink-0",
                    cardsPerView === 4.2 
                      ? "w-[calc(23.8%-18px)]" 
                      : cardsPerView === 2.2 
                        ? "w-[calc(45.45%-14px)]" 
                        : "w-[calc(83.33%-10px)]"
                  )}
                >
                  <ProductCard product={p} index={i} variant="simple" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Select Size Prompt Modal */}
      {showSizePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xl space-y-5 text-left animate-in zoom-in-95 duration-200 text-stone-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-stone-900">Select Size</h3>
                <p className="text-xs text-stone-500 mt-1">Please pick your size for {product.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSizePrompt(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-2.5">
              {product.sizes.map((s) => {
                const isOutOfStock = product.outOfStockSizes?.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => {
                      setSize(s);
                      setShowSizePrompt(false);
                      addToCart(product, s, color, qty);
                      if (sizePromptAction === "buy") {
                        setCartOpen(true);
                      }
                    }}
                    className={cn(
                      "grid h-12 place-items-center rounded-2xl border-2 text-sm font-semibold transition cursor-pointer",
                      isOutOfStock
                        ? "border-dashed border-stone-200 text-stone-300 line-through bg-stone-50/50 cursor-not-allowed opacity-50"
                        : "border-stone-200 bg-white hover:border-primary hover:bg-primary/5 hover:text-primary hover:scale-[1.02] shadow-xs"
                    )}
                  >
                    UK {s}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowSizePrompt(false)}
                className="rounded-full px-5 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimal & Unique Write Review Modal */}
      {writeReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-stone-200/80 bg-white p-7 shadow-2xl text-stone-900 text-left animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setWriteReviewModalOpen(false)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-50 text-amber-500 border border-amber-100">
                <Sparkles className="h-5 w-5 fill-amber-400" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-stone-900">Review {product.name}</h3>
                <p className="text-xs text-stone-500">Rate your experience with this footwear.</p>
              </div>
            </div>

            {/* Interactive Rating Picker */}
            <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50/40 p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => {
                  const active = rvHoverRating || rvRating;
                  return (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setRvHoverRating(s)}
                      onMouseLeave={() => setRvHoverRating(null)}
                      onClick={() => setRvRating(s)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={cn(
                          "h-8 w-8 transition-colors duration-150",
                          s <= active
                            ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                            : "text-stone-300 hover:text-amber-200"
                        )}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs font-extrabold uppercase tracking-wider text-amber-900">
                {(() => {
                  const cur = rvHoverRating || rvRating;
                  if (cur === 5) return "5 ★ — Excellent";
                  if (cur === 4) return "4 ★ — Very Good";
                  if (cur === 3) return "3 ★ — Good";
                  if (cur === 2) return "2 ★ — Fair";
                  return "1 ★ — Poor";
                })()}
              </p>
            </div>

            {/* Review Comment Field */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Your Review
                </label>
                <span className="text-[10px] text-stone-400 font-medium">
                  {rvText.length}/500
                </span>
              </div>
              <textarea
                className="w-full rounded-2xl border border-stone-200 bg-stone-50/50 p-3.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-primary focus:bg-white focus:outline-none transition-all resize-none"
                placeholder="How does it fit? Is the cushioning comfortable? Tell others about your experience..."
                rows={4}
                maxLength={500}
                value={rvText}
                onChange={(e) => setRvText(e.target.value)}
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setWriteReviewModalOpen(false)}
                className="rounded-full px-5 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submittingReview}
                onClick={handleDirectReviewSubmit}
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-primary-glow hover:shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
