"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle, RefreshCw, LogOut, BarChart3 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toWhatsappLink } from "@/lib/phone";

interface Order {
  id: string;
  full_name: string;
  phone: string;
  city: string;
  address: string;
  notes: string | null;
  status: string;
  created_at: string;
}

function whatsappMessage(order: Order) {
  return `مرحباً ${order.full_name} 🎁\n\nتم استلام طلبك لمجموعة Liora التعليمية بنجاح ✅\nفريقنا بيتواصل معك خلال ساعات لتأكيد الطلب وتحديد موعد التوصيل.\n\nشكراً لثقتك في Liora 💜`;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  const loadOrders = useCallback(async () => {
    setError("");
    const { data, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (fetchError) {
      setError("تعذر تحميل الطلبات");
      return;
    }
    setOrders(data as Order[]);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/admin");
        return;
      }
      setCheckingAuth(false);
      loadOrders();
    });
  }, [router, loadOrders]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin");
  }

  if (checkingAuth) return null;

  return (
    <main className="min-h-screen bg-liora-50 px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-liora-900">
            طلبات العملاء {orders ? `(${orders.length})` : ""}
          </h1>
          <div className="flex gap-2">
            <Link
              href="/admin/analytics"
              className="flex items-center gap-2 rounded-full bg-liora-800 px-4 py-2 text-sm font-bold text-white shadow"
            >
              <BarChart3 size={16} />
              التحليلات
            </Link>
            <button
              onClick={loadOrders}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-liora-800 shadow ring-1 ring-liora-100"
            >
              <RefreshCw size={16} />
              تحديث
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-red-600 shadow ring-1 ring-liora-100"
            >
              <LogOut size={16} />
              خروج
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        {!orders ? (
          <p className="mt-8 text-center text-liora-700">جارِ التحميل...</p>
        ) : orders.length === 0 ? (
          <p className="mt-8 text-center text-liora-700">لا توجد طلبات بعد</p>
        ) : (
          <div className="mt-6 space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-liora-100 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold text-liora-900">{order.full_name}</p>
                  <p className="text-sm text-liora-700" dir="ltr">
                    {order.phone}
                  </p>
                  <p className="text-sm text-liora-600">
                    {order.city} — {order.address}
                  </p>
                  {order.notes && (
                    <p className="mt-1 text-xs text-liora-500">
                      ملاحظات: {order.notes}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-liora-400">
                    {new Date(order.created_at).toLocaleString("ar-SA")}
                  </p>
                </div>

                <a
                  href={toWhatsappLink(order.phone, whatsappMessage(order))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-green-500 px-5 py-2.5 font-bold text-white shadow transition hover:scale-105"
                >
                  <MessageCircle size={18} />
                  واتساب
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
