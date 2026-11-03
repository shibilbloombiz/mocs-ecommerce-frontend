import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Instagram, Heart, ExternalLink, ShoppingBag, ArrowUpRight } from "lucide-react";
import { Reveal, Stagger } from "@/components/Reveal";
import { motion } from "motion/react";
import { cn, getImageUrl } from "@/lib/utils";
import { OptimizedImage } from "@/components/OptimizedImage";

export interface InstagramPost {
  id: string;
  image: string;
  instagramUrl: string;
  productName: string;
  productSlug?: string;
  price?: string;
  likes: number;
  caption: string;
  categoryTag: string;
}

export const DEFAULT_INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: "post-1",
    image: "/images/hero-bronze-slide.jpg",
    instagramUrl: "https://www.instagram.com/mocsfootwear/",
    productName: "Everyday Cross Slide",
    productSlug: "patent-cross-slide",
    price: "₹399",
    likes: 1420,
    caption: "Sculpted luxury meets anatomical PU cushioning. Handcrafted for seamless all-day stride.",
    categoryTag: "SIGNATURE SLIDE",
  },
  {
    id: "post-2",
    image: "/images/hero-wedge-rhinestone.jpg",
    instagramUrl: "https://www.instagram.com/mocsfootwear/",
    productName: "Comfort Wedge Slide",
    productSlug: "comfort-wedge-slide",
    price: "₹499",
    likes: 2180,
    caption: "Featherweight shock absorption paired with crystal-encrusted straps. Elevate your silhouette.",
    categoryTag: "ELEVATED STYLE",
  },
  {
    id: "post-3",
    image: "/images/hero-script-bow.jpg",
    instagramUrl: "https://www.instagram.com/mocsfootwear/",
    productName: "Chic Resort Bow Slide",
    productSlug: "ladies-buckle-slide",
    price: "₹349",
    likes: 1890,
    caption: "Supple typography-print bow architecture sculpted for breathable, casual luxury.",
    categoryTag: "RESORT EDIT",
  },
  {
    id: "post-4",
    image: "/images/mocs-lifestyle-model.jpg",
    instagramUrl: "https://www.instagram.com/mocsfootwear/",
    productName: "Ladies Buckle Slide",
    productSlug: "ladies-buckle-slide",
    price: "₹399",
    likes: 3120,
    caption: "Dual wide straps with custom silver hardware on contoured black PU footbeds.",
    categoryTag: "BESTSELLER",
  },
  {
    id: "post-5",
    image: "/images/mocs-comfort-silk.jpg",
    instagramUrl: "https://www.instagram.com/mocsfootwear/",
    productName: "Signature Silk Edit",
    productSlug: "patent-cross-slide",
    price: "₹349",
    likes: 1650,
    caption: "Zero break-in period. Engineered with direct-injection polyurethane craftsmanship.",
    categoryTag: "CRAFTSMANSHIP",
  },
  {
    id: "post-6",
    image: "/images/mocs-model-editorial.jpg",
    instagramUrl: "https://www.instagram.com/mocsfootwear/",
    productName: "Urban Elevation Slide",
    productSlug: "comfort-wedge-slide",
    price: "₹499",
    likes: 2540,
    caption: "Urban minimalism refined. Move different with authentic MOCS comfort engineering.",
    categoryTag: "EDITORIAL",
  },
];

interface InstagramGalleryProps {
  posts?: InstagramPost[];
  handle?: string;
  profileUrl?: string;
}

