import { useRef, useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useReducedMotion,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import homeAboutShoe from "@/assets/media__1786102964931.png";
import blackSandals from "@/assets/black sandals.png";

export function AboutMocsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const isStatsInView = useInView(statsRef, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  const heroShoeImg = homeAboutShoe || blackSandals;

  // Scroll Parallax Effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageYRaw = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [60, -60]
  );

  // Spring-smooth the parallax — adds gentle momentum so it never feels jerky
  const imageY = useSpring(imageYRaw, {
    stiffness: 60,
    damping: 20,
    mass: 0.5,
  });

  // Animated Counter for 13+ Years
  const [yearsCount, setYearsCount] = useState(0);
  useEffect(() => {
    if (isStatsInView) {
      let start = 0;
      const end = 13;
      const duration = 1200; // 1.2s
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setYearsCount(end);
          clearInterval(timer);
        } else {
          setYearsCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isStatsInView]);

  return (
    <section
      ref={sectionRef}
      aria-label="About MOCS"
      className="relative overflow-hidden py-16 sm:py-24 md:py-28 lg:py-36 bg-background text-foreground transition-colors duration-300 border-y border-border/40"
    >
      {/* Subtle Theme Radial Spotlight Effect */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute top-1/2 left-3/4 -translate-y-1/2 w-[650px] h-[650px] rounded-full opacity-15 dark:opacity-20 blur-[130px]"
          style={{
            background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[450px] h-[450px] rounded-full opacity-5 dark:opacity-10 blur-[110px]"
          style={{
            background: "radial-gradient(circle, var(--color-foreground) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Composition: Desktop 2-Column, Mobile Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 items-center">
          
          {/* LEFT SIDE: Copy & Typography */}
          <div className="lg:col-span-6 flex flex-col items-start z-10">
            {/* 1. Eyebrow */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 mb-3 sm:mb-4"
            >
              <span className="w-2 h-2 rounded-full bg-[#F26522] animate-pulse" />
              <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#F26522] uppercase">
                ABOUT MOCS
              </span>
            </motion.div>

            {/* 2. Headline */}
            <div className="overflow-hidden mb-6">
              <h2 className="font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[76px] leading-[0.98] tracking-tight uppercase">
                <motion.span
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -48, skewX: -4 }}
                  whileInView={{ opacity: 1, x: 0, skewX: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-foreground"
                >
                  MADE WITH PURPOSE.
                </motion.span>
                <motion.span
                  initial={prefersReducedMotion ? false : { opacity: 0, x: 48, skewX: 4 }}
                  whileInView={{ opacity: 1, x: 0, skewX: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.75, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-[#F26522]"
                >
                  BUILT FOR COMFORT.
                </motion.span>
              </h2>
            </div>

            {/* 3. Main Paragraph */}
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 28, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed max-w-[560px] font-normal"
            >
              For more than 13 years, MOCS has combined thoughtful design, reliable materials and precise manufacturing to create footwear made for everyday life.
            </motion.p>

            {/* 4. Supporting Statement */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm sm:text-base text-foreground font-medium tracking-wide"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#F26522] shrink-0" />
                <span>Comfort in every step.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#F26522] shrink-0" />
                <span>Quality in every detail.</span>
              </div>
            </motion.div>

            {/* 5. CTA Link */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to="/about"
                className="inline-flex items-center gap-2 mt-8 text-base sm:text-lg font-semibold text-foreground hover:text-[#F26522] transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522]"
              >
                <span className="border-b border-foreground/20 group-hover:border-[#F26522] transition-colors pb-0.5">
                  Our Story
                </span>
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 text-[#F26522]" />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT SIDE: FLOATING FOOTWEAR WITH 3 ROWS OF MEDIUM-SIZED AUTOMATIC SLIDING "MOCS" TEXT */}
          <div className="lg:col-span-6 relative mt-14 lg:mt-0 flex items-center justify-center min-h-[380px] sm:min-h-[460px] md:min-h-[520px] overflow-hidden rounded-3xl">
            
            {/* 3 STACKED ROWS OF CONTINUOUS AUTOMATIC SLIDING BACKGROUND MOCS MARQUEE (MEDIUM SIZE) */}
            <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none select-none z-0 overflow-hidden opacity-[0.09] dark:opacity-[0.08]">
              {/* Row 1: Sliding Left */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : { x: ["0%", "-50%"] }
                }
                transition={{
                  duration: 16,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="flex whitespace-nowrap items-center font-black text-[50px] sm:text-[80px] md:text-[100px] lg:text-[125px] tracking-tight uppercase leading-none text-foreground dark:text-white"
              >
                <span className="mr-8">MOCS</span>
                <span className="mr-8">MOCS</span>
                <span className="mr-8">MOCS</span>
                <span className="mr-8">MOCS</span>
                <span className="mr-8">MOCS</span>
                <span className="mr-8">MOCS</span>
              </motion.div>

              {/* Row 2: Sliding Right (Reverse) */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : { x: ["-50%", "0%"] }
                }
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="flex whitespace-nowrap items-center font-black text-[50px] sm:text-[80px] md:text-[100px] lg:text-[125px] tracking-tight uppercase leading-none text-[#F26522]"
              >
                <span className="mr-8">MOCS</span>
                <span className="mr-8">MOCS</span>
                <span className="mr-8">MOCS</span>
                <span className="mr-8">MOCS</span>
                <span className="mr-8">MOCS</span>
                <span className="mr-8">MOCS</span>
              </motion.div>

              {/* Row 3: Sliding Left */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : { x: ["0%", "-50%"] }
                }
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="flex whitespace-nowrap items-center font-black text-[50px] sm:text-[80px] md:text-[100px] lg:text-[125px] tracking-tight uppercase leading-none text-foreground dark:text-white"
              >
                <span className="mr-8">MOCS</span>
                <span className="mr-8">MOCS</span>
                <span className="mr-8">MOCS</span>
                <span className="mr-8">MOCS</span>
                <span className="mr-8">MOCS</span>
                <span className="mr-8">MOCS</span>
              </motion.div>
            </div>

            {/* FLOATING FOOTWEAR CONTAINER WITH PROMINENT SIZE */}
            <motion.div
              style={{ y: imageY }}
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, scale: 0.9, rotate: -3, y: 40 }
              }
              whileInView={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-[440px] sm:max-w-[540px] lg:max-w-[620px] p-4 flex items-center justify-center select-none"
            >
              {/* Continuous Levitation Float Wrapper */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: [0, -22, 0],
                        rotateZ: [0, 2, 0],
                      }
                }
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative flex items-center justify-center w-full"
              >
                {/* Dynamic 3D Ground Shadow */}
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: [1, 0.82, 1],
                          opacity: [0.6, 0.3, 0.6],
                        }
                  }
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-10 w-4/5 h-14 bg-foreground/20 dark:bg-black/90 rounded-[100%] filter blur-xl z-0 pointer-events-none"
                />

                {/* Ambient Glow Ring */}
                <div className="absolute w-[340px] h-[340px] rounded-full bg-[#F26522]/15 filter blur-3xl opacity-70 pointer-events-none" />

                {/* Prominent Footwear Image */}
                <img
                  src={heroShoeImg}
                  alt="MOCS Premium Footwear"
                  className="w-full h-auto max-h-[500px] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_30px_45px_rgba(0,0,0,0.9)] transform lg:scale-105 pointer-events-auto"
                  loading="lazy"
                />
              </motion.div>
            </motion.div>
          </div>

        </div>

        {/* STATS / BRAND VALUES ROW */}
        <motion.div
          ref={statsRef}
          className="mt-20 sm:mt-24 md:mt-28 border-t border-border pt-12 sm:pt-16"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 lg:gap-8"
            variants={
              prefersReducedMotion
                ? {}
                : {
                    hidden: {},
                    show: {
                      transition: {
                        staggerChildren: 0.12,
                        delayChildren: 0.1,
                      },
                    },
                  }
            }
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {/* Stat 1 */}
            <motion.div
              variants={
                prefersReducedMotion
                  ? {}
                  : {
                      hidden: { opacity: 0, y: 28, scale: 0.96 },
                      show: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                      },
                    }
              }
              className="flex flex-col items-start border-l border-border pl-4 sm:pl-6"
            >
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F26522] tracking-tight">
                {yearsCount}+
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-muted-foreground uppercase mt-1 leading-tight">
                YEARS OF<br />CRAFTSMANSHIP
              </span>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              variants={
                prefersReducedMotion
                  ? {}
                  : {
                      hidden: { opacity: 0, y: 28, scale: 0.96 },
                      show: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                      },
                    }
              }
              className="flex flex-col items-start border-l border-border pl-4 sm:pl-6"
            >
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase">
                QUALITY
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-muted-foreground uppercase mt-1 leading-tight">
                TESTED AT<br />EVERY STAGE
              </span>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              variants={
                prefersReducedMotion
                  ? {}
                  : {
                      hidden: { opacity: 0, y: 28, scale: 0.96 },
                      show: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                      },
                    }
              }
              className="flex flex-col items-start border-l border-border pl-4 sm:pl-6"
            >
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase">
                COMFORT
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-muted-foreground uppercase mt-1 leading-tight">
                DESIGNED FOR<br />EVERYDAY LIFE
              </span>
            </motion.div>

            {/* Stat 4 */}
            <motion.div
              variants={
                prefersReducedMotion
                  ? {}
                  : {
                      hidden: { opacity: 0, y: 28, scale: 0.96 },
                      show: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
                      },
                    }
              }
              className="flex flex-col items-start border-l border-border pl-4 sm:pl-6"
            >
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight uppercase">
                MADE IN INDIA
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-muted-foreground uppercase mt-1 leading-tight">
                BUILT WITH<br />PURPOSE
              </span>
            </motion.div>

          </motion.div>

          {/* Action Button: Load More About / Navigate to /about Page */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 sm:mt-16 flex justify-center"
          >
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#121212] dark:bg-card hover:bg-[#F26522] dark:hover:bg-[#F26522] text-[#F7F7F5] hover:text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-widest border border-border/60 hover:border-[#F26522] transition-all duration-300 shadow-md hover:shadow-[#F26522]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26522] group"
            >
              <span>Discover Full MOCS Story & Craftsmanship</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#F26522] group-hover:text-white" />
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
