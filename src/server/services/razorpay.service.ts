import crypto from "crypto";

export const KEY_ID = "rzp_test_Rh5oOT1q9ZkM4e";
const KEY_SECRET = "2w9r8aT3hcLF8f3s9rFUQCgH";
const RAZORPAY_API = "https://api.razorpay.com/v1";

function basicAuth() {
  return Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");
}

export interface RazorpayOrder {
  id: string;
  amount: number;   // paise
  currency: string;
  receipt: string;
  status: string;
}

/**
 * Create a Razorpay order.
 * @param amountInPaise  Amount in paise (INR × 100). E.g. ₹100 → 10000
 * @param receipt        Unique receipt string (e.g. store_id + timestamp)
 */
export async function createRazorpayOrder(
  amountInPaise: number,
  receipt: string
): Promise<RazorpayOrder> {
  const res = await fetch(`${RAZORPAY_API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basicAuth()}`,
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: "INR",
      receipt,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: { description?: string; code?: string } };
    // Throw as a JSON string so callers can parse error.description for friendly UX
    throw new Error(`Razorpay order creation failed: ${JSON.stringify(err)}`);
  }

  return res.json() as Promise<RazorpayOrder>;
}

/**
 * Verify Razorpay payment signature (HMAC-SHA256).
 * Must be called after the client completes payment.
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const payload = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(payload)
    .digest("hex");
  return expected === signature;
}

/** Razorpay credit package definition */
export interface CreditPackage {
  label: string;
  amountPaid: number;   // INR paid
  creditsGiven: number; // INR credits received
}

/** All available top-up packages, in order */
export const CREDIT_PACKAGES: CreditPackage[] = [
  { label: "₹100",  amountPaid: 100,  creditsGiven: 100  },
  { label: "₹500",  amountPaid: 500,  creditsGiven: 550  },
  { label: "₹1000", amountPaid: 1000, creditsGiven: 1100 },
  { label: "₹2000", amountPaid: 2000, creditsGiven: 2300 },
  { label: "₹5000", amountPaid: 5000, creditsGiven: 6000 },
];
