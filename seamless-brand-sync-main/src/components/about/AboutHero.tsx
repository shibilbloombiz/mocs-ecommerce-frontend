import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import userUploadedShoe from "C:/Users/user/.gemini/antigravity-ide/brain/c3592418-1454-4703-9e91-e98c79461a6b/media__1786102779226.png";
import blackSandals from "@/assets/black sandals.png";

export function AboutHero({ products }: { products?: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Primary hero sneaker image from the uploaded asset
  const heroShoeImg = userUploadedShoe || (products && products.length > 0 && products[0]?.image) || blackSandals;

  // Scroll Parallax — use smaller ranges so transforms stay cheap
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const textY   = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -50]);
  const shoeY   = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -110]);
  const bgTextY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -25]);

  return (
    <section
      ref={containerRef}
      id="hero"
      aria-label="About MOCS Hero"
      className="relative min-h-[90vh] lg:min-h-screen bg-[#070707] text-[#F5F5F2] flex items-center overflow-hidden pt-28 pb-20 lg:py-32"
    >
      {/* Ambient Lighting & Gradients — static, no blur animation for perf */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        {/* Use a CSS conic/radial gradient instead of blur filter to avoid GPU overdraw */}
        <div
          className="absolute top-1/3 left-2/3 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle at center, rgba(242,101,34,0.55) 0%, rgba(242,101,34,0.15) 45%, transparent 70%)",
            transform: "translate(-50%, -50%) translateZ(0)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070707]/60 to-[#070707]" />
      </div>

      {/* Huge Low-Opacity Background Typography "MOCS" — GPU composited */}
      <motion.div
        style={{ y: bgTextY, willChange: "transform", transform: "translateZ(0)" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
      >
        <span className="font-black text-[140px] sm:text-[220px] md:text-[300px] lg:text-[380px] xl:text-[450px] tracking-tighter uppercase leading-none text-white/[0.03]">
          MOCS
        </span>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Copy */}
          <motion.div style={{ y: textY, willChange: "transform" }} className="lg:col-span-7 z-10">
            {/* Orange Eyebrow */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 mb-4 sm:mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#F26522] animate-pulse" />
              <span className="text-xs sm:text-sm font-bold tracking-[0.3em] text-[#F26522] uppercase">
                ABOUT MOCS
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-black text-4xl sm:text-6xl md:text-7xl lg:text-[84px] leading-[0.94] tracking-tight uppercase mb-6 sm:mb-8">
              <motion.span
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="block text-[#F5F5F2]"
              >
                REFINED IN
              </motion.span>
              <motion.span
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="block text-[#F26522] drop-shadow-[0_4px_25px_rgba(242,101,34,0.4)]"
              >
                EVERY STEP.
              </motion.span>
            </h1>

            {/* Supporting Copy */}
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-[#A5A5A5] text-base sm:text-lg md:text-xl leading-relaxed max-w-[580px] font-normal mb-8"
            >
              MOCS represents a refined approach to footwear, blending craftsmanship, innovation and thoughtful design. Each collection reflects contemporary style, superior comfort and lasting quality.
            </motion.p>

            {/* Small Statement Badge */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block border-l-2 border-[#F26522] pl-4 py-1 text-xs sm:text-sm font-semibold tracking-wider text-[#F5F5F2] uppercase"
            >
              ELEVATING EVERYDAY FOOTWEAR WITH TIMELESS QUALITY.
            </motion.div>
          </motion.div>

          {/* Right Column: Pure Floating Animated Footwear */}
          <motion.div
            style={{ y: shoeY, willChange: "transform" }}
            className="lg:col-span-5 relative flex items-center justify-center min-h-[360px] sm:min-h-[460px]"
          >
            <motion.div
              initial={
                prefersReducedMotion
                  ? false
                  : { opacity: 0, scale: 1.12, rotate: 4 }
              }
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-[440px] sm:max-w-[520px] lg:max-w-[600px] p-4 flex items-center justify-center select-none"
            >
              {/* Continuous Levitation Float Wrapper — only translateY for GPU compositing, no rotateZ to avoid repaints */}
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : { y: [0, -20, 0] }
                }
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ willChange: "transform" }}
                className="relative flex items-center justify-center w-full"
              >
                {/* Floating Ground Shadow — use opacity-only to avoid blurring every frame */}
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? {}
                      : { opacity: [0.55, 0.22, 0.55] }
                  }
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ willChange: "opacity" }}
                  className="absolute -bottom-10 w-4/5 h-14 bg-black/90 rounded-[100%] blur-2xl z-0 pointer-events-none"
                />

                {/* Ambient Orange Glow Ring — static radial gradient, no filter blur */}
                <div
                  className="absolute w-[340px] h-[340px] rounded-full opacity-60 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, rgba(242,101,34,0.28) 0%, rgba(242,101,34,0.08) 55%, transparent 75%)",
                    transform: "translateZ(0)",
                  }}
                />

                {/* Pure Floating Footwear Image */}
                <img
                  src={heroShoeImg}
                  alt="MOCS Original Olive Sneaker"
                  className="w-full h-auto object-contain drop-shadow-[0_35px_55px_rgba(0,0,0,0.95)] pointer-events-auto"
                />
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
