import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import azharRmPhoto from "C:/Users/user/.gemini/antigravity-ide/brain/13f69f8c-9e3c-4ae7-926d-54875340adad/azhar_rm_portrait_1786339245557.png";

export function LeadershipSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const portraitScaleRaw = useTransform(scrollYProgress, [0.1, 0.8], prefersReducedMotion ? [1, 1] : [0.93, 1.04]);
  const portraitScale = useSpring(portraitScaleRaw, { stiffness: 70, damping: 22 });
  const bgTextX = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-60, 60]);

  return (
    <section
      ref={containerRef}
      id="leadership"
      aria-label="Leadership"
      className="relative py-24 sm:py-32 bg-[#070707] text-[#F5F5F2] overflow-hidden"
    >
      {/* Background Outlined Typography */}
      <motion.div
        style={{ x: bgTextX }}
        className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-center pointer-events-none select-none z-0 overflow-hidden"
      >
        <span className="font-black text-[100px] sm:text-[180px] md:text-[240px] lg:text-[300px] tracking-tighter uppercase leading-none text-transparent stroke-text opacity-10">
          VISION
        </span>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Leadership Copy */}
          <div className="lg:col-span-7 z-10 flex flex-col items-start">

            {/* Eyebrow label */}
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-[0.25em] text-[#F26522] uppercase mb-4"
            >
              <span className="w-2 h-2 rounded-full bg-[#F26522] animate-pulse" />
              MANAGING DIRECTOR
            </motion.span>

            {/* Name headline */}
            <motion.h2
              initial={prefersReducedMotion ? false : { opacity: 0, x: -48, skewX: -3 }}
              whileInView={{ opacity: 1, x: 0, skewX: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight uppercase mb-2 leading-none"
            >
              AZHAR
            </motion.h2>
            <motion.h2
              initial={prefersReducedMotion ? false : { opacity: 0, x: 48, skewX: 3 }}
              whileInView={{ opacity: 1, x: 0, skewX: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-black text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight uppercase mb-8 leading-none text-[#F26522]"
            >
              RM
            </motion.h2>

            {/* Bio paragraph */}
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 28, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#A5A5A5] text-lg sm:text-xl leading-relaxed font-normal max-w-xl mb-10"
            >
              A visionary leader with strong expertise in footwear manufacturing and supply chain management. He drives efficient production systems, strong dealer partnerships, and sustainable business growth. His leadership reflects integrity, innovation, and a commitment to quality.
            </motion.p>

            {/* Values / Focus Pillars */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 w-full"
            >
              {[
                { num: "01", label: "Integrity" },
                { num: "02", label: "Innovation" },
                { num: "03", label: "Quality" },
              ].map(({ num, label }) => (
                <div key={num} className="group">
                  <span className="block font-black text-[#F26522] text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300 origin-left">
                    {num}
                  </span>
                  <span className="text-xs sm:text-sm text-[#A5A5A5] uppercase font-semibold tracking-wider">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Azhar RM Portrait Card */}
          <motion.div
            style={{ scale: portraitScale }}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-3xl bg-[#F26522]/10 blur-3xl scale-110 pointer-events-none" />

            {/* Portrait card */}
            <div className="relative w-full max-w-[400px] sm:max-w-[440px] rounded-3xl overflow-hidden border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.7)] bg-[#111]">

              {/* Orange top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F26522] via-[#f97316] to-transparent z-20" />

              {/* Portrait image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={azharRmPhoto}
                  alt="Azhar RM — Managing Director of MOCS"
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                {/* Bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
              </div>

              {/* Name badge at bottom */}
              <div className="px-6 py-5 bg-[#0d0d0d] border-t border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] sm:text-xs font-bold tracking-[0.3em] text-[#F26522] uppercase mb-1">
                      Managing Director
                    </span>
                    <span className="block text-lg sm:text-xl font-black text-[#F5F5F2] uppercase tracking-wide">
                      Azhar RM
                    </span>
                  </div>
                  {/* MOCS brand dot */}
                  <div className="w-10 h-10 rounded-full bg-[#F26522]/15 border border-[#F26522]/30 flex items-center justify-center">
                    <span className="text-[#F26522] font-black text-xs">MD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative corner lines */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 border-r-2 border-b-2 border-[#F26522]/30 rounded-br-2xl pointer-events-none" />
            <div className="absolute -top-4 -left-4 w-20 h-20 border-l-2 border-t-2 border-white/10 rounded-tl-2xl pointer-events-none" />
          </motion.div>

        </div>
      </div>

      <style>{`
        .stroke-text {
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.12);
        }
      `}</style>
    </section>
  );
}

