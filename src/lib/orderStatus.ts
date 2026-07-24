export const STATUS_OPTIONS = [
  { value: "new", label: "طلب جديد", color: "blue" },
  { value: "contacted", label: "تم التواصل", color: "purple" },
  { value: "confirmed", label: "تم التأكيد", color: "amber" },
  { value: "delivered", label: "تم التسليم", color: "green" },
  { value: "interested_whatsapp", label: "عميل مهتم واتساب", color: "teal" },
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
  delivered: {
    active: "bg-green-600 text-white",
    inactive: "bg-green-50 text-green-700 hover:bg-green-100",
    select: "border-green-300 bg-green-500 text-white focus:border-green-500",
  },
  interested_whatsapp: {
    active: "bg-teal-600 text-white",
    inactive: "bg-teal-50 text-teal-700 hover:bg-teal-100",
    select: "border-teal-300 bg-teal-500 text-white focus:border-teal-500",
  },
};
