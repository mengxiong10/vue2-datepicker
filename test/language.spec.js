import lang from '../src/locale/languages'
import fechaLocale from '../src/locale/fecha.i18n'

const testLang = (key) => it(key, () => {
  expect(lang[key].days).toHaveLength(7)
  expect(lang[key].months).toHaveLength(12)
  expect(lang[key].pickers).toHaveLength(4)
})

const testFechaLocale = (key) => it(key, () => {
  expect(fechaLocale[key].dayNamesShort).toHaveLength(7)
  expect(fechaLocale[key].dayNames).toHaveLength(7)
  expect(fechaLocale[key].monthNamesShort).toHaveLength(12)
  expect(fechaLocale[key].monthNames).toHaveLength(12)
  expect(fechaLocale[key].amPm).toHaveLength(2)
  expect(typeof fechaLocale[key].DoFn).toBe('function')
})

describe('transformDate', () => {
  Object.keys(lang).forEach(key => testLang(key))
  testFechaLocale('en')
})
