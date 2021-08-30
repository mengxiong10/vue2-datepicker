<template>
  <div :class="`${prefixClass}-time-columns`">
    <scrollbar-vertical v-for="(col, i) in columns" :key="i" :class="`${prefixClass}-time-column`">
      <ul
        :class="`${prefixClass}-time-list`"
        :data-type="col.type"
        :data-index="i"
        @click="handleSelect"
      >
        <li
          v-for="(item, j) in col.list"
          :key="item.value"
          :data-index="j"
          :class="[`${prefixClass}-time-item`, getClasses(item.value, col.type)]"
        >
          {{ item.text }}
        </li>
      </ul>
    </scrollbar-vertical>
  </div>
</template>

<script>
import ScrollbarVertical from '../scrollbar/scrollbar-vertical';
import { getScrollParent } from '../util/dom';

const padNumber = value => {
  value = parseInt(value, 10);
  return value < 10 ? `0${value}` : `${value}`;
};

const generateOptions = (length, step, options) => {
  if (Array.isArray(options)) {
    return options.filter(v => v >= 0 && v < length);
  }
  if (step <= 0) {
    step = 1;
  }
  const arr = [];
  for (let i = 0; i < length; i += step) {
    arr.push(i);
  }
  return arr;
};

const scrollTo = (element, to, duration = 0) => {
  // jump to target if duration zero
  if (duration <= 0) {
    requestAnimationFrame(() => {
      element.scrollTop = to;
    });
    return;
  }
  const difference = to - element.scrollTop;
  const tick = (difference / duration) * 10;
  requestAnimationFrame(() => {
    const scrollTop = element.scrollTop + tick;
    if (scrollTop >= to) {
      element.scrollTop = to;
      return;
    }
    element.scrollTop = scrollTop;
    scrollTo(element, to, duration - 10);
  });
};

export default {
  name: 'ListColumns',
  components: { ScrollbarVertical },
  inject: {
    prefixClass: {
      default: 'mx',
    },
  },
  props: {
    date: Date,
    scrollDuration: {
      type: Number,
      default: 100,
    },
    getClasses: {
      type: Function,
      default: () => [],
    },
    hourOptions: Array,
    minuteOptions: Array,
    secondOptions: Array,
    showHour: {
      type: Boolean,
      default: true,
    },
    showMinute: {
      type: Boolean,
      default: true,
    },
    showSecond: {
      type: Boolean,
      default: true,
    },
    hourStep: {
      type: Number,
      default: 1,
    },
    minuteStep: {
      type: Number,
      default: 1,
    },
    secondStep: {
      type: Number,
      default: 1,
    },
    use12h: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    columns() {
      const cols = [];
      if (this.showHour) cols.push({ type: 'hour', list: this.getHoursList() });
      if (this.showMinute) cols.push({ type: 'minute', list: this.getMinutesList() });
      if (this.showSecond) cols.push({ type: 'second', list: this.getSecondsList() });
      if (this.use12h) cols.push({ type: 'ampm', list: this.getAMPMList() });

      return cols.filter(v => v.list.length > 0);
    },
  },
  watch: {
    date: {
      handler() {
        this.$nextTick(() => {
          this.scrollToSelected(this.scrollDuration);
        });
      },
    },
  },
  mounted() {
    this.scrollToSelected(0);
  },
  methods: {
    getHoursList() {
      return generateOptions(this.use12h ? 12 : 24, this.hourStep, this.hourOptions).map(num => {
        const date = new Date(this.date);
        let text = padNumber(num);
        if (this.use12h) {
          if (num === 0) {
            text = '12';
          }
          if (date.getHours() >= 12) {
            num += 12;
          }
        }
        const value = date.setHours(num);
        return { value, text };
      });
    },
    getMinutesList() {
      return generateOptions(60, this.minuteStep, this.minuteOptions).map(num => {
        const value = new Date(this.date).setMinutes(num);
        return { value, text: padNumber(num) };
      });
    },
    getSecondsList() {
      return generateOptions(60, this.secondStep, this.secondOptions).map(num => {
        const value = new Date(this.date).setSeconds(num);
        return { value, text: padNumber(num) };
      });
    },
    getAMPMList() {
      return ['AM', 'PM'].map((text, i) => {
        const date = new Date(this.date);
        const value = date.setHours((date.getHours() % 12) + i * 12);
        return { text, value };
      });
    },
    scrollToSelected(duration) {
      const elements = this.$el.querySelectorAll('.active');
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const scrollElement = getScrollParent(element, this.$el);
        if (scrollElement) {
          const to = element.offsetTop;
          scrollTo(scrollElement, to, duration);
        }
      }
    },
    handleSelect(evt) {
      const { target, currentTarget } = evt;
      if (target.tagName.toUpperCase() !== 'LI') return;
      const type = currentTarget.getAttribute('data-type');
      const colIndex = parseInt(currentTarget.getAttribute('data-index'), 10);
      const cellIndex = parseInt(target.getAttribute('data-index'), 10);
      const { value } = this.columns[colIndex].list[cellIndex];
      this.$emit('select', value, type);
    },
  },
};
</script>
