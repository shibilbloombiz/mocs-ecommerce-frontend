import { useEffect, useState, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

export function NavigationProgressBar() {
  const isLoading = useRouterState({
    select: (s) => s.status === "pending" || s.isLoading,
  });

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startProgress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    setVisible(true);
    setProgress(15);

    // Increment smoothly while loading
    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          if (progressTimerRef.current) clearInterval(progressTimerRef.current);
          return 85;
        }
        return prev + Math.random() * 18 + 8;
      });
    }, 120);
  };

  const completeProgress = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    setProgress(100);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      timerRef.current = setTimeout(() => {
        setProgress(0);
      }, 200);
    }, 160);
  };

  useEffect(() => {
    if (isLoading) {
      startProgress();
    } else {
      completeProgress();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isLoading]);

  // Also listen for link/button clicks to give instant 0ms tactile reaction
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a, button, [role='button']");
      if (!target) return;

      const isLink = target.tagName === "A" && (target as HTMLAnchorElement).href;
      const isInternal =
        isLink &&
        (target as HTMLAnchorElement).href.startsWith(window.location.origin) &&
        !(target as HTMLAnchorElement).target;

      if (isInternal) {
        startProgress();
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 inset-x-0 z-[99999999] pointer-events-none h-[2.5px] bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-orange-600 via-[#F46A1E] to-amber-400 shadow-[0_0_12px_rgba(244,106,30,0.8),0_0_4px_rgba(244,106,30,0.9)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          transition: progress === 100 ? "width 120ms ease-out, opacity 250ms ease 120ms" : "width 200ms ease-out",
        }}
      >
        {/* Glow head */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-2.5 rounded-full bg-amber-300 blur-[3px] opacity-90" />
      </div>
    </div>
  );
}
