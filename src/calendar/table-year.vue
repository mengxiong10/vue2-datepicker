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
            :ref="handleRefName(cell, i, j)"
            :key="j"
            aria-hidden="false"
            class="cell"
            role="button"
            :tabindex="handleTabIndex(cell)"
            :data-year="cell"
            :class="getCellClasses(cell)"
            @keydown.tab.prevent.stop
            @keydown.up.prevent="handleArrowUp(cell, i, j)"
            @keydown.down.prevent="handleArrowDown(cell, i, j)"
            @keydown.left.prevent="handleArrowLeft(cell, i, j)"
            @keydown.right.prevent="handleArrowRight(cell, i, j)"
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
import { createDate, setYear } from '../util/date';
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
    isDisabled: {
      type: Function,
      default: () => false,
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
    refsArray() {
      if (this.$refs) {
        return Object.entries(this.$refs);
      }
      return [];
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
    handleArrowUp(cell, row, column) {
      if (row === 0) {
        return;
      }
      const refName = this.handleRefName(cell, row - 1, column);
      const ref = this.$refs[refName]?.[0];
      if (ref) {
        ref.focus();
      }
    },
    handleArrowDown(cell, row, column) {
      if (row === this.years.length - 1) {
        return;
      }
      const refName = this.handleRefName(cell, row + 1, column);
      const ref = this.$refs[refName]?.[0];
      if (ref) {
        ref.focus();
      }
    },
    handleArrowLeft(cell, row, column) {
      const currentRefName = this.handleRefName(cell, row, column);
      const firstRef = this.refsArray[0];
      if (currentRefName !== firstRef[0]) {
        const refName = this.handleRefName(cell, row, column - 1);
        const ref = this.$refs[refName]?.[0];
        if (ref) {
          ref.focus();
        }
      } else {
        this.handleIconDoubleLeftClick();
        const lastRef = this.refsArray[this.refsArray.length - 1];
        if (lastRef.length) {
          const element = lastRef[1];
          if (element.length) {
            element[0].focus();
          }
        }
      }
    },
    handleArrowRight(cell, row, column) {
      const currentRefName = this.handleRefName(cell, row, column);
      const lastRef = this.refsArray[this.refsArray.length - 1];
      if (currentRefName !== lastRef[0]) {
        const refName = this.handleRefName(cell, row, column + 1);
        const ref = this.$refs[refName]?.[0];
        if (ref) {
          ref.focus();
        }
      } else {
        this.handleIconDoubleRightClick();
        const firstRef = this.refsArray[0];
        if (firstRef.length) {
          const element = firstRef[1];
          if (element.length) {
            element[0].focus();
          }
        }
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
    handleRefName(cellDate, row, col) {
      const date = createDate(cellDate, 0);
      if (!this.isDisabled(date)) {
        return `year-cell-${row}-${col}`;
      }
      return undefined;
    },
    handleTabIndex(cellDate) {
      const date = createDate(cellDate, 0);
      return this.isDisabled(date) ? -1 : 0;
    },
  },
};
</script>
