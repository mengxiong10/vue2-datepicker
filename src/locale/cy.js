import DatePicker from 'vue2-datepicker';
import cy from 'date-format-parse/lib/locale/cy';

const lang = {
  formatLocale: cy,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('cy', lang);

export default lang;
