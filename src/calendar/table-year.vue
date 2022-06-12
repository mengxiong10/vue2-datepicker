<template>
  <div :class="`${prefixClass}-calendar ${prefixClass}-calendar-panel-year`">
    <div :class="`${prefixClass}-calendar-header`">
      <icon-button
        type="double-left"
        :disabled="isDisabledArrows('last-decade')"
        @click="handleIconDoubleLeftClick"
      ></icon-button>
      <icon-button
        type="double-right"
        :disabled="isDisabledArrows('next-decade')"
        @click="handleIconDoubleRightClick"
      ></icon-button>
      <span :class="`${prefixClass}-calendar-header-label`">
        <span>{{ firstYear }}</span>
        <span :class="`${prefixClass}-calendar-decade-separator`"></span>
        <span>{{ lastYear }}</span>
      </span>
    </div>
    <div :class="`${prefixClass}-calendar-content`">
      <table :class="`${prefixClass}-table ${prefixClass}-table-year`" @click="handleClick">
        <tr v-for="(row, i) in years" :key="i">
          <td
            v-for="(cell, j) in row"
            :key="j"
            :data-year="cell"
            class="cell"
            :class="getCellClasses(cell)"
          >
            <div>{{ cell }}</div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import IconButton from './icon-button';
import { chunk } from '../util/base';
import { setYear } from '../util/date';

export default {
  name: 'TableYear',
  components: { IconButton },
  inject: {
    prefixClass: {
      default: 'mx',
    },
  },
  props: {
    disabledCalendarChanger: {
      type: Function,
      default: () => false,
    },
    calendar: {
      type: Date,
      default: () => new Date(),
    },
    getCellClasses: {
      type: Function,
      default: () => [],
    },
    getYearPanel: {
      type: Function,
    },
  },
  computed: {
    years() {
      const calendar = new Date(this.calendar);
      if (typeof this.getYearPanel === 'function') {
        return this.getYearPanel(calendar);
      }
      return this.getYears(calendar);
    },
    firstYear() {
      return this.years[0][0];
    },
    lastYear() {
      const last = arr => arr[arr.length - 1];
      return last(last(this.years));
    },
  },
  methods: {
    isDisabledArrows(type) {
      const date = new Date(this.calendar);
      switch (type) {
        case 'last-decade':
          date.setFullYear(this.firstYear - 1, 11, 31);
          date.setHours(23, 59, 59, 999);
          break;
        case 'next-decade':
          date.setFullYear(this.lastYear + 1, 0, 1);
          break;
        default:
          break;
      }
      return this.disabledCalendarChanger(date, type);
    },
    getYears(calendar) {
      const firstYear = Math.floor(calendar.getFullYear() / 10) * 10;
      const years = [];
      for (let i = 0; i < 10; i++) {
        years.push(firstYear + i);
      }
      return chunk(years, 2);
    },
    handleIconDoubleLeftClick() {
      this.$emit(
        'changecalendar',
        setYear(this.calendar, v => v - 10),
        'last-decade'
      );
    },
    handleIconDoubleRightClick() {
      this.$emit(
        'changecalendar',
        setYear(this.calendar, v => v + 10),
        'next-decade'
      );
    },
    handleClick(evt) {
      let { target } = evt;
      if (target.tagName.toUpperCase() === 'DIV') {
        target = target.parentNode;
      }
      const year = target.getAttribute('data-year');
      if (year && !target.classList.contains('disabled')) {
        this.$emit('select', parseInt(year, 10));
      }
    },
  },
};
</script>
