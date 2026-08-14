import { useRef, useState, useEffect } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";

export function BrandStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(containerRef, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const storyY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [24, -24]);

  // rAF-based counter: cooperates with browser paint cycle instead of fighting it
  const [yearsCount, setYearsCount] = useState(0);
  useEffect(() => {
    if (!isStatsInView) return;
    const end = 13;
    const duration = 1100; // ms
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setYearsCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
      else setYearsCount(end);
    };

    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isStatsInView]);

  return (
    <section
      ref={containerRef}
      id="story"
      aria-label="Our Story"
      className="relative py-20 sm:py-28 lg:py-36 bg-[#F5F5F2] dark:bg-[#101212] text-[#070707] dark:text-[#F5F5F2] overflow-hidden transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: 13+ Craftsmanship Highlight */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-6"
            >
              {/* Vertical Orange Line Accent */}
              <div className="w-2 h-28 sm:h-36 bg-[#F26522] rounded-full shrink-0" />
              
              <div className="flex flex-col">
                <span className="font-black text-6xl sm:text-8xl lg:text-[110px] leading-none text-[#F26522] tracking-tight">
                  {yearsCount}+
                </span>
                <span className="font-black text-xl sm:text-2xl uppercase tracking-wider text-[#070707] dark:text-[#F5F5F2] mt-2 leading-tight">
                  YEARS OF<br />CRAFTSMANSHIP
                </span>
              </div>
            </motion.div>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 text-base sm:text-lg text-[#555555] dark:text-[#A5A5A5] font-medium max-w-md leading-relaxed"
            >
              13+ years of craftsmanship, innovation and trust, shaping footwear for everyday India.
            </motion.p>
          </div>

          {/* Right Column: Editorial Paragraphs */}
          <motion.div style={{ y: storyY, willChange: "transform" }} className="lg:col-span-7 flex flex-col items-start pt-2 lg:pt-4">
            {/* Statement */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden mb-6"
            >
              <h2 className="font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight uppercase leading-tight">
                <span className="block text-[#070707] dark:text-[#F5F5F2]">MADE WITH PURPOSE.</span>
                <span className="block text-[#F26522]">BUILT FOR COMFORT.</span>
              </h2>
            </motion.div>

            {/* Paragraph */}
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#444444] dark:text-[#A5A5A5] text-lg sm:text-xl md:text-2xl leading-relaxed font-normal max-w-2xl"
            >
              For more than 13 years, MOCS has combined thoughtful design, reliable materials and precise manufacturing to create footwear made for everyday life.
            </motion.p>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-10 grid grid-cols-2 gap-6 w-full pt-8 border-t border-[#070707]/10 dark:border-white/10"
            >
              <div>
                <span className="block font-bold text-[#070707] dark:text-[#F5F5F2] text-base uppercase tracking-wider mb-1">
                  Everyday Durability
                </span>
                <span className="text-sm text-[#666666] dark:text-[#A5A5A5]">
                  Engineered to withstand daily wear across diverse conditions.
                </span>
              </div>
              <div>
                <span className="block font-bold text-[#070707] dark:text-[#F5F5F2] text-base uppercase tracking-wider mb-1">
                  Ergonomic Support
                </span>
                <span className="text-sm text-[#666666] dark:text-[#A5A5A5]">
                  Cushioned PU formulations designed for long-term comfort.
                </span>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
