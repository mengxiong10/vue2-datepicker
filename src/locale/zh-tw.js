import DatePicker from 'vue2-datepicker-keyup';
import zhTW from 'date-format-parse/lib/locale/zh-tw';

const lang = {
  formatLocale: zhTW,
  yearFormat: 'YYYY年',
  monthFormat: 'MMM',
  monthBeforeYear: false,
};

DatePicker.locale('zh-tw', lang);

export default lang;
