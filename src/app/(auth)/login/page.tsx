"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signInWithPopup } from "firebase/auth";
import { apiFetch } from "@/lib/client/fetcher";
import { getFirebaseAuth, getGoogleProvider } from "@/lib/client/firebase";
import { useAuthStore } from "@/store/auth.store";

interface LoginForm { email: string; password: string; }

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const setSession = useAuthStore((s) => s.setSession);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();
  const firebaseConfigured = !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  );

  function handleAuthResponse(r: { token: string; user?: { id: string; email: string; name: string }; is_admin?: boolean }) {
    setSession({ token: r.token, user: r.user, isAdmin: r.is_admin });
    router.push("/dashboard");
  }

  async function onSubmit(values: LoginForm) {
    setServerError("");
    try {
      handleAuthResponse(await apiFetch<{ token: string; user?: { id: string; email: string; name: string }; is_admin?: boolean }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      }));
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Sign in failed");
    }
  }

  async function onGoogle() {
    setServerError("");
    try {
      const cred = await signInWithPopup(getFirebaseAuth(), getGoogleProvider());
      const idToken = await cred.user.getIdToken();
      handleAuthResponse(await apiFetch<{ token: string; user: { id: string; email: string; name: string }; is_admin?: boolean }>("/auth/firebase", {
        method: "POST",
        body: JSON.stringify({ id_token: idToken }),
      }));
    } catch (e: unknown) {
      // Firebase-specific error codes
      const code = (e as { code?: string })?.code ?? "";
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        return; // user dismissed — not an error
      }
      if (
        code === "auth/internal-error" ||
        code === "auth/unauthorized-domain" ||
        code === "auth/operation-not-allowed"
      ) {
        const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
        setServerError(
          `Google sign-in is not configured for this domain yet. ` +
          `Fix in 2 steps: ` +
          `(1) Firebase Console → Authentication → Settings → Authorized Domains → add 'localhost'. ` +
          `(2) Google Cloud Console → APIs & Services → Credentials → OAuth Web Client → Authorized JavaScript Origins → add '${origin}'. ` +
          `Use email/password below in the meantime.`
        );
        return;
      }
      setServerError(e instanceof Error ? e.message : "Google sign-in failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50 px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Vizzle" style={{ height: 44, width: "auto" }} />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-brand-200 bg-white px-8 py-8 shadow-sm">
          <h1 className="mb-1 text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mb-6 text-sm text-gray-500">Sign in to your brand dashboard</p>

          {/* Google */}
          <button
            type="button"
            onClick={onGoogle}
            disabled={!firebaseConfigured}
            title={!firebaseConfigured ? "Firebase not configured — use email/password below" : undefined}
            className="mb-5 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-black bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-brand-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"/></div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">or email</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="you@brand.com"
                className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-400 transition-colors"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-400 transition-colors"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {serverError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700 leading-relaxed">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl border-2 border-black bg-brand-400 py-2.5 text-sm font-bold text-black hover:bg-brand-500 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          New to Vizzle?{" "}
          <Link href="/register" className="font-semibold text-brand-600 hover:underline">
            Create a brand account
          </Link>
        </p>
      </div>
    </div>
  );
}
