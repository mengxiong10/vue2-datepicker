import Vue from 'vue'
import DatePicker from '@/index'

Vue.use(DatePicker)

new Vue({  // eslint-disable-line
  el: '#app',
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
      value9: ''
    }
  },
  methods: {
    getSource (obj) {
      return Object.keys(obj).map(key => {
        const value = obj[key]
        return (
          <section class="source">
            <label class="label">{key} : </label>
            {Vue.compile(value).render.call(this)}
          </section>
        )
      })
    },
    getPre (obj) {
      return Object.keys(obj).map(key => {
        const value = obj[key].replace(/\n/g, '').replace(/\s+/g, ' ')
        return (
          <pre class="pre">
            <code class="language-html">{value}</code>
          </pre>
        )
      })
    }
  },
  render (h) {
    const example1 = {
      'base': '<date-picker v-model="value1" lang="en" :not-before="new Date()"></date-picker>',
      'range': '<date-picker v-model="value2" range ></date-picker>'
    }
    const example2 = {
      'datetime': `
        <date-picker
          v-model="value3"
          lang="en"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"></date-picker>`,
      'datetime with time-picker-options': `
        <date-picker
          v-model="value4"
          lang="en"
          type="datetime"
          format="YYYY-MM-DD hh:mm:ss a"
          :time-picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:30'
          }"></date-picker>`,
      'datetime with minute-step': `
        <date-picker
          v-model="value9"
          lang="en"
          type="datetime"
          format="YYYY-MM-DD hh:mm:ss a"
          :minute-step="10"
          ></date-picker>`,
      'datetime range': `
        <date-picker
          v-model="value5"
          range
          type="datetime"
          lang="en"
          format="YYYY-MM-DD HH:mm:ss"></date-picker>`
    }
    const example3 = {
      'with confirm': `
        <date-picker
          v-model="value6"
          format="YYYY-MM-DD"
          lang="en"
          confirm></date-picker>`,
      'datetime with confirm': `
        <date-picker
          v-model="value7"
          type="datetime"
          lang="en"
          format="YYYY-MM-DD hh:mm:ss"
          confirm></date-picker>`,
      'range width confirm': `
        <date-picker
          v-model="value8"
          range
          lang="en"
          format="YYYY-MM-DD"
          confirm></date-picker>`
    }
    const arr = [
      {
        exam: example1
      },
      {
        exam: example2,
        tips: 'if you use the datetime, you should set the format to "YYYY-MM-DD HH:mm:ss" which default is "YYY-MM-DD'
      },
      {
        exam: example3,
        tips: 'Recommend to use the confirm option when the type is "datetime" or "range" is true'
      }
    ]
    return (
      <div id="app">
        {arr.map(obj => (
          <div class="example">
            {this.getSource(obj.exam)}
            {
              obj.tips
                ? <blockquote class="tips">{obj.tips}</blockquote>
                : ''
            }
            {this.getPre(obj.exam)}
          </div>
        ))}
      </div>
    )
  }
})
