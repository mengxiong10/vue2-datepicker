import enUS from './locale/en';

let defaultLocale = 'en';
const locales = {};
locales[defaultLocale] = enUS;

export function locale(name, object) {
  if (typeof name !== 'string') return locales[defaultLocale];
  if (object) {
    locales[name] = object;
    defaultLocale = name;
  }
  return locales[name] || locales[defaultLocale];
}
