import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Truck, RotateCcw, ShieldCheck, Sparkles, Tag, Gift, Star, Zap, Bell } from "lucide-react";
import { apiClient } from "@/lib/api";

export const DEFAULT_ANNOUNCEMENT_MESSAGES = [
  { id: 1, text: "Free shipping above ₹500" },
  { id: 2, text: "Flat 15% OFF on first order • Use code: MOCS15" },
  { id: 3, text: "3-day easy returns & exchange guarantee" },
  { id: 4, text: "100% Authentic Handcrafted Comfort Footwear" },
];

// Cycle through icons so each message gets a unique visual
const ICONS = [Truck, Sparkles, RotateCcw, ShieldCheck, Tag, Gift, Star, Zap, Bell];

export function AnnouncementBar() {
  const [messages, setMessages] = useState(DEFAULT_ANNOUNCEMENT_MESSAGES);
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch announcement messages from admin settings
  useEffect(() => {
    apiClient.settings
      .get("announcement_bar")
      .then((res) => {
        if (res?.value && Array.isArray(res.value) && res.value.length > 0) {
          setMessages(
            res.value.map((item: any, i: number) => ({
              id: i + 1,
              text: typeof item === "string" ? item : item.text || "",
            }))
          );
        }
      })
      .catch(() => {
        // Silently fall back to hardcoded defaults
      });
  }, []);

  useEffect(() => {
    if (isHovered || messages.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, messages.length]);

  const current = messages[index] ?? messages[0];
  const Icon = ICONS[index % ICONS.length];

  if (!current) return null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative z-50 w-full bg-[#18181b] border-b border-white/10 text-white/95 text-[11px] sm:text-xs font-medium tracking-wide select-none overflow-hidden h-8 sm:h-9 flex items-center justify-center shadow-xs"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 7 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -7 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex items-center justify-center gap-2 px-4 py-1 text-center"
        >
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#d97736] shrink-0 stroke-[2]" />
          <span className="truncate">{current.text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
