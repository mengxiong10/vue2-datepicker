<template>
  <div :class="`${prefixClass}-time`">
    <div v-if="showDurationHeader" :class="`${prefixClass}-time-header`">
      <button
        type="button"
        :class="`${prefixClass}-btn ${prefixClass}-btn-text ${prefixClass}-time-header-title`"
        @click="handleClickTitle"
      >
        {{ title }}
      </button>
    </div>
    <div :class="`${prefixClass}-time-content`">
      <list-columns
        :date="innerValue"
        :get-classes="getClasses"
        :hour-options="hourOptions"
        :minute-options="minuteOptions"
        :second-options="secondOptions"
        :hour-step="hourStep"
        :minute-step="minuteStep"
        :second-step="secondStep"
        v-bind="ShowHourMinuteSecondAMPM"
        @select="handleSelect"
      ></list-columns>
    </div>
  </div>
</template>

<script>
import { format } from 'date-format-parse';
import { getValidDate } from '../util/date';
import ListColumns from './list-columns';
import { getLocaleFieldValue } from '../locale';

export default {
  name: 'DurationPanel',
  components: { ListColumns },
  inject: {
    t: {
      default: () => getLocaleFieldValue,
    },
    prefixClass: {
      default: 'mx',
    },
  },
  props: {
    value: {},
    defaultValue: {
      default() {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
      },
    },
    format: {
      default: 'DD HH',
    },
    timeTitleFormat: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    showDurationHeader: {
      type: Boolean,
      default: false,
    },
    disabledDate: {
      type: Function,
      default: () => false,
    },
    dayOptions: Array,
    hourOptions: Array,
    minuteOptions: Array,
    secondOptions: Array,
    dayStep: {
      type: Number,
      default: 1,
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
    showDay: {
      type: Boolean,
      default: undefined,
    },
    showHour: {
      type: Boolean,
      default: undefined,
    },
    showMinute: {
      type: Boolean,
      default: undefined,
    },
    showSecond: {
      type: Boolean,
      default: undefined,
    },
  },
  computed: {
    innerValue() {
      return getValidDate(this.value, this.defaultValue);
    },
    title() {
      const titleFormat = this.timeTitleFormat;
      const date = new Date(this.innerValue);
      return this.formatDate(date, titleFormat);
    },
    innerForamt() {
      return typeof this.format === 'string' ? this.format : 'DD HH';
    },
    ShowHourMinuteSecondAMPM() {
      const fmt = this.innerForamt;
      const defaultProps = {
        showDay: /[Dd]/.test(fmt),
        showHour: /[HhKk]/.test(fmt),
        showMinute: /m/.test(fmt),
        showSecond: /s/.test(fmt),
        use12h: false,
      };
      const obj = {};
      Object.keys(defaultProps).forEach(key => {
        obj[key] = typeof this[key] === 'boolean' ? this[key] : defaultProps[key];
      });
      return obj;
    },
  },
  methods: {
    formatDate(date, fmt) {
      return format(date, fmt, { locale: this.t('formatLocale') });
    },
    isDisabled(date) {
      return this.disabledDate(new Date(date));
    },
    handleSelect(value, type) {
      const date = new Date(value);
      if (!this.isDisabled(value)) {
        this.$emit('select', date, type);
      }
    },
    handleClickTitle() {
      this.$emit('title-click');
    },
    getClasses(value) {
      const cellDate = new Date(value);
      if (this.isDisabled(value)) {
        return 'disabled';
      }
      if (cellDate.getTime() === this.innerValue.getTime()) {
        return 'active';
      }
      return '';
    },
  },
};
</script>
