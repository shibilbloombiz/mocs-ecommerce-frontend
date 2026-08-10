import { useState, useEffect } from "react";
import { motion } from "motion/react";

const navItems = [
  { id: "hero", label: "HERO" },
  { id: "story", label: "STORY" },
  { id: "leadership", label: "LEADERSHIP" },
  { id: "technology", label: "TECH" },
  { id: "quality", label: "QUALITY" },
  { id: "materials", label: "MATERIALS" },
  { id: "products", label: "PRODUCTS" },
  { id: "presence", label: "PRESENCE" },
  { id: "future", label: "FUTURE" },
  { id: "contact", label: "CONTACT" },
];

export function AboutPageNav() {
  const [activeId, setActiveId] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 300;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside
      aria-label="Section Navigation"
      className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 items-end pointer-events-auto select-none"
    >
      {navItems.map((item, idx) => {
        const isActive = activeId === item.id;
        const numStr = String(idx + 1).padStart(2, "0");
        return (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="group flex items-center gap-3 cursor-pointer py-1"
          >
            <span
              className={`text-[10px] font-bold tracking-widest transition-all duration-300 ${
                isActive
                  ? "text-[#F26522] opacity-100 translate-x-0"
                  : "text-white/40 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
              }`}
            >
              {numStr} {item.label}
            </span>
            <span
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? "w-3 h-3 bg-[#F26522] shadow-lg shadow-[#F26522]/50 scale-125"
                  : "w-1.5 h-1.5 bg-white/20 group-hover:bg-white/60"
              }`}
            />
          </button>
        );
      })}
    </aside>
  );
}
