import { transformDate } from '../src/utils/transform'

const time = new Date(2019, 1, 3)
const timestamp = time.getTime()

const testfn = ({ type, value, date, err = null }) => it(`${type}}`, () => {
  const obj = transformDate
  const typeObj = obj[type]
  expect(typeObj.value2date(err)).toEqual(err)
  expect(typeObj.value2date(value)).toEqual(date)
  expect(typeObj.date2value(err)).toEqual(err)
  expect(typeObj.date2value(date)).toEqual(value)
})

describe('transformDate', () => {
  testfn({ type: 'date', value: time, date: time })
  testfn({ type: 'timestamp', value: timestamp, date: time })
})
