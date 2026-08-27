import { toast as sonnerToast } from "sonner";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationOptions {
  id?: string;
  type?: NotificationType;
  title?: string;
  message?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number; // duration in ms, 0 means persistent
}

export interface ActiveNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration: number;
  createdAt: number;
}

type NotificationListener = (notifications: ActiveNotification[]) => void;

class NotificationManager {
  private notifications: ActiveNotification[] = [];
  private listeners: Set<NotificationListener> = new Set();
  private timers: Map<string, any> = new Map();

  private notifyListeners() {
    const copy = [...this.notifications];
    this.listeners.forEach((listener) => listener(copy));
  }

  public subscribe(listener: NotificationListener) {
    this.listeners.add(listener);
    listener([...this.notifications]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public show(options: NotificationOptions | string, type: NotificationType = "info"): string {
    const raw: NotificationOptions =
      typeof options === "string" ? { message: options, type } : options;

    const notifType: NotificationType = raw.type || type || "info";
    const id = raw.id || `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const primaryText = raw.message || raw.description || raw.title || "";
    let title = raw.title;
    let message = primaryText;
    let actionLabel = raw.actionLabel;
    let onAction = raw.onAction;
    let duration = typeof raw.duration === "number" ? raw.duration : 4500;

    // Default action for checkout missing information if not specified
    if (!onAction && actionLabel === "Review details") {
      onAction = () => {
        const el =
          document.getElementById("shipping-section") ||
          document.querySelector("input[name='first']") ||
          document.querySelector("input[name='firstName']") ||
          document.querySelector("form");
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      };
    }

    // If it's an error with an action, keep it persistent (duration 0) unless specified
    if (notifType === "error" && actionLabel && raw.duration === undefined) {
      duration = 0; // Persistent until user acts or closes
    }

    // Clear existing timer if replacing an existing notification with same id
    if (this.timers.has(id)) {
      clearTimeout(this.timers.get(id));
      this.timers.delete(id);
    }

    const item: ActiveNotification = {
      id,
      type: notifType,
      title,
      message,
      actionLabel,
      onAction,
      duration,
      createdAt: Date.now(),
    };

    // Keep max 3 notifications visible simultaneously
    this.notifications = [item, ...this.notifications.filter((n) => n.id !== id)].slice(0, 3);
    this.notifyListeners();

    // Setup auto dismiss timer if duration > 0
    if (duration > 0) {
      const timer = setTimeout(() => {
        this.dismiss(id);
      }, duration);
      this.timers.set(id, timer);
    }

    return id;
  }

  public dismiss(id: string) {
    if (this.timers.has(id)) {
      clearTimeout(this.timers.get(id));
      this.timers.delete(id);
    }
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notifyListeners();
  }

  public clearAll() {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.notifications = [];
    this.notifyListeners();
  }
}

export const notificationManager = new NotificationManager();

export function showNotification(options: NotificationOptions | string): string {
  return notificationManager.show(options);
}

export const notify = {
  success: (message: string, options?: Omit<NotificationOptions, "message" | "type">) =>
    notificationManager.show({ ...options, message, type: "success" }),
  error: (message: string, options?: Omit<NotificationOptions, "message" | "type">) =>
    notificationManager.show({ ...options, message, type: "error" }),
  warning: (message: string, options?: Omit<NotificationOptions, "message" | "type">) =>
    notificationManager.show({ ...options, message, type: "warning" }),
  info: (message: string, options?: Omit<NotificationOptions, "message" | "type">) =>
    notificationManager.show({ ...options, message, type: "info" }),
  dismiss: (id: string) => notificationManager.dismiss(id),
  clear: () => notificationManager.clearAll(),
};

// Seamless global patch for Sonner toast calls across the application
if (typeof window !== "undefined") {
  try {
    sonnerToast.error = ((message: any, data?: any) => {
      const text = typeof message === "string" ? message : data?.description || String(message);
      return showNotification({
        type: "error",
        title: data?.title,
        message: text,
        actionLabel: data?.action?.label || data?.actionLabel,
        onAction: data?.action?.onClick || data?.onAction,
        duration: data?.duration,
      });
    }) as any;

    sonnerToast.success = ((message: any, data?: any) => {
      const text = typeof message === "string" ? message : data?.description || String(message);
      return showNotification({
        type: "success",
        title: data?.title,
        message: text,
        actionLabel: data?.action?.label || data?.actionLabel,
        onAction: data?.action?.onClick || data?.onAction,
        duration: data?.duration,
      });
    }) as any;

    sonnerToast.warning = ((message: any, data?: any) => {
      const text = typeof message === "string" ? message : data?.description || String(message);
      return showNotification({
        type: "warning",
        title: data?.title,
        message: text,
        actionLabel: data?.action?.label || data?.actionLabel,
        onAction: data?.action?.onClick || data?.onAction,
        duration: data?.duration,
      });
    }) as any;

    sonnerToast.info = ((message: any, data?: any) => {
      const text = typeof message === "string" ? message : data?.description || String(message);
      return showNotification({
        type: "info",
        title: data?.title,
        message: text,
        actionLabel: data?.action?.label || data?.actionLabel,
        onAction: data?.action?.onClick || data?.onAction,
        duration: data?.duration,
      });
    }) as any;
  } catch (e) {
    console.warn("Could not patch sonner toast", e);
  }
}
