import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
const lifestyleWomen = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800";

export function ComfortSection({ products }: { products?: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const comfortProductImg = "/about-products/trans_mocs-wedge-slide.png";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const bgTextY1 = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-60, 60]);
  const bgTextY2 = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [60, -60]);

  return (
    <section
      ref={containerRef}
      id="comfort"
      aria-label="Comfort Begins"
      className="relative py-24 sm:py-32 lg:py-40 bg-[#F5F5F2] dark:bg-[#101212] text-[#070707] dark:text-[#F5F5F2] overflow-hidden transition-colors duration-300"
    >
      {/* Oversized Decorative Moving Background Typography */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-5 flex flex-col justify-between py-12">
        <motion.div style={{ y: bgTextY1 }} className="whitespace-nowrap font-black text-[90px] sm:text-[140px] md:text-[180px] lg:text-[220px] uppercase leading-none tracking-tighter text-[#070707] dark:text-white">
          WHERE REFINED DESIGN MEETS
        </motion.div>
        <motion.div style={{ y: bgTextY2 }} className="whitespace-nowrap font-black text-[90px] sm:text-[140px] md:text-[180px] lg:text-[220px] uppercase leading-none tracking-tighter text-[#070707] dark:text-white">
          LASTING COMFORT
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Original MOCS Product Photo */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 bg-[#191B1D] flex items-center justify-center p-6 sm:p-8">
              <img
                src={comfortProductImg}
                alt="MOCS Original Footwear Product Craftsmanship"
                className="w-full h-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 text-white">
                <span className="text-xs font-bold tracking-widest text-[#F26522] uppercase block">
                  CRAFT & ERGONOMICS
                </span>
                <span className="text-lg font-black uppercase">
                  Contoured PU Footbed & Arch Support
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Statement & Copy */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#F26522] uppercase block mb-3"
            >
              PHILOSOPHY
            </motion.span>

            <motion.h2
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight uppercase leading-tight mb-6"
            >
              COMFORT <br />
              <span className="text-[#F26522]">BEGINS.</span>
            </motion.h2>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#070707] dark:text-[#F5F5F2] text-xl sm:text-2xl font-bold leading-relaxed mb-6"
            >
              Comfort begins with advanced materials designed for lasting durability, flexibility and effortless all-day wear.
            </motion.p>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[#555555] dark:text-[#A5A5A5] text-base sm:text-lg leading-relaxed font-normal"
            >
              Every material at MOCS is selected, tested and refined to deliver consistent comfort and long-term reliability.
            </motion.p>
          </div>

        </div>
      </div>
    </section>
  );
}
