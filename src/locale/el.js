import DatePicker from 'vue2-datepicker-keyup';
import el from 'date-format-parse/lib/locale/el';

const lang = {
  formatLocale: el,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('el', lang);

export default lang;
