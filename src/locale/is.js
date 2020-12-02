import DatePicker from 'vue2-datepicker-keyup';
import is from 'date-format-parse/lib/locale/is';

const lang = {
  formatLocale: is,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('is', lang);

export default lang;
