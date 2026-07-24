"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageCircle,
  RefreshCw,
  LogOut,
  Plus,
  Trash2,
  Globe,
  Pencil,
  Settings,
  UserPlus,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toWhatsappLink } from "@/lib/phone";
import { STATUS_OPTIONS, STATUS_COLOR_CLASSES } from "@/lib/orderStatus";
import OrderModal from "@/components/OrderModal";
import LeadModal from "@/components/LeadModal";
import DateRangeFilter, { DateRange } from "@/components/DateRangeFilter";
import AnalyticsSummary from "@/components/AnalyticsSummary";
import PlatformBreakdown from "@/components/PlatformBreakdown";
import { toRiyadhDateString } from "@/lib/riyadhDate";
import { labelForPlatform } from "@/lib/platformLabels";

interface Order {
  id: string;
  full_name: string;
  phone: string;
  city: string;
  address: string;
  product: string | null;
  price: number | null;
  quantity: number | null;
  notes: string | null;
  status: string;
  collection_status: "تم التحصيل" | "لم يتم التحصيل";
  source: string | null;
  platform: string | null;
  created_at: string;
}

interface Lead {
  id: string;
  full_name: string;
  phone: string;
  notes: string | null;
  source: string;
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
  const [tab, setTab] = useState<"orders" | "leads">("orders");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });
  const [statusFilter, setStatusFilter] = useState("all");

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

  const loadLeads = useCallback(async () => {
    setError("");
    const { data, error: fetchError } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError("تعذر تحميل الليدز");
      return;
    }

    setLeads(data as Lead[]);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/admin");
        return;
      }
      setCheckingAuth(false);
      loadOrders();
      loadLeads();
    });
  }, [router, loadOrders, loadLeads]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin");
  }

  async function handleStatusChange(orderId: string, status: string) {
    setOrders((prev) =>
      prev ? prev.map((order) => (order.id === orderId ? { ...order, status } : order)) : prev
    );
    await supabase.from("orders").update({ status }).eq("id", orderId);
  }

  async function handleCollectionStatusChange(
    orderId: string,
    collectionStatus: Order["collection_status"]
  ) {
    const previousStatus = orders?.find((order) => order.id === orderId)?.collection_status;

    setOrders((prev) =>
      prev
        ? prev.map((order) =>
            order.id === orderId
              ? { ...order, collection_status: collectionStatus }
              : order
          )
        : prev
    );

    const { error: updateError } = await supabase
      .from("orders")
      .update({ collection_status: collectionStatus })
      .eq("id", orderId);

    if (updateError) {
      setError("تعذر حفظ حالة التحصيل");
      if (previousStatus) {
        setOrders((prev) =>
          prev
            ? prev.map((order) =>
                order.id === orderId
                  ? { ...order, collection_status: previousStatus }
                  : order
              )
            : prev
        );
      }
    }
  }

  async function handleDelete(order: Order) {
    if (!confirm(`متأكدة إنك عايزة تحذفي طلب "${order.full_name}"؟ الإجراء ده مش قابل للتراجع.`)) return;
    setOrders((prev) => (prev ? prev.filter((item) => item.id !== order.id) : prev));
    await supabase.from("orders").delete().eq("id", order.id);
  }

  async function handleDeleteLead(lead: Lead) {
    if (!confirm(`متأكدة إنك عايزة تحذفي ليد "${lead.full_name}"؟ الإجراء ده مش قابل للتراجع.`)) return;
    setLeads((prev) => (prev ? prev.filter((item) => item.id !== lead.id) : prev));
    await supabase.from("leads").delete().eq("id", lead.id);
  }

  const filteredOrders =
    orders?.filter((order) => {
      const created = toRiyadhDateString(order.created_at);
      if (dateRange.from && created < dateRange.from) return false;
      if (dateRange.to && created > dateRange.to) return false;
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      return true;
    }) ?? null;

  const filteredLeads =
    leads?.filter((lead) => {
      const created = toRiyadhDateString(lead.created_at);
      if (dateRange.from && created < dateRange.from) return false;
      if (dateRange.to && created > dateRange.to) return false;
      return true;
    }) ?? null;

  if (checkingAuth) return null;

  return (
    <main className="min-h-screen bg-liora-50 px-3 py-8 sm:px-4 lg:px-6" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-liora-900">
            {tab === "orders"
              ? `طلبات العملاء ${filteredOrders ? `(${filteredOrders.length})` : ""}`
              : `الليدز المهتمة ${filteredLeads ? `(${filteredLeads.length})` : ""}`}
          </h1>

          <div className="flex flex-wrap gap-2">
            {tab === "orders" ? (
              <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 rounded-full bg-gold-500 px-4 py-2 text-sm font-bold text-liora-950 shadow">
                <Plus size={16} /> إضافة طلب
              </button>
            ) : (
              <button onClick={() => setShowAddLeadModal(true)} className="flex items-center gap-2 rounded-full bg-gold-500 px-4 py-2 text-sm font-bold text-liora-950 shadow">
                <UserPlus size={16} /> إضافة ليد
              </button>
            )}

            <Link href="/admin/settings" className="flex items-center gap-2 rounded-full bg-liora-800 px-4 py-2 text-sm font-bold text-white shadow">
              <Settings size={16} /> الأسعار والشحن
            </Link>

            <button onClick={() => (tab === "orders" ? loadOrders() : loadLeads())} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-liora-800 shadow ring-1 ring-liora-100">
              <RefreshCw size={16} /> تحديث
            </button>

            <button onClick={handleLogout} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-red-600 shadow ring-1 ring-liora-100">
              <LogOut size={16} /> خروج
            </button>
          </div>
        </div>

        <div className="mt-4">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </div>

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-liora-100">
          <AnalyticsSummary dateRange={dateRange} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />
        </div>

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-liora-100">
          <PlatformBreakdown dateRange={dateRange} />
        </div>

        <div className="mt-6 flex gap-2 border-b border-liora-100">
          <button onClick={() => setTab("orders")} className={`px-4 py-2 text-sm font-bold transition ${tab === "orders" ? "border-b-2 border-liora-800 text-liora-900" : "text-liora-500 hover:text-liora-800"}`}>
            الطلبات
          </button>
          <button onClick={() => setTab("leads")} className={`px-4 py-2 text-sm font-bold transition ${tab === "leads" ? "border-b-2 border-liora-800 text-liora-900" : "text-liora-500 hover:text-liora-800"}`}>
            الليدز المهتمة
          </button>
        </div>

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

        {tab === "orders" ? (
          !filteredOrders ? (
            <p className="mt-8 text-center text-liora-700">جارِ التحميل...</p>
          ) : filteredOrders.length === 0 ? (
            <p className="mt-8 text-center text-liora-700">لا توجد طلبات في الفترة دي</p>
          ) : (
            <div className="mt-6 space-y-3">
              {filteredOrders.map((order) => (
                <div key={order.id} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-liora-100 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-liora-900">{order.full_name}</p>
                    <p className="text-sm text-liora-700" dir="ltr">{order.phone}</p>
                    <p className="text-sm text-liora-600">{order.city} — {order.address}</p>
                    {order.product && (
                      <p className="mt-1 text-xs text-liora-500">
                        المنتج: {order.product}
                        {order.quantity != null ? ` (${order.quantity} مجموعة)` : ""}
                        {order.price != null ? ` — ${order.price} ريال` : ""}
                      </p>
                    )}
                    {order.notes && <p className="mt-1 text-xs text-liora-500">ملاحظات: {order.notes}</p>}
                    <p className="mt-1 text-xs text-liora-400" dir="ltr">
                      {formatDate(order.created_at)}
                      <span dir="rtl"> — المصدر: {labelForPlatform(order.platform)}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-end gap-2">
                    {order.source === "website" || order.source === "الموقع" ? (
                      <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-2.5 text-xs font-bold text-blue-700 ring-1 ring-blue-200">
                        <Globe size={14} /> موقع
                      </span>
                    ) : order.source === "whatsapp" || order.source === "واتساب" ? (
                      <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-2.5 text-xs font-bold text-green-700 ring-1 ring-green-200">
                        <MessageCircle size={14} /> واتساب
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 rounded-full bg-liora-50 px-3 py-2.5 text-xs font-bold text-liora-700 ring-1 ring-liora-100">{order.source}</span>
                    )}

                    <select value={order.status} onChange={(event) => handleStatusChange(order.id, event.target.value)} className={`rounded-full border px-3 py-2.5 text-sm font-bold shadow outline-none transition ${STATUS_COLOR_CLASSES[order.status]?.select ?? "border-liora-100 bg-white text-liora-800 focus:border-liora-500"}`}>
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>

                    <label className="flex flex-col gap-1">
                      <span className="px-1 text-xs font-bold text-liora-700">حالة التحصيل</span>
                      <select
                        value={order.collection_status ?? "لم يتم التحصيل"}
                        onChange={(event) => handleCollectionStatusChange(order.id, event.target.value as Order["collection_status"])}
                        className={`rounded-full border px-3 py-2.5 text-sm font-bold shadow outline-none transition ${
                          order.collection_status === "تم التحصيل"
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        <option value="تم التحصيل">تم التحصيل</option>
                        <option value="لم يتم التحصيل">لم يتم التحصيل</option>
                      </select>
                    </label>

                    <a href={toWhatsappLink(order.phone, whatsappMessage(order))} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-green-500 px-5 py-2.5 font-bold text-white shadow transition hover:scale-105">
                      <MessageCircle size={18} /> واتساب
                    </a>

                    <button onClick={() => setEditingOrder(order)} className="flex items-center justify-center rounded-full bg-white px-4 py-2.5 font-bold text-liora-800 shadow ring-1 ring-liora-100 transition hover:scale-105 hover:bg-liora-50">
                      <Pencil size={18} />
                    </button>

                    <button onClick={() => handleDelete(order)} className="flex items-center justify-center rounded-full bg-white px-4 py-2.5 font-bold text-red-600 shadow ring-1 ring-red-200 transition hover:scale-105 hover:bg-red-50">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : !filteredLeads ? (
          <p className="mt-8 text-center text-liora-700">جارِ التحميل...</p>
        ) : filteredLeads.length === 0 ? (
          <p className="mt-8 text-center text-liora-700">لا يوجد ليدز في الفترة دي</p>
        ) : (
          <div className="mt-6 space-y-3">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-liora-100 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-liora-900">{lead.full_name}</p>
                  <p className="text-sm text-liora-700" dir="ltr">{lead.phone}</p>
                  {lead.notes && <p className="mt-1 text-xs text-liora-500">ملاحظات: {lead.notes}</p>}
                  <p className="mt-1 text-xs text-liora-400" dir="ltr">{formatDate(lead.created_at)}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {lead.source === "website" ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-2.5 text-xs font-bold text-blue-700 ring-1 ring-blue-200"><Globe size={14} /> موقع</span>
                  ) : (
                    <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-2.5 text-xs font-bold text-green-700 ring-1 ring-green-200"><MessageCircle size={14} /> واتساب</span>
                  )}

                  <a href={toWhatsappLink(lead.phone, `مرحباً ${lead.full_name} 👋\n\nحابين نتابع معك بخصوص اهتمامك بمجموعة Liora التعليمية، تحبي نساعدك بأي استفسار؟`)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-green-500 px-5 py-2.5 font-bold text-white shadow transition hover:scale-105">
                    <MessageCircle size={18} /> واتساب
                  </a>

                  <button onClick={() => setEditingLead(lead)} className="flex items-center justify-center rounded-full bg-white px-4 py-2.5 font-bold text-liora-800 shadow ring-1 ring-liora-100 transition hover:scale-105 hover:bg-liora-50"><Pencil size={18} /></button>
                  <button onClick={() => handleDeleteLead(lead)} className="flex items-center justify-center rounded-full bg-white px-4 py-2.5 font-bold text-red-600 shadow ring-1 ring-red-200 transition hover:scale-105 hover:bg-red-50"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && <OrderModal onClose={() => setShowAddModal(false)} onSaved={loadOrders} />}
      {editingOrder && <OrderModal order={editingOrder} onClose={() => setEditingOrder(null)} onSaved={loadOrders} />}
      {showAddLeadModal && <LeadModal onClose={() => setShowAddLeadModal(false)} onSaved={loadLeads} />}
      {editingLead && <LeadModal lead={editingLead} onClose={() => setEditingLead(null)} onSaved={loadLeads} />}
    </main>
  );
}
