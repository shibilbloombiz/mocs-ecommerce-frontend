import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Reveal, Stagger } from "@/components/Reveal";
import { getImageUrl } from "@/lib/utils";
import { OptimizedImage } from "@/components/OptimizedImage";

interface CategoriesSectionProps {
  categoriesBanners: any[];
}

export function CategoriesSection({ categoriesBanners }: CategoriesSectionProps) {
  if (!categoriesBanners || categoriesBanners.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4 text-left">
        <div>
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#d96b27] dark:text-[#e07a38]">
            Explore Categories
          </p>
          <h2 className="mt-1.5 font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-[-0.015em] text-foreground">
            Built For <span className="italic font-serif text-[#d96b27] dark:text-[#e07a38]">Everyone.</span>
          </h2>
        </div>
      </Reveal>
      <Stagger className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Large Column (Hexashop style banner) */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
          style={{ willChange: "transform, opacity" }}
          className="lg:col-span-6 relative group overflow-hidden rounded-none bg-stone-900 shadow-soft min-h-[420px] lg:min-h-full h-full flex flex-col justify-end text-left border border-border/10 gpu-accelerated"
        >
          <div className="absolute inset-0 h-full w-full">
            {categoriesBanners[0]?.bg ? (
              <OptimizedImage
                src={getImageUrl(categoriesBanners[0].bg, { width: 700, quality: 75 })}
                alt={categoriesBanners[0].title}
                sizes="(max-width: 1024px) 100vw, 50vw"
                containerClassName="h-full w-full"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-zinc-500 text-xs font-mono uppercase tracking-widest">
                No Image Configured
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 transition-colors duration-500 group-hover:bg-black/65" />
          </div>

          <div className="relative z-10 p-8 md:p-12 text-white space-y-4">
            <h3 className="font-display text-4xl sm:text-5xl font-extrabold leading-[1.1]">
              {categoriesBanners[0]?.title}
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed max-w-sm font-medium font-sans">
              {categoriesBanners[0]?.desc}
            </p>
            <div className="pt-2">
              <Link
                to={categoriesBanners[0]?.to || "/shop"}
                className="inline-block rounded-none border-2 border-white px-8 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-stone-900 transition-colors"
              >
                {categoriesBanners[0]?.cta || "Purchase Now!"}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Right Column: 2x2 Grid of categories */}
        <motion.div
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } }
          }}
          className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {categoriesBanners.slice(1).map((cat) => {
            return (
              <motion.div
                key={cat.title}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="relative group aspect-square overflow-hidden rounded-none bg-muted shadow-soft flex items-center justify-center border border-border/10 gpu-accelerated"
              >
                {cat.bg ? (
                  <OptimizedImage
                    src={getImageUrl(cat.bg, { width: 450, quality: 75 })}
                    alt={cat.title}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    containerClassName="absolute inset-0 h-full w-full"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-zinc-500 text-xs font-mono uppercase tracking-widest">
                    No Image Configured
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/55" />

                {/* Default Header Text Overlay (shown when NOT hovered) */}
                <div className="absolute inset-x-0 bottom-6 text-center text-white transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-4 z-10 px-4">
                  <h3 className="font-display text-2xl font-extrabold">{cat.title}</h3>
                  <p className="text-xs text-stone-300 mt-1 font-medium font-sans">{cat.desc}</p>
                </div>

                {/* Hover details (fades in as a clean dark square overlay in the center) */}
                <div className="absolute inset-0 flex items-center justify-center p-5 z-20">
                  <div className="w-full h-full border border-white/10 bg-stone-950/90 backdrop-blur-xs p-6 flex flex-col items-center justify-center text-center rounded-none opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-350 select-none">
                    <h4 className="font-display text-2xl font-extrabold text-white">{cat.title}</h4>
                    <p className="text-[11px] text-stone-400 mt-2 max-w-[150px] leading-relaxed font-medium font-sans">
                      Discover premium comfort and style details with {cat.title} collection.
                    </p>
                    <Link
                      to={cat.to || "/shop"}
                      search={cat.search as any}
                      className="mt-5 bg-white text-stone-900 text-[10px] font-black uppercase tracking-wider py-2.5 px-6 hover:bg-primary hover:text-white transition-all shadow-md"
                    >
                      {cat.cta || "Discover More"}
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Stagger>
    </section>
  );
}
