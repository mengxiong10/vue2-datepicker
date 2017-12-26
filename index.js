import DatePicker from './datepicker/index.vue'

DatePicker.install = function (Vue) {
  Vue.component(DatePicker.name, DatePicker)
}

export default DatePicker
