<template>
  <div class="mx-time">
    <div v-if="showTimeHeader" class="mx-time-header">
      <button class="mx-btn mx-btn-text mx-time-header-title" @click="handleClickTitle">
        {{ title }}
      </button>
    </div>
    <div class="mx-time-content">
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
        v-bind="ShowHourMinuteSecondAMPM"
        @select="handleSelect"
      ></list-columns>
    </div>
  </div>
</template>

<script>
import { getValidDate } from '../util/date';
import localeMixin from '../mixin/locale';
import formatMixin from '../mixin/format';
import ListColumns from './list-columns';
import ListOptions from './list-options';

export default {
  name: 'TimePanel',
  components: { ListColumns, ListOptions },
  mixins: [localeMixin, formatMixin],
  props: {
    value: {},
    defaultValue: {
      type: [Date, Number],
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
      return typeof this.format === 'string' ? this.format : 'HH:mm:ss';
    },
    ShowHourMinuteSecondAMPM() {
      const format = this.innerForamt;
      const defaultProps = {
        showHour: /[HhKk]/.test(format),
        showMinute: /m/.test(format),
        showSecond: /s/.test(format),
        use12h: /a/i.test(format),
      };
      const obj = {};
      Object.keys(defaultProps).forEach(key => {
        obj[key] = typeof this[key] === 'boolean' ? this[key] : defaultProps[key];
      });
      return obj;
    },
  },
  methods: {
    isDisabled(date) {
      return this.disabledTime(new Date(date), this.innerValue);
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
