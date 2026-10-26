import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

export function FutureSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const bgTextX = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-80, 80]);

  return (
    <section
      ref={containerRef}
      id="future"
      aria-label="Innovating for the Future"
      className="relative py-24 sm:py-32 bg-[#070707] text-[#F5F5F2] overflow-hidden"
    >
      {/* Background Moving Typography "THE FUTURE" */}
      <motion.div
        style={{ x: bgTextX }}
        className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-center pointer-events-none select-none z-0 overflow-hidden"
      >
        <span className="font-black text-[100px] sm:text-[180px] md:text-[240px] lg:text-[320px] tracking-tighter uppercase leading-none text-white/[0.03]">
          THE FUTURE
        </span>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header & Quote */}
        <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-24">
          <motion.span
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#F26522] uppercase block mb-4"
          >
            VISION & EXPANSION
          </motion.span>

          <motion.h2
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight uppercase leading-tight mb-8"
          >
            INNOVATING FOR <br />
            <span className="text-[#F26522]">THE FUTURE</span>
          </motion.h2>

          <motion.blockquote
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl lg:text-3xl font-semibold italic text-[#F5F5F2] border-l-4 border-[#F26522] pl-6 text-left max-w-3xl mx-auto"
          >
            “Driven by market insight and long-term vision, MOCS continuously evolves to deliver better products and stronger value.”
          </motion.blockquote>
        </div>

        {/* 2 Strategic Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Column 1: Continuous Innovation */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="p-8 sm:p-10 rounded-3xl bg-[#101212] border border-white/10 hover:border-[#F26522] transition-all duration-300"
          >
            <span className="text-xs font-bold tracking-widest text-[#F26522] uppercase block mb-3">
              PILLAR 01
            </span>
            <h3 className="font-black text-2xl sm:text-3xl text-white uppercase mb-4">
              CONTINUOUS INNOVATION
            </h3>
            <p className="text-[#A5A5A5] text-base sm:text-lg leading-relaxed font-normal">
              MOCS continuously develops products aligned with evolving market trends and customer preferences. As demand grows, we focus on enhancing design, comfort and performance while maintaining consistent quality across all ranges.
            </p>
          </motion.div>

          {/* Column 2: The Road Ahead & MOCS Plus */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 sm:p-10 rounded-3xl bg-[#101212] border border-white/10 hover:border-[#F26522] transition-all duration-300"
          >
            <span className="text-xs font-bold tracking-widest text-[#F26522] uppercase block mb-3">
              PILLAR 02 — MOCS PLUS
            </span>
            <h3 className="font-black text-2xl sm:text-3xl text-white uppercase mb-4">
              THE ROAD AHEAD
            </h3>
            <p className="text-[#A5A5A5] text-base sm:text-lg leading-relaxed font-normal">
              MOCS is expanding its manufacturing capacity with a new plant, targeting 40,000 units per month. Alongside this growth, we introduce MOCS Plus — our premium segment offering enhanced comfort, refined design and greater value.
            </p>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
