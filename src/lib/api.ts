// Thin API client for the external MERN backend (see ./mern-reference).
// Set VITE_API_BASE_URL in your env (defaults to http://localhost:5000).
// Works both in Vite client (import.meta.env) and Nitro SSR (process.env).
export const API_BASE_URL: string =
  (typeof process !== "undefined" && (process.env as any)?.VITE_API_BASE_URL) ||
  (import.meta as any)?.env?.VITE_API_BASE_URL ||
  "http://localhost:5000";

const TOKEN_KEY = "mocs_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

/**
 * Cleans developer-facing error messages and transforms them into friendly user text.
 */
export function formatUserError(err: unknown, fallback = "Something went wrong. Please try again."): string {
  if (!err) return fallback;
  const raw = typeof err === "string" ? err : (err as any)?.message || String(err);

  // Strip API status prefixes like "API 404: " or "Error: "
  let cleaned = raw.replace(/^API\s*\d+:\s*/i, "").replace(/^Error:\s*/i, "").trim();

  // Try to parse JSON if message is stringified JSON
  if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
    try {
      const parsed = JSON.parse(cleaned);
      if (parsed?.message) cleaned = parsed.message;
      else if (parsed?.error) cleaned = parsed.error;
    } catch {
      // Ignore JSON parse error
    }
  }

  const lower = cleaned.toLowerCase();

  // Network / Connection errors
  if (lower.includes("failed to fetch") || lower.includes("networkerror") || lower.includes("econnrefused")) {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  // Not found / 404 errors
  if (lower.includes("not found") || lower.includes("404") || lower.includes("cannot get") || lower.includes("route")) {
    return "The requested information could not be found.";
  }

  // Auth / Permission errors
  if (lower.includes("jwt") || lower.includes("token") || lower.includes("unauthorized") || lower.includes("401") || lower.includes("not authorized")) {
    return "Please sign in to continue.";
  }
  if (lower.includes("forbidden") || lower.includes("permission") || lower.includes("403")) {
    return "You do not have permission to perform this action.";
  }

  // Duplicate / Conflict errors
  if (lower.includes("e11000") || lower.includes("duplicate key") || lower.includes("already exists")) {
    return "You have already submitted this entry.";
  }

  // Technical database / server jargon
  if (
    lower.includes("cast to objectid") ||
    lower.includes("internal server error") ||
    lower.includes("syntaxerror") ||
    lower.includes("typeerror") ||
    lower.includes("cannot read properties") ||
    lower.includes("500") ||
    lower.includes("502") ||
    lower.includes("503")
  ) {
    return "Something went wrong on our end. Please try again shortly.";
  }

  return cleaned || fallback;
}

type CacheEntry = {
  data: any;
  timestamp: number;
};

// In-memory cache for fast GET responses across SSR and client navigation
const apiCache = new Map<string, CacheEntry>();
const DEFAULT_CACHE_TTL_MS = 60_000; // 60 seconds fresh TTL
const DEFAULT_TIMEOUT_MS = 2500; // 2.5s max to guarantee sub-3s response

export function invalidateApiCache(prefix?: string) {
  if (!prefix) {
    apiCache.clear();
    return;
  }
  for (const key of apiCache.keys()) {
    if (key.includes(prefix)) {
      apiCache.delete(key);
    }
  }
}

export interface ApiOptions extends RequestInit {
  timeoutMs?: number;
  skipCache?: boolean;
}

