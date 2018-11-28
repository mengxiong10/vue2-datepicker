import DatePicker from './index.vue'
import './index.scss'

DatePicker.install = function (Vue) {
  Vue.component(DatePicker.name, DatePicker)
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  DatePicker.install(window.Vue)
}

export default DatePicker
