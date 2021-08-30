<template>
  <div :class="`${prefixClass}-time`">
    <div v-if="showTimeHeader" :class="`${prefixClass}-time-header`">
      <button
        type="button"
        :class="`${prefixClass}-btn ${prefixClass}-btn-text ${prefixClass}-time-header-title`"
        @click="handleClickTitle"
      >
        {{ title }}
      </button>
    </div>
    <div :class="`${prefixClass}-time-content`">
      <list-options
        v-if="timePickerOptions"
        :date="innerValue"
        :get-classes="getClasses"
        :options="timePickerOptions"
        :format="innerForamt"
        @select="handleSelect"
      ></list-options>
      <list-columns
        v-else
        :date="innerValue"
        :get-classes="getClasses"
        :hour-options="hourOptions"
        :minute-options="minuteOptions"
        :second-options="secondOptions"
        :hour-step="hourStep"
        :minute-step="minuteStep"
        :second-step="secondStep"
        :scroll-duration="scrollDuration"
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
import ListOptions from './list-options';
import { getLocale } from '../locale';

export default {
  name: 'TimePanel',
  components: { ListColumns, ListOptions },
  inject: {
    getLocale: {
      default: () => getLocale,
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
      default: 'HH:mm:ss',
    },
    timeTitleFormat: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    showTimeHeader: {
      type: Boolean,
      default: false,
    },
    disabledTime: {
      type: Function,
      default: () => false,
    },
    timePickerOptions: {
      type: [Object, Function],
      default() {
        return null;
      },
    },
    hourOptions: Array,
    minuteOptions: Array,
    secondOptions: Array,
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
    use12h: {
      type: Boolean,
      default: undefined,
    },
    scrollDuration: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      innerValue: getValidDate(this.value, this.defaultValue),
    };
  },
  computed: {
    title() {
      const titleFormat = this.timeTitleFormat;
      const date = new Date(this.innerValue);
      return this.formatDate(date, titleFormat);
    },
    innerForamt() {
      return typeof this.format === 'string' ? this.format : 'HH:mm:ss';
    },
    ShowHourMinuteSecondAMPM() {
      const fmt = this.innerForamt;
      const defaultProps = {
        showHour: /[HhKk]/.test(fmt),
        showMinute: /m/.test(fmt),
        showSecond: /s/.test(fmt),
        use12h: /a/i.test(fmt),
      };
      const obj = {};
      Object.keys(defaultProps).forEach(key => {
        obj[key] = typeof this[key] === 'boolean' ? this[key] : defaultProps[key];
      });
      return obj;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        this.innerValue = getValidDate(this.value, this.defaultValue);
      },
    },
  },
  methods: {
    formatDate(date, fmt) {
      return format(date, fmt, { locale: this.getLocale().formatLocale });
    },
    isDisabledTime(value) {
      return this.disabledTime(new Date(value));
    },
    isDisabledHour(date) {
      const value = new Date(date);
      return (
        this.isDisabledTime(value) &&
        this.isDisabledTime(value.setMinutes(0, 0, 0)) &&
        this.isDisabledTime(value.setMinutes(59, 59, 999))
      );
    },
    isDisabledMinute(date) {
      const value = new Date(date);
      return (
        this.isDisabledTime(value) &&
        this.isDisabledTime(value.setSeconds(0, 0)) &&
        this.isDisabledTime(value.setSeconds(59, 999))
      );
    },
    isDisabled(date, type) {
      if (type === 'hour') {
        return this.isDisabledHour(date);
      }
      if (type === 'minute') {
        return this.isDisabledMinute(date);
      }
      return this.isDisabledTime(date);
    },
    handleSelect(value, type) {
      const date = new Date(value);
      if (!this.isDisabled(value, type)) {
        this.innerValue = date;
        if (!this.isDisabledTime(date)) {
          this.$emit('select', date, type);
        }
      }
    },
    handleClickTitle() {
      this.$emit('clicktitle');
    },
    getClasses(value, type) {
      const cellDate = new Date(value);
      if (this.isDisabled(value, type)) {
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