export async function api<T = unknown>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const method = (options.method || "GET").toUpperCase();
  const isGet = method === "GET";
  const token = getToken();
  const cacheKey = `${method}:${path}:${token ? "auth" : "anon"}`;
  const now = Date.now();

  // Invalidate cache on mutations
  if (!isGet) {
    if (path.includes("/products")) invalidateApiCache("/api/products");
    if (path.includes("/settings")) invalidateApiCache("/api/settings");
    if (path.includes("/categories")) invalidateApiCache("/api/categories");
    if (path.includes("/collections")) invalidateApiCache("/api/collections");
    if (path.includes("/reviews")) invalidateApiCache("/api/reviews");
  }

  // Check cache for GET requests
  const cached = isGet && !options.skipCache ? apiCache.get(cacheKey) : undefined;
  if (cached && (now - cached.timestamp < DEFAULT_CACHE_TTL_MS)) {
    return cached.data as T;
  }

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  // Setup strict timeout (default 2.5s) to guarantee sub-3s loading time
  const timeoutMs = options.timeoutMs ?? (isGet ? DEFAULT_TIMEOUT_MS : 8000);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  if (options.signal) {
    options.signal.addEventListener("abort", () => controller.abort());
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    // If request timed out or network failed but we have stale cache, return it immediately
    if (cached) {
      console.warn(`[API] Returning stale cache for ${path} due to network/timeout error`);
      return cached.data as T;
    }
    if (err?.name === "AbortError" || controller.signal.aborted) {
      throw new Error("Request timed out. Please check your connection.");
    }
    throw new Error("Unable to connect to the server. Please check your internet connection.");
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    let errorText = "";
    try {
      const json = await res.json();
      errorText = json?.message || json?.error || "";
    } catch {
      errorText = await res.text().catch(() => "");
    }
    
    // If backend returns 5xx but we have stale cache, gracefully fall back
    if (res.status >= 500 && cached) {
      return cached.data as T;
    }

    if (res.status === 404) {
      throw new Error(errorText && !errorText.includes("/api/") ? errorText : "The requested item or page could not be found.");
    }
    if (res.status === 401) {
      throw new Error("Please sign in to continue.");
    }
    if (res.status === 403) {
      throw new Error("You do not have permission to perform this action.");
    }
    if (res.status >= 500) {
      throw new Error("Our servers encountered an issue. Please try again shortly.");
    }

    const friendly = formatUserError(errorText || res.statusText);
    throw new Error(friendly);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const data = (await res.json()) as T;

  // Cache successful GET results
  if (isGet) {
    apiCache.set(cacheKey, { data, timestamp: Date.now() });
  }

  return data;
}

