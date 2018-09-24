<template>
  <div class="mx-calendar">
    <div class="mx-calendar-header">
      <a
        v-show="panel !== 'TIME'"
        class="mx-icon-last-year"
        @click="handleIconYear(-1)">&laquo;</a>
      <a
        v-show="panel === 'DATE'"
        class="mx-icon-last-month"
        @click="handleIconMonth(-1)">&lsaquo;</a>
      <a
        v-show="panel !== 'TIME'"
        class="mx-icon-next-year"
        @click="handleIconYear(1)">&raquo;</a>
      <a
        v-show="panel === 'DATE'"
        class="mx-icon-next-month"
        @click="handleIconMonth(1)">&rsaquo;</a>
      <a
        v-show="panel === 'DATE'"
        class="mx-current-month"
        @click="handleBtnMonth">{{months[calendarMonth]}}</a>
      <a
        v-show="panel === 'DATE' || panel === 'MONTH'"
        class="mx-current-year"
        @click="handleBtnYear">{{calendarYear}}</a>
      <a
        v-show="panel === 'YEAR'"
        class="mx-current-year">{{yearHeader}}</a>
      <a
        v-show="panel === 'TIME'"
        class="mx-time-header"
        @click="handleTimeHeader">{{timeHeader}}</a>
    </div>
    <div class="mx-calendar-content">
      <panel-date
        v-show="panel === 'DATE'"
        :value="value"
        :date-format="dateFormat"
        :calendar-month="calendarMonth"
        :calendar-year="calendarYear"
        :start-at="startAt"
        :end-at="endAt"
        :first-day-of-week="firstDayOfWeek"
        :disabled-date="isDisabledDate"
        @select="selectDate"/>
      <panel-year
        v-show="panel === 'YEAR'"
        :value="value"
        :disabled-year="isDisabledYear"
        :first-year="firstYear"
        @select="selectYear" />
      <panel-month
        v-show="panel === 'MONTH'"
        :value="value"
        :disabled-month="isDisabledMonth"
        :calendar-year="calendarYear"
        @select="selectMonth" />
      <panel-time
        v-show="panel === 'TIME'"
        :minute-step="minuteStep"
        :time-picker-options="timePickerOptions"
        :value="value"
        :disabled-time="isDisabledTime"
        :time-type="timeType"
        @select="selectTime" />
    </div>
  </div>
</template>

<script>
import { isValidDate, isDateObejct, formatDate } from '@/utils/index'
import locale from '@/mixins/locale'
import scrollIntoView from '@/utils/scroll-into-view'
import PanelDate from '@/panel/date'
import PanelYear from '@/panel/year'
import PanelMonth from '@/panel/month'
import PanelTime from '@/panel/time'

