import DatePicker from 'vue2-datepicker-keyup';
import gu from 'date-format-parse/lib/locale/gu';

const lang = {
  formatLocale: gu,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('gu', lang);

export default lang;
