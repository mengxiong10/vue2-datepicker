<template>
  <div>
    <date-picker
      v-model="value"
      :time-picker-options="{
        start: '08:30',
        step: '00:30',
        end: '18:30',
      }"
      format="hh:mm a"
      type="time"
      placeholder="hh:mm a"
    ></date-picker>
  </div>
</template>

<script>
export default {
  name: 'FixedTimeList',
  data() {
    return {
      value: null,
    };
  },
};
</script>
