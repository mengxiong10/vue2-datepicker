<template>
  <table class="mx-table mx-table-date">
    <thead>
      <tr>
        <th v-if="showWeekNumber" class="mx-week-number-header"></th>
        <th v-for="day in days" :key="day">{{ day }}</th>
      </tr>
    </thead>
    <tbody @click="handleCellClick">
      <tr v-for="(row, i) in dates" :key="i" class="mx-date-row" :class="getRowClasses(row)">
        <td v-if="showWeekNumber" class="mx-week-number">
          {{ getWeekNumber(row[0].day) }}
        </td>
        <td
          v-for="(cell, j) in row"
          :key="j"
          :data-day="cell.day"
          class="cell"
          :class="getCellClasses(cell.day)"
          :title="getCellTitle(cell.day)"
        >
          <div>{{ cell.text }}</div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { getWeek } from 'date-format-parse';
import localeMixin from '../mixin/locale';
import formatMixin from '../mixin/format';
import { chunk } from '../util/base';
import { createDate } from '../util/date';

export default {
  name: 'TableDate',
  mixins: [localeMixin, formatMixin],
  props: {
    calendarYear: {
      type: Number,
      default() {
        return new Date().getFullYear();
      },
    },
    calendarMonth: {
      type: Number,
      default() {
        return new Date().getMonth();
      },
    },
    showWeekNumber: {
      type: Boolean,
      default: false,
    },
    titleFormat: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    getRowClasses: {
      type: Function,
      default() {
        return [];
      },
    },
    getCellClasses: {
      type: Function,
      default() {
        return [];
      },
    },
  },
  computed: {
    firstDayOfWeek() {
      return this.t('formatLocale.firstDayOfWeek') || 0;
    },
    days() {
      const days = this.t('days') || this.t('formatLocale.weekdaysMin');
      return days.concat(days).slice(this.firstDayOfWeek, this.firstDayOfWeek + 7);
    },
    dates() {
      const arr = [];
      const { firstDayOfWeek } = this;
      const year = this.calendarYear;
      const month = this.calendarMonth;

      // change to the last day of the last month
      const calendar = createDate(year, month, 0);
      const lastDayInLastMonth = calendar.getDate();
      // getDay() 0 is Sunday, 1 is Monday
      const firstDayInLastMonth =
        lastDayInLastMonth - ((calendar.getDay() + 7 - firstDayOfWeek) % 7);
      for (let i = firstDayInLastMonth; i <= lastDayInLastMonth; i++) {
        const day = i - lastDayInLastMonth;
        arr.push({ day, text: i });
      }
      // change to the last day of the current month
      calendar.setMonth(month + 1, 0);
      const lastDayInCurrentMonth = calendar.getDate();
      for (let i = 1; i <= lastDayInCurrentMonth; i++) {
        arr.push({ day: i, text: i });
      }

      const lastMonthLength = lastDayInLastMonth - firstDayInLastMonth + 1;
      const nextMonthLength = 6 * 7 - lastMonthLength - lastDayInCurrentMonth;
      for (let i = 1; i <= nextMonthLength; i++) {
        arr.push({ day: lastDayInCurrentMonth + i, text: i });
      }

      return chunk(arr, 7);
    },
  },
  methods: {
    handleCellClick(evt) {
      let { target } = evt;
      if (target.tagName === 'DIV') {
        target = target.parentNode;
      }
      const day = target.getAttribute('data-day');
      if (day) {
        this.$emit('select', parseInt(day, 10));
      }
    },
    getCellTitle(day) {
      const year = this.calendarYear;
      const month = this.calendarMonth;
      const format = this.titleFormat;
      const date = createDate(year, month, day);
      return this.formatDate(date, format);
    },
    getWeekNumber(day) {
      const year = this.calendarYear;
      const month = this.calendarMonth;
      const date = createDate(year, month, day);
      return getWeek(date, this.t('formatLocale'));
    },
  },
};
</script>
