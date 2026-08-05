"use client";

import { useMemo, useState } from "react";
import { AlertCircle, BarChart2, ChevronDown, Clock, Link as LinkIcon, Users, Video, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Badge from "@/components/ui/Badge";
import Card, { StatCard } from "@/components/ui/Card";
import { cn, formatNumber } from "@/lib/client/utils";
import { useStoresQuery } from "@/hooks/useStores";
import { useStoresStore } from "@/store/stores.store";
import { useAnalyticsQuery } from "@/hooks/useAnalytics";

const ranges = [{ label: "Last 7 days", days: 7 }, { label: "Last 30 days", days: 30 }, { label: "Last 90 days", days: 90 }];
const colors = ["#0284c7", "#38bdf8", "#10b981", "#f59e0b", "#ef4444"];
function daysAgo(days: number) { const d = new Date(); d.setDate(d.getDate() - days); return d.toISOString().split("T")[0]; }

export default function AnalyticsPage() {
  const [rangeIndex, setRangeIndex] = useState(1);
  const [menu, setMenu] = useState(false);
  const selectedStore = useStoresStore((s) => s.selectedStore);
  const setSelectedStore = useStoresStore((s) => s.setSelectedStore);
  const { data: storesData } = useStoresQuery();
  const stores = storesData?.stores ?? [];
  const { data, isLoading } = useAnalyticsQuery(selectedStore?.store_id ?? null, daysAgo(ranges[rangeIndex].days));

  const breakdown = useMemo(() => data ? [
    { name: "Image try-ons", value: Math.max(data.tryons - data.video_tryons, 0), fill: "#0284c7" },
    { name: "Video try-ons", value: data.video_tryons, fill: "#38bdf8" },
    { name: "Direct mode", value: data.direct_mode_calls, fill: "#10b981" },
  ] : [], [data]);

  const topProducts = useMemo(() => (data?.by_product ?? []).slice(0, 5).map((p, i) => ({ name: p.name ?? "Unknown", value: p.tryon_count, fill: colors[i] })), [data]);

  return (
    <div className="max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-600">Per-store try-on metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-gray-100 p-1">
            {ranges.map((range, i) => (
              <button key={range.label} onClick={() => setRangeIndex(i)} className={cn("rounded-md px-3 py-1.5 text-xs", rangeIndex === i ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")}>{range.label}</button>
            ))}
          </div>
          <div className="relative">
            <button onClick={() => setMenu((v) => !v)} className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              <span>{selectedStore?.store_name ?? "Select store"}</span>
              <ChevronDown size={14} />
            </button>
            {menu ? (
              <div className="absolute right-0 top-full z-20 mt-1 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                {stores.map((store) => (
                  <button key={store.store_id} onClick={() => { setSelectedStore(store); setMenu(false); }} className={cn("w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50", selectedStore?.store_id === store.store_id ? "font-medium text-brand-600" : "text-gray-700")}>{store.store_name}</button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {!selectedStore ? (
        <Card><div className="py-16 text-center"><BarChart2 size={30} className="mx-auto mb-3 text-gray-400" /><p className="text-sm font-medium text-gray-600">Select or create a store to see analytics.</p></div></Card>
      ) : isLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[1,2,3,4].map((i)=><div key={i} className="h-24 animate-pulse rounded-xl border border-gray-200 bg-white" />)}</div>
      ) : !data ? (
        <Card><div className="py-16 text-center text-sm font-medium text-gray-600">No analytics data yet — try-ons will appear here.</div></Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Total Try-ons" value={formatNumber(data.tryons)} icon={Zap} color="violet" />
            <StatCard label="Unique Users" value={formatNumber(data.users)} icon={Users} color="blue" />
            <StatCard label="Direct Mode" value={formatNumber(data.direct_mode_calls)} icon={LinkIcon} color="amber" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {breakdown.some((e) => e.value > 0) ? (
              <Card>
                <h3 className="mb-4 font-semibold text-gray-900">Try-on breakdown</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart><Pie data={breakdown} dataKey="value" nameKey="name" outerRadius={80}>{breakdown.map((entry)=><Cell key={entry.name} fill={entry.fill} />)}</Pie><Tooltip formatter={(v)=>formatNumber(Number(v))} /><Legend /></PieChart>
                </ResponsiveContainer>
              </Card>
            ) : null}

            {topProducts.length > 0 ? (
              <Card>
                <h3 className="mb-4 font-semibold text-gray-900">Top products</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={topProducts} layout="vertical" margin={{ right: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip formatter={(v)=>formatNumber(Number(v))} />
                    <Bar dataKey="value" radius={[0,4,4,0]}>{topProducts.map((entry)=><Cell key={entry.name} fill={entry.fill} />)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