// Endpoints mirror mern-reference/routes/*.js — wire to your Express server.
export const apiClient = {
  auth: {
    login: (email: string, password: string) =>
      api<{ token: string; user: any }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      }),
    register: (data: { name: string; email: string; password: string }) =>
      api<{ token: string; user: any }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ ...data, email: data.email.trim() }),
      }),

    clerkSync: (data: { email: string; name?: string; clerkId: string; avatar?: string; mode?: "login" | "signup" }) =>
      api<{ token: string; user: any }>("/api/auth/clerk-sync", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    googleAuth: (idToken: string, mode?: "login" | "signup") =>
      api<{ token: string; user: any }>("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken, mode }),
      }),
    me: () => api<{ user: any }>("/api/auth/me"),
  },
  users: {
    getProfile: () => api<{ id: string; name: string; email: string; phone: string; address: string; role: string; createdAt: string; jobTitle?: string }>("/api/users/profile"),
    updateProfile: (data: { name: string; phone: string; address: string; jobTitle?: string }) =>
      api<any>("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    changePassword: (data: any) =>
      api<any>("/api/users/change-password", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    getRefundAccount: () => api<any>("/api/users/refund-account"),
    updateRefundAccount: (data: any) =>
      api<any>("/api/users/refund-account", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    list: (q = "") => api<any>(`/api/users${q ? `?${q}` : ""}`),

    create: (data: any) =>
      api("/api/users", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      api(`/api/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) => api(`/api/users/${id}`, { method: "DELETE" }),
    restore: (id: string) => api(`/api/users/${id}/restore`, { method: "POST" }),
  },
  products: {
    list: (q = "") => api<any>(`/api/products${q ? `?${q}` : ""}`),
    get: (id: string, q = "") => api<any>(`/api/products/${id}${q ? `?${q}` : ""}`),
    syncReviewCounts: () => api<any>("/api/products/sync-review-counts", { method: "POST" }),
    create: (data: any) =>
      api("/api/products", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      api<any>(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) => api<any>(`/api/products/${id}`, { method: "DELETE" }),
    restore: (id: string) => api<any>(`/api/products/${id}/restore`, { method: "POST" }),
  },
  cart: {
    get: () => api<any>("/api/cart"),
    add: (body: unknown) =>
      api<any>("/api/cart", { method: "POST", body: JSON.stringify(body) }),
    remove: (id: string) => api<any>(`/api/cart/${id}`, { method: "DELETE" }),
  },
  wishlist: {
    get: () => api<any>("/api/wishlist"),
    toggle: (productId: string) =>
      api<any>("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId }),
      }),
  },
  orders: {
    list: () => api<any[]>("/api/orders"),
    listAll: (q = "") => api<any[]>(`/api/orders/all${q ? `?${q}` : ""}`),
    create: (body: unknown) =>
      api<any>("/api/orders", { method: "POST", body: JSON.stringify(body) }),
    updateStatus: (id: string, status: string, note?: string) =>
      api<any>(`/api/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, note }),
      }),
    updatePaymentStatus: (id: string, paymentStatus: string) =>
      api<any>(`/api/orders/${id}/payment-status`, {
        method: "PATCH",
        body: JSON.stringify({ paymentStatus }),
      }),
    delete: (id: string) => api<any>(`/api/orders/${id}`, { method: "DELETE" }),
    restore: (id: string) => api<any>(`/api/orders/${id}/restore`, { method: "POST" }),
    cancel: (id: string, reason: string) =>
      api<any>(`/api/orders/${id}/cancel`, {
        method: "PATCH",
        body: JSON.stringify({ reason }),
      }),
    returnOrder: (
      id: string,
      data: {
        reason: string;
        refundMethod?: "bank" | "upi" | "original";
        bankDetails?: {
          accountHolderName: string;
          accountNumber: string;
          ifscCode: string;
          bankName?: string;
        };
        upiDetails?: {
          upiId: string;
        };
        saveAccount?: boolean;
      } | string
    ) =>
      api<any>(`/api/orders/${id}/return`, {
        method: "PUT",
        body: JSON.stringify(typeof data === "string" ? { reason: data } : data),
      }),
    processRefund: (
      id: string,
      data: {
        transactionId?: string;
        utr?: string;
        refundAmount?: number;
        refundMethod?: string;
        adminNotes?: string;
      }
    ) =>
      api<any>(`/api/orders/${id}/refund`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  queries: {
    create: (data: { name: string; email: string; subject: string; message: string }) =>
      api<any>("/api/queries", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    list: (q = "") => api<any>(`/api/queries${q ? `?${q}` : ""}`),
    update: (id: string, data: { status?: string; adminNotes?: string }) =>
      api<any>(`/api/queries/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) => api<any>(`/api/queries/${id}`, { method: "DELETE" }),
    restore: (id: string) => api<any>(`/api/queries/${id}/restore`, { method: "POST" }),
  },
  categories: {
    list: () => api<any[]>("/api/categories"),
    create: (data: any) =>
      api<any>("/api/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  collections: {
    list: () => api<any[]>("/api/collections"),
    create: (data: any) =>
      api<any>("/api/collections", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    delete: (id: string) => api<any>(`/api/collections/${id}`, { method: "DELETE" }),
  },
  payments: {
    createOrder: (shippingAddress: any, items?: any[]) =>
      api<{ key: string; amount: number; currency: string; orderId: string; internalOrderId: string; user: any }>("/api/payments/create-order", {
        method: "POST",
        body: JSON.stringify({ shippingAddress, items }),
      }),
    verify: (body: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      internalOrderId: string;
    }) =>
      api<any>("/api/payments/verify", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    list: (q = "") => api<any>(`/api/payments${q ? `?${q}` : ""}`),
    getStats: () => api<any>("/api/payments/stats"),
    cancel: (orderId: string) =>
      api<any>(`/api/payments/${orderId}/cancel`, {
        method: "POST",
      }),
  },
  reviews: {
    list: async (productId: string): Promise<any[]> => {
      if (!productId) return [];
      try {
        const result = await api<any[]>(`/api/reviews/${productId}`);
        return Array.isArray(result) ? result : [];
      } catch {
        return [];
      }
    },
    create: (data: { productId: any; rating: number; text: string; color?: string; size?: number }) => {
      const cleanProductId = typeof data.productId === "object" ? (data.productId?._id || data.productId?.id) : data.productId;
      return api<any>("/api/reviews", {
        method: "POST",
        body: JSON.stringify({
          productId: cleanProductId,
          product: cleanProductId,
          rating: data.rating,
          text: data.text,
          color: data.color,
          size: data.size,
        }),
      });
    },
    update: (id: string, data: { rating?: number; text?: string }) =>
      api<any>(`/api/reviews/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) => api<any>(`/api/reviews/${id}`, { method: "DELETE" }),
  },
  settings: {
    get: (key: string) => api<{ key: string; value: any }>(`/api/settings/${key}`),
    update: (key: string, value: any) =>
      api<any>(`/api/settings/${key}`, {
        method: "PUT",
        body: JSON.stringify({ value }),
      }),
  },
};


