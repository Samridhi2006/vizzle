import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Image optimisation ──────────────────────────────────────────────────
  // Allow Next.js Image component to serve images from external CDNs.
  images: {
    remotePatterns: [
      // Cloudinary — product thumbnails & try-on outputs
      { protocol: "https", hostname: "res.cloudinary.com" },
      // ML backend (Render) — raw result images before Cloudinary upload
      { protocol: "https", hostname: "vizzle-backend-vvc6.onrender.com" },
      // Shopify product catalog imports (bulk JSON)
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },

  // ── Security headers ────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",          value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options",   value: "nosniff" },
          { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.vizzle.io https://apis.google.com https://checkout.razorpay.com https://cdn.razorpay.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://res.cloudinary.com https://cdn.shopify.com https://*.shopify.com https://vizzle-backend-vvc6.onrender.com https://*.googleusercontent.com",
              "font-src 'self'",
              // Firebase Auth popup + Google Sign-In need these connect targets
              "connect-src 'self' https://*.firebaseapp.com https://*.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://res.cloudinary.com https://vizzle-backend-vvc6.onrender.com https://api.razorpay.com https://lumberjack.razorpay.com",
              // Firebase signInWithPopup opens an iframe on accounts.google.com / firebaseapp.com
              "frame-src https://*.firebaseapp.com https://accounts.google.com https://api.razorpay.com",
            ].join("; "),
          },
        ],
      },
      // ── CORS pre-flight for /api/v1/* (widget calls come from brand sites) ──
      {
        source: "/api/v1/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin",  value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, x-api-key, x-vizzle-user" },
        ],
      },
    ];
  },

  // ── Turbopack (Next.js 16 default bundler) ───────────────────────────────
  turbopack: {},
};

export default nextConfig;
