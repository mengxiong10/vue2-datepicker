import { format } from 'date-format-parse';
import { getLocale } from '../locale';

export default {
  inject: {
    locale: {
      default: getLocale(),
    },
  },
  methods: {
    formatDate(date, fmt) {
      return format(date, fmt, { locale: this.t('formatLocale') });
    },
  },
};
