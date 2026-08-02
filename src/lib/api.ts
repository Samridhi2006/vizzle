import { getToken } from "./auth";

const BASE_URL = "/api";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.body && !(options.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    const err = new Error(body.error ?? "Request failed") as Error & {
      status: number;
      body: unknown;
    };
    err.status = res.status;
    err.body = body;
    throw err;
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const auth = {
  register: (data: { name: string; email: string; password: string }) =>
    request<{ token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── Stores ────────────────────────────────────────────────────────────────────

export const stores = {
  list: () =>
    request<{ stores: import("@/types").Store[] }>("/stores"),

  create: (data: { store_name: string; domain: string }) =>
    request<{ store_id: string; api_key: string }>("/stores", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── API Keys ──────────────────────────────────────────────────────────────────

export const apiKeys = {
  rotate: (store_id: string) =>
    request<{ new_api_key: string }>("/api-keys/rotate", {
      method: "POST",
      body: JSON.stringify({ store_id }),
    }),
};

// ── Products ──────────────────────────────────────────────────────────────────

export const products = {
  list: (store_id: string) =>
    request<{ products: import("@/types").Product[] }>(
      `/products?store_id=${store_id}`
    ),

  createUrl: (data: {
    store_id: string;
    product_id: string;
    name: string;
    brand: string;
    cost: number;
    image_url: string;
    category?: string;
    size_chart_url?: string;
  }) =>
    request<{ vizzle_product_id: string; image_url: string }>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createFile: (formData: FormData) =>
    request<{ vizzle_product_id: string; image_url: string }>("/products", {
      method: "POST",
      body: formData,
    }),

  bulk: (data: {
    store_id: string;
    products: {
      id: string;
      name: string;
      brand: string;
      cost: number;
      image_url: string;
    }[];
  }) =>
    request<{ imported: number; errors: unknown[] }>("/products/bulk", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── Analytics ─────────────────────────────────────────────────────────────────

export const analytics = {
  get: (store_id: string, from?: string, to?: string) => {
    const params = new URLSearchParams({ store_id });
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    return request<import("@/types").AnalyticsData>(
      `/analytics?${params.toString()}`
    );
  },
};

// ── Credits ───────────────────────────────────────────────────────────────────

export interface CreditTransaction {
  id: string;
  storeId: string;
  type: string;
  amount: number;
  description: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  createdAt: string;
}

export interface StoreTierInfo {
  tier: string;
  requestsPerHour: number;
  requestsPerDay: number;
}

export interface CreditsData {
  balance: number;
  transactions: CreditTransaction[];
  tier: StoreTierInfo;
}

export const credits = {
  get: (store_id: string) =>
    request<CreditsData>(`/credits?store_id=${store_id}`),
};

// ── Payments ──────────────────────────────────────────────────────────────────

export interface CreateOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  credits_to_receive: number;
  package: { label: string; amountPaid: number; creditsGiven: number };
}

export interface VerifyPaymentResponse {
  success: boolean;
  new_balance: number;
  credits_added: number;
}

export const payments = {
  createOrder: (data: { packageIndex: number; store_id: string }) =>
    request<CreateOrderResponse>("/payments/create-order", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  verify: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    store_id: string;
    package_index: number;
  }) =>
    request<VerifyPaymentResponse>("/payments/verify", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

