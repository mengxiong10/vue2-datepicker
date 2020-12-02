import DatePicker from 'vue2-datepicker-keyup';
import tr from 'date-format-parse/lib/locale/tr';

const lang = {
  formatLocale: tr,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('tr', lang);

export default lang;
