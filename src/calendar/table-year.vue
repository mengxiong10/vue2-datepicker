<template>
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
</template>

<script>
import { chunk } from '../util/base';

export default {
  name: 'TableYear',
  inject: {
    prefixClass: {
      default: 'mx',
    },
  },
  props: {
    decade: Number,
    getCellClasses: {
      type: Function,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    years() {
      const firstYear = this.decade;
      const years = [];
      for (let i = 0; i < 10; i++) {
        years.push(firstYear + i);
      }
      return chunk(years, 2);
    },
  },
  methods: {
    handleClick(evt) {
      let { target } = evt;
      if (target.tagName === 'DIV') {
        target = target.parentNode;
      }
      const year = target.getAttribute('data-year');
      if (year) {
        this.$emit('select', parseInt(year, 10));
      }
    },
  },
};
</script>
