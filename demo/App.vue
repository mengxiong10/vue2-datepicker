<template>
  <div id="app">
    <div class="example">
        <section class="demo">
          <span class="label">default:</span>
          <date-picker v-model="value1" lang="en" editable></date-picker>
        </section>
        <section class="demo">
          <span class="label">range:</span>
          <date-picker v-model="value2" range lang="en"></date-picker>
        </section>
        <pre class="pre">{{demo1}}</pre>
    </div>
    <div class="example">
        <section class="demo">
          <span class="label">datetime:</span>
          <date-picker v-model="value3" lang="en" type="datetime" format="yyyy-MM-dd HH:mm:ss"></date-picker>
        </section>
        <section class="demo">
          <span class="label">datetime with minute-step picker:</span>
          <date-picker v-model="value4" lang="en" type="datetime" format="yyyy-MM-dd hh:mm:ss a"
          :time-picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:30'
          }"></date-picker>
        </section>
        <section class="demo">
          <span class="label">datetime range:</span>
          <date-picker v-model="value5" range type="datetime" lang="en" format="yyyy-MM-dd HH:mm:ss"></date-picker>
        </section>
        <blockquote class="tips">
          if you use the datetime, you should set the format which default is 'yyyy-MM-dd'
        </blockquote>
        <pre class="pre">{{demo2}}</pre>
    </div>
    <div class="example">
      <section class="demo">
        <span class="label">with confirm:</span>
        <date-picker 
          v-model="value6" 
          format="yyyy-MM-dd" 
          lang="en"
          confirm></date-picker>
      </section>
      <section class="demo">
        <span class="label">datetime with confirm:</span>
        <date-picker 
          v-model="value7" 
          type="datetime"
          lang="en"
          format="yyyy-MM-dd hh:mm:ss"
          confirm></date-picker>
      </section>
      <section class="demo">
        <span class="label">range with confirm:</span>
        <date-picker 
          v-model="value8" 
          range
          lang="en"
          format="yyyy-MM-dd"
          @confirm="confirm"
          confirm></date-picker>
      </section>
      <blockquote class="tips">
        Recommend to use the confirm option when the type is 'datetime' or range is true  
      </blockquote>
      <pre class="pre">{{demo3}}</pre>
    </div>

  </div>
</template>

<script>
import DatePicker from '../index'

export default {
  name: 'app',
  components: { DatePicker },
  data () {
    return {
      value1: new Date(),
      value2: '',
      value3: new Date(),
      value4: '',
      value5: '',
      value6: '',
      value7: '',
      value8: '',
      demo1: '<date-picker v-model="value1" editable lang="en"></date-picker>\n<date-picker v-model="value3" range lang="en"></date-picker>',
      demo2: `<date-picker v-model="value3" type="datetime" format="yyyy-MM-dd HH:mm:ss" lang="en"></date-picker>\n<date-picker v-model="value4" type="datetime" format="yyyy-MM-dd hh:mm:ss a" :time-picker-options="{start: '00:00',step: '00:30',end: '23:30'}" lang="en"></date-picker>\n<date-picker v-model="value4" range type="datetime" format="yyyy-MM-dd HH:mm:ss" lang="en"></date-picker>`,
      demo3: '<date-picker v-model="value6" format="yyyy-MM-dd" lang="en" confirm></date-picker>\n<date-picker v-model="value7" lang="en" type="datetime" format="yyyy-MM-dd hh:mm:ss" confirm></date-picker>\n<date-picker v-model="value8" lang="en" range format="yyyy-MM-dd" confirm></date-picker>'
    }
  },
  methods: {
    confirm (val) {
      console.log(val)
    }
  }
}
</script>

<style>
.demo {
  margin:20px;
}
.label{
  display: inline-block;
  margin-right: 1em;
}
.pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}
.example {
  padding: 45px;
  word-wrap: break-word;
  background-color: #fff;
  border: 1px solid #ddd;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
}
.example > .demo {
  display: inline-block;
}
.tips {
  margin: 0;
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
}
</style>
