import DatePicker from 'vue2-datepicker-keyup';
import ka from 'date-format-parse/lib/locale/ka';

const lang = {
  formatLocale: ka,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('ka', lang);

export default lang;
