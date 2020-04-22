<template>
  <div
    :class="{
      [`${prefixClass}-datepicker`]: true,
      [`${prefixClass}-datepicker-range`]: range,
      [`${prefixClass}-datepicker-inline`]: inline,
      disabled: disabled,
    }"
  >
    <div
      v-if="!inline"
      :class="`${prefixClass}-input-wrapper`"
      @mousedown="openPopup"
      @touchstart="openPopup"
    >
      <slot name="input">
        <input
          ref="input"
          v-bind="{ name: 'date', type: 'text', autocomplete: 'off', value: text, ...inputAttr }"
          :class="inputClass"
          :disabled="disabled"
          :readonly="!editable"
          :placeholder="placeholder"
          @keydown="handleInputKeydown"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
          @input="handleInputInput"
          @change="handleInputChange"
        />
      </slot>
      <i v-if="showClearIcon" :class="`${prefixClass}-icon-clear`" @mousedown.stop="handleClear">
        <slot name="icon-clear">
          <icon-close></icon-close>
        </slot>
      </i>
      <i :class="`${prefixClass}-icon-calendar`">
        <slot name="icon-calendar">
          <icon-calendar></icon-calendar>
        </slot>
      </i>
    </div>
    <Popup
      ref="popup"
      :class="popupClass"
      :style="popupStyle"
      :inline="inline"
      :visible="popupVisible"
      :append-to-body="appendToBody"
      @clickoutside="handleClickOutSide"
    >
      <div
        v-if="hasSlot('sidebar') || shortcuts.length"
        :class="`${prefixClass}-datepicker-sidebar`"
      >
        <slot name="sidebar" :value="currentValue" :emit="emitValue"></slot>
        <button
          v-for="(v, i) in shortcuts"
          :key="i"
          type="button"
          :class="`${prefixClass}-btn ${prefixClass}-btn-text ${prefixClass}-btn-shortcut`"
          @click="handleSelectShortcut(v)"
        >
          {{ v.text }}
        </button>
      </div>
      <div :class="`${prefixClass}-datepicker-content`">
        <div v-if="hasSlot('header')" :class="`${prefixClass}-datepicker-header`">
          <slot name="header" :value="currentValue" :emit="emitValue"></slot>
        </div>
        <div :class="`${prefixClass}-datepicker-body`">
          <slot name="content" :value="currentValue" :emit="emitValue">
            <component
              :is="currentComponent"
              ref="picker"
              v-bind="currentComponentProps"
              @select="handleSelectDate"
            ></component>
          </slot>
        </div>
        <div v-if="hasSlot('footer') || confirm" :class="`${prefixClass}-datepicker-footer`">
          <slot name="footer" :value="currentValue" :emit="emitValue"></slot>
          <button
            v-if="confirm"
            type="button"
            :class="`${prefixClass}-btn ${prefixClass}-datepicker-btn-confirm`"
            @click="handleConfirmDate"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
import { parse, format, getWeek } from 'date-format-parse';
import { isValidDate, isValidRangeDate } from './util/date';
import { pick, isObject, mergeDeep } from './util/base';
import { getLocale, getLocaleFieldValue } from './locale';
import Popup from './popup';
import IconCalendar from './icon/icon-calendar';
import IconClose from './icon/icon-close';
import CalendarPanel from './calendar/calendar-panel';
import CalendarRange from './calendar/calendar-range';
import TimePanel from './time/time-panel';
import TimeRange from './time/time-range';
import DatetimePanel from './datetime/datetime-panel';
import DatetimeRange from './datetime/datetime-range';

const componentMap = {
  default: CalendarPanel,
  time: TimePanel,
  datetime: DatetimePanel,
};
const componentRangeMap = {
  default: CalendarRange,
  time: TimeRange,
  datetime: DatetimeRange,
};

