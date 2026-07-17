"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, ShoppingBag, TrendingUp, Wallet, BadgeDollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { DateRange } from "@/components/DateRangeFilter";
import { STATUS_OPTIONS } from "@/lib/orderStatus";

interface Stats {
  visits: number;
  orders: number;
  avgOrderValue: number;
  conversionRate: number;
  totalSales: number;
}

export default function AnalyticsSummary({ dateRange }: { dateRange: DateRange }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadStats = useCallback(async (range: DateRange, status: string) => {
    setError("");
    setStats(null);

    let visitsQuery = supabase
      .from("page_views")
      .select("*", { count: "exact", head: true });
    let ordersQuery = supabase.from("orders").select("price, created_at, status");

    if (range.from) {
      visitsQuery = visitsQuery.gte("created_at", range.from);
      ordersQuery = ordersQuery.gte("created_at", range.from);
    }
    if (range.to) {
      const toEnd = `${range.to}T23:59:59.999`;
      visitsQuery = visitsQuery.lte("created_at", toEnd);
      ordersQuery = ordersQuery.lte("created_at", toEnd);
    }
    if (status !== "all") {
      ordersQuery = ordersQuery.eq("status", status);
    }

    const [{ count: visits, error: visitsError }, { data: ordersData, error: ordersError }] =
      await Promise.all([visitsQuery, ordersQuery]);

    if (visitsError || ordersError) {
      setError("تعذر تحميل الإحصائيات");
      return;
    }

    const v = visits ?? 0;
    const orders = ordersData ?? [];
    const o = orders.length;
    const totalSales = orders.reduce((sum, ord) => sum + Number(ord.price ?? 0), 0);

    setStats({
      visits: v,
      orders: o,
      avgOrderValue: o > 0 ? Math.round(totalSales / o) : 0,
      conversionRate: v > 0 ? (o / v) * 100 : 0,
      totalSales,
    });
  }, []);

  useEffect(() => {
    loadStats(dateRange, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, statusFilter]);

  const cards = stats
    ? [
        { icon: Eye, label: "عدد الزيارات", value: stats.visits.toLocaleString("ar-SA") },
        { icon: ShoppingBag, label: "عدد الطلبات", value: stats.orders.toLocaleString("ar-SA") },
        {
          icon: Wallet,
          label: "متوسط سعر الطلب",
          value: `${stats.avgOrderValue.toLocaleString("ar-SA")} ريال`,
        },
        {
          icon: TrendingUp,
          label: "معدل التحويل",
          value: `${stats.conversionRate.toFixed(1)}%`,
        },
        {
          icon: BadgeDollarSign,
          label: "إجمالي المبيعات",
          value: `${stats.totalSales.toLocaleString("ar-SA")} ريال`,
        },
      ]
    : [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-black text-liora-900">لوحة التحليلات</h2>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
              statusFilter === "all"
                ? "bg-liora-800 text-white"
                : "bg-liora-50 text-liora-700 hover:bg-liora-100"
            }`}
          >
            كل الحالات
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                statusFilter === s.value
                  ? "bg-liora-800 text-white"
                  : "bg-liora-50 text-liora-700 hover:bg-liora-100"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {!stats ? (
        <p className="mt-4 text-center text-liora-700">جارِ التحميل...</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.label}
              className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-liora-100"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-liora-800 text-gold-400">
                <c.icon size={22} />
              </div>
              <div>
                <p className="text-sm text-liora-600">{c.label}</p>
                <p className="text-xl font-black text-liora-900">{c.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
