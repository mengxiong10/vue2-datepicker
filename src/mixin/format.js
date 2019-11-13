import { format } from 'date-format-parse';
import LocaleMixin from './locale';

export default {
  mixins: [LocaleMixin],
  methods: {
    formatDate(date, fmt) {
      return format(date, fmt, { locale: this.t('formatLocale') });
    },
  },
};
