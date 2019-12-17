<template>
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
</template>

<script>
import { chunk } from '../util/base';
import { getLocaleFieldValue } from '../locale';

export default {
  name: 'TableMonth',
  inject: {
    t: {
      default: () => getLocaleFieldValue,
    },
    prefixClass: {
      default: 'mx',
    },
  },
  props: {
    getCellClasses: {
      type: Function,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    months() {
      const monthsLocale = this.t('months') || this.t('formatLocale.monthsShort');
      const months = monthsLocale.map((text, month) => {
        return { text, month };
      });
      return chunk(months, 3);
    },
  },
  methods: {
    handleClick(evt) {
      let { target } = evt;
      if (target.tagName === 'DIV') {
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
