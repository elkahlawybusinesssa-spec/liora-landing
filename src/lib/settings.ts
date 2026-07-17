import { supabase } from "@/lib/supabase";

export interface SiteSettings {
  original_price: number;
  price_1: number;
  price_2: number;
  price_3: number;
  shipping_delivery_label: string;
  shipping_delivery_cost: number;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  original_price: 299,
  price_1: 159,
  price_2: 294,
  price_3: 404,
  shipping_delivery_label: "الشحن إلى باب المنزل",
  shipping_delivery_cost: 0,
};

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return DEFAULT_SETTINGS;

  return {
    original_price: Number(data.original_price),
    price_1: Number(data.price_1),
    price_2: Number(data.price_2),
    price_3: Number(data.price_3),
    shipping_delivery_label: data.shipping_delivery_label,
    shipping_delivery_cost: Number(data.shipping_delivery_cost),
  };
}
