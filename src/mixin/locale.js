import { getLocale } from '../locale';

export default {
  inject: {
    locale: {
      default: getLocale(),
    },
  },
  methods: {
    t(path) {
      const arr = path.split('.');
      let current = this.locale || getLocale();
      let value;
      for (let i = 0, len = arr.length; i < len; i++) {
        const prop = arr[i];
        value = current[prop];
        if (i === len - 1) {
          return value;
        }
        if (!value) {
          return null;
        }
        current = value;
      }
      return null;
    },
  },
};
