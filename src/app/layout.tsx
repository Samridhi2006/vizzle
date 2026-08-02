import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import AppProviders from "@/components/providers/AppProviders";

export const metadata: Metadata = {
  title: "Vizzle Dashboard",
  description: "Virtual Try-On Platform — Admin Dashboard",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-brand-50 text-gray-900 antialiased">
        <AppProviders>{children}</AppProviders>
        {/*
          Razorpay Checkout SDK — loaded globally so it's available on the
          billing page without any dynamic injection or timing issues.
          strategy="afterInteractive" loads it right after page hydration.
        */}
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
