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
      @click="showPopup">
      <input
        ref="input"
        type="text"
        autocomplete="off"
        :class="inputClass"
        :name="inputName"
        :disabled="disabled"
        :readonly="!editable"
        :value="text"
        :placeholder="innerPlaceholder"
        @input="handleInput"
        @change="handleChange">
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
      <span
        v-if="showClearIcon"
        class="mx-input-append mx-clear-wrapper"
        @click.stop="clearDate">
        <slot name="mx-clear-icon">
          <i class="mx-input-icon mx-clear-icon"></i>
        </slot>
      </span>
    </div>
    <div class="mx-datepicker-popup"
      :style="position"
      v-show="popupVisible"
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
import { isValidDate, isValidRange, isDateObejct, isPlainObject, formatDate, parseDate } from '@/utils/index'
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
    placeholder: {
      type: String,
      default: null
    },
    lang: {
      type: [String, Object],
      default: 'zh'
    },
    format: {
      type: String,
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
      }
    }
  },
  computed: {
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
      if (!this.range) {
        return isValidDate(this.value) ? this.stringify(this.value) : ''
      }
      return isValidRange(this.value)
        ? `${this.stringify(this.value[0])} ${this.rangeSeparator} ${this.stringify(this.value[1])}`
        : ''
    },
    computedWidth () {
      if (typeof this.width === 'number' || (typeof this.width === 'string' && /^\d+$/.test(this.width))) {
        return this.width + 'px'
      }
      return this.width
    },
    showClearIcon () {
      return !this.disabled && this.clearable && (this.range ? isValidRange(this.value) : isValidDate(this.value))
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
            self.currentValue = [ new Date(), new Date(Date.now() + 3600 * 1000 * 24 * 7) ]
            self.updateDate(true)
          }
        },
        {
          text: pickers[1],
          onClick (self) {
            self.currentValue = [ new Date(), new Date(Date.now() + 3600 * 1000 * 24 * 30) ]
            self.updateDate(true)
          }
        },
        {
          text: pickers[2],
          onClick (self) {
            self.currentValue = [ new Date(Date.now() - 3600 * 1000 * 24 * 7), new Date() ]
            self.updateDate(true)
          }
        },
        {
          text: pickers[3],
          onClick (self) {
            self.currentValue = [ new Date(Date.now() - 3600 * 1000 * 24 * 30), new Date() ]
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
      if (this.innerType === 'date') {
        return this.format
      }
      return this.format.replace(/[Hh]+.*[msSaAZ]|\[.*?\]/g, '').trim() || 'YYYY-MM-DD'
    }
  },
  methods: {
    initCalendar () {
      this.handleValueChange(this.value)
      this.displayPopup()
    },
    stringify (date, format) {
      return formatDate(date, format || this.format)
    },
    parseDate (value, format) {
      return parseDate(value, format || this.format)
    },
    dateEqual (a, b) {
      return isDateObejct(a) && isDateObejct(b) && a.getTime() === b.getTime()
    },
    rangeEqual (a, b) {
      return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((item, index) => this.dateEqual(item, b[index]))
    },
    selectRange (range) {
      if (typeof range.onClick === 'function') {
        return range.onClick(this)
      }
      this.currentValue = [ new Date(range.start), new Date(range.end) ]
      this.updateDate(true)
    },
    clearDate () {
      const date = this.range ? [null, null] : null
      this.currentValue = date
      this.updateDate(true)
      this.$emit('clear')
    },
    confirmDate () {
      const valid = this.range ? isValidRange(this.currentValue) : isValidDate(this.currentValue)
      if (valid) {
        this.updateDate(true)
      }
      this.$emit('confirm', this.currentValue)
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
      this.$emit('input', this.currentValue)
      this.$emit('change', this.currentValue)
      return true
    },
    handleValueChange (value) {
      if (!this.range) {
        this.currentValue = isValidDate(value) ? new Date(value) : null
      } else {
        this.currentValue = isValidRange(value) ? [new Date(value[0]), new Date(value[1])] : [null, null]
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
    selectTime (time) {
      this.currentValue = time
      this.updateDate()
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
    displayPopup () {
      const dw = document.documentElement.clientWidth
      const dh = document.documentElement.clientHeight
      const InputRect = this.$el.getBoundingClientRect()
      const PopupRect = this.$refs.calendar.getBoundingClientRect()
      this.position = {}
      if (
        dw - InputRect.left < PopupRect.width &&
        InputRect.right < PopupRect.width
      ) {
        this.position.left = 1 - InputRect.left + 'px'
      } else if (InputRect.left + InputRect.width / 2 <= dw / 2) {
        this.position.left = 0
      } else {
        this.position.right = 0
      }
      if (
        InputRect.top <= PopupRect.height + 1 &&
        dh - InputRect.bottom <= PopupRect.height + 1
      ) {
        this.position.top = dh - InputRect.top - PopupRect.height - 1 + 'px'
      } else if (InputRect.top + InputRect.height / 2 <= dh / 2) {
        this.position.top = '100%'
      } else {
        this.position.bottom = '100%'
      }
    },
    handleInput (event) {
      this.userInput = event.target.value
    },
    handleChange (event) {
      const value = event.target.value
      if (this.editable && this.userInput !== null) {
        const calendar = this.$children[0]
        const checkDate = calendar.type === 'date' ? calendar.isDisabledDate : calendar.isDisabledTime
        if (this.range) {
          const range = value.split(` ${this.rangeSeparator} `)
          if (range.length === 2) {
            const start = this.parseDate(range[0], this.format)
            const end = this.parseDate(range[1], this.format)
            if (start && end && !checkDate(start, null, end) && !checkDate(end, start, null)) {
              this.currentValue = [ start, end ]
              this.updateDate(true)
              this.closePopup()
              return
            }
          }
        } else {
          const date = this.parseDate(value, this.format)
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
