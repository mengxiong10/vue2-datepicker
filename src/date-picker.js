import { parse, format, getWeek } from 'date-format-parse';
import { isValidDate, isValidRangeDate, isValidDates } from './util/date';
import { pick, isObject, mergeDeep } from './util/base';
import { getLocale } from './locale';
import Popup from './popup';
import IconCalendar from './icon/icon-calendar';
import IconTime from './icon/icon-time';
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
  provide() {
    return {
      // make locale reactive
      getLocale: () => this.locale,
      getWeek: this.getWeek,
      prefixClass: this.prefixClass,
      dispatchDatePicker: this.$emit.bind(this),
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
      type: String,
    },
    formatter: {
      type: Object,
    },
    range: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    rangeSeparator: {
      type: String,
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
    inputClass: {},
    inputAttr: {
      type: Object,
      default: () => ({}),
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
      default: () => ({}),
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
    renderInputText: {
      type: Function,
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
      mouseInInput: false,
    };
  },
  computed: {
    popupVisible() {
      return !this.disabled && (typeof this.open === 'boolean' ? this.open : this.defaultOpen);
    },
    innerRangeSeparator() {
      return this.rangeSeparator || (this.multiple ? ',' : ' ~ ');
    },
    innerFormat() {
      const map = {
        date: 'YYYY-MM-DD',
        datetime: 'YYYY-MM-DD HH:mm:ss',
        year: 'YYYY',
        month: 'YYYY-MM',
        time: 'HH:mm:ss',
        week: 'w',
      };
      return this.format || map[this.type] || map.date;
    },
    innerValue() {
      let { value } = this;
      if (this.validMultipleType) {
        value = Array.isArray(value) ? value : [];
        return value.map(this.value2date);
      }
      if (this.range) {
        value = Array.isArray(value) ? value.slice(0, 2) : [null, null];
        return value.map(this.value2date);
      }
      return this.value2date(value);
    },
    text() {
      if (this.userInput !== null) {
        return this.userInput;
      }
      if (typeof this.renderInputText === 'function') {
        return this.renderInputText(this.innerValue);
      }
      if (!this.isValidValue(this.innerValue)) {
        return '';
      }
      if (Array.isArray(this.innerValue)) {
        return this.innerValue.map(v => this.formatDate(v)).join(this.innerRangeSeparator);
      }
      return this.formatDate(this.innerValue);
    },
    showClearIcon() {
      return !this.disabled && this.clearable && this.text && this.mouseInInput;
    },
    locale() {
      if (isObject(this.lang)) {
        return mergeDeep(getLocale(), this.lang);
      }
      return getLocale(this.lang);
    },
    validMultipleType() {
      const types = ['date', 'month', 'year'];
      return this.multiple && !this.range && types.indexOf(this.type) !== -1;
    },
  },
  watch: {
    innerValue: {
      immediate: true,
      handler(val) {
        this.currentValue = val;
      },
    },
    popupVisible: {
      handler(val) {
        if (val) {
          this.currentValue = this.innerValue;
        }
      },
    },
  },
  created() {
    if (typeof this.format === 'object') {
      console.warn(
        "[vue2-datepicker]: The prop `format` don't support Object any more. You can use the new prop `formatter` to replace it"
      );
    }
  },
  methods: {
    handleMouseEnter() {
      this.mouseInInput = true;
    },
    handleMouseLeave() {
      this.mouseInInput = false;
    },
    handleClickOutSide(evt) {
      const { target } = evt;
      if (!this.$el.contains(target)) {
        this.closePopup();
      }
    },
    getFormatter(key) {
      return (
        (isObject(this.formatter) && this.formatter[key]) ||
        (isObject(this.format) && this.format[key])
      );
    },
    getWeek(date, options) {
      if (typeof this.getFormatter('getWeek') === 'function') {
        return this.getFormatter('getWeek')(date, options);
      }
      return getWeek(date, options);
    },
    parseDate(value, fmt) {
      fmt = fmt || this.innerFormat;
      if (typeof this.getFormatter('parse') === 'function') {
        return this.getFormatter('parse')(value, fmt);
      }
      const backupDate = new Date();
      return parse(value, fmt, { locale: this.locale.formatLocale, backupDate });
    },
    formatDate(date, fmt) {
      fmt = fmt || this.innerFormat;
      if (typeof this.getFormatter('stringify') === 'function') {
        return this.getFormatter('stringify')(date, fmt);
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
          return typeof value === 'string' ? this.parseDate(value) : new Date(NaN);
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
          return this.formatDate(date);
        default:
          return this.formatDate(date, this.valueType);
      }
    },
    emitValue(date, type, close = true) {
      // fix IE11/10 trigger input event when input is focused. (placeholder !== '')
      this.userInput = null;
      const value = Array.isArray(date) ? date.map(this.date2value) : this.date2value(date);
      this.$emit('input', value);
      this.$emit('change', value, type);
      if (close) {
        this.closePopup();
      }
      return value;
    },
    isValidValue(value) {
      if (this.validMultipleType) {
        return isValidDates(value);
      }
      if (this.range) {
        return isValidRangeDate(value);
      }
      return isValidDate(value);
    },
    isValidValueAndNotDisabled(value) {
      if (!this.isValidValue(value)) {
        return false;
      }
      const disabledDate =
        typeof this.disabledDate === 'function' ? this.disabledDate : () => false;
      const disabledTime =
        typeof this.disabledTime === 'function' ? this.disabledTime : () => false;
      if (!Array.isArray(value)) {
        value = [value];
      }
      return value.every(v => !disabledDate(v) && !disabledTime(v));
    },
    handleMultipleDates(date, dates) {
      if (this.validMultipleType && dates) {
        const nextDates = dates.filter(v => v.getTime() !== date.getTime());
        if (nextDates.length === dates.length) {
          nextDates.push(date);
        }
        return nextDates;
      }
      return date;
    },
    handleSelectDate(val, type, dates) {
      val = this.handleMultipleDates(val, dates);
      if (this.confirm) {
        this.currentValue = val;
      } else {
        this.emitValue(
          val,
          type,
          // this.type === 'datetime', click the time should close popup
          !this.validMultipleType && (type === this.type || type === 'time')
        );
      }
    },
    clear() {
      this.emitValue(this.range ? [null, null] : null);
      this.$emit('clear');
    },
    handleClear(evt) {
      evt.stopPropagation();
      this.clear();
    },
    handleConfirmDate() {
      const value = this.emitValue(this.currentValue);
      this.$emit('confirm', value);
    },
    handleSelectShortcut(evt) {
      const index = evt.currentTarget.getAttribute('data-index');
      const item = this.shortcuts[parseInt(index, 10)];
      if (isObject(item) && typeof item.onClick === 'function') {
        const date = item.onClick(this);
        if (date) {
          this.emitValue(date);
        }
      }
    },
    openPopup(evt) {
      if (this.popupVisible || this.disabled) return;
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
      // when use slot input
      if (this.$refs.input) {
        this.$refs.input.blur();
      }
    },
    focus() {
      if (this.$refs.input) {
        this.$refs.input.focus();
      }
    },
    handleInputChange() {
      if (!this.editable || this.userInput === null) return;
      const text = this.userInput.trim();
      this.userInput = null;
      if (text === '') {
        this.clear();
        return;
      }
      let date;
      if (this.validMultipleType) {
        date = text.split(this.innerRangeSeparator).map(v => this.parseDate(v.trim()));
      } else if (this.range) {
        let arr = text.split(this.innerRangeSeparator);
        if (arr.length !== 2) {
          // Maybe the separator during the day is the same as the separator for the date
          // eg: 2019-10-09-2020-01-02
          arr = text.split(this.innerRangeSeparator.trim());
        }
        date = arr.map(v => this.parseDate(v.trim()));
      } else {
        date = this.parseDate(text);
      }
      if (this.isValidValueAndNotDisabled(date)) {
        this.emitValue(date);
        this.blur();
      } else {
        this.$emit('input-error', text);
      }
    },
    handleInputInput(evt) {
      // slot input v-model
      this.userInput = typeof evt === 'string' ? evt : evt.target.value;
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
    renderSlot(name, fallback, props) {
      const slotFn = this.$scopedSlots[name];
      if (slotFn) {
        return slotFn(props) || fallback;
      }
      return this.$slots[name] || fallback;
    },
    renderInput() {
      const { prefixClass } = this;
      const props = {
        name: 'date',
        type: 'text',
        autocomplete: 'off',
        value: this.text,
        class: this.inputClass || `${this.prefixClass}-input`,
        readonly: !this.editable,
        disabled: this.disabled,
        placeholder: this.placeholder,
        ...this.inputAttr,
      };
      const { value, class: className, ...attrs } = props;
      const events = {
        keydown: this.handleInputKeydown,
        focus: this.handleInputFocus,
        blur: this.handleInputBlur,
        input: this.handleInputInput,
        change: this.handleInputChange,
      };
      const input = this.renderSlot(
        'input',
        <input value={value} class={className} {...{ attrs, on: events }} ref="input" />,
        {
          props,
          events,
        }
      );
      const calendarIcon = this.type === 'time' ? <IconTime /> : <IconCalendar />;
      // remove touchstart event to avoid opens the popup while scrolling in mobile #469
      return (
        <div
          class={`${prefixClass}-input-wrapper`}
          onMouseenter={this.handleMouseEnter}
          onMouseleave={this.handleMouseLeave}
          onClick={this.openPopup}
          ref="inputWrapper"
        >
          {input}
          {this.showClearIcon ? (
            <i class={`${prefixClass}-icon-clear`} onClick={this.handleClear}>
              {this.renderSlot('icon-clear', <IconClose />)}
            </i>
          ) : (
            <i class={`${prefixClass}-icon-calendar`}>
              {this.renderSlot('icon-calendar', calendarIcon)}
            </i>
          )}
        </div>
      );
    },
    renderContent() {
      const map = this.range ? componentRangeMap : componentMap;
      const Component = map[this.type] || map.default;
      const props = {
        ...pick(this.$props, Object.keys(Component.props)),
        value: this.currentValue,
      };
      const on = {
        ...pick(this.$listeners, Component.emits || []),
        select: this.handleSelectDate,
      };
      const content = <Component {...{ props, on, ref: 'picker' }} />;
      return (
        <div class={`${this.prefixClass}-datepicker-body`}>
          {this.renderSlot('content', content, {
            value: this.currentValue,
            emit: this.handleSelectDate,
          })}
        </div>
      );
    },
    renderSidebar() {
      const { prefixClass } = this;
      return (
        <div class={`${prefixClass}-datepicker-sidebar`}>
          {this.renderSlot('sidebar', null, {
            value: this.currentValue,
            emit: this.handleSelectDate,
          })}
          {this.shortcuts.map((v, i) => (
            <button
              key={i}
              data-index={i}
              type="button"
              class={`${prefixClass}-btn ${prefixClass}-btn-text ${prefixClass}-btn-shortcut`}
              onClick={this.handleSelectShortcut}
            >
              {v.text}
            </button>
          ))}
        </div>
      );
    },
    renderHeader() {
      return (
        <div class={`${this.prefixClass}-datepicker-header`}>
          {this.renderSlot('header', null, {
            value: this.currentValue,
            emit: this.handleSelectDate,
          })}
        </div>
      );
    },
    renderFooter() {
      const { prefixClass } = this;
      return (
        <div class={`${prefixClass}-datepicker-footer`}>
          {this.renderSlot('footer', null, {
            value: this.currentValue,
            emit: this.handleSelectDate,
          })}
          {this.confirm ? (
            <button
              type="button"
              class={`${prefixClass}-btn ${prefixClass}-datepicker-btn-confirm`}
              onClick={this.handleConfirmDate}
            >
              {this.confirmText}
            </button>
          ) : null}
        </div>
      );
    },
  },
  render() {
    const { prefixClass, inline, disabled } = this;
    const sidedar = this.hasSlot('sidebar') || this.shortcuts.length ? this.renderSidebar() : null;
    const content = (
      <div class={`${prefixClass}-datepicker-content`}>
        {this.hasSlot('header') ? this.renderHeader() : null}
        {this.renderContent()}
        {this.hasSlot('footer') || this.confirm ? this.renderFooter() : null}
      </div>
    );
    return (
      <div
        class={{
          [`${prefixClass}-datepicker`]: true,
          [`${prefixClass}-datepicker-range`]: this.range,
          [`${prefixClass}-datepicker-inline`]: inline,
          disabled,
        }}
      >
        {!inline ? this.renderInput() : null}
        {!inline ? (
          <Popup
            ref="popup"
            class={this.popupClass}
            style={this.popupStyle}
            visible={this.popupVisible}
            appendToBody={this.appendToBody}
            onClickoutside={this.handleClickOutSide}
          >
            {sidedar}
            {content}
          </Popup>
        ) : (
          <div class={`${prefixClass}-datepicker-main`}>
            {sidedar}
            {content}
          </div>
        )}
      </div>
    );
  },
};
