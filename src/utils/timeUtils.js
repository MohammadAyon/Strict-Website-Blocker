export function calculateEndDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + parseInt(days));
  return date.getTime();
}

export function isBlockingExpired(endDate) {
  if (!endDate) return true;
  return Date.now() >= endDate;
}

export function getRemainingDays(endDate) {
  if (!endDate) return 0;
  const remaining = endDate - Date.now();
  return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));
}