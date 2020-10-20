<template>
  <div>
    <date-picker
      v-model="value1"
      type="date"
      placeholder="Select date"
      format="DD/MM/YYYY"
      :show-be-year="true"
    ></date-picker>

    <date-picker
      v-model="value2"
      type="date"
      placeholder="Select date"
      format="DD MMM YY"
      :show-be-year="true"
    ></date-picker>

    <date-picker
      v-model="value3"
      type="datetime"
      placeholder="Select date"
      format="DD/MM/YYYY hh:mm:ss"
      :show-be-year="true"
    ></date-picker>

    <date-picker
      v-model="value4"
      type="datetime"
      placeholder="Select date"
      format="DD MMM YY hh:mm:ss"
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
      value2: new Date(),
      value3: new Date(),
      value4: new Date(),
    };
  },
};
</script>
