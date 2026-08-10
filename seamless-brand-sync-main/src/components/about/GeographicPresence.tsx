import { motion, useReducedMotion } from "motion/react";
import { MapPin, Globe2 } from "lucide-react";

const regions = [
  { name: "Kerala & South India", desc: "Core manufacturing hub & dense retail partner network.", active: true },
  { name: "GCC Export Regions", desc: "UAE, Saudi Arabia & Oman international distributor footprint.", active: true },
  { name: "Western & Central India", desc: "Rapidly expanding multi-state dealer channels & logistics nodes.", active: true },
  { name: "Pan-India Direct-to-Factory", desc: "E-Commerce fulfillment reaching every pincode.", active: true },
];

export function GeographicPresence() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="presence"
      aria-label="Geographic Presence"
      className="relative py-24 sm:py-32 bg-[#070707] text-[#F5F5F2] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading & Copy */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#F26522] uppercase block mb-3"
            >
              FOOTPRINT
            </motion.span>

            <motion.h2
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-black text-4xl sm:text-6xl tracking-tight uppercase leading-tight mb-6"
            >
              GEOGRAPHIC <br />
              <span className="text-[#F26522]">PRESENCE</span>
            </motion.h2>

            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#A5A5A5] text-lg sm:text-xl leading-relaxed max-w-xl font-normal mb-8"
            >
              With a growing presence across Indian states and GCC regions, MOCS builds long-term growth through reliable partnerships and market trust.
            </motion.p>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#101212] border border-white/10 w-full max-w-md">
              <Globe2 className="w-8 h-8 text-[#F26522] shrink-0" />
              <div>
                <span className="block font-bold text-white text-sm uppercase">Global & Regional Network</span>
                <span className="text-xs text-[#A5A5A5]">Connecting direct-to-dealer & direct-to-customer networks.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Region Interactive Badges Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {regions.map((reg, idx) => (
              <motion.div
                key={reg.name}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="p-6 rounded-2xl bg-[#101212] border border-white/10 hover:border-[#F26522] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#F26522]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#F26522]" />
                  </div>
                  <span className="font-bold text-white text-base uppercase group-hover:text-[#F26522] transition-colors">
                    {reg.name}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#A5A5A5] leading-relaxed">
                  {reg.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
