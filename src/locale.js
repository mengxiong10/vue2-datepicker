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
