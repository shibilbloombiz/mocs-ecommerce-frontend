import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MapPin, Phone, Mail, Navigation } from "lucide-react";

const branches = [
  {
    city: "Kozhikode",
    role: "Corporate Office & Headquarters",
    address: "MOCS Foot Care, 7QJ8+42H, West Hill, Kozhikode, Kerala 673005",
    phone: "+91 7994550834 / 0495 485 5060",
    email: "support@mocs.in",
    mapUrl: "https://maps.google.com/?q=Kozhikode+West+Hill",
  },
  {
    city: "Malappuram",
    role: "Regional Distribution Hub & Dealer Operations",
    address: "MOCS Logistics Hub, Malappuram Industrial Zone, Kerala",
    phone: "+91 7994550834",
    email: "malappuram@mocs.in",
    mapUrl: "https://maps.google.com/?q=Malappuram+Kerala",
  },
];

export function NorthKeralaPresence() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedCity, setSelectedCity] = useState(0);

  const activeBranch = branches[selectedCity];

  return (
    <section
      id="kerala"
      aria-label="North Kerala Operations"
      className="relative py-20 sm:py-28 bg-[#101212] text-[#F5F5F2] border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#F26522] uppercase block mb-3">
            HOME GROUND
          </span>
          <h2 className="font-black text-3xl sm:text-5xl tracking-tight uppercase leading-tight">
            MOCS IN <span className="text-[#F26522]">NORTH KERALA</span>
          </h2>
          <p className="mt-3 text-[#A5A5A5] text-base sm:text-lg">
            Our state-of-the-art corporate offices and regional distribution centers in Kozhikode and Malappuram.
          </p>
        </div>

        {/* City Tab Selectors */}
        <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-4">
          {branches.map((b, idx) => (
            <button
              key={b.city}
              onClick={() => setSelectedCity(idx)}
              className={`pb-3 text-lg sm:text-xl font-bold uppercase tracking-wider transition-all duration-300 relative ${
                selectedCity === idx
                  ? "text-[#F26522]"
                  : "text-[#A5A5A5] hover:text-white"
              }`}
            >
              <span>{b.city}</span>
              {selectedCity === idx && (
                <motion.div
                  layoutId="activeCityLine"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[#F26522] rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Active Office Details Card */}
        <motion.div
          key={activeBranch.city}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 sm:p-10 rounded-3xl bg-[#191B1D] border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-8 flex flex-col items-start gap-4">
            <span className="text-xs font-bold tracking-widest text-[#F26522] uppercase">
              {activeBranch.role}
            </span>
            <h3 className="font-black text-2xl sm:text-3xl text-white uppercase">
              {activeBranch.city} Center
            </h3>

            <div className="space-y-3 mt-2 text-sm sm:text-base text-[#A5A5A5]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F26522] shrink-0 mt-0.5" />
                <span>{activeBranch.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#F26522] shrink-0" />
                <span>{activeBranch.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#F26522] shrink-0" />
                <span>{activeBranch.email}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <a
              href={activeBranch.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#F26522] hover:bg-[#F26522]/90 text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg"
            >
              <span>Get Directions</span>
              <Navigation className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
