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
    minuteStep: {
      type: Number,
      default: 0,
      validator: val => val >= 0 && val <= 60
    },
    value: null,
    disabledTime: Function
  },
  computed: {
    currentHours () {
      return new Date(this.value).getHours()
    },
    currentMinutes () {
      return new Date(this.value).getMinutes()
    },
    currentSeconds () {
      return new Date(this.value).getSeconds()
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
    getTimeSelectOptions () {
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
            hours, minutes
          }
          result.push({
            value,
            label: formatTime(value)
          })
        }
      }
      return result
    }

  },
  render (h) {
    const date = new Date(this.value)
    const disabledTime = typeof this.disabledTime === 'function' && this.disabledTime

    let pickers = this.getTimeSelectOptions()
    if (Array.isArray(pickers) && pickers.length) {
      pickers = pickers.map(picker => {
        const pickHours = picker.value.hours
        const pickMinutes = picker.value.minutes
        const time = new Date(date).setHours(pickHours, pickMinutes, 0)
        return (
          <li
            class={{
              'mx-time-picker-item': true,
              'cell': true,
              'actived': pickHours === this.currentHours && pickMinutes === this.currentMinutes,
              'disabled': disabledTime && disabledTime(time)
            }}
            onClick={this.selectTime.bind(this, time)}>{picker.label}</li>
        )
      })
      return (
        <div class="mx-panel mx-panel-time">
          <ul class="mx-time-list">
            {pickers}
          </ul>
        </div>
      )
    }

    const hours = Array.apply(null, { length: 24 }).map((_, i) => {
      const time = new Date(date).setHours(i)
      return <li
        class={{
          'cell': true,
          'actived': i === this.currentHours,
          'disabled': disabledTime && disabledTime(time)
        }}
        onClick={this.selectTime.bind(this, time)}
      >{this.stringifyText(i)}</li>
    })

    const step = this.minuteStep || 1
    const length = parseInt(60 / step)
    const minutes = Array.apply(null, { length }).map((_, i) => {
      const value = i * step
      const time = new Date(date).setMinutes(value)
      return <li
        class={{
          'cell': true,
          'actived': value === this.currentMinutes,
          'disabled': disabledTime && disabledTime(time)
        }}
        onClick={this.selectTime.bind(this, time)}
      >{this.stringifyText(value)}</li>
    })

    const seconds = Array.apply(null, { length: 60 }).map((_, i) => {
      const time = new Date(date).setSeconds(i)
      return <li
        class={{
          'cell': true,
          'actived': i === this.currentSeconds,
          'disabled': disabledTime && disabledTime(time)
        }}
        onClick={this.selectTime.bind(this, time)}
      >{this.stringifyText(i)}</li>
    })

    let times = [hours, minutes]
    if (this.minuteStep === 0) {
      times.push(seconds)
    }

    times = times.map(list => (
      <ul class="mx-time-list"
        style={{ width: 100 / times.length + '%' }}>
        {list}
      </ul>
    ))

    return (
      <div class="mx-panel mx-panel-time">
        {times}
      </div>
    )
  }
}
