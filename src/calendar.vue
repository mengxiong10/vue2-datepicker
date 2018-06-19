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
        v-show="panel !== 'TIME'"
        class="mx-current-month"
        @click="handleBtnMonth">{{months[calendarMonth]}}</a>
      <a
        v-show="panel !== 'TIME'"
        class="mx-current-year"
        @click="handleBtnYear">{{calendarYear}}</a>
      <a
        v-show="panel === 'TIME'"
        class="mx-time-header"
        @click="showPanelDate">{{timeHeader}}</a>
    </div>
    <div class="mx-calendar-content">
      <panel-date
        v-show="panel === 'DATE'"
        :value="value"
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
        :first-year="firstYear"
        @select="selectYear" />
      <panel-month
        v-show="panel === 'MONTH'"
        :value="value"
        :calendar-year="calendarYear"
        @select="selectMonth" />
      <panel-time
        v-show="panel === 'TIME'"
        :minute-step="minuteStep"
        :time-picker-options="timePickerOptions"
        :value="value"
        :disabled-time="isDisabledTime"
        @select="selectTime" />
    </div>
  </div>
</template>

<script>
import { isValidDate, isDateObejct } from '@/utils/index'
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

    // below user set
    type: {
      type: String,
      default: 'date' // ['date', 'datetime']
    },
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
    timeHeader () {
      return this.value && new Date(this.value).toLocaleDateString()
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
          [...this.$el.querySelectorAll('.mx-panel-time .mx-time-list')].forEach(el => {
            scrollIntoView(el, el.querySelector('.actived'))
          })
        })
      }
    },
    init () {
      this.panel = 'DATE'
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
      this.showPanelMonth()
    },
    selectMonth (month) {
      this.changeCalendarMonth(month)
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
    handleIconMonth (flag) {
      this.changeCalendarMonth(this.calendarMonth + flag)
    },
    handleIconYear (flag) {
      if (this.panel === 'YEAR') {
        this.changePanelYears(flag)
      } else {
        this.changeCalendarYear(this.calendarYear + flag)
      }
    },
    handleBtnYear () {
      if (this.panel === 'YEAR') {
        this.showPanelDate()
      } else {
        this.showPanelYear()
      }
    },
    handleBtnMonth () {
      if (this.panel === 'MONTH') {
        this.showPanelDate()
      } else {
        this.showPanelMonth()
      }
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
