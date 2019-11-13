// new Date(10, 0, 1) The year from 0 to 99 will be incremented by 1900 automatically.
export function createDate(y, M = 0, d = 1, h = 0, m = 0, s = 0, ms = 0) {
  const date = new Date(y, M, d, h, m, s, ms);
  if (y < 100 && y >= 0) {
    date.setFullYear(y);
  }
  return date;
}

export function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}

export function isValidRangeDate(date) {
  return Array.isArray(date) && date.length === 2 && date.every(isValidDate) && date[0] <= date[1];
}

export function getValidDate(value, ...backup) {
  const date = new Date(value);
  return isValidDate(date) ? date : getValidDate(...backup);
}
