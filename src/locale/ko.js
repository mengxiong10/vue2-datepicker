import DatePicker from 'vue2-datepicker-keyup';
import ko from 'date-format-parse/lib/locale/ko';

const lang = {
  formatLocale: ko,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: false,
};

DatePicker.locale('ko', lang);

export default lang;
