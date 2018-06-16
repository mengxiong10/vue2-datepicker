import DatePicker from './index.vue'
import './index.scss'

DatePicker.install = function (Vue) {
  Vue.component(DatePicker.name, DatePicker)
}

export default DatePicker
