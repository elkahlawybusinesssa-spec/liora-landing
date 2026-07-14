"use client";

import { trackInitiateCheckout } from "@/lib/pixels";

export default function ShopCTAButton() {
  return (
    <a
      href="/#order"
      onClick={() => trackInitiateCheckout()}
      className="mt-6 inline-block rounded-full bg-gold-500 px-8 py-4 text-lg font-black text-liora-950 shadow-lg"
    >
      تسوقي الآن 🎁
    </a>
  );
}
