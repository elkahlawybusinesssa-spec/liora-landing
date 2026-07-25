"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, ShoppingBag, TrendingUp, Wallet, BadgeDollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { DateRange } from "@/components/DateRangeFilter";
import { STATUS_OPTIONS, STATUS_COLOR_CLASSES, getWorkflowStatus } from "@/lib/orderStatus";
import { riyadhRangeBounds } from "@/lib/riyadhDate";

interface Stats {
  visits: number;
  orders: number;
  avgOrderValue: number;
  conversionRate: number;
  totalSales: number;
}

interface AnalyticsOrder {
  price: number | null;
  created_at: string;
  status: string;
  shipping_company_status?: string | null;
  collection_status?: string | null;
  waybill_status?: string | null;
}

export default function AnalyticsSummary({
  dateRange,
  statusFilter,
  onStatusFilterChange,
}: {
  dateRange: DateRange;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  const loadStats = useCallback(async (range: DateRange, status: string) => {
    setError("");
    setStats(null);

    let visitsQuery = supabase.from("page_views").select("*", { count: "exact", head: true });
    let ordersQuery = supabase
      .from("orders")
      .select("price,created_at,status,shipping_company_status,collection_status,waybill_status");

    const bounds = riyadhRangeBounds(range);
    if (bounds.gte) {
      visitsQuery = visitsQuery.gte("created_at", bounds.gte);
      ordersQuery = ordersQuery.gte("created_at", bounds.gte);
    }
    if (bounds.lte) {
      visitsQuery = visitsQuery.lte("created_at", bounds.lte);
      ordersQuery = ordersQuery.lte("created_at", bounds.lte);
    }

    const [visitsResult, ordersResult] = await Promise.all([visitsQuery, ordersQuery]);

    if (visitsResult.error || ordersResult.error) {
      setError("تعذر تحميل الإحصائيات");
      return;
    }

    const allOrders = (ordersResult.data ?? []) as AnalyticsOrder[];
    const orders = status === "all"
      ? allOrders
      : allOrders.filter((order) => getWorkflowStatus(order) === status);

    const visits = visitsResult.count ?? 0;
    const ordersCount = orders.length;
    const totalSales = orders.reduce((sum, order) => sum + Number(order.price ?? 0), 0);

    setStats({
      visits,
      orders: ordersCount,
      avgOrderValue: ordersCount > 0 ? Math.round(totalSales / ordersCount) : 0,
      conversionRate: visits > 0 ? (ordersCount / visits) * 100 : 0,
      totalSales,
    });
  }, []);

  useEffect(() => {
    loadStats(dateRange, statusFilter);
  }, [dateRange, statusFilter, loadStats]);

  const cards = stats
    ? [
        { icon: Eye, label: "عدد الزيارات", value: stats.visits.toLocaleString("ar-SA") },
        { icon: ShoppingBag, label: "عدد الطلبات", value: stats.orders.toLocaleString("ar-SA") },
        { icon: Wallet, label: "متوسط سعر الطلب", value: `${stats.avgOrderValue.toLocaleString("ar-SA")} ريال` },
        { icon: TrendingUp, label: "معدل التحويل", value: `${stats.conversionRate.toFixed(1)}%` },
        { icon: BadgeDollarSign, label: "إجمالي المبيعات", value: `${stats.totalSales.toLocaleString("ar-SA")} ريال` },
      ]
    : [];

  const selectedLabel = statusFilter === "all"
    ? "كل الحالات"
    : STATUS_OPTIONS.find((item) => item.value === statusFilter)?.label;

  return (
    <div className="relative z-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-black text-liora-900">لوحة التحليلات</h2>

        <div className="relative z-20 flex flex-wrap gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => onStatusFilterChange("all")}
            aria-pressed={statusFilter === "all"}
            className={`relative z-20 cursor-pointer rounded-full border px-3 py-1.5 text-xs font-bold transition-all duration-150 active:scale-95 pointer-events-auto ${
              statusFilter === "all"
                ? "scale-[1.04] border-liora-900 bg-liora-900 text-white shadow-lg ring-2 ring-liora-300 ring-offset-2"
                : "border-liora-100 bg-liora-50 text-liora-700 hover:bg-liora-100"
            }`}
          >
            كل الحالات
          </button>

          {STATUS_OPTIONS.map((item) => {
            const selected = statusFilter === item.value;
            const colors = STATUS_COLOR_CLASSES[item.value];
            return (
              <button
                type="button"
                key={item.value}
                onClick={() => onStatusFilterChange(item.value)}
                aria-pressed={selected}
                className={`relative z-20 cursor-pointer rounded-full border px-3 py-1.5 text-xs font-bold transition-all duration-150 active:scale-95 pointer-events-auto ${
                  selected
                    ? `${colors.active} scale-[1.04] shadow-lg ring-2 ring-current ring-offset-2`
                    : colors.inactive
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-xs font-bold text-liora-700">الفلتر الحالي: {selectedLabel}</p>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
      )}

      {!stats ? (
        <p className="mt-4 text-center text-liora-700">جارِ التحميل...</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div key={card.label} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-liora-100">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-liora-800 text-gold-400">
                <card.icon size={22} />
              </div>
              <div>
                <p className="text-sm text-liora-600">{card.label}</p>
                <p className="text-xl font-black text-liora-900">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
