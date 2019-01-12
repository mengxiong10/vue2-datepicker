import { transformDate, transformDateRange } from '../src/utils/transform'

const time = new Date(2019, 1, 3)
const timestamp = time.getTime()
const format = 'MM-DD-YYYY'
const text = '02-03-2019'

const testfn = ({ type, value, date, err = null, range = false }) => it(`${type}}`, () => {
  const obj = range ? transformDateRange : transformDate
  const typeObj = obj[type]
  expect(typeObj.value2date(err, format)).toEqual(err)
  expect(typeObj.value2date(value, format)).toEqual(date)
  expect(typeObj.date2value(err, format)).toEqual(err)
  expect(typeObj.date2value(date, format)).toEqual(value)
})

describe('transformDate', () => {
  testfn({ type: 'date', value: time, date: time })
  testfn({ type: 'format', value: text, date: time })
  testfn({ type: 'timestamp', value: timestamp, date: time })
})

describe('transformDateRange', () => {
  const err = [null, null]
  const date = [time, time]
  testfn({ type: 'date', value: [time, time], date, err, range: true })
  testfn({ type: 'format', value: [text, text], date, err, range: true })
  testfn({ type: 'timestamp', value: [timestamp, timestamp], date, err, range: true })
})