export default {
  name: 'DatePicker',
  components: {
    IconCalendar,
    IconClose,
    Popup,
  },
  provide() {
    return {
      t: this.getLocaleFieldValue,
      getWeek: this.getWeek,
      prefixClass: this.prefixClass,
    };
  },
  props: {
    ...DatetimePanel.props,
    value: {},
    valueType: {
      type: String,
      default: 'date', // date, format, timestamp, or token like 'YYYY-MM-DD'
    },
    type: {
      type: String, // ['date', 'datetime', 'time', 'year', 'month', 'week']
      default: 'date',
    },
    format: {
      type: [String, Object],
      default() {
        const map = {
          date: 'YYYY-MM-DD',
          datetime: 'YYYY-MM-DD HH:mm:ss',
          year: 'YYYY',
          month: 'YYYY-MM',
          time: 'HH:mm:ss',
          week: 'w',
        };
        return map[this.type] || map.date;
      },
    },
    range: {
      type: Boolean,
      default: false,
    },
    rangeSeparator: {
      type: String,
      default: ' ~ ',
    },
    lang: {
      type: [String, Object],
    },
    placeholder: {
      type: String,
      default: '',
    },
    editable: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    prefixClass: {
      type: String,
      default: 'mx',
    },
    inputClass: {
      default() {
        return `${this.prefixClass}-input`;
      },
    },
    inputAttr: {
      type: Object,
      default() {
        return {};
      },
    },
    appendToBody: {
      type: Boolean,
      default: true,
    },
    open: {
      type: Boolean,
      default: undefined,
    },
    popupClass: {},
    popupStyle: {
      type: Object,
      default: () => {
        return {};
      },
    },
    inline: {
      type: Boolean,
      default: false,
    },
    confirm: {
      type: Boolean,
      default: false,
    },
    confirmText: {
      type: String,
      default: 'OK',
    },
    shortcuts: {
      type: Array,
      validator(value) {
        return (
          Array.isArray(value) &&
          value.every(
            v => isObject(v) && typeof v.text === 'string' && typeof v.onClick === 'function'
          )
        );
      },
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      // cache the innervalue, wait to confirm
      currentValue: null,
      userInput: null,
      defaultOpen: false,
    };
  },
  computed: {
    currentComponent() {
      const map = this.range ? componentRangeMap : componentMap;
      return map[this.type] || map.default;
    },
    currentComponentProps() {
      const props = {
        ...pick(this, Object.keys(this.currentComponent.props)),
        value: this.currentValue,
      };
      return props;
    },
    popupVisible() {
      return !this.disabled && (typeof this.open === 'boolean' ? this.open : this.defaultOpen);
    },
    innerValue() {
      let { value } = this;
      if (this.range) {
        value = Array.isArray(value) ? value.slice(0, 2) : [null, null];
        return value.map(this.value2date);
      }
      return this.value2date(this.value);
    },
    text() {
      if (this.userInput !== null) {
        return this.userInput;
      }
      if (!this.isValidValue(this.innerValue)) {
        return '';
      }
      const fmt = this.format;
      if (Array.isArray(this.innerValue)) {
        return this.innerValue.map(v => this.formatDate(v, fmt)).join(this.rangeSeparator);
      }
      return this.formatDate(this.innerValue, fmt);
    },
    showClearIcon() {
      return !this.disabled && this.clearable && this.text;
    },
    locale() {
      if (isObject(this.lang)) {
        return mergeDeep(getLocale(), this.lang);
      }
      return getLocale(this.lang);
    },
  },
  watch: {
    innerValue: {
      immediate: true,
      handler(val) {
        this.currentValue = val;
      },
    },
  },
  methods: {
    handleClickOutSide(evt) {
      const { target } = evt;
      if (!this.$el.contains(target)) {
        this.closePopup();
      }
    },
    getWeek(date, options) {
      if (isObject(this.format) && typeof this.format.getWeek === 'function') {
        return this.format.getWeek(date, options);
      }
      return getWeek(date, options);
    },
    parseDate(value, fmt) {
      if (isObject(this.format) && typeof this.format.parse === 'function') {
        return this.format.parse(value, fmt);
      }
      const backupDate = new Date();
      return parse(value, fmt, { locale: this.locale.formatLocale, backupDate });
    },
    formatDate(date, fmt) {
      if (isObject(this.format) && typeof this.format.stringify === 'function') {
        return this.format.stringify(date, fmt);
      }
      return format(date, fmt, { locale: this.locale.formatLocale });
    },
    // transform the outer value to inner date
    value2date(value) {
      switch (this.valueType) {
        case 'date':
          return value instanceof Date ? new Date(value.getTime()) : new Date(NaN);
        case 'timestamp':
          return typeof value === 'number' ? new Date(value) : new Date(NaN);
        case 'format':
          return typeof value === 'string' ? this.parseDate(value, this.format) : new Date(NaN);
        default:
          return typeof value === 'string' ? this.parseDate(value, this.valueType) : new Date(NaN);
      }
    },
    // transform the inner date to outer value
    date2value(date) {
      if (!isValidDate(date)) return null;
      switch (this.valueType) {
        case 'date':
          return date;
        case 'timestamp':
          return date.getTime();
        case 'format':
          return this.formatDate(date, this.format);
        default:
          return this.formatDate(date, this.valueType);
      }
    },
    emitValue(date, type) {
      // fix IE11/10 trigger input event when input is focused. (placeholder !== '')
      this.userInput = null;
      const value = Array.isArray(date) ? date.map(this.date2value) : this.date2value(date);
      this.$emit('input', value);
      this.$emit('change', value, type);
      this.afterEmitValue(type);
      return value;
    },
    afterEmitValue(type) {
      // this.type === 'datetime', click the time should close popup
      if (!type || type === this.type || type === 'time') {
        this.closePopup();
      }
    },
    isValidValue(value) {
      const validate = this.range ? isValidRangeDate : isValidDate;
      return validate(value);
    },
    handleSelectDate(val, type) {
      if (this.confirm) {
        this.currentValue = val;
      } else {
        this.emitValue(val, type);
      }
    },
    handleClear() {
      this.emitValue(this.range ? [null, null] : null);
      this.$emit('clear');
    },
    handleConfirmDate() {
      const value = this.emitValue(this.currentValue);
      this.$emit('confirm', value);
    },
    handleSelectShortcut(item) {
      if (isObject(item) && typeof item.onClick === 'function') {
        const date = item.onClick(this);
        if (date) {
          this.emitValue(date);
        }
      }
    },
    openPopup(evt) {
      if (this.popupVisible) return;
      this.defaultOpen = true;
      this.$emit('open', evt);
      this.$emit('update:open', true);
    },
    closePopup() {
      if (!this.popupVisible) return;
      this.defaultOpen = false;
      this.$emit('close');
      this.$emit('update:open', false);
    },
    blur() {
      this.$refs.input.blur();
    },
    focus() {
      this.$refs.input.focus();
    },
    handleInputChange() {
      if (!this.editable || this.userInput === null) return;
      const text = this.userInput.trim();
      this.userInput = null;
      if (text === '') {
        this.handleClear();
        return;
      }
      let date;
      if (this.range) {
        let arr = text.split(this.rangeSeparator);
        if (arr.length !== 2) {
          arr = text.split(this.rangeSeparator.trim());
        }
        date = arr.map(v => this.parseDate(v.trim(), this.format));
      } else {
        date = this.parseDate(text, this.format);
      }
      if (this.isValidValue(date)) {
        this.emitValue(date);
        this.blur();
      } else {
        this.$emit('input-error', text);
      }
    },
    handleInputInput(evt) {
      this.userInput = evt.target.value;
    },
    handleInputKeydown(evt) {
      const { keyCode } = evt;
      // Tab 9 or Enter 13
      if (keyCode === 9) {
        this.closePopup();
      } else if (keyCode === 13) {
        this.handleInputChange();
      }
    },
    handleInputBlur(evt) {
      // tab close
      this.$emit('blur', evt);
    },
    handleInputFocus(evt) {
      this.openPopup(evt);
      this.$emit('focus', evt);
    },
    hasSlot(name) {
      return !!(this.$slots[name] || this.$scopedSlots[name]);
    },
    getLocaleFieldValue(path) {
      return getLocaleFieldValue(path, this.locale);
    },
  },
};
</script>
