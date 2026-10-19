import { useState, useEffect, useRef } from "react";
import logo from "@/assets/mocs-logo.png";

export function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Optional query parameter to inspect loader at a fixed percentage (e.g. ?hold=60)
    const searchParams = new URLSearchParams(window.location.search);
    const holdParam = searchParams.get("hold");
    if (holdParam !== null) {
      const fixedPercent = holdParam ? Math.min(Math.max(parseInt(holdParam, 10) || 50, 0), 100) : 50;
      setProgress(fixedPercent);
      return;
    }

    // Liquid fill progression animation
    const startTime = performance.now();
    const duration = 2200; // 2.2s fill time

    const animateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);

      // Smooth custom ease-in-out curve for fluid, organic liquid physics
      let eased: number;
      if (rawProgress < 0.5) {
        eased = 2 * rawProgress * rawProgress;
      } else {
        eased = -1 + (4 - 2 * rawProgress) * rawProgress;
      }

      const currentPercent = Math.min(Math.round(eased * 100), 100);
      setProgress(currentPercent);

      if (rawProgress < 1) {
        animFrameRef.current = requestAnimationFrame(animateProgress);
      } else {
        setProgress(100);
        setIsCompleted(true);

        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            setShouldRender(false);
          }, 550);
        }, 350);
      }
    };

    animFrameRef.current = requestAnimationFrame(animateProgress);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      aria-hidden={!isVisible}
      className={`fixed inset-0 z-[9999999] flex flex-col items-center justify-center bg-[#070709] text-white select-none transition-all duration-600 ease-out ${
        isVisible ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-[1.03] pointer-events-none"
      }`}
    >
      {/* Background Ambience */}
      <div
        className="absolute w-[420px] h-[420px] rounded-full pointer-events-none transition-opacity duration-700 blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(244,106,30,0.3) 0%, rgba(244,106,30,0.05) 50%, transparent 80%)",
          opacity: 0.35 + (progress / 100) * 0.65,
          transform: `scale(${0.9 + (progress / 100) * 0.3})`,
        }}
      />

      {/* Main Container */}
      <div className="relative flex flex-col items-center justify-center px-6">
        {/* Logo Container */}
        <div className="relative w-[260px] sm:w-[320px] md:w-[380px] aspect-[3034/724]">
          {/* LAYER 1: BASE WHITE LOGO */}
          <img
            src={logo}
            alt="MOCS Logo Base"
            className="absolute inset-0 w-full h-full object-contain brightness-0 invert opacity-80 select-none pointer-events-none drop-shadow-[0_0_16px_rgba(255,255,255,0.22)]"
          />

          {/* LAYER 2: ORANGE LIQUID FILL */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none"
            style={{
              WebkitMaskImage: `url("${logo}")`,
              maskImage: `url("${logo}")`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          >
            {/* Rising Liquid Container */}
            <div
              className="absolute bottom-0 left-0 right-0 w-full transition-[height] ease-linear"
              style={{
                height: `${progress}%`,
              }}
            >
              {/* Wave 1: Primary Orange Liquid Wave */}
              <div className="absolute -top-4 sm:-top-5 left-0 w-full h-6 sm:h-7 overflow-visible pointer-events-none z-10">
                <svg
                  className="absolute left-0 top-0 w-[200%] h-full text-[#F46A1E] mocs-wave-slow drop-shadow-[0_-2px_6px_rgba(255,160,92,0.8)]"
                  viewBox="0 0 1200 80"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 0 30 Q 150 2 300 30 T 600 30 T 900 30 T 1200 30 V 80 H 0 Z"
                    fill="currentColor"
                  />
                  <path
                    d="M 0 30 Q 150 2 300 30 T 600 30 T 900 30 T 1200 30"
                    fill="none"
                    stroke="#FFD1B3"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                </svg>
              </div>

              {/* Wave 2: Secondary Amber Wave */}
              <div className="absolute -top-4 sm:-top-5 left-0 w-full h-6 sm:h-7 overflow-visible pointer-events-none opacity-60">
                <svg
                  className="absolute left-0 top-0 w-[200%] h-full text-[#FF8533] mocs-wave-fast"
                  viewBox="0 0 1200 80"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 0 30 Q 150 58 300 30 T 600 30 T 900 30 T 1200 30 V 80 H 0 Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              {/* Liquid Body Gradient */}
              <div
                className="w-full h-full relative"
                style={{
                  background: "linear-gradient(180deg, #FF782A 0%, #F46A1E 25%, #EA580C 65%, #B83E00 100%)",
                }}
              >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <span className="mocs-bubble" style={{ left: "15%", animationDelay: "0.1s" }} />
                  <span className="mocs-bubble" style={{ left: "32%", animationDelay: "0.7s" }} />
                  <span className="mocs-bubble" style={{ left: "50%", animationDelay: "0.3s" }} />
                  <span className="mocs-bubble" style={{ left: "67%", animationDelay: "1.0s" }} />
                  <span className="mocs-bubble" style={{ left: "82%", animationDelay: "0.5s" }} />
                </div>
              </div>
            </div>
          </div>

          {/* LAYER 3: AUTHENTIC LOGO REVEAL AT 100% COMPLETION */}
          <img
            src={logo}
            alt="MOCS Logo Filled"
            className={`absolute inset-0 w-full h-full object-contain select-none pointer-events-none transition-opacity duration-400 drop-shadow-[0_0_24px_rgba(244,106,30,0.6)] ${
              isCompleted ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* LAYER 4: COMPLETION LIGHT SHEEN SWEEP */}
          {isCompleted && (
            <div
              className="absolute inset-0 w-full h-full pointer-events-none mocs-shimmer-sweep"
              style={{
                WebkitMaskImage: `url("${logo}")`,
                maskImage: `url("${logo}")`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
          )}

          {/* Ambient Brand Glow Flare */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 pointer-events-none drop-shadow-[0_0_28px_rgba(244,106,30,0.65)] ${
              isCompleted ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Progression Indicator & Brand Typography */}
        <div className="mt-8 flex flex-col items-center gap-2.5">
          <div className="relative w-36 sm:w-44 h-1 bg-white/10 rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(244,106,30,0.8)]"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #EA580C 0%, #F46A1E 60%, #FF9955 100%)",
              }}
            />
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono tracking-[0.25em] text-[#F46A1E] font-medium text-[11px]">
              {String(progress).padStart(3, "0")}%
            </span>
            <span className="h-2 w-[1px] bg-white/20" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-medium">
              MOCS Commerce Control
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mocsWaveSlide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes mocsWaveSlideReverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes mocsBubbleRise {
          0% {
            transform: translateY(100%) scale(0.6);
            opacity: 0;
          }
          30% {
            opacity: 0.7;
          }
          80% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-20px) scale(1.1);
            opacity: 0;
          }
        }

        @keyframes mocsShimmer {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .mocs-wave-slow {
          animation: mocsWaveSlide 1.8s linear infinite;
        }

        .mocs-wave-fast {
          animation: mocsWaveSlideReverse 1.3s linear infinite;
        }

        .mocs-bubble {
          position: absolute;
          bottom: -4px;
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.45);
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.6);
          animation: mocsBubbleRise 1.6s ease-in infinite;
        }

        .mocs-shimmer-sweep {
          background: linear-gradient(
            105deg,
            transparent 30%,
            rgba(255, 255, 255, 0.6) 50%,
            transparent 70%
          );
          animation: mocsShimmer 0.75s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
