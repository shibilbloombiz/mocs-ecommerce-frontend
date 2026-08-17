import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  notificationManager,
  type ActiveNotification,
  type NotificationType,
} from "@/lib/notifications";

const variantConfig: Record<
  NotificationType,
  {
    icon: React.ElementType;
    accentBar: string;
    iconBg: string;
    iconColor: string;
    progressBar: string;
  }
> = {
  error: {
    icon: AlertCircle,
    accentBar: "bg-[#EF4444]",
    iconBg: "bg-red-50/90 border border-red-100/90 text-[#EF4444]",
    iconColor: "text-[#EF4444]",
    progressBar: "bg-[#EF4444]",
  },
  success: {
    icon: CheckCircle2,
    accentBar: "bg-[#10B981]",
    iconBg: "bg-emerald-50/90 border border-emerald-100/90 text-[#10B981]",
    iconColor: "text-[#10B981]",
    progressBar: "bg-[#10B981]",
  },
  warning: {
    icon: AlertTriangle,
    accentBar: "bg-[#F59E0B]",
    iconBg: "bg-amber-50/90 border border-amber-100/90 text-[#F59E0B]",
    iconColor: "text-[#F59E0B]",
    progressBar: "bg-[#F59E0B]",
  },
  info: {
    icon: Info,
    accentBar: "bg-[#3B82F6]",
    iconBg: "bg-blue-50/90 border border-blue-100/90 text-[#3B82F6]",
    iconColor: "text-[#3B82F6]",
    progressBar: "bg-[#3B82F6]",
  },
};

function NotificationCardItem({ item }: { item: ActiveNotification }) {
  const config = variantConfig[item.type] || variantConfig.info;
  const IconComponent = config.icon;

  return (
    <div
      className="pointer-events-auto relative w-full sm:w-[360px] max-w-[calc(100vw-32px)] overflow-hidden rounded-2xl border border-stone-200/90 bg-white/95 backdrop-blur-xl p-5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12),0_4px_16px_-2px_rgba(0,0,0,0.04)] text-left font-sans"
      role="alert"
      aria-live="assertive"
    >
      {/* Left Colored Accent Bar */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-[4.5px]", config.accentBar)} />

      {/* Top-Right Close Button */}
      <button
        type="button"
        onClick={() => notificationManager.dismiss(item.id)}
        aria-label="Close notification"
        className="absolute right-3.5 top-3.5 grid h-7 w-7 place-items-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition duration-200 cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Top Status Icon / Dot */}
      <div className="mb-3 pl-1">
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-full shadow-2xs", config.iconBg)}>
          <IconComponent className={cn("h-4.5 w-4.5", config.iconColor)} />
        </div>
      </div>

      {/* Content */}
      <div className="pl-1 pr-6">
        {/* Title */}
        <h4 className="font-semibold text-[15px] leading-tight text-stone-900">
          {item.title}
        </h4>

        {/* Description / Message */}
        <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600">
          {item.message}
        </p>
      </div>

      {/* Ultra-Smooth Hardware-Accelerated Progress Bar */}
      {item.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-stone-100/90 overflow-hidden">
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{
              duration: item.duration / 1000,
              ease: "linear",
            }}
            style={{ transformOrigin: "left center" }}
            className={cn("h-full w-full will-change-transform", config.progressBar)}
          />
        </div>
      )}
    </div>
  );
}

export function FloatingNotificationContainer() {
  const [notifications, setNotifications] = useState<ActiveNotification[]>([]);

  useEffect(() => {
    return notificationManager.subscribe(setNotifications);
  }, []);

  return (
    <div
      aria-label="Notifications"
      className="fixed z-[99999] pointer-events-none flex flex-col gap-3.5 top-4 left-4 right-4 sm:top-[70px] sm:left-auto sm:right-4 lg:top-[80px] lg:right-6"
    >
      {notifications.map((item) => (
        <NotificationCardItem key={item.id} item={item} />
      ))}
    </div>
  );
}
