/* istanbul ignore file */
import DatePicker from './date-picker';
import CalendarPanel from './calendar/calendar-panel';
import CalendarRange from './calendar/calendar-range';
import TimePanel from './time/time-panel';
import TimeRange from './time/time-range';
import DatetimePanel from './datetime/datetime-panel';
import DatetimeRange from './datetime/datetime-range';
import { locale } from './locale';

DatePicker.locale = locale;

DatePicker.install = function install(Vue) {
  Vue.component(DatePicker.name, DatePicker);
};

if (typeof window !== 'undefined' && window.Vue) {
  DatePicker.install(window.Vue);
}

Object.assign(DatePicker, {
  CalendarPanel,
  CalendarRange,
  TimePanel,
  TimeRange,
  DatetimePanel,
  DatetimeRange,
});

export default DatePicker;
