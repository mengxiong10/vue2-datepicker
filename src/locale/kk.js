import DatePicker from 'vue2-datepicker-keyup';
import kk from 'date-format-parse/lib/locale/kk';

const lang = {
  formatLocale: kk,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('kk', lang);

export default lang;
