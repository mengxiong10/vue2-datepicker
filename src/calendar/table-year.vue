<template>
  <div :class="`${prefixClass}-calendar ${prefixClass}-calendar-panel-year`">
    <div :class="`${prefixClass}-calendar-header`">
      <icon-button
        type="double-left"
        :disabled="isDoubleLeftDisabled"
        @click="handleIconDoubleLeftClick"
      ></icon-button>
      <icon-button
        type="double-right"
        :disabled="isDoubleRightDisabled"
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
    calendar: {
      type: Date,
      default: () => new Date(),
    },
    getCellClasses: {
      type: Function,
      default: () => [],
    },
    getIsYearDisabled: {
      type: Function,
      default: () => false,
    },
    getYearPanel: {
      type: Function,
    },
    min: {
      // in year e.g. 2021
      type: Number,
    },
    max: {
      // in year e.g. 2021
      type: Number,
    },
  },
  computed: {
    isDoubleLeftDisabled() {
      return !!this.min && this.firstYear <= this.min;
    },
    isDoubleRightDisabled() {
      return !!this.max && this.lastYear >= this.max;
    },
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
      if (year) {
        if (this.getIsYearDisabled(year)) return;
        this.$emit('select', parseInt(year, 10));
      }
    },
  },
};
</script>
