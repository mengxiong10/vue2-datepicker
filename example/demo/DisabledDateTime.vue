<template>
  <div class="box">
    <section>
      <p>date not before today</p>
      <date-picker v-model="value1" :disabled-date="notBeforeToday"></date-picker>
    </section>
    <section>
      <p>date not after today</p>
      <date-picker v-model="value2" :disabled-date="notAfterToday"></date-picker>
    </section>
    <section>
      <p>time not before 09:00</p>
      <date-picker
        v-model="value3"
        value-type="format"
        type="time"
        placeholder="HH:mm:ss"
        :default-value="new Date().setHours(9, 0, 0)"
        :disabled-time="notBeforeNine"
      ></date-picker>
    </section>
    <section>
      <p>datetime not before 2019-10-09 12:00</p>
      <date-picker
        v-model="value4"
        type="datetime"
        :disabled-date="notBeforeDate"
        :disabled-time="notBeforeTime"
        value-type="format"
      ></date-picker>
    </section>
  </div>
</template>

<script>
const today = new Date();
today.setHours(0, 0, 0, 0);

export default {
  data() {
    return {
      value1: new Date(),
      value2: new Date(),
      value3: '',
      value4: '',
      value5: '',
    };
  },
  methods: {
    notBeforeToday(date) {
      return date < today;
    },
    notAfterToday(date) {
      return date > today;
    },
    notBeforeNine(date) {
      return date.getHours() < 9;
    },
    notBeforeDate(date) {
      return date < new Date(2019, 9, 9);
    },
    notBeforeTime(date) {
      return date < new Date(2019, 9, 9, 12);
    },
  },
};
</script>
