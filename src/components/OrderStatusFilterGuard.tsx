"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const FILTER_LABEL_TO_VALUE: Record<string, string> = {
  "طلب جديد": "new",
  "تم التواصل": "contacted",
  "تم التاكيد - لم يتم اصدار بوليصة": "confirmed_no_waybill",
  "تم التاكيد - تم اصدار بوليصة": "confirmed_waybill",
  "لم يتم تسليم الشحنة": "shipment_not_delivered",
  "تم تسليم الشحنة": "shipment_delivered",
  "لم يتم التحصيل": "not_collected",
  "تم التحصيل": "collected",
};

function normalize(value: string | null | undefined) {
  return (value || "").replace(/\s+/g, " ").trim();
}

export default function OrderStatusFilterGuard() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/admin/orders") return;

    let selectedValue = "all";

    const applyFilter = () => {
      const workflowSelects = Array.from(document.querySelectorAll<HTMLSelectElement>("select")).filter((select) =>
        Array.from(select.options).some((option) => normalize(option.textContent) === "طلب جديد")
      );

      workflowSelects.forEach((select) => {
        const card = select.closest<HTMLElement>("div.rounded-2xl.bg-white.p-4.shadow-sm");
        if (!card) return;
        card.style.display = selectedValue === "all" || select.value === selectedValue ? "" : "none";
      });
    };

    const handleClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement | null)?.closest("button");
      if (!button) return;

      const label = normalize(button.textContent);
      const isAll = label === "كل الحالات";
      const value = FILTER_LABEL_TO_VALUE[label];
      if (!isAll && !value) return;

      const analyticsHeading = Array.from(document.querySelectorAll("h2")).find(
        (heading) => normalize(heading.textContent) === "لوحة التحليلات"
      );
      const analyticsSection = analyticsHeading?.parentElement?.parentElement;
      if (!analyticsSection?.contains(button)) return;

      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();

      selectedValue = isAll ? "all" : value;
      applyFilter();
    };

    document.addEventListener("click", handleClick, true);
    const observer = new MutationObserver(() => applyFilter());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("click", handleClick, true);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
