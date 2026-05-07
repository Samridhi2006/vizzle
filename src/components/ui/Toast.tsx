"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/client/utils";
import { useUIStore } from "@/store/ui.store";

const toneClasses = {
  success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  info: "bg-brand-50 border-brand-200 text-brand-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  error: "bg-red-50 border-red-200 text-red-800",
} as const;

export default function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((toast) =>
      setTimeout(() => removeToast(toast.id), 3500)
    );
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, removeToast]);

  return (
    <div className="fixed right-4 top-4 z-[100] flex w-[340px] max-w-[calc(100vw-2rem)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "rounded-lg border p-3 shadow-sm backdrop-blur-sm",
            toneClasses[toast.tone]
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.message ? (
                <p className="mt-0.5 text-xs opacity-90">{toast.message}</p>
              ) : null}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="rounded p-1 hover:bg-black/5"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
