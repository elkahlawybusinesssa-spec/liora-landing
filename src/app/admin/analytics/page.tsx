"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  ShoppingBag,
  TrendingUp,
  Wallet,
  BadgeDollarSign,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const UNIT_PRICE = 149;

interface Stats {
  visits: number;
  orders: number;
  avgOrderValue: number;
  conversionRate: number;
  totalSales: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace("/admin");
        return;
      }
      setCheckingAuth(false);

      const [{ count: visits, error: visitsError }, { count: orders, error: ordersError }] =
        await Promise.all([
          supabase.from("page_views").select("*", { count: "exact", head: true }),
          supabase.from("orders").select("*", { count: "exact", head: true }),
        ]);

      if (visitsError || ordersError) {
        setError("تعذر تحميل الإحصائيات");
        return;
      }

      const v = visits ?? 0;
      const o = orders ?? 0;
      setStats({
        visits: v,
        orders: o,
        avgOrderValue: o > 0 ? UNIT_PRICE : 0,
        conversionRate: v > 0 ? (o / v) * 100 : 0,
        totalSales: o * UNIT_PRICE,
      });
    });
  }, [router]);

  if (checkingAuth) return null;

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
    <main className="min-h-screen bg-liora-50 px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-liora-900">لوحة التحليلات</h1>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-liora-800 shadow ring-1 ring-liora-100"
          >
            <ArrowRight size={16} />
            رجوع للطلبات
          </Link>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        {!stats ? (
          <p className="mt-8 text-center text-liora-700">جارِ التحميل...</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </main>
  );
}
