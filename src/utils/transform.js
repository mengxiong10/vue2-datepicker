import { isValidDate } from './index'

export const transformDate = {
  date: {
    value2date: (value) => isValidDate(value) ? new Date(value) : null,
    date2value: (date) => date
  },
  timestamp: {
    value2date: (value) => isValidDate(value) ? new Date(value) : null,
    date2value: (date) => date && new Date(date).getTime()
  }
}
