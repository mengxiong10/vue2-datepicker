<template>
  <div class="box">
    <section>
      <p>date (default)</p>
      <date-picker
        v-model="value1"
        format="YYYY-MM-DD"
        type="date"
        placeholder="Select date"
      ></date-picker>
    </section>
    <section>
      <p>month</p>
      <date-picker v-model="value2" type="month" placeholder="Select month"></date-picker>
    </section>
    <section>
      <p>year</p>
      <date-picker v-model="value3" type="year" placeholder="Select year"></date-picker>
    </section>
    <section>
      <p>datetime</p>
      <date-picker v-model="value4" type="datetime" placeholder="Select datetime"></date-picker>
    </section>
    <section>
      <p>time</p>
      <date-picker v-model="value5" type="time" placeholder="Select time"></date-picker>
    </section>
    <section>
      <p>week</p>
      <date-picker v-model="value6" type="week" placeholder="Select week"></date-picker>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Basic',
  data() {
    return {
      value1: null,
      value2: null,
      value3: null,
      value4: null,
      value5: null,
      value6: null,
    };
  },
};
</script>
