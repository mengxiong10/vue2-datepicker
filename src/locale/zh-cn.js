import DatePicker from 'vue2-datepicker-keyup';
import zhCN from 'date-format-parse/lib/locale/zh-cn';

const lang = {
  formatLocale: zhCN,
  yearFormat: 'YYYY年',
  monthFormat: 'MMM',
  monthBeforeYear: false,
};

DatePicker.locale('zh-cn', lang);

export default lang;
