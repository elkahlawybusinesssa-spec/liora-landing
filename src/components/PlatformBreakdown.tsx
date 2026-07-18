"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DateRange } from "@/components/DateRangeFilter";
import { riyadhRangeBounds } from "@/lib/riyadhDate";
import { labelForPlatform, normalizePlatform } from "@/lib/platformLabels";

interface Row {
  platform: string;
  visits: number;
  orders: number;
  sales: number;
}

export default function PlatformBreakdown({ dateRange }: { dateRange: DateRange }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError("");
      setRows(null);

      let visitsQuery = supabase.from("page_views").select("platform");
      let ordersQuery = supabase.from("orders").select("platform, price");

      const bounds = riyadhRangeBounds(dateRange);
      if (bounds.gte) {
        visitsQuery = visitsQuery.gte("created_at", bounds.gte);
        ordersQuery = ordersQuery.gte("created_at", bounds.gte);
      }
      if (bounds.lte) {
        visitsQuery = visitsQuery.lte("created_at", bounds.lte);
        ordersQuery = ordersQuery.lte("created_at", bounds.lte);
      }

      const [{ data: visitsData, error: visitsError }, { data: ordersData, error: ordersError }] =
        await Promise.all([visitsQuery, ordersQuery]);

      if (cancelled) return;

      if (visitsError || ordersError) {
        setError("تعذر تحميل توزيع المنصات");
        return;
      }

      const map = new Map<string, Row>();
      const get = (platform: string | null) => {
        const key = normalizePlatform(platform);
        if (!map.has(key)) map.set(key, { platform: key, visits: 0, orders: 0, sales: 0 });
        return map.get(key)!;
      };

      (visitsData ?? []).forEach((v) => {
        get(v.platform).visits += 1;
      });
      (ordersData ?? []).forEach((o) => {
        const row = get(o.platform);
        row.orders += 1;
        row.sales += Number(o.price ?? 0);
      });

      setRows(Array.from(map.values()).sort((a, b) => b.visits - a.visits));
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [dateRange]);

  return (
    <div>
      <h2 className="text-lg font-black text-liora-900">التوزيع حسب المنصة الإعلانية</h2>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      {!rows ? (
        <p className="mt-4 text-center text-liora-700">جارِ التحميل...</p>
      ) : rows.length === 0 ? (
        <p className="mt-4 text-center text-liora-700">لا توجد بيانات في الفترة دي</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-right text-sm">
            <thead>
              <tr className="border-b border-liora-100 text-liora-600">
                <th className="py-2 font-bold">المنصة</th>
                <th className="py-2 font-bold">الزيارات</th>
                <th className="py-2 font-bold">الطلبات</th>
                <th className="py-2 font-bold">معدل التحويل</th>
                <th className="py-2 font-bold">إجمالي المبيعات</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.platform} className="border-b border-liora-50">
                  <td className="py-2 font-bold text-liora-900">{labelForPlatform(r.platform)}</td>
                  <td className="py-2 text-liora-700">{r.visits.toLocaleString("ar-SA")}</td>
                  <td className="py-2 text-liora-700">{r.orders.toLocaleString("ar-SA")}</td>
                  <td className="py-2 text-liora-700">
                    {r.visits > 0 ? ((r.orders / r.visits) * 100).toFixed(1) : "0.0"}%
                  </td>
                  <td className="py-2 text-liora-700">
                    {r.sales.toLocaleString("ar-SA")} ريال
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
