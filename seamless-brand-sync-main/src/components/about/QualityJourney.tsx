import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useInView,
  useReducedMotion,
} from "motion/react";
import {
  FlaskConical, Ruler, Zap, Heart,
  Eye, ShieldCheck, ClipboardCheck, RefreshCcw,
} from "lucide-react";

const steps = [
  { num: "01", icon: FlaskConical,   side: "left",  title: "Raw Material Inspection",        desc: "Chemical polyol ratio, synthetic leather tear strength & pigment audit.",          tag: "INPUT GATE"  },
  { num: "02", icon: Ruler,          side: "right", title: "In-process Checks",               desc: "Mould temperature, feed weights & precision upper stitching alignment.",            tag: "PRODUCTION"  },
  { num: "03", icon: Zap,            side: "left",  title: "Mechanical & Physical Testing",   desc: "Direct injection bond validation & high flex-fatigue recovery.",                    tag: "STRESS TEST" },
  { num: "04", icon: Heart,          side: "right", title: "Comfort & Fit Evaluation",        desc: "Ergonomic arch support, weight distribution & foot fatigue testing.",               tag: "ERGONOMICS"  },
  { num: "05", icon: Eye,            side: "left",  title: "Visual Finish Inspection",        desc: "Flash trimming, logo embossing precision & color uniformity gate.",                 tag: "AESTHETICS"  },
  { num: "06", icon: ShieldCheck,    side: "right", title: "Durability & Usage Tests",        desc: "Abrasion resistance & 150,000+ cycle sole flex recovery verification.",             tag: "LONGEVITY"   },
  { num: "07", icon: ClipboardCheck, side: "left",  title: "Final AQL Audit Before Packing", desc: "Acceptable Quality Limit (AQL) random batch sampling before boxing.",               tag: "FINAL GATE"  },
  { num: "08", icon: RefreshCcw,     side: "right", title: "Feedback & Improvements",        desc: "Dealer & customer feedback loop integrated into next production run.",              tag: "LOOP BACK"   },
];

