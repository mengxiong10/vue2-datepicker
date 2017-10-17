# vue2-datepicker

> A Datepicker Component For Vue2

## Demo
<https://mengxiong10.github.io/vue2-datepicker/>

![image](https://github.com/mengxiong10/vue2-datepicker/raw/master/screenshot/demo.PNG)

## Install

```bash
$ npm install vue2-datepicker --save
```

## Usage

```html
<script>
import DatePicker from 'vue2-datepicker'

export default {
  components: { DatePicker },
  data() {
    return {
      time1: '',
      time2: '',
      shortcuts: [
        {
          text: 'Today',
          start: new Date(),
          end: new Date()
        }
      ]
    }
  }
}
</script>

<template>
  <div>
    <date-picker v-model="time1" :first-day-of-week="1"></date-picker>
    <date-picker v-model="time2" range :shortcuts="shortcuts"></date-picker>
  </div>
</template>
```
## Attributes

| Prop              | Type          | Default     | Description                                       |
|-------------------|---------------|-------------|---------------------------------------------------|
| range             | Boolean       | false       | if true, the type is daterange                    |
| format            | String        | yyyy-MM-dd  | Date formatting string                            |
| lang              | String        | zh          | Translation (en/zh/es/fs)                         |
| placeholder       | String        |             | input placeholder text                            |
| width             | String/Number | 210         | input size                                        |
| disabled-days     | Array         | []          | Days in YYYY-MM-DD format to disable              |
| not-before        | String        | ''          | Disable all dates before date in YYY-MM-DD format |
| not-after         | String        | ''          | Disable all dates after date in YYY-MM-DD format  |
| shortcuts         | Boolean/Array | true        | the shortcuts for the range picker                |
| first-day-of-week | Number        | 7           | set the first day of week (1-7)                   |

## shortcuts
* true -      show the default shortcuts
* false -     hide the shortcuts
* Object[] -  custom shortcuts, [{text, start, end}]

| Prop            | Type          |  Description           |
|-----------------|---------------|------------------------|
| text            | String        | Text                   |
| start           | Date          | Start Date             |
| end             | Date          | End Date               |