export default {
  name: 'CalendarPanel',
  components: { PanelDate, PanelYear, PanelMonth, PanelTime },
  mixins: [locale],
  props: {
    value: {
      default: null,
      validator: function (val) {
        return val === null || isValidDate(val)
      }
    },
    startAt: null,
    endAt: null,
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'date'
    },
    dateFormat: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    // below user set
    firstDayOfWeek: {
      default: 7,
      type: Number,
      validator: val => val >= 1 && val <= 7
    },
    notBefore: {
      default: null,
      validator: function (val) {
        return !val || isValidDate(val)
      }
    },
    notAfter: {
      default: null,
      validator: function (val) {
        return !val || isValidDate(val)
      }
    },
    disabledDays: {
      type: [Array, Function],
      default: function () {
        return []
      }
    },
    minuteStep: {
      type: Number,
      default: 0,
      validator: val => val >= 0 && val <= 60
    },
    timePickerOptions: {
      type: [Object, Function],
      default () {
        return null
      }
    }
  },
  data () {
    const now = new Date()
    const calendarYear = now.getFullYear()
    const calendarMonth = now.getMonth()
    const firstYear = Math.floor(calendarYear / 10) * 10
    return {
      panel: 'DATE',
      dates: [],
      calendarMonth,
      calendarYear,
      firstYear
    }
  },
  computed: {
    now: {
      get () {
        return new Date(this.calendarYear, this.calendarMonth).getTime()
      },
      set (val) {
        const now = new Date(val)
        this.calendarYear = now.getFullYear()
        this.calendarMonth = now.getMonth()
      }
    },
    timeType () {
      const h = /h+/.test(this.$parent.format) ? '12' : '24'
      const a = /A/.test(this.$parent.format) ? 'A' : 'a'
      return [h, a]
    },
    timeHeader () {
      if (this.type === 'time') {
        return this.$parent.format
      }
      return this.value && formatDate(this.value, this.dateFormat)
    },
    yearHeader () {
      return this.firstYear + ' ~ ' + (this.firstYear + 10)
    },
    months () {
      return this.t('months')
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: 'updateNow'
    },
    visible: {
      immediate: true,
      handler: 'init'
    },
    panel: {
      immediate: true,
      handler: 'handelPanelChange'
    }
  },
  methods: {
    handelPanelChange (panel) {
      if (panel === 'YEAR') {
        this.firstYear = Math.floor(this.calendarYear / 10) * 10
      } else if (panel === 'TIME') {
        this.$nextTick(() => {
          const list = this.$el.querySelectorAll('.mx-panel-time .mx-time-list')
          for (let i = 0, len = list.length; i < len; i++) {
            const el = list[i]
            scrollIntoView(el, el.querySelector('.actived'))
          }
        })
      }
    },
    init () {
      const type = this.type
      if (type === 'month') {
        this.panel = 'MONTH'
      } else if (type === 'year') {
        this.panel = 'YEAR'
      } else if (type === 'time') {
        this.panel = 'TIME'
      } else {
        this.panel = 'DATE'
      }
      this.updateNow(this.value)
    },
    // 根据value更新日历
    updateNow (value) {
      this.now = value ? new Date(value) : new Date()
    },
    isDisabledTime (date, startAt, endAt) {
      const time = new Date(date).getTime()
      const notBefore = this.notBefore && (time < new Date(this.notBefore))
      const notAfter = this.notAfter && (time > new Date(this.notAfter))
      startAt = startAt === undefined ? this.startAt : startAt
      startAt = startAt && (time < new Date(startAt))
      endAt = endAt === undefined ? this.endAt : endAt
      endAt = endAt && (time > new Date(endAt))
      return notBefore || notAfter || startAt || endAt
    },
    isDisabledDate (date, startAt, endAt) {
      const time = new Date(date).getTime()
      const notBefore = this.notBefore && (time < new Date(this.notBefore).setHours(0, 0, 0, 0))
      const notAfter = this.notAfter && (time > new Date(this.notAfter).setHours(0, 0, 0, 0))
      startAt = startAt === undefined ? this.startAt : startAt
      startAt = startAt && (time < new Date(startAt).setHours(0, 0, 0, 0))
      endAt = endAt === undefined ? this.endAt : endAt
      endAt = endAt && (time > new Date(endAt).setHours(0, 0, 0, 0))
      let disabledDays = false
      if (Array.isArray(this.disabledDays)) {
        disabledDays = this.disabledDays.some(v => new Date(v).setHours(0, 0, 0, 0) === time)
      } else if (typeof this.disabledDays === 'function') {
        disabledDays = this.disabledDays(new Date(date))
      }
      return notBefore || notAfter || disabledDays || startAt || endAt
    },
    isDisabledYear (year) {
      const date = new Date(year, this.calendarMonth)
      return this.isDisabledDate(date)
    },
    isDisabledMonth (month) {
      const date = new Date(this.calendarYear, month)
      return this.isDisabledDate(date)
    },
    selectDate (date) {
      if (this.type === 'datetime') {
        let time = new Date(date)
        if (isDateObejct(this.value)) {
          time.setHours(
            this.value.getHours(),
            this.value.getMinutes(),
            this.value.getSeconds()
          )
        }
        if (this.isDisabledTime(time)) {
          time.setHours(0, 0, 0, 0)
          if (this.notBefore && time.getTime() < new Date(this.notBefore).getTime()) {
            time = new Date(this.notBefore)
          }
          if (this.startAt && time.getTime() < new Date(this.startAt).getTime()) {
            time = new Date(this.startAt)
          }
        }
        this.$emit('select-time', time)
        this.panel = 'TIME'
        return
      }
      this.$emit('select-date', date)
    },
    selectYear (year) {
      this.changeCalendarYear(year)
      if (this.type.toLowerCase() === 'year') {
        return this.selectDate(new Date(this.now))
      }
      this.showPanelMonth()
    },
    selectMonth (month) {
      this.changeCalendarMonth(month)
      if (this.type.toLowerCase() === 'month') {
        return this.selectDate(new Date(this.now))
      }
      this.showPanelDate()
    },
    selectTime (time) {
      this.$emit('select-time', time)
    },
    changeCalendarYear (year) {
      this.now = new Date(year, this.calendarMonth)
    },
    changeCalendarMonth (month) {
      this.now = new Date(this.calendarYear, month)
    },
    getSibling () {
      const calendars = this.$parent.$children.filter(v => v.$options.name === this.$options.name)
      const index = calendars.indexOf(this)
      const sibling = calendars[index ^ 1]
      return sibling
    },
    handleIconMonth (flag) {
      const month = this.calendarMonth
      this.changeCalendarMonth(month + flag)
      this.$parent.$emit('change-calendar-month', {
        month,
        flag,
        vm: this,
        sibling: this.getSibling()
      })
    },
    handleIconYear (flag) {
      if (this.panel === 'YEAR') {
        this.changePanelYears(flag)
      } else {
        const year = this.calendarYear
        this.changeCalendarYear(year + flag)
        this.$parent.$emit('change-calendar-year', {
          year,
          flag,
          vm: this,
          sibling: this.getSibling()
        })
      }
    },
    handleBtnYear () {
      this.showPanelYear()
    },
    handleBtnMonth () {
      this.showPanelMonth()
    },
    handleTimeHeader () {
      if (this.type === 'time') {
        return
      }
      this.showPanelDate()
    },
    changePanelYears (flag) {
      this.firstYear = this.firstYear + flag * 10
    },
    showPanelDate () {
      this.panel = 'DATE'
    },
    showPanelYear () {
      this.panel = 'YEAR'
    },
    showPanelMonth () {
      this.panel = 'MONTH'
    }
  }
}
</script>
