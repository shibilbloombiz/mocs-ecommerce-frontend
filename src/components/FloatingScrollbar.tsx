import { useEffect, useState, useRef, useCallback } from "react";

export function FloatingScrollbar() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const dimensionsRef = useRef({
    docHeight: 1,
    winHeight: 1,
    maxScroll: 1,
    maxThumbTravel: 1,
    thumbHeight: 44,
  });

  const [hasOverflow, setHasOverflow] = useState(true);

  const thumbRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const percentSpanRef = useRef<HTMLSpanElement | null>(null);

  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafId = useRef<number | null>(null);

  const currentPos = useRef(0);
  const targetPos = useRef(0);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isScrollingRef = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScrollY = useRef(0);

  const updateDimensions = useCallback(() => {
    if (typeof window === "undefined") return;
    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      1
    );
    const winHeight = window.innerHeight || 1;
    const maxScroll = Math.max(docHeight - winHeight, 1);
    const availableTrackHeight = Math.max(winHeight, 10);
    const rawThumbHeight = (winHeight / docHeight) * availableTrackHeight;
    const thumbHeight = Math.min(Math.max(rawThumbHeight, 44), availableTrackHeight * 0.4);
    const maxThumbTravel = Math.max(availableTrackHeight - thumbHeight, 1);

    dimensionsRef.current = {
      docHeight,
      winHeight,
      maxScroll,
      maxThumbTravel,
      thumbHeight,
    };

    const overflow = docHeight > winHeight + 15;
    setHasOverflow((prev) => (prev !== overflow ? overflow : prev));
  }, []);

  const startAnimation = useCallback(() => {
    if (rafId.current) return;

    const animate = () => {
      const { maxScroll, maxThumbTravel, thumbHeight } = dimensionsRef.current;

      if (!isDraggingRef.current) {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const ratio = Math.min(Math.max(scrollY / maxScroll, 0), 1);
        targetPos.current = ratio * maxThumbTravel;

        // Smooth Lerp (0.22 factor for fluid liquid response)
        currentPos.current += (targetPos.current - currentPos.current) * 0.22;
      }

      if (thumbRef.current) {
        thumbRef.current.style.transform = `translate3d(0, ${currentPos.current}px, 0)`;
        thumbRef.current.style.height = `${thumbHeight}px`;
      }

      if (percentSpanRef.current && (isHoveredRef.current || isDraggingRef.current)) {
        const percent = Math.min(Math.max(Math.round((currentPos.current / maxThumbTravel) * 100), 0), 100);
        percentSpanRef.current.textContent = `${percent}%`;
      }

      const diff = Math.abs(targetPos.current - currentPos.current);
      // If user stopped scrolling and dragging and position has settled, halt loop
      if (!isDraggingRef.current && !isScrollingRef.current && diff < 0.2) {
        rafId.current = null;
        return;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
  }, []);

  const handleScroll = useCallback(() => {
    if (!isScrollingRef.current) {
      isScrollingRef.current = true;
      setIsScrolling(true);
    }
    startAnimation();

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      setIsScrolling(false);
    }, 1800);
  }, [startAnimation]);

  useEffect(() => {
    updateDimensions();
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateDimensions, { passive: true });

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const observer = new ResizeObserver(() => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateDimensions, 100);
    });

    if (document.body) {
      observer.observe(document.body);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateDimensions);
      observer.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [updateDimensions, handleScroll]);

  // Don't render if page doesn't have overflow
  if (!hasOverflow) {
    return null;
  }

  // Mouse Dragging Interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    isDraggingRef.current = true;
    setIsScrolling(true);
    isScrollingRef.current = true;
    startAnimation();

    dragStartY.current = e.clientY;
    dragStartScrollY.current = window.scrollY || window.pageYOffset || 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const { maxScroll, maxThumbTravel } = dimensionsRef.current;
      const deltaY = moveEvent.clientY - dragStartY.current;
      const scrollRatioDelta = deltaY / maxThumbTravel;
      const newScrollY = dragStartScrollY.current + scrollRatioDelta * maxScroll;
      const clampedScrollY = Math.min(Math.max(newScrollY, 0), maxScroll);

      window.scrollTo({
        top: clampedScrollY,
        behavior: "instant" as any,
      });

      const newPos = (clampedScrollY / maxScroll) * maxThumbTravel;
      currentPos.current = newPos;
      targetPos.current = newPos;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      isDraggingRef.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        setIsScrolling(false);
      }, 1800);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    const { maxScroll, maxThumbTravel, thumbHeight } = dimensionsRef.current;
    const clickY = e.clientY;
    const targetThumbCenter = clickY - thumbHeight / 2;
    const newRatio = Math.min(Math.max(targetThumbCenter / maxThumbTravel, 0), 1);
    window.scrollTo({
      top: newRatio * maxScroll,
      behavior: "smooth",
    });
  };

  const isVisible = isScrolling || isDragging || isHovered;

  return (
    <div
      ref={trackRef}
      onClick={handleTrackClick}
      onMouseEnter={() => {
        isHoveredRef.current = true;
        setIsHovered(true);
        startAnimation();
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        setIsHovered(false);
      }}
      className={`fixed right-0 top-0 bottom-0 z-[999999] w-3 sm:w-3.5 select-none pointer-events-auto transition-all duration-500 ease-out flex justify-end ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1 pointer-events-none"
      }`}
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      {/* Precision Floating Glass Capsule Thumb - Flush to right edge, no end gaps */}
      <div
        ref={thumbRef}
        onMouseDown={handleMouseDown}
        style={{
          height: `${dimensionsRef.current.thumbHeight}px`,
          willChange: "transform",
        }}
        className={`group relative rounded-l-full cursor-grab active:cursor-grabbing transition-all duration-200 ease-out ${
          isHovered || isDragging
            ? "w-2.5 sm:w-3 shadow-[0_0_16px_rgba(244,106,30,0.65)] ring-1 ring-[#F46A1E]/30"
            : "w-1.5 sm:w-2 shadow-[0_0_10px_rgba(244,106,30,0.4)]"
        }`}
      >
        {/* Multi-Stop Ultra-Vibrant Liquid Orange Gradient */}
        <div className="absolute inset-0 rounded-l-full bg-gradient-to-b from-[#ff8c3a] via-[#F46A1E] to-[#cf4d07] transition-all duration-200">
          {/* Subtle Top Glass Reflection */}
          <div className="absolute top-1 inset-x-0.5 h-3 rounded-l-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
        </div>

        {/* Floating Percentage Indicator Capsule (on hover & drag) */}
        {(isHovered || isDragging) && (
          <div className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-full bg-stone-950/85 backdrop-blur-md px-2 py-0.5 text-[10px] font-extrabold font-mono text-orange-400 border border-orange-500/30 shadow-xl shadow-black/40 whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-90 duration-150">
            <span ref={percentSpanRef}>0%</span>
          </div>
        )}
      </div>
    </div>
  );
}
