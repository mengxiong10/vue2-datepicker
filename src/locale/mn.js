import DatePicker from 'vue2-datepicker';
import mn from 'date-format-parse/lib/locale/mn';

const lang = {
  formatLocale: mn,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: false,
};

DatePicker.locale('mn', lang);

export default lang;
