<template>
  <div :class="`${prefixClass}-calendar ${prefixClass}-calendar-panel-year`">
    <div :class="`${prefixClass}-calendar-header`">
      <icon-button
        type="double-left"
        :aria-label="locale.prev"
        :disabled="isDisabledArrows('last-decade')"
        @click="handleIconDoubleLeftClick"
      ></icon-button>
      <span :class="`${prefixClass}-calendar-header-label`">
        <span>{{ firstYear }}</span>
        <span :class="`${prefixClass}-calendar-decade-separator`"></span>
        <span>{{ lastYear }}</span>
      </span>
      <icon-button
        type="double-right"
        :aria-label="locale.next"
        :disabled="isDisabledArrows('next-decade')"
        @click="handleIconDoubleRightClick"
      ></icon-button>
    </div>
    <div :class="`${prefixClass}-calendar-content`">
      <table
        :class="`${prefixClass}-table ${prefixClass}-table-year`"
        @click="handleClick"
        @keydown.enter="handleClick"
      >
        <tr v-for="(row, i) in years" :key="i">
          <td
            v-for="(cell, j) in row"
            :ref="handleRef(cell)"
            :key="j"
            aria-hidden="false"
            class="cell"
            role="button"
            :tabindex="handleTabIndex(cell)"
            :data-year="cell"
            :class="getCellClasses(cell)"
            @blur.prevent="onBlur(i, j)"
            @keydown.tab.prevent.stop
            @keydown.up.prevent="handleArrowUp(i, j)"
            @keydown.down.prevent="handleArrowDown(i, j)"
            @keydown.left.prevent="handleArrowLeft(i, j)"
            @keydown.right.prevent="handleArrowRight(i, j)"
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
import { getLocale } from '../locale';

export default {
  name: 'TableYear',
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
    locale() {
      return this.getLocale();
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
    handleArrowUp(row, column) {
      if (row === 0) {
        return;
      }
      const year = this.years[row - 1][column];
      const ref = this.$refs[`year-cell-${year}`]?.[0];
      if (ref) {
        ref.focus();
        ref.classList.add('focus');
      }
    },
    handleArrowDown(row, column) {
      if (row === this.years.length - 1) {
        return;
      }
      const year = this.years[row + 1][column];
      const ref = this.$refs[`year-cell-${year}`]?.[0];
      if (ref) {
        ref.focus();
        ref.classList.add('focus');
      }
    },
    handleArrowLeft(row, column) {
      if (column % 2 === 0) {
        if (row === 0 && column === 0) {
          this.handleIconDoubleLeftClick();
          const ref = this.$refs[`year-cell-${this.lastYear}`]?.[0];
          if (ref) {
            ref.focus();
          }
        }
        return;
      }
      const year = this.years[row][column - 1];
      const ref = this.$refs[`year-cell-${year}`]?.[0];
      if (ref) {
        ref.focus();
        ref.classList.add('focus');
      }
    },
    handleArrowRight(row, column) {
      if (column % 2 === 1) {
        if (row === this.years.length - 1) {
          const lastRow = this.years[row];
          if (column === lastRow.length - 1) {
            this.handleIconDoubleRightClick();
            const year = this.years[0][0];
            const ref = this.$refs[`year-cell-${year}`]?.[0];
            if (ref) {
              ref.focus();
            }
          }
        }
        return;
      }
      const year = this.years[row][column + 1];
      const ref = this.$refs[`year-cell-${year}`]?.[0];
      if (ref) {
        ref.focus();
        ref.classList.add('focus');
      }
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
        this.selectedYear = parseInt(year, 10);
      }
    },
    handleRef(cellDate) {
      return this.disabledCalendarChanger(cellDate, 'year') ? undefined : `year-cell-${cellDate}`;
    },
    handleTabIndex(cellDate) {
      return this.disabledCalendarChanger(cellDate, 'year') ? -1 : 0;
    },
    moveToFirstCell() {
      const year = this.years[0][0];
      const ref = this.$refs[`year-cell-${year}`]?.[0];
      if (ref) {
        setTimeout(() => {
          ref.focus();
          ref.classList.add('focus');
        }, 1);
      }
    },
    onBlur(i, j) {
      const year = this.years[i][j];
      const ref = this.$refs[`year-cell-${year}`]?.[0];
      if (ref) {
        ref.classList.remove('focus');
      }
    },
  },
};
</script>
