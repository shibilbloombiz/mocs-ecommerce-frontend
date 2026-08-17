import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import blackSandals from "@/assets/black sandals.png";
const heroShoe = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800";

const puSoleSpecs = [
  "Lightweight & flexible",
  "Shock-absorbing foam structure",
  "Slip-resistant & water-resistant",
  "Long-lasting durability",
  "Reduced foot fatigue for wear",
  "Cushioned & impact-resistant",
];

const upperSpecs = [
  "Premium synthetic leather",
  "Leather-like appearance",
  "Tear-resistant & durable",
  "Designed for comfort",
  "Breathable & skin-friendly",
  "Excellent cushioning retention",
];

export function MaterialsSection({ products }: { products?: any[] }) {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<"sole" | "upper">("sole");
  const [activeSpecIdx, setActiveSpecIdx] = useState(0);

  const currentSpecs = activeTab === "sole" ? puSoleSpecs : upperSpecs;

  const soleImg = products?.[0]?.image || blackSandals;
  const upperImg = products?.[1]?.image || heroShoe;
  const currentImg = activeTab === "sole" ? soleImg : upperImg;

  return (
    <section
      id="materials"
      aria-label="Material Technology"
      className="relative py-24 sm:py-32 bg-[#070707] text-[#F5F5F2] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header & Tab Selector */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 sm:mb-20">
          <div>
            <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#F26522] uppercase block mb-3">
              MATERIAL INNOVATION
            </span>
            <h2 className="font-black text-4xl sm:text-6xl tracking-tight uppercase leading-none">
              PU SOLE & <span className="text-[#F26522]">UPPER TECH</span>
            </h2>
          </div>

          {/* Interactive Tab Switcher */}
          <div className="flex items-center gap-2 p-1.5 bg-[#191B1D] rounded-full border border-white/10 self-start lg:self-auto">
            <button
              onClick={() => { setActiveTab("sole"); setActiveSpecIdx(0); }}
              className={`px-6 py-3 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 ${
                activeTab === "sole"
                  ? "bg-[#F26522] text-white shadow-lg shadow-[#F26522]/25"
                  : "text-[#A5A5A5] hover:text-white"
              }`}
            >
              PU Sole Technology
            </button>
            <button
              onClick={() => { setActiveTab("upper"); setActiveSpecIdx(0); }}
              className={`px-6 py-3 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 ${
                activeTab === "upper"
                  ? "bg-[#F26522] text-white shadow-lg shadow-[#F26522]/25"
                  : "text-[#A5A5A5] hover:text-white"
              }`}
            >
              Upper Materials
            </button>
          </div>
        </div>

        {/* Desktop Interactive Explorer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Original MOCS Product Imagery */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[340px] sm:min-h-[420px]">
            <div className="absolute w-[300px] h-[300px] rounded-full bg-[#F26522]/20 filter blur-3xl" />
            <motion.img
              key={activeTab}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6 }}
              src={currentImg}
              alt="MOCS Original Footwear Product Structure"
              className="w-full max-w-[440px] h-auto object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.95)] z-10"
            />
          </div>

          {/* Right Column: Numbered Specifications List */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {currentSpecs.map((spec, idx) => {
              const isActive = activeSpecIdx === idx;
              const numStr = String(idx + 1).padStart(2, "0");
              return (
                <motion.div
                  key={spec}
                  onMouseEnter={() => setActiveSpecIdx(idx)}
                  className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                    isActive
                      ? "bg-[#191B1D] border-[#F26522] shadow-lg shadow-[#F26522]/10"
                      : "bg-[#101212] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <span className={`font-black text-2xl sm:text-3xl transition-colors duration-300 ${
                      isActive ? "text-[#F26522]" : "text-[#A5A5A5]"
                    }`}>
                      {numStr}
                    </span>
                    <span className={`font-bold text-lg sm:text-xl uppercase transition-colors duration-300 ${
                      isActive ? "text-[#F5F5F2]" : "text-[#A5A5A5]"
                    }`}>
                      {spec}
                    </span>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isActive ? "bg-[#F26522] scale-125" : "bg-white/20"
                  }`} />
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
