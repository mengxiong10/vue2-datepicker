<template>
  <div class="box">
    <section>
      <p>disabled = "true"</p>
      <date-picker v-model="value1" disabled></date-picker>
    </section>
    <section>
      <p>editable = "false"</p>
      <date-picker v-model="value2" :editable="false"></date-picker>
    </section>
    <section>
      <p>clearable = "false"</p>
      <date-picker v-model="value3" :clearable="false"></date-picker>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: new Date(),
      value2: new Date(),
      value3: new Date(),
    };
  },
};
</script>
