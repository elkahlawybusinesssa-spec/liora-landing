"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle, RefreshCw, LogOut, Plus, Trash2, Pencil, Settings, UserPlus } from "lucide-react";
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
  shipping_company_status?: "تم التسليم" | "لم يتم التسليم";
  collection_status: "تم التحصيل" | "لم يتم التحصيل";
  national_address?: string | null;
  waybill_status?: "تم الاصدار" | "لم يتم الاصدار";
  waybill_number?: string | null;
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

const ORDER_AND_COLLECTION_OPTIONS = [
  ...STATUS_OPTIONS.filter((item) => item.value !== "interested_whatsapp"),
  { value: "لم يتم التحصيل", label: "لم يتم التحصيل" },
  { value: "تم التحصيل", label: "تم التحصيل" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

function customerWhatsappMessage(order: Order) {
  return `مرحباً ${order.full_name} 🎁\n\nتم استلام طلبك لمجموعة Liora التعليمية بنجاح ✅\nفريقنا بيتواصل معك خلال ساعات لتأكيد الطلب وتحديد موعد التوصيل.\n\nشكراً لثقتك في Liora 💜`;
}

function shippingWhatsappMessage(order: Order) {
  return `بيانات العميل للشحن:\n\nالاسم: ${order.full_name}\nرقم الهاتف: ${order.phone}\nالمدينة: ${order.city}\nاللوكيشن: ${order.address || "غير مضاف"}\nالعنوان الوطني: ${order.national_address}`;
}

function shippingStage(order: Order) {
  if (order.shipping_company_status === "تم التسليم") return "تم تسليم الطلب";
  if (order.waybill_status === "تم الاصدار" && order.shipping_company_status === "لم يتم التسليم") return "لم يتم تسليم الطلب";
  if (order.waybill_status === "تم الاصدار") return "تم إصدار بوليصة";
  return "لم يتم إصدار بوليصة";
}

function customerSource(order: Order) {
  return order.source === "website" || order.source === "الموقع" ? "موقع" : order.source || "غير محدد";
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
  const [editingNationalAddressId, setEditingNationalAddressId] = useState<string | null>(null);
  const [nationalAddressDrafts, setNationalAddressDrafts] = useState<Record<string, string>>({});
  const [editingWaybillId, setEditingWaybillId] = useState<string | null>(null);
  const [waybillDrafts, setWaybillDrafts] = useState<Record<string, string>>({});

  const loadOrders = useCallback(async () => {
    setError("");
    const { data, error: fetchError } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (fetchError) { setError("تعذر تحميل الطلبات"); return; }
    setOrders(data as Order[]);
  }, []);

  const loadLeads = useCallback(async () => {
    setError("");
    const { data, error: fetchError } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (fetchError) { setError("تعذر تحميل الليدز"); return; }
    setLeads(data as Lead[]);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.replace("/admin"); return; }
      setCheckingAuth(false);
      loadOrders();
      loadLeads();
    });
  }, [router, loadOrders, loadLeads]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin");
  }

  async function updateOrderFields(orderId: string, values: Partial<Order>, errorMessage: string) {
    const previous = orders?.find((order) => order.id === orderId);
    setOrders((prev) => prev ? prev.map((order) => order.id === orderId ? { ...order, ...values } : order) : prev);
    const { error: updateError } = await supabase.from("orders").update(values).eq("id", orderId);
    if (updateError) {
      setError(errorMessage);
      if (previous) setOrders((prev) => prev ? prev.map((order) => order.id === orderId ? previous : order) : prev);
      return false;
    }
    return true;
  }

  async function saveNationalAddress(order: Order) {
    const value = (nationalAddressDrafts[order.id] ?? order.national_address ?? "").trim();
    if (!value) { setError("اكتب العنوان الوطني أولاً ثم اضغط حفظ"); return; }
    if (await updateOrderFields(order.id, { national_address: value }, "تعذر حفظ العنوان الوطني")) {
      setEditingNationalAddressId(null);
      setError("");
    }
  }

  async function saveWaybillNumber(order: Order) {
    const value = (waybillDrafts[order.id] ?? order.waybill_number ?? "").trim();
    if (await updateOrderFields(order.id, { waybill_number: value }, "تعذر حفظ رقم البوليصة")) setEditingWaybillId(null);
  }

  async function changeOrderAndCollection(order: Order, value: string) {
    if (value === "تم التحصيل" || value === "لم يتم التحصيل") {
      await updateOrderFields(order.id, { status: value, collection_status: value }, "تعذر حفظ حالة الطلب / التحصيل");
    } else {
      await updateOrderFields(order.id, { status: value }, "تعذر حفظ حالة الطلب / التحصيل");
    }
  }

  async function changeShippingStage(order: Order, value: string) {
    if (value === "لم يتم إصدار بوليصة") {
      await updateOrderFields(order.id, { waybill_status: "لم يتم الاصدار", shipping_company_status: "لم يتم التسليم" }, "تعذر حفظ حالة شركة الشحن");
      return;
    }
    if (value === "تم إصدار بوليصة") {
      await updateOrderFields(order.id, { waybill_status: "تم الاصدار" }, "تعذر حفظ حالة شركة الشحن");
      return;
    }
    if (value === "لم يتم تسليم الطلب") {
      await updateOrderFields(order.id, { waybill_status: "تم الاصدار", shipping_company_status: "لم يتم التسليم" }, "تعذر حفظ حالة شركة الشحن");
      return;
    }
    await updateOrderFields(order.id, { waybill_status: "تم الاصدار", shipping_company_status: "تم التسليم" }, "تعذر حفظ حالة شركة الشحن");
  }

  function contactShippingCompany(order: Order) {
    if (!order.national_address?.trim()) {
      const message = "لا يمكن التواصل مع شركة الشحن قبل إضافة العنوان الوطني وحفظه";
      setError(message);
      window.alert(message);
      return;
    }
    setError("");
    window.open(`https://wa.me/?text=${encodeURIComponent(shippingWhatsappMessage(order))}`, "_blank", "noopener,noreferrer");
  }

  async function handleDelete(order: Order) {
    if (!confirm(`متأكدة إنك عايزة تحذفي طلب "${order.full_name}"؟ الإجراء ده مش قابل للتراجع.`)) return;
    setOrders((prev) => prev ? prev.filter((item) => item.id !== order.id) : prev);
    await supabase.from("orders").delete().eq("id", order.id);
  }

  async function handleDeleteLead(lead: Lead) {
    if (!confirm(`متأكدة إنك عايزة تحذفي ليد "${lead.full_name}"؟ الإجراء ده مش قابل للتراجع.`)) return;
    setLeads((prev) => prev ? prev.filter((item) => item.id !== lead.id) : prev);
    await supabase.from("leads").delete().eq("id", lead.id);
  }

  const filteredOrders = orders?.filter((order) => {
    const created = toRiyadhDateString(order.created_at);
    if (dateRange.from && created < dateRange.from) return false;
    if (dateRange.to && created > dateRange.to) return false;
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    return true;
  }) ?? null;

  const filteredLeads = leads?.filter((lead) => {
    const created = toRiyadhDateString(lead.created_at);
    if (dateRange.from && created < dateRange.from) return false;
    if (dateRange.to && created > dateRange.to) return false;
    return true;
  }) ?? null;

  if (checkingAuth) return null;

  const labelClass = "px-1 text-xs font-bold text-liora-700";
  const selectBase = "w-full rounded-xl border px-3 py-2.5 text-sm font-bold shadow-sm outline-none transition";

  return (
    <main className="min-h-screen bg-liora-50 px-2 py-8 sm:px-3 lg:px-4" dir="rtl">
      <div className="mx-auto w-full max-w-[1900px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-black text-liora-900">{tab === "orders" ? `طلبات العملاء ${filteredOrders ? `(${filteredOrders.length})` : ""}` : `الليدز المهتمة ${filteredLeads ? `(${filteredLeads.length})` : ""}`}</h1>
          <div className="flex flex-wrap gap-2">
            {tab === "orders" ? <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 rounded-full bg-gold-500 px-4 py-2 text-sm font-bold text-liora-950 shadow"><Plus size={16} /> إضافة طلب</button> : <button onClick={() => setShowAddLeadModal(true)} className="flex items-center gap-2 rounded-full bg-gold-500 px-4 py-2 text-sm font-bold text-liora-950 shadow"><UserPlus size={16} /> إضافة ليد</button>}
            <Link href="/admin/settings" className="flex items-center gap-2 rounded-full bg-liora-800 px-4 py-2 text-sm font-bold text-white shadow"><Settings size={16} /> الأسعار والشحن</Link>
            <button onClick={() => tab === "orders" ? loadOrders() : loadLeads()} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-liora-800 shadow ring-1 ring-liora-100"><RefreshCw size={16} /> تحديث</button>
            <button onClick={handleLogout} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-red-600 shadow ring-1 ring-liora-100"><LogOut size={16} /> خروج</button>
          </div>
        </div>

        <div className="mt-4"><DateRangeFilter value={dateRange} onChange={setDateRange} /></div>
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-liora-100"><AnalyticsSummary dateRange={dateRange} statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} /></div>
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-liora-100"><PlatformBreakdown dateRange={dateRange} /></div>

        <div className="mt-6 flex gap-2 border-b border-liora-100">
          <button onClick={() => setTab("orders")} className={`px-4 py-2 text-sm font-bold ${tab === "orders" ? "border-b-2 border-liora-800 text-liora-900" : "text-liora-500"}`}>الطلبات</button>
          <button onClick={() => setTab("leads")} className={`px-4 py-2 text-sm font-bold ${tab === "leads" ? "border-b-2 border-liora-800 text-liora-900" : "text-liora-500"}`}>الليدز المهتمة</button>
        </div>

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

        {tab === "orders" ? (
          !filteredOrders ? <p className="mt-8 text-center text-liora-700">جارِ التحميل...</p> :
          filteredOrders.length === 0 ? <p className="mt-8 text-center text-liora-700">لا توجد طلبات في الفترة دي</p> :
          <div className="mt-6 space-y-4">
            {filteredOrders.map((order) => {
              const editingNational = editingNationalAddressId === order.id || !order.national_address;
              const editingWaybill = editingWaybillId === order.id || !order.waybill_number;
              const currentShippingStage = shippingStage(order);
              return (
                <div key={order.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-liora-100">
                  <div className="grid gap-5 2xl:grid-cols-[minmax(320px,0.9fr)_minmax(0,3.1fr)]">
                    <div>
                      <p className="font-bold text-liora-900">{order.full_name}</p>
                      <p className="text-sm text-liora-700" dir="ltr">{order.phone}</p>
                      <p className="text-sm text-liora-600">{order.city} — {order.address}</p>
                      {order.product && <p className="mt-1 text-xs text-liora-500">المنتج: {order.product}{order.quantity != null ? ` (${order.quantity} مجموعة)` : ""}{order.price != null ? ` — ${order.price} ريال` : ""}</p>}
                      {order.notes && <p className="mt-1 text-xs text-liora-500">ملاحظات: {order.notes}</p>}
                      <p className="mt-1 text-xs font-bold text-liora-600">مصدر العميل: {customerSource(order)}</p>
                      <p className="mt-1 text-xs text-liora-400" dir="ltr">{formatDate(order.created_at)}<span dir="rtl"> — المصدر: {labelForPlatform(order.platform)}</span></p>
                    </div>

                    <div dir="ltr" className="grid items-end gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-[70px_minmax(160px,1fr)_minmax(180px,1.2fr)_repeat(2,minmax(155px,1fr))]">
                      <div dir="rtl" className="flex flex-col gap-2">
                        <button title="تعديل الطلب" aria-label="تعديل الطلب" onClick={() => setEditingOrder(order)} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-liora-800 shadow ring-1 ring-liora-100"><Pencil size={18} /></button>
                        <button title="إلغاء الطلب" aria-label="إلغاء الطلب" onClick={() => handleDelete(order)} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-red-600 shadow ring-1 ring-red-200"><Trash2 size={18} /></button>
                      </div>

                      <div dir="rtl" className="flex min-w-0 flex-col gap-2">
                        <div className="flex flex-col gap-1"><span className={labelClass}>التواصل مع العميل</span><a href={toWhatsappLink(order.phone, customerWhatsappMessage(order))} target="_blank" rel="noopener noreferrer" className="flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-green-500 px-3 py-2.5 text-sm font-bold text-white shadow"><MessageCircle size={17} /> واتساب</a></div>
                        <div className="flex flex-col gap-1"><span className={labelClass}>التواصل مع شركة الشحن</span><button onClick={() => contactShippingCompany(order)} className={`flex min-h-[42px] items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-white shadow ${order.national_address?.trim() ? "bg-emerald-600" : "cursor-not-allowed bg-gray-400"}`}><MessageCircle size={17} /> واتساب</button></div>
                      </div>

                      <div dir="rtl" className="flex min-w-0 flex-col gap-1">
                        <span className={labelClass}>العنوان الوطني</span>
                        {editingNational ? <div className="flex gap-1"><input value={nationalAddressDrafts[order.id] ?? order.national_address ?? ""} onChange={(event) => setNationalAddressDrafts((prev) => ({ ...prev, [order.id]: event.target.value }))} placeholder="اكتب العنوان الوطني" className="min-w-0 flex-1 rounded-xl border border-liora-100 px-2 py-2.5 text-xs outline-none" /><button onClick={() => saveNationalAddress(order)} className="rounded-xl bg-liora-800 px-2 text-xs font-bold text-white">حفظ</button></div> : <div className="flex min-h-[42px] items-center justify-between gap-1 rounded-xl bg-liora-50 px-2 text-xs"><span className="truncate">{order.national_address}</span><button onClick={() => { setNationalAddressDrafts((prev) => ({ ...prev, [order.id]: order.national_address ?? "" })); setEditingNationalAddressId(order.id); }} className="font-bold text-liora-800">تعديل</button></div>}
                      </div>

                      <label dir="rtl" className="flex min-w-0 flex-col gap-1">
                        <span className={labelClass}>حالة الطلب / التحصيل</span>
                        <select value={order.status} onChange={(event) => changeOrderAndCollection(order, event.target.value)} className={`${selectBase} ${STATUS_COLOR_CLASSES[order.status]?.select ?? (order.status === "تم التحصيل" ? "border-green-200 bg-green-50 text-green-700" : order.status === "لم يتم التحصيل" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-liora-100 bg-white text-liora-800")}`}>{ORDER_AND_COLLECTION_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
                      </label>

                      <div dir="rtl" className="flex min-w-0 flex-col gap-1">
                        <span className={labelClass}>شركة الشحن</span>
                        <select value={currentShippingStage} onChange={(event) => changeShippingStage(order, event.target.value)} className={`${selectBase} ${currentShippingStage === "تم تسليم الطلب" ? "border-green-200 bg-green-50 text-green-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}><option value="لم يتم إصدار بوليصة">لم يتم إصدار بوليصة</option><option value="تم إصدار بوليصة">تم إصدار بوليصة</option><option value="لم يتم تسليم الطلب">لم يتم تسليم الطلب</option><option value="تم تسليم الطلب">تم تسليم الطلب</option></select>
                        {currentShippingStage !== "لم يتم إصدار بوليصة" && (editingWaybill ? <div className="mt-1 flex gap-1"><input value={waybillDrafts[order.id] ?? order.waybill_number ?? ""} onChange={(event) => setWaybillDrafts((prev) => ({ ...prev, [order.id]: event.target.value }))} placeholder="رقم البوليصة" className="min-w-0 flex-1 rounded-lg border border-liora-100 px-2 py-2 text-xs outline-none" /><button onClick={() => saveWaybillNumber(order)} className="rounded-lg bg-liora-800 px-2 text-xs font-bold text-white">حفظ</button></div> : <div className="mt-1 flex items-center justify-between gap-1 rounded-lg bg-liora-50 px-2 py-1.5 text-xs"><span className="truncate">{order.waybill_number}</span><button onClick={() => { setWaybillDrafts((prev) => ({ ...prev, [order.id]: order.waybill_number ?? "" })); setEditingWaybillId(order.id); }} className="font-bold text-liora-800">تعديل</button></div>)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : !filteredLeads ? <p className="mt-8 text-center text-liora-700">جارِ التحميل...</p> : filteredLeads.length === 0 ? <p className="mt-8 text-center text-liora-700">لا يوجد ليدز في الفترة دي</p> : (
          <div className="mt-6 space-y-3">{filteredLeads.map((lead) => <div key={lead.id} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-liora-100 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-liora-900">{lead.full_name}</p><p className="text-sm text-liora-700" dir="ltr">{lead.phone}</p>{lead.notes && <p className="mt-1 text-xs text-liora-500">ملاحظات: {lead.notes}</p>}<p className="mt-1 text-xs text-liora-400" dir="ltr">{formatDate(lead.created_at)}</p></div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-blue-50 px-3 py-2.5 text-xs font-bold text-blue-700 ring-1 ring-blue-200">{lead.source === "website" ? "موقع" : "واتساب"}</span><a href={toWhatsappLink(lead.phone, `مرحباً ${lead.full_name} 👋\n\nحابين نتابع معك بخصوص اهتمامك بمجموعة Liora التعليمية، تحبي نساعدك بأي استفسار؟`)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-green-500 px-5 py-2.5 font-bold text-white shadow"><MessageCircle size={18} /> واتساب</a><button onClick={() => setEditingLead(lead)} className="rounded-full bg-white px-4 py-2.5 text-liora-800 shadow ring-1 ring-liora-100"><Pencil size={18} /></button><button onClick={() => handleDeleteLead(lead)} className="rounded-full bg-white px-4 py-2.5 text-red-600 shadow ring-1 ring-red-200"><Trash2 size={18} /></button></div></div>)}</div>
        )}
      </div>

      {showAddModal && <OrderModal onClose={() => setShowAddModal(false)} onSaved={loadOrders} />}
      {editingOrder && <OrderModal order={editingOrder} onClose={() => setEditingOrder(null)} onSaved={loadOrders} />}
      {showAddLeadModal && <LeadModal onClose={() => setShowAddLeadModal(false)} onSaved={loadLeads} />}
      {editingLead && <LeadModal lead={editingLead} onClose={() => setEditingLead(null)} onSaved={loadLeads} />}
    </main>
  );
}
