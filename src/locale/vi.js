import DatePicker from 'vue2-datepicker';
import vi from 'date-format-parse/lib/locale/vi';

const lang = {
  formatLocale: vi,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: false,
};

DatePicker.locale('vi', lang);

export default lang;
