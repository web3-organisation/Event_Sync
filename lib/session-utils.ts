// lib/session-utils.ts

export type SessionStatus = "upcoming" | "live" | "ended";

export function getSessionStatus(
  startTime: string | Date,
  endTime: string | Date
): SessionStatus {
  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "live";
  return "ended";
}

/** Format "09:30 – 10:30" */
export function formatTimeRange(start: string | Date, end: string | Date): string {
  const fmt = (d: string | Date) =>
    new Date(d).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  return `${fmt(start)} – ${fmt(end)}`;
}

/** Format "Lun. 15 juin 2025" */
export function formatEventDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Group sessions by date string "YYYY-MM-DD" */
export function groupSessionsByDate<T extends { startTime: string }>(
  sessions: T[]
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const s of sessions) {
    const key = new Date(s.startTime).toISOString().split("T")[0];
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }
  return map;
}
