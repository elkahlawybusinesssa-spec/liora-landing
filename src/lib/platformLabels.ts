const LABELS: Record<string, string> = {
  facebook: "فيسبوك",
  face: "فيسبوك",
  fb: "فيسبوك",
  instagram: "انستقرام",
  ig: "انستقرام",
  tiktok: "تيك توك",
  snapchat: "سناب شات",
  snap: "سناب شات",
  google: "جوجل",
  whatsapp: "واتساب",
  direct: "مباشر / غير معروف",
};

export function labelForPlatform(platform: string | null | undefined): string {
  if (!platform) return LABELS.direct;
  return LABELS[platform.toLowerCase()] ?? platform;
}

const CANONICAL_KEYS: Record<string, string> = {
  face: "facebook",
  fb: "facebook",
  ig: "instagram",
  snap: "snapchat",
};

/** Normalizes aliases (e.g. "face" -> "facebook") so they group under one key. */
export function normalizePlatform(platform: string | null | undefined): string {
  if (!platform) return "direct";
  const lower = platform.toLowerCase();
  return CANONICAL_KEYS[lower] ?? lower;
}
