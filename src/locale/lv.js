import DatePicker from 'vue2-datepicker';
import lv from 'date-format-parse/lib/locale/lv';

const lang = {
  formatLocale: lv,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: false,
};

DatePicker.locale('lv', lang);

export default lang;
