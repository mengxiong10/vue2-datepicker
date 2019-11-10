<template>
  <div>
    <date-picker
      v-model="value"
      value-type="format"
      type="time"
      :open.sync="open"
      placeholder="Select time"
      @change="handleChange"
    ></date-picker>
  </div>
</template>

<script>
export default {
  name: 'ControlOpen',
  data() {
    return {
      value: null,
      open: false,
    };
  },
  methods: {
    handleChange(value, type) {
      if (type === 'second') {
        this.open = false;
      }
    },
  },
};
</script>
