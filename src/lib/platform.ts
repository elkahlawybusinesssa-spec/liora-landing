const KEY = "liora_platform";

export function capturePlatformFromUrl(): string {
  if (typeof window === "undefined") return "direct";
  const src = new URLSearchParams(window.location.search).get("src");
  if (src) {
    const platform = src.toLowerCase();
    localStorage.setItem(KEY, platform);
    return platform;
  }
  return localStorage.getItem(KEY) || "direct";
}

export function getStoredPlatform(): string {
  if (typeof window === "undefined") return "direct";
  return localStorage.getItem(KEY) || "direct";
}
