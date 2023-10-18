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
            :ref="`month-cell-${cell.text}`"
            class="cell"
            role="button"
            tabindex="0"
            :data-month="cell.month"
            :class="getCellClasses(cell.month)"
            @blur="onBlur(i, j)"
            @keydown.tab.prevent.stop
            @keydown.up.prevent="handleArrowUp(i, j)"
            @keydown.down.prevent="handleArrowDown(i, j)"
            @keydown.left.prevent="handleArrowLeft(i, j)"
            @keydown.right.prevent="handleArrowRight(i, j)"
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
import { setYear } from '../util/date';

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
    handleArrowUp(row, column) {
      if (row === 0) {
        return;
      }
      const month = this.months[row - 1][column];
      const ref = this.$refs[`month-cell-${month.text}`]?.[0];
      if (ref) {
        ref.focus();
        ref.classList.add('focus');
      }
    },
    handleArrowDown(row, column) {
      if (row === this.months.length - 1) {
        return;
      }
      const month = this.months[row + 1][column];
      const ref = this.$refs[`month-cell-${month.text}`]?.[0];
      if (ref) {
        ref.focus();
        ref.classList.add('focus');
      }
    },
    handleArrowLeft(row, column) {
      if (column <= 0) {
        if (row === 0 && column === 0) {
          this.handleIconDoubleLeftClick();
          const lastMonth = this.months[this.months.length - 1];
          const month = lastMonth[lastMonth.length - 1];
          const ref = this.$refs[`month-cell-${month.text}`]?.[0];
          if (ref) {
            ref.focus();
          }
        }
        return;
      }
      const month = this.months[row][column - 1];
      const ref = this.$refs[`month-cell-${month.text}`]?.[0];
      if (ref) {
        ref.focus();
        ref.classList.add('focus');
      }
    },
    handleArrowRight(row, column) {
      if (column >= 2) {
        if (row === this.months.length - 1) {
          const lastRow = this.months[row];
          if (column === lastRow.length - 1) {
            this.handleIconDoubleRightClick();
            const month = this.months[0][0];
            const ref = this.$refs[`month-cell-${month.text}`]?.[0];
            if (ref) {
              ref.focus();
            }
          }
        }
        return;
      }
      const month = this.months[row][column + 1];
      const ref = this.$refs[`month-cell-${month.text}`]?.[0];
      if (ref) {
        ref.focus();
        ref.classList.add('focus');
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
    moveToFirstCell() {
      const month = this.months[0][0];
      const ref = this.$refs[`month-cell-${month.text}`]?.[0];
      if (ref) {
        setTimeout(() => {
          ref.focus();
          ref.classList.add('focus');
        }, 1);
      }
    },
    onBlur(i, j) {
      const month = this.months[i][j];
      const ref = this.$refs[`month-cell-${month.text}`]?.[0];
      if (ref) {
        ref.classList.remove('focus');
      }
    },
  },
};
</script>