export function InstagramGallery({
  posts = DEFAULT_INSTAGRAM_POSTS,
  handle = "@mocsfootwear",
  profileUrl = "https://www.instagram.com/mocsfootwear/",
}: InstagramGalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const displayPosts = posts && posts.length > 0 ? posts : DEFAULT_INSTAGRAM_POSTS;

  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-24 bg-stone-950 text-white overflow-hidden border-t border-stone-850">
      
      {/* Subtle Ambient Orange Glow in Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-orange-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <Reveal>
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-[#ff6600] uppercase font-['Space_Grotesk',sans-serif]">
                <span className="w-5 h-[1.5px] bg-[#ff6600]" />
                <span>COMMUNITY & EDITORIAL</span>
              </div>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-tight">
                AS SEEN ON <span className="text-[#ff6600]">INSTAGRAM</span>
              </h2>
              <p className="font-['Space_Grotesk',sans-serif] text-xs sm:text-sm text-stone-400 max-w-lg leading-relaxed">
                Discover real styling moments, editorial campaigns, and our community wearing authentic MOCS direct-injection PU footwear.
              </p>
            </div>
          </Reveal>

          {/* ── Instagram Profile Card & Follow CTA ── */}
          <Reveal delay={0.15}>
            <div className="flex items-center gap-3 bg-stone-900/90 border border-stone-800 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 pr-4 sm:pr-5 shadow-lg self-start md:self-auto">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-[#ff6600] to-pink-600 flex items-center justify-center text-white shadow-md">
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs sm:text-sm text-white font-['Space_Grotesk',sans-serif]">
                    {handle}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff6600]" />
                </div>
                <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium">
                  Official MOCS Footwear
                </p>
              </div>
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1.5 bg-[#ff6600] hover:bg-[#ff771a] active:scale-95 text-white font-['Space_Grotesk',sans-serif] font-bold text-xs uppercase px-4 py-2 rounded-xl transition-all shadow-[0_2px_12px_rgba(255,102,0,0.35)] cursor-pointer"
              >
                <span>Follow</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </Reveal>
        </div>

        {/* ── Instagram Photo Grid ── */}
        <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {displayPosts.map((post, idx) => {
            const isHovered = hoveredId === post.id;
            return (
              <motion.div
                key={post.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                onMouseEnter={() => setHoveredId(post.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 border border-stone-800/80 shadow-soft transition-all duration-500 hover:shadow-[0_12px_36px_rgba(0,0,0,0.8)] hover:border-[#ff6600]/40"
              >
                {/* Product / Lifestyle Photo */}
                <OptimizedImage
                  src={getImageUrl(post.image, { width: 800, quality: 90 })}
                  alt={`${post.productName} on Instagram`}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Top Corner Instagram Badge */}
                <div className="absolute top-2.5 right-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/90 group-hover:bg-[#ff6600] group-hover:border-[#ff6600] transition-colors duration-300">
                  <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>

                {/* Top Corner Category Tag */}
                <div className="absolute top-2.5 left-2.5 z-20">
                  <span className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider font-['Space_Grotesk',sans-serif] bg-black/70 backdrop-blur-md border border-white/10 text-white/90">
                    {post.categoryTag}
                  </span>
                </div>

                {/* Hover Gradient Overlay & Interactive Actions */}
                <div
                  className={cn(
                    "absolute inset-0 z-20 bg-gradient-to-t from-black/95 via-black/75 to-black/35 p-3 sm:p-4 flex flex-col justify-end text-left transition-all duration-300 backdrop-blur-[2px]",
                    isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  )}
                >
                  {/* Likes Count */}
                  <div className="flex items-center gap-1.5 text-white/90 mb-1.5">
                    <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                    <span className="text-[11px] font-bold font-['Space_Grotesk',sans-serif]">
                      {post.likes.toLocaleString()}
                    </span>
                  </div>

                  {/* Product Title & Price */}
                  <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-xs sm:text-sm text-white leading-tight line-clamp-1 mb-0.5">
                    {post.productName}
                  </h3>
                  {post.price && (
                    <span className="font-['Space_Grotesk',sans-serif] text-[11px] font-semibold text-[#ff6600] mb-2.5 block">
                      {post.price}
                    </span>
                  )}

                  {/* Dual Action Buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {/* 1. Shop Product in Catalog */}
                    {post.productSlug ? (
                      <Link
                        to="/product/$id"
                        params={{ id: post.productSlug }}
                        className="flex-1 inline-flex items-center justify-center gap-1 bg-white hover:bg-stone-100 active:scale-95 text-stone-950 font-['Space_Grotesk',sans-serif] font-bold text-[10px] sm:text-[11px] uppercase py-1.5 px-2 rounded-lg transition-all"
                        title={`Shop ${post.productName}`}
                      >
                        <ShoppingBag className="w-3 h-3 text-[#ff6600]" />
                        <span>Shop</span>
                      </Link>
                    ) : (
                      <Link
                        to="/shop"
                        className="flex-1 inline-flex items-center justify-center gap-1 bg-white hover:bg-stone-100 active:scale-95 text-stone-950 font-['Space_Grotesk',sans-serif] font-bold text-[10px] sm:text-[11px] uppercase py-1.5 px-2 rounded-lg transition-all"
                      >
                        <ShoppingBag className="w-3 h-3 text-[#ff6600]" />
                        <span>Shop</span>
                      </Link>
                    )}

                    {/* 2. Open Original Instagram Post */}
                    <a
                      href={post.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-stone-800/90 hover:bg-[#ff6600] active:scale-95 text-white flex items-center justify-center transition-colors"
                      title="View Post on Instagram"
                      aria-label="View on Instagram"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Subtle Bottom Ambient Gradient for contrast when not hovered */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none group-hover:opacity-0 transition-opacity duration-300" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between text-white/90 group-hover:opacity-0 transition-opacity duration-300">
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-bold line-clamp-1 drop-shadow-sm">
                    {post.productName}
                  </span>
                  {post.price && (
                    <span className="font-['Space_Grotesk',sans-serif] text-[10px] font-semibold text-white/80">
                      {post.price}
                    </span>
                  )}
                </div>

              </motion.div>
            );
          })}
        </Stagger>

        {/* ── Community Callout Footer ── */}
        <div className="mt-10 sm:mt-12 text-center">
          <p className="inline-flex items-center gap-2 text-xs text-stone-400 font-['Space_Grotesk',sans-serif]">
            <span>Tag</span>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff6600] hover:underline font-bold"
            >
              {handle}
            </a>
            <span>on Instagram with your FOCS sandals for a chance to be featured.</span>
          </p>
        </div>

      </div>
    </section>
  );
}

