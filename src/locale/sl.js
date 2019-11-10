import DatePicker from 'vue2-datepicker';
import sl from 'date-format-parse/lib/locale/sl';

const lang = {
  formatLocale: sl,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('sl', lang);

export default lang;
