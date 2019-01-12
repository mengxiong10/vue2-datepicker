import lang from '../src/locale/languages'

const testLang = (key) => it(key, () => {
  expect(lang[key].days).toHaveLength(7)
  expect(lang[key].months).toHaveLength(12)
  expect(lang[key].pickers).toHaveLength(4)
})

describe('transformDate', () => {
  Object.keys(lang).forEach(key => testLang(key))
})
