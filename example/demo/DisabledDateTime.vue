<template>
  <div class="box">
    <section>
      <p>Not before than today and not after than a week</p>
      <date-picker
        v-model="value1"
        :default-value="new Date()"
        :disabled-date="disabledBeforeTodayAndAfterAWeek"
      ></date-picker>
    </section>
    <section>
      <p>Not before 09:30</p>
      <date-picker
        v-model="value3"
        value-type="format"
        type="time"
        placeholder="HH:mm:ss"
        :default-value="new Date().setHours(9, 30, 0, 0)"
        :disabled-time="notBeforeNineOClock"
      ></date-picker>
    </section>
    <section>
      <p>Not before than 12:00 Today</p>
      <date-picker
        v-model="value4"
        type="datetime"
        :default-value="new Date().setHours(12, 0, 0, 0)"
        :disabled-date="notBeforeToday"
        :disabled-time="notBeforeTodayTwelveOClock"
        value-type="format"
      ></date-picker>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: new Date(),
      value3: '',
      value4: '',
    };
  },
  methods: {
    disabledBeforeTodayAndAfterAWeek(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return date < today || date > new Date(today.getTime() + 7 * 24 * 3600 * 1000);
    },
    notBeforeNineOClock(date) {
      return date < new Date(date.getTime()).setHours(9, 30, 0, 0);
    },
    notBeforeToday(date) {
      return date < new Date(new Date().setHours(0, 0, 0, 0));
    },
    notBeforeTodayTwelveOClock(date) {
      return date < new Date(new Date().setHours(12, 0, 0, 0));
    },
  },
};
</script>
