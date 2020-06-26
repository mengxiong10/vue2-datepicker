<template>
  <div>
    <date-picker
      v-model="value1"
      type="date"
      placeholder="Select date"
      :show-be-year="true"
    ></date-picker>
  </div>
</template>

<script>
export default {
  name: 'ShowBE',
  data() {
    return {
      value1: new Date(),
    };
  },
};
</script>
