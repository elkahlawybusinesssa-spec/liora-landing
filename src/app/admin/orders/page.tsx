"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle, RefreshCw, LogOut, BarChart3, Plus, Trash2, Globe, Pencil, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toWhatsappLink } from "@/lib/phone";
import { STATUS_OPTIONS } from "@/lib/orderStatus";
import OrderModal from "@/components/OrderModal";
import DateRangeFilter, { DateRange } from "@/components/DateRangeFilter";

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
  source: string | null;
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
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });

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

  async function handleDelete(order: Order) {
    if (!confirm(`متأكدة إنك عايزة تحذفي طلب "${order.full_name}"؟ الإجراء ده مش قابل للتراجع.`)) {
      return;
    }
    setOrders((prev) => (prev ? prev.filter((o) => o.id !== order.id) : prev));
    await supabase.from("orders").delete().eq("id", order.id);
  }

  const filteredOrders =
    orders?.filter((o) => {
      const created = o.created_at.slice(0, 10);
      if (dateRange.from && created < dateRange.from) return false;
      if (dateRange.to && created > dateRange.to) return false;
      return true;
    }) ?? null;

  if (checkingAuth) return null;

  return (
    <main className="min-h-screen bg-liora-50 px-4 py-8" dir="rtl">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-liora-900">
            طلبات العملاء {filteredOrders ? `(${filteredOrders.length})` : ""}
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
            <Link
              href="/admin/settings"
              className="flex items-center gap-2 rounded-full bg-liora-800 px-4 py-2 text-sm font-bold text-white shadow"
            >
              <Settings size={16} />
              الأسعار والشحن
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

        <div className="mt-4">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        {!filteredOrders ? (
          <p className="mt-8 text-center text-liora-700">جارِ التحميل...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="mt-8 text-center text-liora-700">لا توجد طلبات في الفترة دي</p>
        ) : (
          <div className="mt-6 space-y-3">
            {filteredOrders.map((order) => (
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
                  {order.source === "website" ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-2.5 text-xs font-bold text-blue-700 ring-1 ring-blue-200">
                      <Globe size={14} />
                      موقع
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-2.5 text-xs font-bold text-green-700 ring-1 ring-green-200">
                      <MessageCircle size={14} />
                      واتساب
                    </span>
                  )}

                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`rounded-full border px-3 py-2.5 text-sm font-bold shadow outline-none transition ${
                      order.status === "delivered"
                        ? "border-green-300 bg-green-500 text-white focus:border-green-500"
                        : "border-liora-100 bg-white text-liora-800 focus:border-liora-500"
                    }`}
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

                  <button
                    onClick={() => setEditingOrder(order)}
                    className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 font-bold text-liora-800 shadow ring-1 ring-liora-100 transition hover:scale-105 hover:bg-liora-50"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(order)}
                    className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 font-bold text-red-600 shadow ring-1 ring-red-200 transition hover:scale-105 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <OrderModal
          onClose={() => setShowAddModal(false)}
          onSaved={loadOrders}
        />
      )}

      {editingOrder && (
        <OrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSaved={loadOrders}
        />
      )}
    </main>
  );
}
