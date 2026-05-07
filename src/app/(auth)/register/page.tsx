"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { apiFetch } from "@/lib/client/fetcher";
import { useAuthStore } from "@/store/auth.store";
import { useState } from "react";

interface RegisterForm { name: string; email: string; password: string; confirmPassword: string; }

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const setSession = useAuthStore((s) => s.setSession);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterForm>();

  async function onSubmit(values: RegisterForm) {
    setServerError("");
    try {
      const r = await apiFetch<{ token: string; user?: { id: string; email: string; name: string }; is_admin?: boolean }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: values.name, email: values.email, password: values.password }),
      });
      setSession({ token: r.token, user: r.user, isAdmin: r.is_admin });
      router.push("/dashboard");
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Registration failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50 px-4 py-10">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Vizzle" style={{ height: 44, width: "auto" }} />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-brand-200 bg-white px-8 py-8 shadow-sm">
          <h1 className="mb-1 text-2xl font-bold text-gray-900">Create brand account</h1>
          <p className="mb-6 text-sm text-gray-500">Start offering virtual try-on — free to begin</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {[
              { name: "name" as const,            label: "Brand name",    type: "text",     placeholder: "Acme Fashion",       rules: { required: "Required" } },
              { name: "email" as const,           label: "Work email",    type: "email",    placeholder: "you@brand.com",      rules: { required: "Required" } },
              { name: "password" as const,        label: "Password",      type: "password", placeholder: "Min. 8 characters",  rules: { required: "Required", minLength: { value: 8, message: "Min 8 chars" } } },
              { name: "confirmPassword" as const, label: "Confirm password", type: "password", placeholder: "••••••••",       rules: { required: "Required", validate: (v: string) => v === watch("password") || "Passwords don't match" } },
            ].map((f) => (
              <div key={f.name}>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-brand-400 transition-colors"
                  {...register(f.name, f.rules)}
                />
                {errors[f.name] && <p className="mt-1 text-xs text-red-500">{errors[f.name]?.message}</p>}
              </div>
            ))}

            {serverError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl border-2 border-black bg-brand-400 py-2.5 text-sm font-bold text-black hover:bg-brand-500 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
