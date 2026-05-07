import { cn } from "@/lib/client/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import Spinner from "@/components/ui/Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black text-black";

    const variants = {
      primary:  "bg-brand-400 hover:bg-brand-500 focus:ring-brand-400",
      secondary:"bg-white hover:bg-gray-50 focus:ring-gray-300",
      danger:   "bg-red-400 hover:bg-red-500 focus:ring-red-400",
      ghost:    "bg-transparent border-transparent hover:bg-gray-100 focus:ring-gray-300",
      outline:  "bg-white hover:bg-brand-50 focus:ring-brand-300",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-5 py-2.5 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Spinner size={16} />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
