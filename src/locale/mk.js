import DatePicker from 'vue2-datepicker';
import mk from 'date-format-parse/lib/locale/mk';

const lang = {
  formatLocale: mk,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('mk', lang);

export default lang;
