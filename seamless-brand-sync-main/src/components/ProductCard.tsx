import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Star, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn, getImageUrl } from "@/lib/utils";
import { isAuthed } from "@/lib/auth";
import { OptimizedImage } from "@/components/OptimizedImage";

export function ProductCard({
  product,
  index = 0,
  variant = "default",
  showNewBadge = true,
}: {
  product: Product;
  index?: number;
  variant?: "default" | "simple";
  showNewBadge?: boolean;
}) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const navigate = useNavigate();
  const wished = isWishlisted(product.id);
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  if (variant === "simple") {
    return (
      <div className="group relative font-sans">
        <Link
          to="/product/$id"
          params={{ id: product.id || (product as any)._id || "" }}
          className="relative block w-full aspect-square overflow-hidden rounded-3xl border border-stone-200/80 bg-stone-100 shadow-sm"
        >
          {/* Product Image with Pure Scale Animation on Hover */}
          <div className="relative h-full w-full overflow-hidden bg-stone-900">
            {/* Decorative background image */}
            <img
              src="/hero-bg.jpg"
              alt=""
              aria-hidden
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover object-center opacity-30 blur-[1px] scale-105 pointer-events-none select-none z-0"
            />
            <OptimizedImage
              src={getImageUrl(product.image, { width: 450, quality: 75 })}
              alt={product.name}
              aspectRatio="1/1"
              priority={index < 4}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              containerClassName="h-full w-full relative z-10"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
            />
          </div>

          {/* Top-Left Badges */}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5 z-20 pointer-events-none">
            {showNewBadge && product.isNew && (
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#EA580C] via-orange-500 to-amber-500 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-[0_3px_10px_rgba(234,88,12,0.45)] border border-white/30 backdrop-blur-xs">
                NEW
              </span>
            )}
            {discount > 0 && (
              <span className="inline-flex items-center overflow-hidden rounded-md border border-stone-900/90 bg-stone-950/95 text-[9px] font-black text-white shadow-md backdrop-blur-md">
                <span className="bg-rose-600 px-1.5 py-0.5 text-white">-{discount}%</span>
                <span className="px-1.5 py-0.5 text-[7.5px] text-stone-300 uppercase tracking-widest font-bold">OFF</span>
              </span>
            )}
            <span className="rounded-full bg-white/95 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-stone-900 border border-stone-200/70 shadow-xs">
              {product.category}
            </span>
          </div>

          {/* Wishlist Button on Top-Right */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            aria-label="Toggle wishlist"
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-stone-800 border border-stone-200/70 backdrop-blur-md transition-transform duration-200 hover:scale-110 cursor-pointer z-20 shadow-xs"
          >
            <Heart
              className={cn("h-3.5 w-3.5 transition-colors", wished ? "fill-primary text-primary" : "text-stone-700")}
            />
          </button>

          {/* Bottom Gradient overlay for text readability */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-10" />

          {/* Details inside the image box */}
          <div className="absolute inset-x-0 bottom-0 p-4 z-20 flex items-end justify-between">
            <div className="text-left space-y-0.5 min-w-0 flex-1 pr-2">
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 drop-shadow-sm">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="font-medium text-stone-300 text-[10px]">({product.reviews})</span>
              </div>
              <h4 className="font-display text-xs sm:text-sm font-extrabold text-white leading-tight truncate drop-shadow-sm">
                {product.name}
              </h4>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm sm:text-base font-black text-white drop-shadow-sm">₹{product.price}</span>
                {product.oldPrice && (
                  <span className="text-[10px] text-stone-300 line-through font-medium drop-shadow-sm">
                    ₹{product.oldPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (!isAuthed()) {
                  navigate({ to: "/auth", search: { redirect: `/product/${product.id}` } });
                  return;
                }
                addToCart(product);
              }}
              aria-label="Add to cart"
              className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white transition-transform duration-200 hover:scale-105 cursor-pointer shadow-md shrink-0"
            >
              <ShoppingBag className="h-4 w-4 text-white" />
            </button>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="group relative font-sans">
      <Link
        to="/product/$id"
        params={{ id: product.id || (product as any)._id || "" }}
        className="block overflow-hidden rounded-3xl bg-white border border-stone-200/80 shadow-soft text-stone-900"
      >
        <div className="relative aspect-square overflow-hidden bg-stone-900">
          {/* Decorative background image */}
          <img
            src="/hero-bg.jpg"
            alt=""
            aria-hidden
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-25 blur-[1px] scale-105 pointer-events-none select-none z-0"
          />
          {/* Main Product Image with Smooth Scale on Hover */}
          <OptimizedImage
            src={getImageUrl(product.image, { width: 450, quality: 75 })}
            alt={product.name}
            aspectRatio="1/1"
            priority={index < 4}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            containerClassName="h-full w-full relative z-10"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
          />

          {/* Top-Left Badges */}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5 pointer-events-none z-20">
            {showNewBadge && product.isNew && (
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#EA580C] via-orange-500 to-amber-500 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-[0_3px_10px_rgba(234,88,12,0.45)] border border-white/30 backdrop-blur-xs">
                NEW
              </span>
            )}
            {discount > 0 && (
              <span className="inline-flex items-center overflow-hidden rounded-md border border-stone-900/90 bg-stone-950/95 text-[9px] font-black text-white shadow-md backdrop-blur-md">
                <span className="bg-rose-600 px-1.5 py-0.5 text-white">-{discount}%</span>
                <span className="px-1.5 py-0.5 text-[7.5px] text-stone-300 uppercase tracking-widest font-bold">OFF</span>
              </span>
            )}
          </div>

          {/* Top-Right Floating Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            aria-label="Toggle wishlist"
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-stone-700 border border-stone-200/70 shadow-xs backdrop-blur-md transition-transform duration-200 hover:scale-110 cursor-pointer z-20"
          >
            <Heart
              className={cn("h-3.5 w-3.5 transition-colors", wished ? "fill-primary text-primary" : "text-stone-700")}
            />
          </button>
        </div>

        {/* Product Details Info - Constant Colors, No Hover Color Shift */}
        <div className="space-y-1.5 p-4.5 text-left bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              {product.category}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-stone-800">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              {product.rating}
              <span className="font-medium text-stone-400">({product.reviews})</span>
            </span>
          </div>

          <h3 className="truncate font-display text-base font-bold text-stone-900 leading-tight">
            {product.name}
          </h3>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg font-bold text-stone-900">₹{product.price}</span>
              {product.oldPrice && (
                <span className="text-xs text-stone-400 line-through font-medium">
                  ₹{product.oldPrice}
                </span>
              )}
            </div>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                product.stock <= 6
                  ? "bg-primary/10 text-primary"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
              )}
            >
              {product.stock <= 6 ? `Only ${product.stock} left` : "In stock"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white border border-stone-200/60 shadow-soft">
      <div className="shimmer aspect-square bg-zinc-100" />
      <div className="space-y-3 p-4">
        <div className="shimmer h-3 w-1/3 rounded bg-zinc-100" />
        <div className="shimmer h-4 w-2/3 rounded bg-zinc-100" />
        <div className="shimmer h-5 w-1/4 rounded bg-zinc-100" />
      </div>
    </div>
  );
}
