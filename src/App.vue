<template>
  <div id="app">
    <div class="demo">
      <span class="label">默认:</span>
      <date-picker v-model="value1"></date-picker>
    </div>
    <div class="demo">
      <span class="label">range:</span>
      <date-picker v-model="value2" range></date-picker>
    </div>
  </div>
</template>

<script>
import DatePicker from './datepicker/index.vue'

export default {
  name: 'app',
  components:{ DatePicker },
  data () {
    return {
      value1:'2015-10-10',
      value2:'',
    }
  }
}
</script>

<style>
.demo {
  float:left;
  margin:60px;
}
.label{
  margin-right: 1em;
}
</style>
