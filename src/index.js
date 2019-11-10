/* istanbul ignore file */
import DatePicker from './date-picker.vue';
import { locale } from './locale';

DatePicker.locale = locale;

DatePicker.install = function install(Vue) {
  Vue.component(DatePicker.name, DatePicker);
};

if (typeof window !== 'undefined' && window.Vue) {
  DatePicker.install(window.Vue);
}

export default DatePicker;
