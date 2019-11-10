<template>
  <table class="mx-table mx-table-month" @click="handleClick">
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
import localeMixin from '../mixin/locale';
import { chunk } from '../util/base';

export default {
  name: 'TableMonth',
  mixins: [localeMixin],
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
