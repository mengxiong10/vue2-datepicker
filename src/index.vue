<template>
  <div
    class="mx-datepicker"
    :class="{
      'mx-datepicker-range': range,
      'disabled': disabled
    }"
    :style="{
      'width': computedWidth
    }"
    v-clickoutside="closePopup">
    <div class="mx-input-wrapper"
      @click.stop="showPopup">
      <input
        :class="inputClass"
        :name="inputName"
        v-bind="inputAttr"
        ref="input"
        type="text"
        autocomplete="off"
        :disabled="disabled"
        :readonly="!editable"
        :value="text"
        :placeholder="innerPlaceholder"
        @keydown="handleKeydown"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        @change="handleChange">
      <span
        v-if="showClearIcon"
        class="mx-input-append mx-clear-wrapper"
        @click.stop="clearDate">
        <slot name="mx-clear-icon">
          <i class="mx-input-icon mx-clear-icon"></i>
        </slot>
      </span>
      <span class="mx-input-append">
        <slot name="calendar-icon">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 200 200" class="mx-calendar-icon">
            <rect x="13" y="29" rx="14" ry="14" width="174" height="158" fill="transparent" />
            <line x1="46" x2="46" y1="8" y2="50" />
            <line x1="154" x2="154" y1="8" y2="50" />
            <line x1="13" x2="187" y1="70" y2="70" />
            <text x="50%" y="135" font-size="90" stroke-width="1" text-anchor="middle" dominant-baseline="middle">{{new Date().getDate()}}</text>
          </svg>
        </slot>
      </span>
    </div>
    <div class="mx-datepicker-popup"
      :style="innerPopupStyle"
      v-show="popupVisible"
      @click.stop.prevent
      ref="calendar">
      <slot name="header">
        <div class="mx-shortcuts-wrapper"
          v-if="range && innerShortcuts.length">
          <button
            type="button"
            class="mx-shortcuts"
            v-for="(range, index) in innerShortcuts"
            :key="index"
            @click="selectRange(range)">{{range.text}}</button>
        </div>
      </slot>
      <calendar-panel
        v-if="!range"
        v-bind="$attrs"
        ref="calendarPanel"
        :index="-1"
        :type="innerType"
        :date-format="innerDateFormat"
        :value="currentValue"
        :visible="popupVisible"
        @select-date="selectDate"
        @select-time="selectTime"></calendar-panel>
      <div class="mx-range-wrapper"
        v-else>
        <calendar-panel
          style="box-shadow:1px 0 rgba(0, 0, 0, .1)"
          v-bind="$attrs"
          ref="calendarPanel"
          :index="0"
          :type="innerType"
          :date-format="innerDateFormat"
          :value="currentValue[0]"
          :end-at="currentValue[1]"
          :start-at="null"
          :visible="popupVisible"
          @select-date="selectStartDate"
          @select-time="selectStartTime"></calendar-panel>
        <calendar-panel
          v-bind="$attrs"
          :index="1"
          :type="innerType"
          :date-format="innerDateFormat"
          :value="currentValue[1]"
          :start-at="currentValue[0]"
          :end-at="null"
          :visible="popupVisible"
          @select-date="selectEndDate"
          @select-time="selectEndTime"></calendar-panel>
      </div>
      <slot name="footer" :confirm="confirmDate">
        <div class="mx-datepicker-footer"
          v-if="confirm">
          <button type="button"
            class="mx-datepicker-btn mx-datepicker-btn-confirm"
            @click="confirmDate">{{ confirmText }}</button>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import fecha from 'fecha'
import clickoutside from '@/directives/clickoutside'
import { isValidDate, isValidRangeDate, isDateObejct, isPlainObject, formatDate, parseDate, throttle } from '@/utils/index'
import { transformDate } from '@/utils/transform'
import CalendarPanel from './calendar.vue'
import locale from '@/mixins/locale'
import Languages from '@/locale/languages'

