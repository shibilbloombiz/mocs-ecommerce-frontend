import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Leaf, ShieldCheck, Recycle } from "lucide-react";
const shoe4 = "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800";

export function ResponsibleManufacturing({ products }: { products?: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const manufacturingImg = products?.[4]?.image || products?.[0]?.image || shoe4;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0.2, 0.8], prefersReducedMotion ? [1, 1] : [0.88, 1.02]);

  return (
    <section
      ref={containerRef}
      id="responsibility"
      aria-label="Responsible Manufacturing"
      className="relative py-24 sm:py-32 bg-[#F5F5F2] dark:bg-[#101212] text-[#070707] dark:text-[#F5F5F2] overflow-hidden transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Hero Original MOCS Manufacturing & Product Image */}
          <motion.div
            style={{ scale: imageScale }}
            className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 bg-[#191B1D]"
          >
            <img
              src={manufacturingImg}
              alt="MOCS Sustainable & Responsible Footwear Manufacturing"
              className="w-full h-full object-cover filter brightness-95"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold tracking-widest text-[#F26522] uppercase block">
                  ECO-EFFICIENCY
                </span>
                <span className="text-lg font-black uppercase">
                  Zero-Waste Chemical Pouring
                </span>
              </div>
              <Recycle className="w-8 h-8 text-[#F26522]" />
            </div>
          </motion.div>

          {/* Right Column: Statement & Key Pillars */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#F26522] uppercase block mb-3">
              SUSTAINABLE APPROACH
            </span>

            <h2 className="font-black text-4xl sm:text-6xl tracking-tight uppercase leading-tight mb-6">
              RESPONSIBLE <br />
              <span className="text-[#F26522]">MANUFACTURING</span>
            </h2>

            <p className="text-[#070707] dark:text-[#F5F5F2] text-xl sm:text-2xl font-bold leading-relaxed mb-6">
              At MOCS, responsible manufacturing means using materials efficiently, reducing waste and creating durable footwear that minimizes environmental impact.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full pt-6 border-t border-black/10 dark:border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F26522]/10 flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 text-[#F26522]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#070707] dark:text-[#F5F5F2] text-base uppercase">
                    Eco Synthetic Leather
                  </h3>
                  <p className="text-sm text-[#666666] dark:text-[#A5A5A5] mt-1">
                    Skin-friendly, solvent-reduced formulations mimicking natural grain.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F26522]/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#F26522]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#070707] dark:text-[#F5F5F2] text-base uppercase">
                    Extended Lifespan
                  </h3>
                  <p className="text-sm text-[#666666] dark:text-[#A5A5A5] mt-1">
                    Direct-injected soles prevent separation, reducing fast-fashion waste.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
