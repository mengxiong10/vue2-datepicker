<template>
  <div>
    <date-picker
      v-model="value"
      :minute-step="30"
      :hour-options="hours"
      format="HH:mm"
      value-type="format"
      type="time"
      placeholder="HH:mm"
    ></date-picker>
  </div>
</template>

<script>
export default {
  name: 'ControlOpen',
  data() {
    return {
      value: '',
      hours: Array.from({ length: 10 }).map((_, i) => i + 8),
    };
  },
};
</script>
