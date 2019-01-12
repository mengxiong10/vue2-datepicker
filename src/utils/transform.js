import { isValidDate, isValidRange, parseDate, formatDate } from './index'

export const transformDate = {
  date: {
    value2date: (value) => isValidDate(value) ? new Date(value) : null,
    date2value: (date) => date
  },
  timestamp: {
    value2date: (value) => isValidDate(value) ? new Date(value) : null,
    date2value: (date) => isValidDate(date) ? new Date(date).getTime() : null
  },
  format: {
    value2date: parseDate,
    date2value: (date, format) => isValidDate(date) ? formatDate(date, format) : null
  }
}

export const transformDateRange = {
  date: {
    value2date: (value) => isValidRange(value) ? [new Date(value[0]), new Date(value[1])] : [null, null],
    date2value: (date) => date
  },
  timestamp: {
    value2date: (value) => isValidRange(value) ? [new Date(value[0]), new Date(value[1])] : [null, null],
    date2value: (date) => date.map(transformDate.timestamp.date2value)
  },
  format: {
    value2date: (value, format) => {
      if (Array.isArray(value) && value.length === 2) {
        const value0 = parseDate(value[0], format)
        const value1 = parseDate(value[1], format)
        if (value0 && value1 && value1 >= value0) {
          return [value0, value1]
        }
      }
      return [null, null]
    },
    date2value: (date, format) => date.map(v => transformDate.format.date2value(v, format))
  }
}
