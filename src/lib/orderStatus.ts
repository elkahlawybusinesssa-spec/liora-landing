export const STATUS_OPTIONS = [
  { value: "new", label: "طلب جديد", color: "blue" },
  { value: "contacted", label: "تم التواصل", color: "purple" },
  { value: "confirmed", label: "تم التاكيد - لم يتم اصدار بوليصة", color: "amber" },
  { value: "confirmed", label: "تم التاكيد - تم اصدار بوليصة", color: "purple" },
  { value: "shipment_not_delivered", label: "لم يتم تسليم الشحنة", color: "orange" },
  { value: "delivered", label: "تم تسليم الشحنة", color: "green" },
  { value: "لم يتم التحصيل", label: "لم يتم التحصيل", color: "red" },
  { value: "تم التحصيل", label: "تم التحصيل", color: "emerald" },
];

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
  confirmed: {
    active: "bg-amber-600 text-white",
    inactive: "bg-amber-50 text-amber-700 hover:bg-amber-100",
    select: "border-amber-300 bg-amber-500 text-white focus:border-amber-500",
  },
  shipment_not_delivered: {
    active: "bg-orange-600 text-white",
    inactive: "bg-orange-50 text-orange-700 hover:bg-orange-100",
    select: "border-orange-300 bg-orange-500 text-white focus:border-orange-500",
  },
  delivered: {
    active: "bg-green-600 text-white",
    inactive: "bg-green-50 text-green-700 hover:bg-green-100",
    select: "border-green-300 bg-green-500 text-white focus:border-green-500",
  },
  "لم يتم التحصيل": {
    active: "bg-red-600 text-white",
    inactive: "bg-red-50 text-red-700 hover:bg-red-100",
    select: "border-red-300 bg-red-500 text-white focus:border-red-500",
  },
  "تم التحصيل": {
    active: "bg-emerald-600 text-white",
    inactive: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    select: "border-emerald-300 bg-emerald-500 text-white focus:border-emerald-500",
  },
};