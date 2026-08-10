import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

const stages = [
  {
    num: "01",
    title: "Production Technology",
    items: [
      "PU injection & pouring technology",
      "Controlled polyol-isocyanate reaction",
      "Precision molds & curing processes",
    ],
  },
  {
    num: "02",
    title: "Manufacturing Capability",
    items: [
      "Heavy production capacity",
      "~30,000 pairs/day capability",
      "Expansion in progress (MOCS Plus targets 40k/mo)",
    ],
  },
  {
    num: "03",
    title: "In-House Advantage",
    items: [
      "Sole manufacturing",
      "Upper production",
      "Assembly & finishing",
    ],
  },
];

export function TechnologySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest < 0.33) setActiveStage(0);
      else if (latest < 0.66) setActiveStage(1);
      else setActiveStage(2);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section
      ref={containerRef}
      id="technology"
      aria-label="Technology & Capability"
      className="relative py-24 sm:py-32 bg-[#F5F5F2] dark:bg-[#101212] text-[#070707] dark:text-[#F5F5F2] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Sticky Heading & Progress Line */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 flex flex-col items-start">
            <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#F26522] uppercase block mb-3">
              ENGINEERING EXCELLENCE
            </span>

            <h2 className="font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase leading-tight mb-6">
              TECHNOLOGY THAT <br />
              <span className="text-[#F26522]">DRIVES QUALITY</span>
            </h2>

            <p className="text-[#555555] dark:text-[#A5A5A5] text-base sm:text-lg leading-relaxed max-w-md font-normal mb-8">
              From raw polyurethane chemistry to finished assembly, our vertically integrated plant ensures every pair meets rigorous standards.
            </p>

            {/* Vertical Progress Bar */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="w-1.5 h-48 bg-black/10 dark:bg-white/10 rounded-full relative overflow-hidden">
                <motion.div
                  style={{ height: lineHeight }}
                  className="w-full bg-[#F26522] rounded-full"
                />
              </div>
              <div className="flex flex-col gap-8 text-xs font-bold tracking-widest text-[#A5A5A5]">
                <span className={activeStage === 0 ? "text-[#F26522]" : ""}>01 PRODUCTION</span>
                <span className={activeStage === 1 ? "text-[#F26522]" : ""}>02 CAPACITY</span>
                <span className={activeStage === 2 ? "text-[#F26522]" : ""}>03 IN-HOUSE</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Stages Scroll Storytelling */}
          <div className="lg:col-span-7 flex flex-col gap-12 sm:gap-16">
            {stages.map((stage, idx) => {
              const isActive = activeStage === idx;
              return (
                <motion.div
                  key={stage.num}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className={`p-8 sm:p-10 rounded-3xl transition-all duration-500 border ${
                    isActive
                      ? "bg-white dark:bg-[#191B1D] border-[#F26522]/40 shadow-xl opacity-100 scale-100"
                      : "bg-white/60 dark:bg-[#191B1D]/40 border-black/5 dark:border-white/5 opacity-60 scale-98"
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-black text-4xl sm:text-5xl text-[#F26522]">
                      {stage.num}
                    </span>
                    <span className="text-xs font-bold tracking-widest uppercase text-[#A5A5A5]">
                      STAGE {stage.num}
                    </span>
                  </div>

                  <h3 className="font-black text-2xl sm:text-3xl text-[#070707] dark:text-[#F5F5F2] uppercase mb-6">
                    {stage.title}
                  </h3>

                  <ul className="space-y-3">
                    {stage.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-center gap-3 text-base sm:text-lg text-[#333333] dark:text-[#A5A5A5] font-medium"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#F26522] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
