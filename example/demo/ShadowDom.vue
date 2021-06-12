<template>
  <div>
    <date-picker
      ref="datePicker"
      v-model="value"
      value-type="format"
      type="date"
      placeholder="Select date"
      :append-to-body="false"
    ></date-picker>
  </div>
</template>

<script>
export default {
  name: 'ShadowDom',
  data() {
    return {
      value: null,
    };
  },
  mounted() {
    const shadow = this.$el.attachShadow({ mode: 'open' });

    shadow.appendChild(this.$refs.datePicker.$el);
  },
};
</script>
