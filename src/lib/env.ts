const PROD_HOSTNAMES = ["liorakidz.com", "www.liorakidz.com"];

/** True only when running on the real production domain (not localhost/preview/Vercel branches). */
export function isProdSite(): boolean {
  if (typeof window === "undefined") return false;
  return PROD_HOSTNAMES.includes(window.location.hostname);
}
