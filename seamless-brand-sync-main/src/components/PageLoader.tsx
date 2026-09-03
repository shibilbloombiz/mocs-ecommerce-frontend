import { useState, useEffect } from "react";
import logo from "@/assets/mocs-logo.png";

const CRITICAL_ASSETS = [
  "/hero-comfort-banner.jpg",
  "/hero-lifestyle-1.jpg",
];

export function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if user already saw the loader in this session to keep route navigation instant
    try {
      const hasLoaded = sessionStorage.getItem("mocs_session_loaded");
      if (hasLoaded) {
        setShouldRender(false);
        return;
      }
    } catch {}

    // Preload critical assets in the background while the loader is active
    CRITICAL_ASSETS.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.catch(() => {});
    }

    // Clean 2.8s duration
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem("mocs_session_loaded", "true");
      } catch {}

      // Smooth subtle fade out
      setIsVisible(false);
      setTimeout(() => {
        setShouldRender(false);
      }, 450);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      aria-hidden={!isVisible}
      className={`fixed inset-0 z-[9999999] flex items-center justify-center bg-[#09090b]/98 backdrop-blur-md text-white select-none transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-[1.02] pointer-events-none"
      }`}
    >
      {/* Minimal Logo Only */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Subtle ambient luxury glow behind logo */}
        <div className="absolute w-24 h-24 rounded-full bg-[#F46A1E]/15 blur-2xl pointer-events-none animate-pulse" />

        <img
          src={logo}
          alt="MOCS"
          className="relative h-9 sm:h-10 w-auto object-contain drop-shadow-[0_2px_16px_rgba(244,106,30,0.3)] transition-all duration-700 ease-in-out animate-pulse"
        />
      </div>
    </div>
  );
}