export default {
  fecha,
  name: 'DatePicker',
  components: { CalendarPanel },
  mixins: [locale],
  directives: {
    clickoutside
  },
  props: {
    value: null,
    valueType: {
      default: 'date',
      validator: function (value) {
        return ['timestamp', 'format', 'date'].indexOf(value) !== -1 || isPlainObject(value)
      }
    },
    placeholder: {
      type: String,
      default: null
    },
    lang: {
      type: [String, Object],
      default: 'zh'
    },
    format: {
      type: [String, Object],
      default: 'YYYY-MM-DD'
    },
    dateFormat: {
      type: String // format the time header and date tooltip
    },
    type: {
      type: String,
      default: 'date' // ['date', 'datetime'] zendy added 'month', 'year', mxie added "time"
    },
    range: {
      type: Boolean,
      default: false
    },
    rangeSeparator: {
      type: String,
      default: '~'
    },
    width: {
      type: [String, Number],
      default: null
    },
    confirmText: {
      type: String,
      default: 'OK'
    },
    confirm: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    shortcuts: {
      type: [Boolean, Array],
      default: true
    },
    inputName: {
      type: String,
      default: 'date'
    },
    inputClass: {
      type: [String, Array],
      default: 'mx-input'
    },
    inputAttr: Object,
    appendToBody: {
      type: Boolean,
      default: false
    },
    popupStyle: {
      type: Object
    }
  },
  data () {
    return {
      currentValue: this.range ? [null, null] : null,
      userInput: null,
      popupVisible: false,
      position: {}
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: 'handleValueChange'
    },
    popupVisible (val) {
      if (val) {
        this.initCalendar()
      } else {
        this.userInput = null
        this.blur()
      }
    }
  },
  computed: {
    transform () {
      const type = this.valueType
      if (isPlainObject(type)) {
        return { ...transformDate.date, ...type }
      }
      if (type === 'format') {
        return {
          value2date: this.parse.bind(this),
          date2value: this.stringify.bind(this)
        }
      }
      return transformDate[type] || transformDate.date
    },
    language () {
      if (isPlainObject(this.lang)) {
        return { ...Languages.en, ...this.lang }
      }
      return Languages[this.lang] || Languages.en
    },
    innerPlaceholder () {
      if (typeof this.placeholder === 'string') {
        return this.placeholder
      }
      return this.range ? this.t('placeholder.dateRange') : this.t('placeholder.date')
    },
    text () {
      if (this.userInput !== null) {
        return this.userInput
      }
      const { value2date } = this.transform
      if (!this.range) {
        return this.isValidValue(this.value)
          ? this.stringify(value2date(this.value))
          : ''
      }
      return this.isValidRangeValue(this.value)
        ? `${this.stringify(value2date(this.value[0]))} ${this.rangeSeparator} ${this.stringify(value2date(this.value[1]))}`
        : ''
    },
    computedWidth () {
      if (typeof this.width === 'number' || (typeof this.width === 'string' && /^\d+$/.test(this.width))) {
        return this.width + 'px'
      }
      return this.width
    },
    showClearIcon () {
      return !this.disabled && this.clearable && (this.range ? this.isValidRangeValue(this.value) : this.isValidValue(this.value))
    },
    innerType () {
      return String(this.type).toLowerCase()
    },
    innerShortcuts () {
      if (Array.isArray(this.shortcuts)) {
        return this.shortcuts
      }
      if (this.shortcuts === false) {
        return []
      }
      const pickers = this.t('pickers')
      const arr = [
        {
          text: pickers[0],
          onClick (self) {
            self.currentValue = [new Date(), new Date(Date.now() + 3600 * 1000 * 24 * 7)]
            self.updateDate(true)
          }
        },
        {
          text: pickers[1],
          onClick (self) {
            self.currentValue = [new Date(), new Date(Date.now() + 3600 * 1000 * 24 * 30)]
            self.updateDate(true)
          }
        },
        {
          text: pickers[2],
          onClick (self) {
            self.currentValue = [new Date(Date.now() - 3600 * 1000 * 24 * 7), new Date()]
            self.updateDate(true)
          }
        },
        {
          text: pickers[3],
          onClick (self) {
            self.currentValue = [new Date(Date.now() - 3600 * 1000 * 24 * 30), new Date()]
            self.updateDate(true)
          }
        }
      ]
      return arr
    },
    innerDateFormat () {
      if (this.dateFormat) {
        return this.dateFormat
      }
      if (typeof this.format !== 'string') {
        return 'YYYY-MM-DD'
      }
      if (this.innerType === 'date') {
        return this.format
      }
      return this.format.replace(/[Hh]+.*[msSaAZ]|\[.*?\]/g, '').trim() || 'YYYY-MM-DD'
    },
    innerPopupStyle () {
      return { ...this.position, ...this.popupStyle }
    }
  },
  mounted () {
    if (this.appendToBody) {
      this.popupElm = this.$refs.calendar
      document.body.appendChild(this.popupElm)
    }
    this._displayPopup = throttle(() => {
      if (this.popupVisible) {
        this.displayPopup()
      }
    }, 200)
    window.addEventListener('resize', this._displayPopup)
    window.addEventListener('scroll', this._displayPopup)
  },
  beforeDestroy () {
    if (this.popupElm && this.popupElm.parentNode === document.body) {
      document.body.removeChild(this.popupElm)
    }
    window.removeEventListener('resize', this._displayPopup)
    window.removeEventListener('scroll', this._displayPopup)
  },
  methods: {
    initCalendar () {
      this.handleValueChange(this.value)
      this.displayPopup()
    },
    stringify (date) {
      return (isPlainObject(this.format) && typeof this.format.stringify === 'function')
        ? this.format.stringify(date)
        : formatDate(date, this.format)
    },
    parse (value) {
      return (isPlainObject(this.format) && typeof this.format.parse === 'function')
        ? this.format.parse(value)
        : parseDate(value, this.format)
    },
    isValidValue (value) {
      const { value2date } = this.transform
      return isValidDate(value2date(value))
    },
    isValidRangeValue (value) {
      const { value2date } = this.transform
      return Array.isArray(value) && value.length === 2 && this.isValidValue(value[0]) &&
        this.isValidValue(value[1]) && (value2date(value[1]).getTime() >= value2date(value[0]).getTime())
    },
    dateEqual (a, b) {
      return isDateObejct(a) && isDateObejct(b) && a.getTime() === b.getTime()
    },
    rangeEqual (a, b) {
      return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((item, index) => this.dateEqual(item, b[index]))
    },
    selectRange (range) {
      if (typeof range.onClick === 'function') {
        const close = range.onClick(this)
        if (close !== false) {
          this.closePopup()
        }
      } else {
        this.currentValue = [new Date(range.start), new Date(range.end)]
        this.updateDate(true)
        this.closePopup()
      }
    },
    clearDate () {
      const date = this.range ? [null, null] : null
      this.currentValue = date
      this.updateDate(true)
      this.$emit('clear')
    },
    confirmDate () {
      const valid = this.range ? isValidRangeDate(this.currentValue) : isValidDate(this.currentValue)
      if (valid) {
        this.updateDate(true)
      }
      this.emitDate('confirm')
      this.closePopup()
    },
    updateDate (confirm = false) {
      if ((this.confirm && !confirm) || this.disabled) {
        return false
      }
      const equal = this.range ? this.rangeEqual(this.value, this.currentValue) : this.dateEqual(this.value, this.currentValue)
      if (equal) {
        return false
      }
      this.emitDate('input')
      this.emitDate('change')
      return true
    },
    emitDate (eventName) {
      const { date2value } = this.transform
      const value = this.range
        ? this.currentValue.map(date2value)
        : date2value(this.currentValue)
      this.$emit(eventName, value)
    },
    handleValueChange (value) {
      const { value2date } = this.transform
      if (this.range) {
        this.currentValue = this.isValidRangeValue(value) ? value.map(value2date) : [null, null]
      } else {
        this.currentValue = this.isValidValue(value) ? value2date(value) : null
      }
    },
    selectDate (date) {
      this.currentValue = date
      this.updateDate() && this.closePopup()
    },
    selectStartDate (date) {
      this.$set(this.currentValue, 0, date)
      if (this.currentValue[1]) {
        this.updateDate()
      }
    },
    selectEndDate (date) {
      this.$set(this.currentValue, 1, date)
      if (this.currentValue[0]) {
        this.updateDate()
      }
    },
    selectTime (time, close) {
      this.currentValue = time
      this.updateDate() && close && this.closePopup()
    },
    selectStartTime (time) {
      this.selectStartDate(time)
    },
    selectEndTime (time) {
      this.selectEndDate(time)
    },
    showPopup () {
      if (this.disabled) {
        return
      }
      this.popupVisible = true
    },
    closePopup () {
      this.popupVisible = false
    },
    getPopupSize (element) {
      const originalDisplay = element.style.display
      const originalVisibility = element.style.visibility
      element.style.display = 'block'
      element.style.visibility = 'hidden'
      const styles = window.getComputedStyle(element)
      const width = element.offsetWidth + parseInt(styles.marginLeft) + parseInt(styles.marginRight)
      const height = element.offsetHeight + parseInt(styles.marginTop) + parseInt(styles.marginBottom)
      const result = { width, height }
      element.style.display = originalDisplay
      element.style.visibility = originalVisibility
      return result
    },
    displayPopup () {
      const dw = document.documentElement.clientWidth
      const dh = document.documentElement.clientHeight
      const InputRect = this.$el.getBoundingClientRect()
      const PopupRect = this._popupRect || (this._popupRect = this.getPopupSize(this.$refs.calendar))
      const position = {}
      let offsetRelativeToInputX = 0
      let offsetRelativeToInputY = 0
      if (this.appendToBody) {
        offsetRelativeToInputX = window.pageXOffset + InputRect.left
        offsetRelativeToInputY = window.pageYOffset + InputRect.top
      }
      if (
        dw - InputRect.left < PopupRect.width &&
        InputRect.right < PopupRect.width
      ) {
        position.left = offsetRelativeToInputX - InputRect.left + 1 + 'px'
      } else if (InputRect.left + InputRect.width / 2 <= dw / 2) {
        position.left = offsetRelativeToInputX + 'px'
      } else {
        position.left = offsetRelativeToInputX + InputRect.width - PopupRect.width + 'px'
      }
      if (
        InputRect.top <= PopupRect.height &&
        dh - InputRect.bottom <= PopupRect.height
      ) {
        position.top = offsetRelativeToInputY + dh - InputRect.top - PopupRect.height + 'px'
      } else if (InputRect.top + InputRect.height / 2 <= dh / 2) {
        position.top = offsetRelativeToInputY + InputRect.height + 'px'
      } else {
        position.top = offsetRelativeToInputY - PopupRect.height + 'px'
      }
      if (position.top !== this.position.top || position.left !== this.position.left) {
        this.position = position
      }
    },
    blur () {
      this.$refs.input.blur()
    },
    handleBlur (event) {
      this.$emit('blur', event)
    },
    handleFocus (event) {
      if (!this.popupVisible) {
        this.showPopup()
      }
      this.$emit('focus', event)
    },
    handleKeydown (event) {
      const keyCode = event.keyCode
      // Tab 9 or Enter 13
      if (keyCode === 9 || keyCode === 13) {
        // ie emit the watch before the change event
        event.stopPropagation()
        this.handleChange()
        this.userInput = null
        this.closePopup()
      }
    },
    handleInput (event) {
      this.userInput = event.target.value
    },
    handleChange () {
      if (this.editable && this.userInput !== null) {
        const value = this.text
        const checkDate = this.$refs.calendarPanel.isDisabledTime
        if (!value) {
          this.clearDate()
          return
        }
        if (this.range) {
          const range = value.split(` ${this.rangeSeparator} `)
          if (range.length === 2) {
            const start = this.parse(range[0])
            const end = this.parse(range[1])
            if (start && end && !checkDate(start, null, end) && !checkDate(end, start, null)) {
              this.currentValue = [start, end]
              this.updateDate(true)
              this.closePopup()
              return
            }
          }
        } else {
          const date = this.parse(value)
          if (date && !checkDate(date, null, null)) {
            this.currentValue = date
            this.updateDate(true)
            this.closePopup()
            return
          }
        }
        this.$emit('input-error', value)
      }
    }
  }
}
</script>
