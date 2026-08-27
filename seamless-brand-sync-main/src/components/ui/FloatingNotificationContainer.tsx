import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Check,
  AlertTriangle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  notificationManager,
  type ActiveNotification,
  type NotificationType,
} from "@/lib/notifications";

// Line icon shape mapping (outlined circle with 1px border, distinct icon per state)
const stateIcons: Record<NotificationType, React.ElementType> = {
  success: Check,
  error: X,
  warning: AlertTriangle,
  info: Info,
};

interface ToastItemProps {
  item: ActiveNotification;
  onDismiss: (id: string) => void;
  prefersReducedMotion: boolean;
}

function ToastItem({ item, onDismiss, prefersReducedMotion }: ToastItemProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(item.duration || 4500);
  const [progress, setProgress] = useState(100);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const Icon = stateIcons[item.type] || Info;
  const isPersistent = item.duration === 0;

  // Handle countdown & progress bar with accurate pause/resume
  const startTimer = useCallback((duration: number) => {
    if (isPersistent || duration <= 0) return;

    startTimeRef.current = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, duration - elapsed);
      const pct = (remaining / (item.duration || 4500)) * 100;

      setProgress(pct);

      if (remaining > 0) {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    timerRef.current = setTimeout(() => {
      onDismiss(item.id);
    }, duration);
  }, [isPersistent, item.duration, item.id, onDismiss]);

  const pauseTimer = useCallback(() => {
    if (isPersistent || isPaused) return;
    setIsPaused(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    const elapsed = Date.now() - startTimeRef.current;
    const nextRemaining = Math.max(0, remainingTime - elapsed);
    setRemainingTime(nextRemaining);
  }, [isPersistent, isPaused, remainingTime]);

  const resumeTimer = useCallback(() => {
    if (isPersistent || !isPaused) return;
    setIsPaused(false);
    startTimer(remainingTime);
  }, [isPersistent, isPaused, remainingTime, startTimer]);

  useEffect(() => {
    startTimer(remainingTime);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const primaryText = item.message || item.title || "Notification";

  return (
    <motion.div
      layout={!prefersReducedMotion}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
      drag="x"
      dragConstraints={{ left: 0, right: 300 }}
      dragElastic={{ left: 0.1, right: 0.8 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 70 || info.velocity.x > 400) {
          onDismiss(item.id);
        }
      }}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      onTouchStart={pauseTimer}
      onTouchEnd={resumeTimer}
      role="status"
      aria-live="polite"
      className={cn(
        "group pointer-events-auto relative w-full sm:w-[360px] max-w-[380px] overflow-hidden select-none",
        "rounded-[16px] border border-border/90 dark:border-border",
        "bg-card/95 dark:bg-card/90 backdrop-blur-xl",
        "shadow-md shadow-black/5 dark:shadow-black/20",
        "text-left font-sans transition-colors duration-150"
      )}
    >
      <div className="flex items-center gap-3 p-3.5 sm:p-4">
        {/* Outlined Circle Status Icon (1px border, no solid fill) */}
        <div className="grid h-7 w-7 sm:h-8 sm:w-8 shrink-0 place-items-center rounded-full border border-border bg-transparent text-foreground/80">
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.2]" />
        </div>

        {/* Content (Single primary line + Relative time) */}
        <div className="min-w-0 flex-1 pr-1">
          <p className="text-[13.5px] sm:text-sm font-medium text-foreground leading-snug line-clamp-2">
            {primaryText}
          </p>
          <p className="text-[11.5px] sm:text-[12px] text-muted-foreground font-normal mt-0.5">
            Just now
          </p>

          {/* Action button if present */}
          {item.actionLabel && item.onAction && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                item.onAction?.();
                onDismiss(item.id);
              }}
              className="mt-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              {item.actionLabel}
            </button>
          )}
        </div>

        {/* Close button with min 40x40px tap target */}
        <button
          type="button"
          onClick={() => onDismiss(item.id)}
          aria-label="Dismiss notification"
          className="relative -mr-1 -mt-1 sm:-mr-1.5 sm:-mt-1.5 flex h-10 w-10 min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground active:scale-95 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Auto-Dismiss Progress Bar (2px along bottom inner edge) */}
      {!isPersistent && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-muted/40 overflow-hidden">
          <div
            className="h-full bg-foreground/35 dark:bg-foreground/50 transition-none will-change-transform"
            style={{
              width: `${Math.max(0, Math.min(100, progress))}%`,
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

export function FloatingNotificationContainer() {
  const [notifications, setNotifications] = useState<ActiveNotification[]>([]);
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    return notificationManager.subscribe(setNotifications);
  }, []);

  const handleDismiss = useCallback((id: string) => {
    notificationManager.dismiss(id);
  }, []);

  return (
    <div
      aria-label="Notifications"
      className={cn(
        "fixed z-[99999] pointer-events-none flex flex-col gap-2.5 sm:gap-3",
        // Mobile: Centered at top, full width minus 24px margins, safe area padded
        "top-4 inset-x-3 sm:inset-x-auto pt-[env(safe-area-inset-top,0px)] items-center",
        // Desktop: Positioned top-right with fixed offset
        "sm:top-20 sm:right-6 sm:items-end"
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {notifications.map((item) => (
          <ToastItem
            key={item.id}
            item={item}
            onDismiss={handleDismiss}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
