import DatePicker from 'vue2-datepicker';
import be from 'date-format-parse/lib/locale/be';

const lang = {
  formatLocale: be,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('be', lang);

export default lang;
