import { formatTime, parseTime } from '@/utils/index'

export default {
  name: 'panelTime',
  props: {
    timePickerOptions: {
      type: [Object, Function],
      default () {
        return null
      }
    },
    timeSelectOptions: {
      type: Object,
      default () {
        return null
      }
    },
    minuteStep: {
      type: Number,
      default: 0,
      validator: val => val >= 0 && val <= 60
    },
    value: null,
    timeType: {
      type: Array,
      default () {
        return ['24', 'a']
      }
    },
    disabledTime: Function
  },
  computed: {
    currentHours () {
      return this.value ? new Date(this.value).getHours() : 0
    },
    currentMinutes () {
      return this.value ? new Date(this.value).getMinutes() : 0
    },
    currentSeconds () {
      return this.value ? new Date(this.value).getSeconds() : 0
    }
  },
  methods: {
    stringifyText (value) {
      return ('00' + value).slice(String(value).length)
    },
    selectTime (time) {
      if (typeof this.disabledTime === 'function' && this.disabledTime(time)) {
        return
      }
      this.$emit('select', new Date(time))
    },
    pickTime (time) {
      if (typeof this.disabledTime === 'function' && this.disabledTime(time)) {
        return
      }
      this.$emit('pick', new Date(time))
    },
    getTimePickerOptions () {
      const result = []
      const options = this.timePickerOptions
      if (!options) {
        return []
      }
      if (typeof options === 'function') {
        return options() || []
      }
      const start = parseTime(options.start)
      const end = parseTime(options.end)
      const step = parseTime(options.step)
      if (start && end && step) {
        const startMinutes = start.minutes + start.hours * 60
        const endMinutes = end.minutes + end.hours * 60
        const stepMinutes = step.minutes + step.hours * 60
        const len = Math.floor((endMinutes - startMinutes) / stepMinutes)
        for (let i = 0; i <= len; i++) {
          let timeMinutes = startMinutes + i * stepMinutes
          let hours = Math.floor(timeMinutes / 60)
          let minutes = timeMinutes % 60
          let value = {
            hours,
            minutes
          }
          result.push({
            value,
            label: formatTime(value, ...this.timeType)
          })
        }
      }
      return result
    }
  },
  render (h) {
    const date = this.value
      ? new Date(this.value)
      : new Date().setHours(0, 0, 0, 0)
    const disabledTime =
      typeof this.disabledTime === 'function' && this.disabledTime

    let pickers = this.getTimePickerOptions()
    if (Array.isArray(pickers) && pickers.length) {
      pickers = pickers.map(picker => {
        const pickHours = picker.value.hours
        const pickMinutes = picker.value.minutes
        const time = new Date(date).setHours(pickHours, pickMinutes, 0)
        return (
          <li
            class={{
              'mx-time-picker-item': true,
              cell: true,
              actived:
                pickHours === this.currentHours &&
                pickMinutes === this.currentMinutes,
              disabled: disabledTime && disabledTime(time)
            }}
            onClick={this.pickTime.bind(this, time)}
          >
            {picker.label}
          </li>
        )
      })
      return (
        <div class="mx-panel mx-panel-time">
          <ul class="mx-time-list">{pickers}</ul>
        </div>
      )
    }

    const minuteStep = this.minuteStep || 1
    const minuteLength = parseInt(60 / minuteStep)
    let hours = Array.apply(null, { length: 24 }).map((_, i) => i)
    let minutes = Array.apply(null, { length: minuteLength }).map(
      (_, i) => i * minuteStep
    )
    let seconds =
      this.minuteStep === 0
        ? Array.apply(null, { length: 60 }).map((_, i) => i)
        : []
    let columns = { hours, minutes, seconds }

    if (this.timeSelectOptions && typeof this.timeSelectOptions === 'object') {
      columns = { ...columns, ...this.timeSelectOptions }
    }

    const hoursColumn = columns.hours.map(v => {
      const time = new Date(date).setHours(v)
      return (
        <li
          class={{
            cell: true,
            actived: v === this.currentHours,
            disabled: disabledTime && disabledTime(time)
          }}
          onClick={this.selectTime.bind(this, time)}
        >
          {this.stringifyText(v)}
        </li>
      )
    })

    const minutesColumn = columns.minutes.map(v => {
      const time = new Date(date).setMinutes(v)
      return (
        <li
          class={{
            cell: true,
            actived: v === this.currentMinutes,
            disabled: disabledTime && disabledTime(time)
          }}
          onClick={this.selectTime.bind(this, time)}
        >
          {this.stringifyText(v)}
        </li>
      )
    })

    const secondsColumn = columns.seconds.map(v => {
      const time = new Date(date).setSeconds(v)
      return (
        <li
          class={{
            cell: true,
            actived: v === this.currentSeconds,
            disabled: disabledTime && disabledTime(time)
          }}
          onClick={this.selectTime.bind(this, time)}
        >
          {this.stringifyText(v)}
        </li>
      )
    })

    let times = [hoursColumn, minutesColumn, secondsColumn].filter(
      v => v.length > 0
    )

    times = times.map(list => (
      <ul class="mx-time-list" style={{ width: 100 / times.length + '%' }}>
        {list}
      </ul>
    ))

    return <div class="mx-panel mx-panel-time">{times}</div>
  }
}
