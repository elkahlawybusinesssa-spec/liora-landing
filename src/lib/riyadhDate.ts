const RIYADH_OFFSET_MS = 3 * 60 * 60 * 1000;

/** Calendar date (YYYY-MM-DD) in Riyadh time (UTC+3) for a given instant. */
export function toRiyadhDateString(date: Date | string = new Date()): string {
  const instant = typeof date === "string" ? new Date(date) : date;
  return new Date(instant.getTime() + RIYADH_OFFSET_MS).toISOString().slice(0, 10);
}

/** Turns a {from, to} calendar-date range into Riyadh-midnight-anchored ISO bounds for Postgres queries. */
export function riyadhRangeBounds(range: { from: string | null; to: string | null }) {
  return {
    gte: range.from ? `${range.from}T00:00:00+03:00` : undefined,
    lte: range.to ? `${range.to}T23:59:59.999+03:00` : undefined,
  };
}
