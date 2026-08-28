import { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";

export function TrendingProducts({ products = [] }: { products?: any[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
  });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onSelect = () => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  };

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, products]);

  if (!products || products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal className="mb-10 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#d96b27] dark:text-[#e07a38]">
              Curated Selection
            </p>
            <h2 className="mt-1.5 font-display text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight text-foreground leading-[1.15]">
              Trending <span className="text-[#d96b27] dark:text-[#e07a38]">Products</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-2 font-light max-w-md">
              Our absolute best sellers of this season, engineered for lasting comfort.
            </p>
          </div>

          <div className="hidden lg:flex gap-2 shrink-0">
            <button
              type="button"
              disabled={prevBtnDisabled}
              onClick={scrollPrev}
              aria-label="Previous trending products"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-background/95 hover:bg-background text-foreground hover:border-primary hover:text-primary transition shadow-card cursor-pointer hover:scale-105 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              disabled={nextBtnDisabled}
              onClick={scrollNext}
              aria-label="Next trending products"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-background/95 hover:bg-background text-foreground hover:border-primary hover:text-primary transition shadow-card cursor-pointer hover:scale-105 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Reveal>

      <div className="relative">
        <div className="overflow-hidden cursor-grab active:cursor-grabbing px-2 py-4" ref={emblaRef}>
          <div className="flex gap-6">
            {products.map((product, i) => (
              <div key={product.id} className="min-w-0 flex-[0_0_80%] sm:flex-[0_0_46%] lg:flex-[0_0_23.5%]">
                <ProductCard product={product} index={i} variant="simple" showNewBadge={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
