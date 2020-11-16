<template>
  <scrollbar-vertical>
    <div
      v-for="item in list"
      :key="item.value"
      :class="[`${prefixClass}-time-option`, getClasses(item.value)]"
      @click="handleSelect(item.value)"
    >
      {{ item.text }}
    </div>
  </scrollbar-vertical>
</template>

<script>
import { format } from 'date-format-parse';
import ScrollbarVertical from '../scrollbar/scrollbar-vertical';
import { getScrollParent } from '../util/dom';
import { getLocale } from '../locale';

function parseOption(time = '') {
  const values = time.split(':');
  if (values.length >= 2) {
    const hours = parseInt(values[0], 10);
    const minutes = parseInt(values[1], 10);
    return {
      hours,
      minutes,
    };
  }
  return null;
}

const scrollTo = (element, to) => {
  if (element) {
    element.scrollTop = to;
  }
};

export default {
  name: 'ListOptions',
  components: { ScrollbarVertical },
  inject: {
    getLocale: {
      default: () => getLocale,
    },
    prefixClass: {
      default: 'mx',
    },
  },
  props: {
    date: Date,
    options: {
      type: [Object, Function],
      default() {
        return [];
      },
    },
    format: {
      type: String,
      default: 'HH:mm:ss',
    },
    getClasses: {
      type: Function,
      default: () => [],
    },
  },
  computed: {
    list() {
      const result = [];
      const { options } = this;
      if (typeof options === 'function') {
        return options() || [];
      }
      const start = parseOption(options.start);
      const end = parseOption(options.end);
      const step = parseOption(options.step);
      const fmt = options.format || this.format;
      if (start && end && step) {
        const startMinutes = start.minutes + start.hours * 60;
        const endMinutes = end.minutes + end.hours * 60;
        const stepMinutes = step.minutes + step.hours * 60;
        const len = Math.floor((endMinutes - startMinutes) / stepMinutes);
        for (let i = 0; i <= len; i++) {
          const timeMinutes = startMinutes + i * stepMinutes;
          const hours = Math.floor(timeMinutes / 60);
          const minutes = timeMinutes % 60;
          const value = new Date(this.date).setHours(hours, minutes, 0);
          result.push({
            value,
            text: this.formatDate(value, fmt),
          });
        }
      }
      return result;
    },
  },
  mounted() {
    this.scrollToSelected();
  },
  methods: {
    formatDate(date, fmt) {
      return format(date, fmt, { locale: this.getLocale().formatLocale });
    },
    scrollToSelected() {
      const element = this.$el.querySelector('.active');
      if (!element) return;
      const scrollElement = getScrollParent(element, this.$el);
      if (!scrollElement) return;
      const to = element.offsetTop;
      scrollTo(scrollElement, to);
    },
    handleSelect(value) {
      this.$emit('select', value, 'time');
    },
  },
};
</script>
