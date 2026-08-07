export type WorkflowStatus =
  | "new"
  | "contacted"
  | "confirmed_no_waybill"
  | "confirmed_waybill"
  | "shipped"
  | "shipment_not_delivered"
  | "delivered_not_collected"
  | "collected"
  | "cancelled";

export interface WorkflowOrderFields {
  status: string;
  shipping_company_status?: string | null;
  collection_status?: string | null;
  waybill_status?: string | null;
}

export const STATUS_OPTIONS: Array<{ value: WorkflowStatus; label: string; color: string }> = [
  { value: "new", label: "طلب جديد", color: "blue" },
  { value: "contacted", label: "تم التواصل لتأكيد الطلب", color: "purple" },
  { value: "confirmed_no_waybill", label: "تم التاكيد - لم يتم اصدار بوليصة", color: "amber" },
  { value: "confirmed_waybill", label: "تم اصدار بوليصة", color: "purple" },
  { value: "shipped", label: "تم الشحن", color: "cyan" },
  { value: "shipment_not_delivered", label: "لم يتم تسليم الشحنة", color: "orange" },
  { value: "delivered_not_collected", label: "تم تسليم الشحنة - لم يتم التحصيل", color: "red" },
  { value: "collected", label: "تم التحصيل", color: "emerald" },
  { value: "cancelled", label: "ملغي", color: "gray" },
];

export function getWorkflowStatus(order: WorkflowOrderFields): WorkflowStatus {
  if (order.status === "cancelled") return "cancelled";
  if (order.status === "تم التحصيل" || order.collection_status === "تم التحصيل") return "collected";
  if (
    order.status === "لم يتم التحصيل" ||
    order.status === "delivered" ||
    order.shipping_company_status === "تم التسليم"
  ) return "delivered_not_collected";
  if (order.status === "shipment_not_delivered") return "shipment_not_delivered";
  if (order.status === "shipped") return "shipped";
  if (order.status === "confirmed" && order.waybill_status === "تم الاصدار") return "confirmed_waybill";
  if (order.status === "confirmed") return "confirmed_no_waybill";
  if (order.status === "contacted") return "contacted";
  return "new";
}

export const STATUS_COLOR_CLASSES: Record<string, { active: string; inactive: string; select: string }> = {
  new: {
    active: "bg-blue-600 text-white",
    inactive: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    select: "border-blue-300 bg-blue-500 text-white focus:border-blue-500",
  },
  contacted: {
    active: "bg-purple-600 text-white",
    inactive: "bg-purple-50 text-purple-700 hover:bg-purple-100",
    select: "border-purple-300 bg-purple-500 text-white focus:border-purple-500",
  },
  confirmed_no_waybill: {
    active: "bg-amber-600 text-white",
    inactive: "bg-amber-50 text-amber-700 hover:bg-amber-100",
    select: "border-amber-300 bg-amber-500 text-white focus:border-amber-500",
  },
  confirmed_waybill: {
    active: "bg-purple-600 text-white",
    inactive: "bg-purple-50 text-purple-700 hover:bg-purple-100",
    select: "border-purple-300 bg-purple-500 text-white focus:border-purple-500",
  },
  shipped: {
    active: "bg-cyan-600 text-white",
    inactive: "bg-cyan-50 text-cyan-700 hover:bg-cyan-100",
    select: "border-cyan-300 bg-cyan-500 text-white focus:border-cyan-500",
  },
  shipment_not_delivered: {
    active: "bg-orange-600 text-white",
    inactive: "bg-orange-50 text-orange-700 hover:bg-orange-100",
    select: "border-orange-300 bg-orange-500 text-white focus:border-orange-500",
  },
  delivered_not_collected: {
    active: "bg-red-600 text-white",
    inactive: "bg-red-50 text-red-700 hover:bg-red-100",
    select: "border-red-300 bg-red-500 text-white focus:border-red-500",
  },
  collected: {
    active: "bg-emerald-600 text-white",
    inactive: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    select: "border-emerald-300 bg-emerald-500 text-white focus:border-emerald-500",
  },
  cancelled: {
    active: "bg-gray-600 text-white",
    inactive: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    select: "border-gray-300 bg-gray-500 text-white focus:border-gray-500",
  },
};