import { cn } from "@/lib/client/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({
  children,
  className,
  padding = true,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-brand-100 shadow-sm",
        padding && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color = "violet",
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color?: "violet" | "emerald" | "blue" | "amber" | "rose";
}) {
  const colors = {
    violet: "bg-brand-50 text-brand-600",
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-gray-900">{value}</p>
          {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
        </div>
        <div className={cn("p-2.5 rounded-lg", colors[color])}>
          <Icon size={20} />
        </div>
      </div>
    </Card>
  );
}

