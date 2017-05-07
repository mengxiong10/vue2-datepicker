<template>
  <div class="calendar">
    <div class="calendar-header">
      <i class="calendar__prev-icon" @click="changeYear(-1)">&laquo;</i>
      <i class="calendar__prev-icon" @click="changeMonth(-1)">&lsaquo;</i>
      <span>{{now.getFullYear() + '年'}}</span>
      <span>{{now.getMonth() + 1 + '月'}}</span>
      <i class="calendar__next-icon" @click="changeYear(1)">&raquo;</i>
      <i class="calendar__next-icon" @click="changeMonth(1)" >&rsaquo;</i>
    </div>
    <div class="calendar-content">
      <table class="calendar-table">
        <thead>
          <tr>
            <th v-for="day in days">{{day}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in dates">
            <td v-for="cell in row"
                :title="cell.title"
                :class="getClasses(cell)"
                @click="selectDate(cell)">{{cell.day}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { formatDate } from './utils.js'

export default {
  props: {
    startAt: null,
    endAt: null,
    value: null,
    show: Boolean,
  },
  data() {
    return {
      days: ['日', '一', '二', '三', '四', '五', '六'],
      dates: [],
      now: this.value ? new Date(this.value) : new Date(),
    }
  },
  created() {
    this.update()
  },
  watch: {
    show(val) {
      if (val) {
        this.now = this.value ? new Date(this.value) : new Date()
      }
    },
    value(val) {
      this.now = val ? new Date(val) : new Date()
    },
    now: 'update',
  },
  methods: {
    getCalendar(time, firstday, length, classes) {
      const today = new Date().setHours(0, 0, 0, 0)
      return Array.apply(null, { length }).map((v, i) => { // eslint-disable-line
        let day = firstday + i
        let type = classes
        const date = new Date(time.getFullYear(), time.getMonth(), day)
        const isToday = today === date.getTime()
        if (isToday) {
          day = '今天'
          type += ' today'
        }
        return {
          title: formatDate(date, 'yyyy-MM-dd'),
          date,
          day,
          type,
        }
      })
    },
    // 更新面板选择时间
    update() {
      const row = 6
      const col = 7
      const time = new Date(this.now)

      time.setDate(0) // 把时间切换到上个月最后一天
      const lastMonthLength = time.getDay() + 1  // time.getDay() 0是星期天, 1是星期一 ...
      const lastMonthfirst = time.getDate() - (lastMonthLength - 1)
      const lastMonth = this.getCalendar(time, lastMonthfirst, lastMonthLength, 'lastMonth')

      time.setMonth(time.getMonth() + 2, 0) // 切换到这个月最后一天
      const curMonthLength = time.getDate()
      const curMonth = this.getCalendar(time, 1, curMonthLength, 'curMonth')

      time.setMonth(time.getMonth() + 1, 1)
      const nextMonthLength = (row * col) - (lastMonthLength + curMonthLength)
      const nextMonth = this.getCalendar(time, 1, nextMonthLength, 'nextMonth')

      // 分割数组
      let index = 0
      let resIndex = 0
      const arr = lastMonth.concat(curMonth, nextMonth)
      const result = new Array(row)
      while (index < row * col) {
        result[resIndex++] = arr.slice(index, index += col)
      }
      this.dates = result
    },
    getClasses(cell) {
      const classes = []
      const cellTime = cell.date.getTime()
      const curTime = this.value ? new Date(this.value).setHours(0, 0, 0, 0) : 0
      const startTime = this.startAt ? this.startAt.setHours(0, 0, 0, 0) : 0
      const endTime = this.endAt ? this.endAt.setHours(0, 0, 0, 0) : 0
      classes.push(cell.type)
      if (startTime) {
        if (cellTime < startTime) {
          classes.push('disabled')
        } else if (curTime && cellTime <= curTime) {
          classes.push('inrange')
        }
      } else if (endTime) {
        if (cellTime > endTime) {
          classes.push('disabled')
        } else if (curTime && cellTime >= curTime) {
          classes.push('inrange')
        }
      }
      if (curTime === cellTime) {
        classes.push('current')
      }
      return classes.join(' ')
    },
    changeYear(flag) {
      const now = new Date(this.now)
      now.setDate(1)
      now.setFullYear(now.getFullYear() + flag)
      this.now = now
    },
    changeMonth(flag) {
      const now = new Date(this.now)
      now.setDate(1)
      now.setMonth(now.getMonth() + flag)
      this.now = now
    },
    selectDate(cell) {
      const classes = this.getClasses(cell)
      if (classes.indexOf('disabled') !== -1) {
        return
      }
      this.now = cell.date
      this.$emit('input', cell.date)
    },
  },
}

</script>

<style scoped>

.calendar {
  float: left;
  padding: 6px 12px;
}

.calendar:nth-child(2) {
  border-left: 1px solid #e4e4e4;
}

.calendar-header {
  line-height: 34px;
  text-align: center;
}

.calendar__next-icon,
.calendar__prev-icon {
  font-style: normal;
  font-size: 20px;
  padding: 0 6px;
  cursor: pointer;
}

.calendar__next-icon:hover,
.calendar__prev-icon:hover {
  color: #1284e7;
}

.calendar__prev-icon {
  float: left;
}

.calendar__next-icon {
  float: right;
}

.calendar-table {
  width: 100%;
  font-size: 12px;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;
}

.calendar-table td,
.calendar-table th {
  width: 30px;
  height: 30px;
  text-align: center;
}

.calendar-table td {
  cursor: pointer;
}

.calendar-table td.inrange,
.calendar-table td:hover {
  background-color: #eaf8fe;
}

.calendar-table td.current {
  color: #fff;
  background-color: #1284e7;
}

.calendar-table td.disabled {
  cursor: not-allowed;
  color: #ccc;
  background-color: #f3f3f3;
}

.lastMonth,
.nextMonth {
  color: #ddd;
}

.today {
  color: #20a0ff;
}

</style>

