import { useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Heart, Star, Eye, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn, getImageUrl } from "@/lib/utils";
import { isAuthed } from "@/lib/auth";
import { OptimizedImage } from "@/components/OptimizedImage";

export function ProductCard({
  product,
  index = 0,
  variant = "default",
}: {
  product: Product;
  index?: number;
  variant?: "default" | "simple";
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
          params={{ id: product.id }}
          className="relative block w-full aspect-square overflow-hidden rounded-3xl shadow-soft transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1.5 hover:shadow-xl bg-[#eaeaea] border border-black/5"
        >
          {/* Base Image */}
          <OptimizedImage
            src={getImageUrl(product.image)}
            alt={product.name}
            aspectRatio="1/1"
            containerClassName="h-full w-full"
            className={cn(
              "h-full w-full object-cover transition-all duration-500 ease-out mix-blend-multiply absolute inset-0",
              product.views && product.views.length > 1 ? "group-hover:opacity-0" : ""
            )}
          />
          {/* Hover Image */}
          {product.views && product.views.length > 1 && (
            <OptimizedImage
              src={getImageUrl(product.views[1].src)}
              alt={`${product.name} Hover`}
              aspectRatio="1/1"
              containerClassName="h-full w-full"
              className="h-full w-full object-cover transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 mix-blend-multiply absolute inset-0"
            />
          )}

          {/* Top-Left Category Badge */}
          <div className="absolute left-3 top-3 z-20">
            <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-stone-850 border border-black/5 shadow-xs">
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
            className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-stone-850 border border-black/5 backdrop-blur-md transition-all duration-300 hover:text-primary hover:scale-110 cursor-pointer z-20 shadow-xs"
          >
            <Heart
              className={cn("h-3 w-3 transition-colors", wished && "fill-primary text-primary")}
            />
          </button>

          {/* Bottom Gradient overlay for text legibility */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none z-10" />

          {/* Floating details inside the image box */}
          <div className="absolute inset-x-0 bottom-0 p-4 z-20 flex items-end justify-between">
            <div className="text-left space-y-0.5 min-w-0 flex-1 pr-2">
              {/* Product Name */}
              <h4 className="font-display text-xs sm:text-sm font-extrabold text-white leading-tight truncate drop-shadow-sm">
                {product.name}
              </h4>
              {/* Price */}
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
              className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-white transition-all duration-300 hover:bg-primary-glow hover:scale-105 cursor-pointer shadow-md shrink-0"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="group relative">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block overflow-hidden rounded-2xl bg-white border border-orange-500 lg:border-orange-500/12 shadow-[0_0_15px_rgba(244,106,30,0.18)] lg:shadow-soft transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-primary group-hover:shadow-[0_12px_40px_rgba(244,106,30,0.15)] text-stone-900"
      >
        <div className="relative aspect-square overflow-hidden bg-white">
          <OptimizedImage
            src={getImageUrl(product.image)}
            alt={product.name}
            aspectRatio="1/1"
            containerClassName="h-full w-full"
            className="relative h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          <div className="absolute left-3 top-3 flex flex-col gap-2 pointer-events-none">
            {product.isNew && (
              <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-sm">
                -{discount}%
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            aria-label="Toggle wishlist"
            className="absolute right-3 top-3 grid h-9 w-9 translate-x-12 place-items-center rounded-full bg-background/90 text-foreground shadow-soft backdrop-blur transition-all duration-300 hover:text-primary hover:scale-110 group-hover:translate-x-0 cursor-pointer z-20"
          >
            <Heart
              className={cn("h-4 w-4 transition-colors", wished && "fill-primary text-primary")}
            />
          </button>

          <div className="absolute inset-x-3 bottom-3 flex translate-y-16 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20">
            <span className="grid h-10 flex-1 place-items-center rounded-xl bg-black/85 hover:bg-black text-xs font-bold uppercase tracking-wider backdrop-blur-md cursor-pointer text-white transition-colors duration-300">
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" /> Quick View
              </span>
            </span>
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
              className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary-glow hover:scale-105 cursor-pointer shadow-md"
            >
              <ShoppingBag className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        <div className="space-y-1.5 p-4 text-left bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-stone-500">
              {product.category}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-stone-800">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              {product.rating}
              <span className="font-medium text-stone-400">({product.reviews})</span>
            </span>
          </div>
          <h3 className="truncate font-display text-base font-bold text-stone-900 leading-tight">{product.name}</h3>



          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-stone-900">₹{product.price}</span>
              {product.oldPrice && (
                <span className="text-sm text-stone-400 line-through font-medium">
                  ₹{product.oldPrice}
                </span>
              )}
            </div>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide",
                product.stock <= 6
                  ? "bg-primary/10 text-primary"
                  : "bg-success/10 text-success",
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
    <div className="overflow-hidden rounded-2xl bg-white border border-orange-500/12 shadow-soft">
      <div className="shimmer aspect-square bg-zinc-100" />
      <div className="space-y-3 p-4">
        <div className="shimmer h-3 w-1/3 rounded bg-zinc-100" />
        <div className="shimmer h-4 w-2/3 rounded bg-zinc-100" />
        <div className="shimmer h-5 w-1/4 rounded bg-zinc-100" />
      </div>
    </div>
  );
}
