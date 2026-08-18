import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Reveal } from "@/components/Reveal";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getImageUrl } from "@/lib/utils";

interface NewArrivalsProps {
  products: any[];
}

export function NewArrivals({ products }: NewArrivalsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
    dragFree: true,
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
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Reveal className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#EA580C] via-[#F97316] to-[#FB923C] p-6 sm:p-8 lg:p-10 shadow-2xl">
        {/* Background Decorative Element */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-black/10 blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-10">
          {/* Left Column: Heading & Info */}
          <div className="flex flex-col justify-between shrink-0 lg:w-72 xl:w-80 text-left space-y-5">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-[0.95] drop-shadow-sm">
                New <br />
                <span className="text-white/95">Arrivals</span>
              </h2>
              <p className="mt-3 text-xs sm:text-sm font-medium tracking-wide text-white/90 leading-relaxed">
                Handcrafted comfort, timeless silhouette. Designed for your everyday journey.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link
                to="/shop"
                search={{ collection: "Casual" }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-900 shadow-md transition-all duration-300 hover:bg-stone-950 hover:text-white hover:scale-105 active:scale-95"
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              {/* Navigation Controls */}
              {products.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={prevBtnDisabled}
                    onClick={scrollPrev}
                    aria-label="Previous arrivals"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/25 backdrop-blur-md text-white transition-all duration-200 hover:bg-black/60 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={nextBtnDisabled}
                    onClick={scrollNext}
                    aria-label="Next arrivals"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/25 backdrop-blur-md text-white transition-all duration-200 hover:bg-black/60 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sliding Cards Container */}
          <div className="relative z-10 flex-1 min-w-0 w-full overflow-hidden">
            <div className="cursor-grab active:cursor-grabbing overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 sm:gap-5 py-2">
                {products.map((product) => {
                  const discount = product.oldPrice && Number(product.oldPrice) > Number(product.price)
                    ? Math.round(((Number(product.oldPrice) - Number(product.price)) / Number(product.oldPrice)) * 100)
                    : 0;

                  return (
                    <Link
                      key={product.id || product._id}
                      to="/product/$id"
                      params={{ id: product.id || product._id }}
                      className="group relative flex-[0_0_72%] sm:flex-[0_0_46%] md:flex-[0_0_36%] lg:flex-[0_0_31%] xl:flex-[0_0_27%] min-w-0 flex flex-col justify-between rounded-2xl bg-white p-3.5 sm:p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Badges - Offer Badge Only for Fresh Drops */}
                      {discount > 0 && (
                        <div className="absolute left-3 top-3 z-20 pointer-events-none">
                          <span className="inline-flex items-center overflow-hidden rounded-md border border-stone-900/90 bg-stone-950/95 text-[9px] font-black text-white shadow-md backdrop-blur-md">
                            <span className="bg-rose-600 px-1.5 py-0.5 text-white">-{discount}%</span>
                            <span className="px-1.5 py-0.5 text-[7.5px] text-stone-300 uppercase tracking-widest font-bold">OFF</span>
                          </span>
                        </div>
                      )}

                    {/* Shoe Image Box */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-stone-100/80 flex items-center justify-center p-2">
                      <OptimizedImage
                        src={getImageUrl(product.image, { width: 450, quality: 75 })}
                        alt={product.name}
                        aspectRatio="1/1"
                        sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 25vw"
                        containerClassName="h-full w-full"
                        className="h-full w-full object-contain transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="mt-3 flex flex-col justify-between flex-1 text-left">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                        {product.category || "Footwear"}
                      </p>
                      <h4 className="font-sans text-xs sm:text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h4>
                      <div className="mt-2 flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-display text-sm sm:text-base font-extrabold text-stone-950">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </span>
                          {product.oldPrice && Number(product.oldPrice) > Number(product.price) && (
                            <span className="text-[11px] font-medium text-stone-400 line-through">
                              ₹{Number(product.oldPrice).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          Buy →
                        </span>
                      </div>
                    </div>
                  </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

