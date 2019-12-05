import enUS from './locale/en';

let defaultLocale = 'en';
const locales = {};
locales[defaultLocale] = enUS;

export function locale(name, object, isLocal) {
  if (typeof name !== 'string') return locales[defaultLocale];
  let l = defaultLocale;
  if (locales[name]) {
    l = name;
  }
  if (object) {
    locales[name] = object;
    l = name;
  }
  if (!isLocal) {
    defaultLocale = l;
  }
  return locales[name] || locales[defaultLocale];
}

/**
 * get locale object
 * @param {string} name lang
 */
export function getLocale(name) {
  return locale(name, null, true);
}

/**
 * get locale field value
 * @param {string} field field eg: 'formatLocale.shortMonth'
 * @param {object} lang locale object
 */
export function getLocaleFieldValue(field, lang) {
  const arr = (field || '').split('.');
  let current = lang || getLocale();
  let value;
  for (let i = 0, len = arr.length; i < len; i++) {
    const prop = arr[i];
    value = current[prop];
    if (i === len - 1) {
      return value;
    }
    if (!value) {
      return null;
    }
    current = value;
  }
  return null;
}
