<template>
  <div :class="`${prefixClass}-calendar ${prefixClass}-calendar-panel-month`">
    <div :class="`${prefixClass}-calendar-header`">
      <icon-button type="double-left" @click="handleIconDoubleLeftClick"></icon-button>
      <icon-button type="double-right" @click="handleIconDoubleRightClick"></icon-button>
      <span :class="`${prefixClass}-calendar-header-label`">
        <button
          type="button"
          :class="`${prefixClass}-btn ${prefixClass}-btn-text`"
          @click="handlePanelChange"
        >
          {{ calendarYear }}
        </button>
      </span>
    </div>
    <div :class="`${prefixClass}-calendar-content`">
      <table :class="`${prefixClass}-table ${prefixClass}-table-month`" @click="handleClick">
        <tr v-for="(row, i) in months" :key="i">
          <td
            v-for="(cell, j) in row"
            :key="j"
            :data-month="cell.month"
            class="cell"
            :class="getCellClasses(cell.month)"
          >
            <div>{{ cell.text }}</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { chunk } from '../util/base';
import IconButton from './icon-button';
import { getLocale } from '../locale';
import { createDate } from '../util/date';

export default {
  name: 'TableMonth',
  components: { IconButton },
  inject: {
    getLocale: {
      default: () => getLocale,
    },
    prefixClass: {
      default: 'mx',
    },
  },
  props: {
    calendar: {
      type: Date,
      default: () => new Date(),
    },
    getCellClasses: {
      type: Function,
      default: () => [],
    },
  },
  computed: {
    calendarYear() {
      return this.calendar.getFullYear();
    },
    months() {
      const locale = this.getLocale();
      const monthsLocale = locale.months || locale.formatLocale.monthsShort;
      const months = monthsLocale.map((text, month) => {
        return { text, month };
      });
      return chunk(months, 3);
    },
  },
  methods: {
    getNextCalendar(diffYear) {
      const year = this.calendar.getFullYear();
      const month = this.calendar.getMonth();
      return createDate(year + diffYear, month);
    },
    handleIconDoubleLeftClick() {
      this.$emit('changecalendar', this.getNextCalendar(-1), 'last-year');
    },
    handleIconDoubleRightClick() {
      this.$emit('changecalendar', this.getNextCalendar(1), 'next-year');
    },
    handlePanelChange() {
      this.$emit('changepanel', 'year');
    },
    handleClick(evt) {
      let { target } = evt;
      if (target.tagName.toUpperCase() === 'DIV') {
        target = target.parentNode;
      }
      const month = target.getAttribute('data-month');
      if (month) {
        this.$emit('select', parseInt(month, 10));
      }
    },
  },
};
</script>
