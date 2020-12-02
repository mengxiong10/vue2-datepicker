import DatePicker from 'vue2-datepicker-keyup';
import nb from 'date-format-parse/lib/locale/nb';

const lang = {
  formatLocale: nb,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('nb', lang);

export default lang;
