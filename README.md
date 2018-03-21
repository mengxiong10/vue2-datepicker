# vue2-datepicker

[中文版](https://github.com/mengxiong10/vue2-datepicker/blob/master/README_CN.md)

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
### Attributes

| Prop                | Type          | Default     | Description                                       |
|---------------------|---------------|-------------|---------------------------------------------------|
| type                | String        | 'date'      | select datepicker or datetimepicker(date/datetime)|
| range               | Boolean       | false       | if true, the type is daterange or datetimerange   |
| confirm             | Boolean       | false       | if true, need click the button to change the value|
| format              | String        | yyyy-MM-dd  | Date formatting string                            |
| lang                | String        | zh          | Translation (en/zh/es/pt-br/fr/ru/de/it/cs)       |
| placeholder         | String        |             | input placeholder text                            |
| width               | String/Number | 210         | input size                                        |
| disabled-days       | Array         | []          | Days in YYYY-MM-DD format to disable              |
| not-before          | String/Date   | ''          | Disable all dates before new Date(not-before)     |
| not-after           | String/Date   | ''          | Disable all dates after new Date(not-after)       |
| shortcuts           | Boolean/Array | true        | the shortcuts for the range picker                |
| time-picker-options | Object        | {}          | set timePickerOptions(start, step, end)           |
| minute-step         | Number        | 0           | if > 0 don't show the second picker(0 - 60)       |
| first-day-of-week   | Number        | 7           | set the first day of week (1-7)                   |
| input-class         | String        | 'mx-input'  | the input class name                              |
| confirm-text        | String        | 'OK'        | the default text to display on confirm button     |
| disabled            | Boolean       | false       | Disable the component                             |
| editable            | Boolean       | false       | if true, user can type it(only the range is false)|

#### shortcuts
* true -      show the default shortcuts
* false -     hide the shortcuts
* Object[] -  custom shortcuts, [{text, start, end}]

| Prop            | Type          |  Description           |
|-----------------|---------------|------------------------|
| text            | String        | Text                   |
| start           | Date          | Start Date             |
| end             | Date          | End Date               |

#### time-picker-options
* Object[] -  custom time-picker, [{start, step, end}]

| Prop            | Type          |  Description           |
|-----------------|---------------|------------------------|
| start           | String        | startTime (eg '00:00') |
| step            | String        | stepTime  (eg '00:30') |
| end             | String        | endTime   (eg '23:30') |


### Events
| Name            | Description                  |  Callback Arguments    |
|-----------------|------------------------------|------------------------|
| change          | When user select date        | the currentValue       |
| confirm         | When user click 'OK' button  | the currentValue       |

## License

[MIT](https://github.com/mengxiong10/vue2-datepicker/blob/master/LICENSE)

Copyright (c) 2017-present xiemengxiong
