import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, MapPin, Phone, Mail, Navigation } from "lucide-react";

export function AboutContactCTA() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="contact"
      aria-label="Contact & Corporate Office"
      className="relative min-h-[80vh] bg-[#070707] text-[#F5F5F2] flex items-center py-24 sm:py-32 overflow-hidden border-t border-white/10"
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-[140px]"
          style={{ background: "radial-gradient(circle, #F26522 0%, transparent 70%)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Big Headline & Action Buttons */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#F26522] uppercase block mb-4"
            >
              START A CONVERSATION
            </motion.span>

            <motion.h2
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.95] mb-8"
            >
              LET'S <br />
              <span className="text-[#F26522]">TALK.</span>
            </motion.h2>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#F26522] hover:bg-[#F26522]/90 text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 shadow-xl shadow-[#F26522]/20 group"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href="https://maps.google.com/?q=Kozhikode+West+Hill"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#191B1D] hover:bg-white hover:text-black text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-widest border border-white/10 transition-all duration-300 group"
              >
                <span>Get Directions</span>
                <Navigation className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Address & Contact Details */}
          <div className="lg:col-span-6 p-8 sm:p-12 rounded-3xl bg-[#101212] border border-white/10 space-y-8">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#F26522] uppercase block mb-2">
                CORPORATE OFFICE
              </span>
              <h3 className="font-black text-xl sm:text-2xl text-white uppercase mb-2">
                MOCS FOOT CARE
              </h3>
              <p className="text-sm sm:text-base text-[#A5A5A5] leading-relaxed flex items-start gap-2">
                <MapPin className="w-5 h-5 text-[#F26522] shrink-0 mt-0.5" />
                <span>7QJ8+42H, WEST HILL, KOZHIKODE, KERALA 673005</span>
              </p>
            </div>

            <div className="pt-6 border-t border-white/10">
              <span className="text-xs font-bold tracking-widest text-[#F26522] uppercase block mb-3">
                CONNECT US
              </span>
              <div className="space-y-3 text-sm sm:text-base text-[#F5F5F2]">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#F26522]" />
                  <span>+91 7994550834 / 0495 485 5060</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#F26522]" />
                  <span>support@mocs.in</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
