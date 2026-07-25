"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, ShoppingBag, TrendingUp, Wallet, BadgeDollarSign, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { DateRange } from "@/components/DateRangeFilter";
import { STATUS_OPTIONS, getWorkflowStatus } from "@/lib/orderStatus";
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
  const [selectedStatus, setSelectedStatus] = useState(statusFilter);

  useEffect(() => {
    setSelectedStatus(statusFilter);
  }, [statusFilter]);

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
    loadStats(dateRange, selectedStatus);
  }, [dateRange, selectedStatus, loadStats]);

  const chooseStatus = (value: string) => {
    setSelectedStatus(value);
    onStatusFilterChange(value);
  };

  const cards = stats
    ? [
        { icon: Eye, label: "عدد الزيارات", value: stats.visits.toLocaleString("ar-SA") },
        { icon: ShoppingBag, label: "عدد الطلبات", value: stats.orders.toLocaleString("ar-SA") },
        { icon: Wallet, label: "متوسط سعر الطلب", value: `${stats.avgOrderValue.toLocaleString("ar-SA")} ريال` },
        { icon: TrendingUp, label: "معدل التحويل", value: `${stats.conversionRate.toFixed(1)}%` },
        { icon: BadgeDollarSign, label: "إجمالي المبيعات", value: `${stats.totalSales.toLocaleString("ar-SA")} ريال` },
      ]
    : [];

  const selectedLabel = selectedStatus === "all"
    ? "كل الحالات"
    : STATUS_OPTIONS.find((item) => item.value === selectedStatus)?.label ?? "كل الحالات";

  const buttonStyle = (selected: boolean): React.CSSProperties => selected
    ? {
        backgroundColor: "#4c1d95",
        color: "#ffffff",
        borderColor: "#4c1d95",
        boxShadow: "0 0 0 3px rgba(196, 181, 253, 0.8), 0 6px 16px rgba(76, 29, 149, 0.25)",
        transform: "scale(1.04)",
      }
    : {
        backgroundColor: "#ffffff",
        color: "#5b4a78",
        borderColor: "#e9e1f4",
        boxShadow: "none",
        transform: "scale(1)",
      };

  return (
    <div className="relative z-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-black text-liora-900">لوحة التحليلات</h2>

        <div className="relative z-20 flex flex-wrap gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => chooseStatus("all")}
            aria-pressed={selectedStatus === "all"}
            style={buttonStyle(selectedStatus === "all")}
            className="relative z-20 flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold transition-all duration-150 active:scale-95 pointer-events-auto"
          >
            {selectedStatus === "all" && <Check size={13} strokeWidth={3} />}
            كل الحالات
          </button>

          {STATUS_OPTIONS.map((item) => {
            const selected = selectedStatus === item.value;
            return (
              <button
                type="button"
                key={item.value}
                onClick={() => chooseStatus(item.value)}
                aria-pressed={selected}
                style={buttonStyle(selected)}
                className="relative z-20 flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold transition-all duration-150 active:scale-95 pointer-events-auto"
              >
                {selected && <Check size={13} strokeWidth={3} />}
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
