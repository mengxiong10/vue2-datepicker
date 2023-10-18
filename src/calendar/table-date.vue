<template>
  <div :class="`${prefixClass}-calendar ${prefixClass}-calendar-panel-date`">
    <div :class="`${prefixClass}-calendar-header`">
      <icon-button
        type="double-left"
        :aria-label="locale.prevYear"
        :disabled="isDisabledArrows('last-year')"
        @click="handleIconDoubleLeftClick"
      ></icon-button>
      <icon-button
        type="left"
        :aria-label="locale.prevMonth"
        :disabled="isDisabledArrows('last-month')"
        @click="handleIconLeftClick"
      ></icon-button>
      <span :class="`${prefixClass}-calendar-header-label`">
        <button
          v-for="item in yearMonth"
          :key="item.panel"
          type="button"
          :class="
            `${prefixClass}-btn ${prefixClass}-btn-text ${prefixClass}-btn-current-${item.panel}`
          "
          @click="handlePanelChange(item.panel)"
        >
          {{ item.label }}
        </button>
      </span>
      <icon-button
        type="right"
        :aria-label="locale.nextMonth"
        :disabled="isDisabledArrows('next-month')"
        @click="handleIconRightClick"
      ></icon-button>
      <icon-button
        type="double-right"
        :aria-label="locale.nextYear"
        :disabled="isDisabledArrows('next-year')"
        @click="handleIconDoubleRightClick"
      ></icon-button>
    </div>
    <div :class="`${prefixClass}-calendar-content`">
      <table :class="`${prefixClass}-table ${prefixClass}-table-date`">
        <thead>
          <tr>
            <th v-if="showWeekNumber" :class="`${prefixClass}-week-number-header`"></th>
            <th v-for="day in days" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody @click="handleCellClick" @keydown.enter="handleCellClick">
          <tr
            v-for="(row, i) in dates"
            :key="i"
            :class="[`${prefixClass}-date-row`, getRowClasses(row)]"
          >
            <td
              v-if="showWeekNumber"
              :data-row-col="`${i},0`"
              :class="`${prefixClass}-week-number`"
            >
              {{ getWeekNumber(row[0]) }}
            </td>
            <td
              v-for="(cell, j) in row"
              :id="handleId(i, j)"
              :key="j"
              :ref="handleRefName(cell, i, j)"
              class="cell"
              role="button"
              :class="getCellClasses(cell)"
              :data-row-col="`${i},${j}`"
              :disabled="isDisabled(cell)"
              :tabindex="handleTabIndex(cell)"
              :title="getCellTitle(cell)"
              @mouseenter="handleMouseEnter(cell)"
              @mouseleave="handleMouseLeave(cell)"
              @keydown.tab.prevent.stop
              @keydown.up.prevent="handleArrowUp(cell, i, j)"
              @keydown.down.prevent="handleArrowDown(cell, i, j)"
              @keydown.left.prevent="handleArrowLeft(cell, i, j)"
              @keydown.right.prevent="handleArrowRight(cell, i, j)"
            >
              <div>{{ cell.getDate() }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { getWeek, format } from 'date-format-parse';
import IconButton from './icon-button';
import { chunk } from '../util/base';
import { getCalendar, setMonth, setYear } from '../util/date';
import { getLocale } from '../locale';

export default {
  name: 'TableDate',
  components: { IconButton },
  inject: {
    getLocale: {
      default: () => getLocale,
    },
    getWeek: {
      default: () => getWeek,
    },
    prefixClass: {
      default: 'mx',
    },
    onDateMouseEnter: {
      default: undefined,
    },
    onDateMouseLeave: {
      default: undefined,
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
    isDisabled: {
      type: Function,
      default: () => false,
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
      default: () => [],
    },
    getCellClasses: {
      type: Function,
      default: () => [],
    },
    range: {
      type: Boolean,
      default: false,
    },
    rangeIndex: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    firstDayOfWeek() {
      return this.getLocale().formatLocale.firstDayOfWeek || 0;
    },
    yearMonth() {
      const { yearFormat, monthBeforeYear, monthFormat = 'MMM' } = this.getLocale();
      const yearLabel = {
        panel: 'year',
        label: this.formatDate(this.calendar, yearFormat),
      };
      const monthLabel = {
        panel: 'month',
        label: this.formatDate(this.calendar, monthFormat),
      };
      return monthBeforeYear ? [monthLabel, yearLabel] : [yearLabel, monthLabel];
    },
    days() {
      const locale = this.getLocale();
      const days = locale.days || locale.formatLocale.weekdaysMin;
      return days.concat(days).slice(this.firstDayOfWeek, this.firstDayOfWeek + 7);
    },
    dates() {
      const year = this.calendar.getFullYear();
      const month = this.calendar.getMonth();
      const arr = getCalendar({
        firstDayOfWeek: this.firstDayOfWeek,
        year,
        month,
      });
      return chunk(arr, 7);
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
          date.setFullYear(date.getFullYear() - 1, date.getMonth() + 1, 0);
          date.setHours(23, 59, 59, 999);
          break;
        case 'next-year':
          date.setFullYear(date.getFullYear() + 1);
          break;
        case 'last-month':
          date.setMonth(date.getMonth(), 0);
          date.setHours(23, 59, 59, 999);
          break;
        case 'next-month':
          date.setMonth(date.getMonth() + 1);
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
      if (row === this.dates.length - 1) {
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
      } else if (this.range) {
        let index = 0;
        if (this.rangeIndex === 0) {
          this.handleIconLeftClick();
        } else {
          index = this.rangeIndex - 1;
        }
        const lastRow = this.dates[this.dates.length - 1];
        const cellName = `#range-date-${index}-cell-${this.dates.length - 1}-${lastRow.length - 1}`;
        const cellElement = document.querySelector(cellName);
        if (cellElement) {
          cellElement.focus();
        }
      } else {
        this.$nextTick(() => {
          this.handleIconLeftClick();
          const lastRef = this.refsArray[this.refsArray.length - 1];
          if (lastRef.length) {
            const element = lastRef[1];
            if (element.length) {
              element[0].focus();
            }
          }
        });
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
      } else if (this.range) {
        let index = 0;
        if (this.rangeIndex === 0) {
          index = this.rangeIndex + 1;
        } else {
          index = this.rangeIndex - 1;
          this.handleIconRightClick();
        }
        const cellName = `#range-date-${index}-cell-0-0`;
        const cellElement = document.querySelector(cellName);
        if (cellElement) {
          cellElement.focus();
        }
      } else {
        this.$nextTick(() => {
          this.handleIconLeftClick();
          const firstRef = this.refsArray[0];
          if (firstRef.length) {
            const element = firstRef[1];
            if (element.length) {
              element[0].focus();
            }
          }
        });
      }
    },
    handleIconLeftClick() {
      this.$emit(
        'changecalendar',
        setMonth(this.calendar, v => v - 1),
        'last-month'
      );
    },
    handleIconRightClick() {
      this.$emit(
        'changecalendar',
        setMonth(this.calendar, v => v + 1),
        'next-month'
      );
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
    handlePanelChange(panel) {
      this.$emit('changepanel', panel);
    },
    handleMouseEnter(cell) {
      if (typeof this.onDateMouseEnter === 'function') {
        this.onDateMouseEnter(cell);
      }
    },
    handleMouseLeave(cell) {
      if (typeof this.onDateMouseLeave === 'function') {
        this.onDateMouseLeave(cell);
      }
    },
    handleCellClick(evt) {
      let { target } = evt;
      if (target.tagName.toUpperCase() === 'DIV') {
        target = target.parentNode;
      }
      const index = target.getAttribute('data-row-col');
      if (index) {
        const [row, col] = index.split(',').map(v => parseInt(v, 10));
        const date = this.dates[row][col];
        this.$emit('select', new Date(date));
      }
    },
    formatDate(date, fmt) {
      return format(date, fmt, { locale: this.getLocale().formatLocale });
    },
    getCellTitle(date) {
      const fmt = this.titleFormat;
      return this.formatDate(date, fmt);
    },
    getWeekNumber(date) {
      return this.getWeek(date, this.getLocale().formatLocale);
    },
    handleRefName(cellDate, row, col) {
      if (!this.isDisabled(cellDate)) {
        if (this.range) {
          return `range-date-${this.rangeIndex}-cell-${row}-${col}`;
        }
        return `date-cell-${row}-${col}`;
      }
      return undefined;
    },
    handleId(row, col) {
      if (this.range) {
        return `range-date-${this.rangeIndex}-cell-${row}-${col}`;
      }
      return undefined;
    },
    handleTabIndex(cellDate) {
      const response = this.isDisabled(cellDate);
      return response ? -1 : 0;
    },
  },
};
</script>
