import { useEffect, useState, useRef, useCallback } from "react";

export function FloatingScrollbar() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);

  const [dimensions, setDimensions] = useState({
    docHeight: 1,
    winHeight: 1,
  });

  const thumbRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafId = useRef<number | null>(null);

  const currentPos = useRef(0);
  const targetPos = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScrollY = useRef(0);

  const trackPadding = 10;

  const updateDimensions = useCallback(() => {
    if (typeof window === "undefined") return;
    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      1
    );
    const winHeight = window.innerHeight || 1;
    setDimensions({ docHeight, winHeight });
  }, []);

  // Butter-Smooth Physics Animation Loop (Lerp Damping)
  useEffect(() => {
    const maxScroll = Math.max(dimensions.docHeight - dimensions.winHeight, 1);
    const availableTrackHeight = Math.max(dimensions.winHeight - trackPadding * 2, 10);
    const rawThumbHeight = (dimensions.winHeight / dimensions.docHeight) * availableTrackHeight;
    const thumbHeight = Math.min(Math.max(rawThumbHeight, 44), availableTrackHeight * 0.4);
    const maxThumbTravel = Math.max(availableTrackHeight - thumbHeight, 1);

    const animate = () => {
      if (!isDraggingRef.current) {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const ratio = Math.min(Math.max(scrollY / maxScroll, 0), 1);
        targetPos.current = trackPadding + ratio * maxThumbTravel;

        // Smooth Lerp (0.22 factor for fluid liquid response)
        currentPos.current += (targetPos.current - currentPos.current) * 0.22;
      }

      if (thumbRef.current) {
        thumbRef.current.style.transform = `translate3d(0, ${currentPos.current}px, 0)`;
        thumbRef.current.style.height = `${thumbHeight}px`;
      }

      const percent = Math.round(
        ((currentPos.current - trackPadding) / maxThumbTravel) * 100
      );
      setScrollPercentage(Math.min(Math.max(percent, 0), 100));

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [dimensions]);

  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1800);
  }, []);

  useEffect(() => {
    updateDimensions();
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateDimensions, { passive: true });

    const observer = new ResizeObserver(updateDimensions);
    if (document.body) {
      observer.observe(document.body);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateDimensions);
      observer.disconnect();
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [updateDimensions, handleScroll]);

  // Don't render if page doesn't have overflow
  if (dimensions.docHeight <= dimensions.winHeight + 15) {
    return null;
  }

  const maxScroll = Math.max(dimensions.docHeight - dimensions.winHeight, 1);
  const availableTrackHeight = Math.max(dimensions.winHeight - trackPadding * 2, 10);
  const rawThumbHeight = (dimensions.winHeight / dimensions.docHeight) * availableTrackHeight;
  const thumbHeight = Math.min(Math.max(rawThumbHeight, 44), availableTrackHeight * 0.4);
  const maxThumbTravel = Math.max(availableTrackHeight - thumbHeight, 1);

  // Mouse Dragging Interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    isDraggingRef.current = true;
    setIsScrolling(true);
    dragStartY.current = e.clientY;
    dragStartScrollY.current = window.scrollY || window.pageYOffset || 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - dragStartY.current;
      const scrollRatioDelta = deltaY / maxThumbTravel;
      const newScrollY = dragStartScrollY.current + scrollRatioDelta * maxScroll;
      const clampedScrollY = Math.min(Math.max(newScrollY, 0), maxScroll);
      
      window.scrollTo({
        top: clampedScrollY,
        behavior: "instant" as any,
      });

      const newPos = trackPadding + (clampedScrollY / maxScroll) * maxThumbTravel;
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
        setIsScrolling(false);
      }, 1800);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleTrackClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    const clickY = e.clientY;
    const targetThumbCenter = clickY - thumbHeight / 2 - trackPadding;
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed right-1 sm:right-1.5 top-0 bottom-0 z-[999999] w-4 sm:w-5 select-none pointer-events-auto transition-all duration-500 ease-out flex justify-center ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1 pointer-events-none"
      }`}
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      {/* Precision Floating Glass Capsule Thumb */}
      <div
        ref={thumbRef}
        onMouseDown={handleMouseDown}
        style={{
          height: `${thumbHeight}px`,
          willChange: "transform",
        }}
        className={`group relative rounded-full cursor-grab active:cursor-grabbing transition-all duration-200 ease-out ${
          isHovered || isDragging
            ? "w-2.5 sm:w-3 shadow-[0_0_16px_rgba(244,106,30,0.65)] ring-2 ring-[#F46A1E]/30"
            : "w-1.5 sm:w-2 shadow-[0_0_10px_rgba(244,106,30,0.4)]"
        }`}
      >
        {/* Multi-Stop Ultra-Vibrant Liquid Orange Gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#ff8c3a] via-[#F46A1E] to-[#cf4d07] transition-all duration-200">
          {/* Subtle Top Glass Reflection */}
          <div className="absolute top-1 inset-x-0.5 h-3 rounded-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
        </div>

        {/* Floating Percentage Indicator Capsule (on hover & drag) */}
        {(isHovered || isDragging) && (
          <div className="absolute right-full mr-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-full bg-stone-950/85 backdrop-blur-md px-2 py-0.5 text-[10px] font-extrabold font-mono text-orange-400 border border-orange-500/30 shadow-xl shadow-black/40 whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-90 duration-150">
            <span>{scrollPercentage}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
