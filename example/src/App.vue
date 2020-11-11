<template>
  <div>
    <DatePicker v-model="value" />
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

export default {
  name: 'App',
  components: {
    DatePicker,
  },
  data() {
    return {
      value: null,
    };
  },
};
</script>
