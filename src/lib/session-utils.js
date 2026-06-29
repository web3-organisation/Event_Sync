// src/lib/session-utils.js

/**
 * Returns true if the session is currently live.
 * @param {string|Date|null|undefined} startTime
 * @param {string|Date|null|undefined} endTime
 * @returns {boolean}
 */
export function isSessionLive(startTime, endTime) {
  if (!startTime || !endTime) return false;
  const now = new Date();
  return now >= new Date(startTime) && now <= new Date(endTime);
}

/**
 * Decorates a session object with an `isLive` boolean field.
 * @param {object} session
 * @returns {object}
 */
export function withLiveStatus(session) {
  return {
    ...session,
    isLive: isSessionLive(session.startTime, session.endTime),
  };
}

/**
 * Returns the status of a session: "upcoming" | "live" | "ended"
 * @param {string|Date} startTime
 * @param {string|Date} endTime
 * @returns {"upcoming"|"live"|"ended"}
 */
export function getSessionStatus(startTime, endTime) {
  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "live";
  return "ended";
}

/**
 * Formats a time range as "09:30 – 10:30"
 * @param {string|Date} start
 * @param {string|Date} end
 * @returns {string}
 */
export function formatTimeRange(start, end) {
  const fmt = (d) =>
    new Date(d).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  return `${fmt(start)} – ${fmt(end)}`;
}

/**
 * Formats a date as "Lun. 15 juin 2025"
 * @param {string|Date} date
 * @returns {string}
 */
export function formatEventDate(date) {
  return new Date(date).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Groups sessions by date string "YYYY-MM-DD"
 * @param {Array<{startTime: string}>} sessions
 * @returns {Map<string, Array>}
 */
export function groupSessionsByDate(sessions) {
  const map = new Map();
  for (const s of sessions) {
    const key = new Date(s.startTime).toISOString().split("T")[0];
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return map;
}
