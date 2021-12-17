<template>
  <div>
    <div>
      <p>min: {{ min }}</p>
      <p>max: {{ max }}</p>
    </div>
    <div class="box">
      <section>
        <date-picker
          v-model="value"
          placeholder="Select date"
          format="YYYY-MM-DD"
          type="date"
          :min="min"
          :max="max"
        ></date-picker>
      </section>
      <section>
        <date-picker
          v-model="value"
          placeholder="Select date range"
          format="YYYY-MM-DD"
          type="date"
          range
          :min="min"
          :max="max"
        ></date-picker>
      </section>
    </div>
  </div>
</template>

<script>
const MONTH_1 = 2.628e9;

export default {
  name: 'ControlOpen',
  data() {
    return {
      value: '',
      min: new Date(Date.now() - 3 * MONTH_1),
      max: new Date(Date.now() + 200 * MONTH_1),
    };
  },
};
</script>
