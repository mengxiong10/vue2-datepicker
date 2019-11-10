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
