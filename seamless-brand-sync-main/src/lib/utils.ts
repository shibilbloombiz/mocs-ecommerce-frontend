import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_BASE_URL } from "./api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(url?: any, options: { width?: number; quality?: number } = {}): string {
  if (typeof url !== "string" || !url) return "";
  let normalizedUrl = url.trim().replace(/\\/g, "/");
  const targetWidth = options.width || 700;
  const targetQuality = options.quality || 75;

  if (normalizedUrl.startsWith("http://") || normalizedUrl.startsWith("https://") || normalizedUrl.startsWith("data:")) {
    if (normalizedUrl.includes("images.unsplash.com")) {
      try {
        const u = new URL(normalizedUrl);
        u.searchParams.set("auto", "format");
        u.searchParams.set("fit", "crop");
        u.searchParams.set("w", String(targetWidth));
        u.searchParams.set("q", String(targetQuality));
        normalizedUrl = u.toString();
      } catch (e) {}
    } else if (normalizedUrl.includes("res.cloudinary.com") && normalizedUrl.includes("/image/upload/")) {
      const uploadMarker = "/image/upload/";
      const uploadIdx = normalizedUrl.indexOf(uploadMarker);
      if (uploadIdx !== -1) {
        const prefix = normalizedUrl.substring(0, uploadIdx + uploadMarker.length);
        let rest = normalizedUrl.substring(uploadIdx + uploadMarker.length);

        // Transformation segments always contain key_value pairs like w_700, q_auto, f_auto, c_limit
        // (they contain underscores). Version numbers (v1234567890/) and folders (mocs/uploads/) do not.
        const transformSegmentRegex = /^([a-z]{1,4}_[a-zA-Z0-9_.:-]+(?:,[a-z]{1,4}_[a-zA-Z0-9_.:-]+)*\/)/i;
        if (transformSegmentRegex.test(rest)) {
          rest = rest.replace(transformSegmentRegex, "");
        }

        const transformParams = `f_auto,q_${targetQuality},w_${targetWidth},c_limit`;
        normalizedUrl = `${prefix}${transformParams}/${rest}`;
      }
    }
    return normalizedUrl;
  }

  const cleanBase = API_BASE_URL.replace(/\/+$/, "");
  let cleanUrl = normalizedUrl.replace(/^\/+/, "");
  if (cleanUrl.startsWith("src/uploads/")) {
    cleanUrl = cleanUrl.slice(4);
  }
  return `${cleanBase}/${cleanUrl}`;
}

export function formatDate(dateInput: any): string {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateTime(dateInput: any): string {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = String(hours).padStart(2, "0");
  
  return `${day}/${month}/${year}, ${hoursStr}:${minutes}:${seconds} ${ampm}`;
}
