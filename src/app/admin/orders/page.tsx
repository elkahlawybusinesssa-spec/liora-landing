"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle, RefreshCw, LogOut, BarChart3, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toWhatsappLink } from "@/lib/phone";
import { STATUS_OPTIONS } from "@/lib/orderStatus";
import AddOrderModal from "@/components/AddOrderModal";

interface Order {
  id: string;
  full_name: string;
  phone: string;
  city: string;
  address: string;
  product: string | null;
  price: number | null;
  notes: string | null;
  status: string;
  created_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function whatsappMessage(order: Order) {
  return `مرحباً ${order.full_name} 🎁\n\nتم استلام طلبك لمجموعة Liora التعليمية بنجاح ✅\nفريقنا بيتواصل معك خلال ساعات لتأكيد الطلب وتحديد موعد التوصيل.\n\nشكراً لثقتك في Liora 💜`;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

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

  async function handleStatusChange(orderId: string, status: string) {
    setOrders((prev) =>
      prev ? prev.map((o) => (o.id === orderId ? { ...o, status } : o)) : prev
    );
    await supabase.from("orders").update({ status }).eq("id", orderId);
  }

  if (checkingAuth) return null;

  return (
    <main className="min-h-screen bg-liora-50 px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-liora-900">
            طلبات العملاء {orders ? `(${orders.length})` : ""}
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-full bg-gold-500 px-4 py-2 text-sm font-bold text-liora-950 shadow"
            >
              <Plus size={16} />
              إضافة طلب
            </button>
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
                  {order.product && (
                    <p className="mt-1 text-xs text-liora-500">
                      المنتج: {order.product}
                      {order.price != null ? ` — ${order.price} ريال` : ""}
                    </p>
                  )}
                  {order.notes && (
                    <p className="mt-1 text-xs text-liora-500">
                      ملاحظات: {order.notes}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-liora-400" dir="ltr">
                    {formatDate(order.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="rounded-full border border-liora-100 bg-white px-3 py-2.5 text-sm font-bold text-liora-800 shadow outline-none focus:border-liora-500"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>

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
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddOrderModal
          onClose={() => setShowAddModal(false)}
          onAdded={loadOrders}
        />
      )}
    </main>
  );
}