/* Individual step row — each manages its own inView */
function StepRow({
  step,
  idx,
  prefersReducedMotion,
}: {
  step: (typeof steps)[0];
  idx: number;
  prefersReducedMotion: boolean | null;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, { once: true, margin: "-80px" });
  const isLeft = step.side === "left";
  const Icon = step.icon;

  const cardVariants = {
    hidden: { opacity: 0, x: isLeft ? -56 : 56, scale: 0.94 },
    visible: {
      opacity: 1, x: 0, scale: 1,
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const nodeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div ref={rowRef} className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-0">

      {/* LEFT SLOT */}
      <div className="flex justify-end pr-6 sm:pr-10">
        {isLeft && (
          <motion.div
            variants={prefersReducedMotion ? {} : cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="w-full max-w-[300px] sm:max-w-[340px]"
          >
            <StepCard step={step} idx={idx} isInView={isInView} prefersReducedMotion={!!prefersReducedMotion} />
          </motion.div>
        )}
        {/* Connector dot on left side */}
        {isLeft && isInView && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-[calc(50%-1px)] top-1/2 -translate-y-1/2 h-[1px] w-[40px] sm:w-[56px] bg-gradient-to-r from-[#F26522]/40 to-[#F26522]/10 origin-right pointer-events-none"
            style={{ right: "calc(50% - 1px)", width: "clamp(24px, 5vw, 56px)" }}
          />
        )}
      </div>

      {/* CENTER NODE */}
      <div className="relative flex flex-col items-center" style={{ width: "2px" }}>
        <motion.div
          variants={prefersReducedMotion ? {} : nodeVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative z-10 flex items-center justify-center"
        >
          {/* Outer pulse ring */}
          {isInView && !prefersReducedMotion && (
            <motion.div
              animate={{ scale: [1, 1.7, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-8 h-8 rounded-full border border-[#F26522]/50"
            />
          )}
          {/* Inner glow ring */}
          {isInView && !prefersReducedMotion && (
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="absolute w-5 h-5 rounded-full border border-[#F26522]/70"
            />
          )}
          {/* Solid node */}
          <div className="w-4 h-4 rounded-full bg-[#F26522] shadow-[0_0_14px_rgba(242,101,34,0.7)] z-10" />
        </motion.div>
      </div>

      {/* RIGHT SLOT */}
      <div className="flex justify-start pl-6 sm:pl-10">
        {!isLeft && (
          <motion.div
            variants={prefersReducedMotion ? {} : cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="w-full max-w-[300px] sm:max-w-[340px]"
          >
            <StepCard step={step} idx={idx} isInView={isInView} prefersReducedMotion={!!prefersReducedMotion} />
          </motion.div>
        )}
        {/* Connector dot on right side */}
        {!isLeft && isInView && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-[calc(50%-1px)] top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-l from-[#F26522]/40 to-[#F26522]/10 origin-left pointer-events-none"
            style={{ left: "calc(50% - 1px)", width: "clamp(24px, 5vw, 56px)" }}
          />
        )}
      </div>
    </div>
  );
}

/* Card component */
function StepCard({
  step,
  idx,
  isInView,
  prefersReducedMotion,
}: {
  step: (typeof steps)[0];
  idx: number;
  isInView: boolean;
  prefersReducedMotion: boolean;
}) {
  const Icon = step.icon;
  return (
    <div className="group relative rounded-2xl border border-white/[0.08] bg-[#0e0e0e] overflow-hidden hover:border-[#F26522]/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(242,101,34,0.1)]">
      {/* Top accent line — swipes in when card enters view */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isInView ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="h-[2px] bg-gradient-to-r from-[#F26522] via-[#f97316] to-transparent origin-left"
      />

      {/* Watermark number */}
      <span
        aria-hidden
        className="absolute top-1 right-3 font-black text-[56px] leading-none select-none pointer-events-none text-white/[0.03] group-hover:text-[#F26522]/[0.07] transition-colors duration-500"
      >
        {step.num}
      </span>

      <div className="p-5 sm:p-6">
        {/* Tag + Icon */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-block text-[8px] sm:text-[9px] font-black tracking-[0.22em] text-[#F26522]/60 uppercase border border-[#F26522]/20 bg-[#F26522]/[0.06] rounded-full px-2.5 py-[3px]">
            {step.tag}
          </span>
          <motion.div
            animate={{ color: isInView ? "#F26522" : "#333", rotate: isInView ? 0 : -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Number */}
        <span className="font-black text-3xl leading-none text-[#F26522] block mb-1.5 tracking-tight">
          {step.num}
        </span>

        {/* Title */}
        <h3 className={`font-black text-[13px] sm:text-sm uppercase tracking-wide leading-snug mb-3 transition-colors duration-500 ${isInView ? "text-[#EFEFED]" : "text-[#3a3a3a]"}`}>
          {step.title}
        </h3>

        {/* Animated divider */}
        <motion.div
          animate={{ width: isInView ? "100%" : "1.5rem" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="h-[1px] bg-gradient-to-r from-[#F26522]/50 to-transparent mb-3"
        />

        {/* Description */}
        <p className={`text-xs sm:text-[13px] leading-relaxed transition-colors duration-500 ${isInView ? "text-[#7a7a7a]" : "text-[#2a2a2a]"}`}>
          {step.desc}
        </p>
      </div>

      {/* Bottom hover glow */}
      <div className="h-6 bg-gradient-to-t from-[#F26522]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

/* ── Main export ── */
export function QualityJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  /* Scroll-driven line fill */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "end 0.1"],
  });
  const lineScaleY = useSpring(scrollYProgress, { stiffness: 45, damping: 16 });

  return (
    <section
      ref={sectionRef}
      id="quality"
      aria-label="Quality Journey"
      className="relative py-24 sm:py-32 bg-[#070707] text-[#F5F5F2] overflow-hidden"
    >
      {/* Ambient centre glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(242,101,34,0.055) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Header ── */}
        <div className="text-center mb-20 sm:mb-24">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 mb-5"
          >
            <span className="w-7 h-[2px] bg-[#F26522] rounded-full" />
            <span className="text-[10px] sm:text-xs font-black tracking-[0.3em] text-[#F26522] uppercase">
              END-TO-END AUDIT
            </span>
            <span className="w-7 h-[2px] bg-[#F26522] rounded-full" />
          </motion.div>

          <motion.h2
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight uppercase leading-[0.92] text-[#F5F5F2] mb-5"
          >
            QUALITY AT{" "}
            <span className="relative inline-block text-[#F26522]">
              EVERY STEP.
              <motion.span
                initial={prefersReducedMotion ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#F26522] origin-left rounded-full"
              />
            </span>
          </motion.h2>


          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#A5A5A5] text-base sm:text-lg max-w-md mx-auto"
          >
            Eight rigorous quality checkpoints — zero-defect craftsmanship guaranteed.
          </motion.p>
        </div>

        {/* ── Timeline ── */}
        <div className="relative">

          {/* Centre vertical line track (ghost) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/[0.06] rounded-full" />

          {/* Scroll-driven orange fill line */}
          <motion.div
            style={{ scaleY: lineScaleY, transformOrigin: "top" }}
            className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] rounded-full pointer-events-none"
            style={{
              scaleY: lineScaleY,
              transformOrigin: "top",
              background: "linear-gradient(to bottom, #F26522, #f97316, #F26522aa)",
              boxShadow: "0 0 12px 2px rgba(242,101,34,0.35)",
            } as any}
          />

          {/* Steps */}
          <div className="relative flex flex-col gap-16 sm:gap-20 py-4">
            {steps.map((step, idx) => (
              <StepRow
                key={step.num}
                step={step}
                idx={idx}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>

          {/* End cap dot */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-[#F26522]/40 border border-[#F26522]/60 shadow-[0_0_10px_rgba(242,101,34,0.5)]"
          />
        </div>

        {/* ── Bottom stats ── */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 sm:mt-24 pt-10 border-t border-white/[0.06] flex flex-wrap justify-center gap-8 sm:gap-16"
        >
          {[
            { value: "8",     label: "Quality Gates"      },
            { value: "150K+", label: "Flex Cycles Tested" },
            { value: "0",     label: "Defect Tolerance"   },
            { value: "AQL",   label: "Industry Standard"  },
          ].map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-1 group"
            >
              <span className="font-black text-3xl sm:text-4xl text-[#F26522] group-hover:scale-110 transition-transform duration-300 origin-bottom">
                {value}
              </span>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.22em] text-[#3d3d3d] uppercase">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
