export function isSessionLive(startTime, endTime) {
  if (!startTime || !endTime) return false;
  const now = new Date();
  return now >= new Date(startTime) && now <= new Date(endTime);
}
