"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/client/fetcher";
import type { CreditsData, CreateOrderResponse } from "@/lib/api";
import { CREDIT_PACKAGES_CLIENT } from "@/lib/client/creditPackages";

// ── Query key ─────────────────────────────────────────────────────────────────

export const creditsQueryKey = (storeId: string) => ["credits", storeId];

// ── Fetch balance + transactions ──────────────────────────────────────────────

export function useCreditsQuery(storeId: string | null) {
  return useQuery({
    queryKey: creditsQueryKey(storeId ?? "none"),
    queryFn: () => apiFetch<CreditsData>(`/credits?store_id=${storeId}`),
    enabled: !!storeId,
    refetchInterval: 30_000, // auto-refresh every 30s
  });
}

// ── Create Razorpay order ─────────────────────────────────────────────────────

export function useCreateOrderMutation() {
  return useMutation({
    mutationFn: (data: { packageIndex: number; store_id: string }) =>
      apiFetch<CreateOrderResponse>("/payments/create-order", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });
}

// ── Verify payment + refresh balance ─────────────────────────────────────────

export function useVerifyPaymentMutation(storeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      store_id: string;
      package_index: number;
    }) =>
      apiFetch<{ success: boolean; new_balance: number; credits_added: number }>(
        "/payments/verify",
        { method: "POST", body: JSON.stringify(data) }
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creditsQueryKey(storeId) });
    },
  });
}

// ── Razorpay script waiter ────────────────────────────────────────────────────

/**
 * Waits for window.Razorpay to be available.
 * The actual script is loaded by the <Script> component in billing/page.tsx.
 * This function just polls until the SDK is ready (max 10 s).
 */
function waitForRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Razorpay) { resolve(); return; }

    const start = Date.now();
    const poll = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).Razorpay) {
        clearInterval(poll);
        resolve();
      } else if (Date.now() - start > 10_000) {
        clearInterval(poll);
        reject(new Error(
          "Razorpay SDK did not load. Check your internet connection and try again."
        ));
      }
    }, 100);
  });
}

// ── Razorpay checkout ─────────────────────────────────────────────────────────

type RazorpayPaymentResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

/**
 * Open the Razorpay checkout modal.
 * Waits for window.Razorpay (loaded by <Script> in billing page),
 * then opens the modal as a plain Promise.
 */
export async function openRazorpayCheckout(opts: {
  order: CreateOrderResponse;
  packageIndex: number;
  storeId: string;
}): Promise<RazorpayPaymentResponse> {
  // Wait for the SDK to be available (injected by Next.js <Script>)
  await waitForRazorpay();

  const pkg = CREDIT_PACKAGES_CLIENT[opts.packageIndex];

  // Plain (non-async) Promise — avoids the async-executor antipattern
  return new Promise<RazorpayPaymentResponse>((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rzp = new (window as any).Razorpay({
      key:         opts.order.key_id,
      amount:      opts.order.amount,
      currency:    opts.order.currency,
      order_id:    opts.order.order_id,
      name:        "Vizzle",
      description: `Credit top-up — ${pkg?.label ?? ""}`,
      theme:       { color: "#1D8DB2" },
      handler:     (response: RazorpayPaymentResponse) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
    });
    rzp.open();
  });
}

// ── Setup Plan mutations & checkout ──────────────────────────────────────────

export function useCreateSetupOrderMutation() {
  return useMutation({
    mutationFn: (data: { tier: string; store_id: string }) =>
      apiFetch<{ order_id: string; amount: number; currency: string; key_id: string; tier: string; amount_paid: number }>(
        "/payments/setup-order",
        { method: "POST", body: JSON.stringify(data) }
      ),
  });
}

export function useVerifySetupMutation(storeId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      store_id: string;
      tier: string;
    }) =>
      apiFetch<{ success: boolean; tier: string; requests_per_hour: number; requests_per_day: number }>(
        "/payments/verify-setup",
        { method: "POST", body: JSON.stringify(data) }
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: creditsQueryKey(storeId) });
    },
  });
}

export async function openRazorpaySetupCheckout(opts: {
  order: { order_id: string; amount: number; currency: string; key_id: string; tier: string; amount_paid: number };
  tierLabel: string;
  storeId: string;
}): Promise<RazorpayPaymentResponse> {
  await waitForRazorpay();

  return new Promise<RazorpayPaymentResponse>((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rzp = new (window as any).Razorpay({
      key:         opts.order.key_id,
      amount:      opts.order.amount,
      currency:    opts.order.currency,
      order_id:    opts.order.order_id,
      name:        "Vizzle Store Activation",
      description: `One-Time Setup Plan — ${opts.tierLabel}`,
      theme:       { color: "#1D8DB2" },
      handler:     (response: RazorpayPaymentResponse) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
    });
    rzp.open();
  });
}

export { CREDIT_PACKAGES_CLIENT };
