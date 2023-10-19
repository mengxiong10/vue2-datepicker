<template>
  <div :class="`${prefixClass}-calendar ${prefixClass}-calendar-panel-month`">
    <div :class="`${prefixClass}-calendar-header`">
      <icon-button
        type="double-left"
        :aria-label="locale.prev"
        :disabled="isDisabledArrows('last-year')"
        @click="handleIconDoubleLeftClick"
      ></icon-button>
      <span :class="`${prefixClass}-calendar-header-label`">
        <button
          type="button"
          :class="`${prefixClass}-btn ${prefixClass}-btn-text`"
          @click="handlePanelChange"
        >
          {{ calendarYear }}
        </button>
      </span>
      <icon-button
        type="double-right"
        :aria-label="locale.next"
        :disabled="isDisabledArrows('next-year')"
        @click="handleIconDoubleRightClick"
      ></icon-button>
    </div>
    <div :class="`${prefixClass}-calendar-content`">
      <table
        :class="`${prefixClass}-table ${prefixClass}-table-month`"
        @click="handleClick"
        @keydown.enter="handleClick"
      >
        <tr v-for="(row, i) in months" :key="i">
          <td
            v-for="(cell, j) in row"
            :key="j"
            :ref="handleRefName(cell, i, j)"
            class="cell"
            role="button"
            :disabled="isDisabled(cell)"
            :tabindex="handleTabIndex(cell)"
            :data-month="cell.month"
            :class="getCellClasses(cell.month)"
            @keydown.tab.prevent.stop
            @keydown.up.prevent="handleArrowUp(cell, i, j)"
            @keydown.down.prevent="handleArrowDown(cell, i, j)"
            @keydown.left.prevent="handleArrowLeft(cell, i, j)"
            @keydown.right.prevent="handleArrowRight(cell, i, j)"
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
import { createDate, setYear } from '../util/date';

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
    isDisabled: {
      type: Function,
      default: () => false,
    },
  },
  computed: {
    calendarYear() {
      return this.calendar.getFullYear();
    },
    months() {
      const { locale } = this;
      const monthsLocale = locale.months || locale.formatLocale.monthsShort;
      const months = monthsLocale.map((text, month) => {
        return { text, month };
      });
      return chunk(months, 3);
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
        case 'last-year':
          date.setFullYear(date.getFullYear() - 1, 11, 31);
          date.setHours(23, 59, 59, 999);
          break;
        case 'next-year':
          date.setFullYear(date.getFullYear() + 1, 0, 1);
          break;
        default:
          break;
      }
      return this.disabledCalendarChanger(date, type);
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
      if (row === this.months.length - 1) {
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
        setYear(this.calendar, v => v - 1),
        'last-year'
      );
    },
    handleIconDoubleRightClick() {
      this.$emit(
        'changecalendar',
        setYear(this.calendar, v => v + 1),
        'next-year'
      );
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
      if (month && !target.classList.contains('disabled')) {
        this.$emit('select', parseInt(month, 10));
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
