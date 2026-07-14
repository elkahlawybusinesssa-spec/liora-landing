declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void };
    snaptr?: (...args: unknown[]) => void;
  }
}

const ORDER_VALUE = 179;
const CURRENCY = "SAR";

export function trackOrderConversion(value: number = ORDER_VALUE) {
  if (typeof window === "undefined") return;

  window.fbq?.("track", "Purchase", {
    value,
    currency: CURRENCY,
    content_name: "Liora Educational Set",
  });

  window.ttq?.track("PlaceAnOrder", {
    value,
    currency: CURRENCY,
    content_name: "Liora Educational Set",
  });

  window.snaptr?.("track", "PURCHASE", {
    price: value,
    currency: CURRENCY,
  });
}

export function trackInitiateCheckout() {
  if (typeof window === "undefined") return;

  window.fbq?.("track", "InitiateCheckout", {
    value: ORDER_VALUE,
    currency: CURRENCY,
    content_name: "Liora Educational Set",
  });

  window.ttq?.track("InitiateCheckout", {
    value: ORDER_VALUE,
    currency: CURRENCY,
    content_name: "Liora Educational Set",
  });

  window.snaptr?.("track", "START_CHECKOUT", {
    price: ORDER_VALUE,
    currency: CURRENCY,
  });
}
