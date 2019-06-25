# vue2-datepicker

[中文版](https://github.com/mengxiong10/vue2-datepicker/blob/master/README.zh-CN.md)

> A Datepicker Component For Vue2

<a href="https://travis-ci.org/mengxiong10/vue2-datepicker">
  <img src="https://travis-ci.org/mengxiong10/vue2-datepicker.svg?branch=master" alt="build:passed">
</a>
<a href="https://coveralls.io/github/mengxiong10/vue2-datepicker">
  <img src="https://coveralls.io/repos/github/mengxiong10/vue2-datepicker/badge.svg?branch=master&service=github" alt="Badge">
</a>
<a href="https://www.npmjs.com/package/vue2-datepicker">
  <img src="https://img.shields.io/npm/v/vue2-datepicker.svg" alt="npm">
</a>
<a href="LICENSE">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT">
</a>

## Demo
<https://mengxiong10.github.io/vue2-datepicker/demo/index.html>

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
      time3: '',
      // custom lang
      lang: {
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        pickers: ['next 7 days', 'next 30 days', 'previous 7 days', 'previous 30 days'],
        placeholder: {
          date: 'Select Date',
          dateRange: 'Select Date Range'
        }
      },
      // custom range shortcuts
      shortcuts: [
        {
          text: 'Today',
          onClick: () => {
            this.time3 = [ new Date(), new Date() ]
          }
        }
      ],
      timePickerOptions:{
        start: '00:00',
        step: '00:30',
        end: '23:30'
      }
    }
  }
}
</script>

<template>
  <div>
    <date-picker v-model="time1" valueType="format" :first-day-of-week="1"></date-picker>
    <date-picker v-model="time2" type="datetime" :time-picker-options="timePickerOptions"></date-picker>
    <date-picker v-model="time3" range :shortcuts="shortcuts"></date-picker>
    <date-picker v-model="value" :lang="lang"></date-picker>
  </div>
</template>
```
### Props

| Prop | Description  | Type  | Default |
|------|--------------|-------|---------|
| type | select date type  | 'date' \| 'datetime' \| 'year' \| 'month' \| 'time' | 'date' |
| range | if true, the type is daterange or datetimerange | `boolean` | false |
| format | format the Date. The parsing tokens are similar to the moment.js | [token](https://github.com/taylorhakes/fecha#formatting-tokens) \| [`object`](https://github.com/mengxiong10/vue2-datepicker/issues/232#issuecomment-458558141) | 'YYYY-MM-DD' |
| value-type | type of binding value. If not specified, the binding value will be a Date object | [value-type](#value-type) | 'date' |
| lang | Translation | [lang](#lang) | 'zh' |
| clearable | if false, don't show the clear icon | `boolean` | true |
| confirm | if true, need click the button to change the value | `boolean` | false |
| editable | if false, user cann't type it | `boolean` | true |
| disabled | Disable the component | `boolean` | false |
| placeholder | input placeholder text | `string` | — |
| width  | input size  | `string`\|`number` | 210 |
| append-to-body | append the popup to body | `boolean` | false |
| default-value | default date of the calendar | `Date` | new Date() |
| popupStyle | popup style(override the top, left style) | `object` | — |
| not-before | Disable all dates before new Date(not-before) | `string`\|`Date` | ''|
| not-after | Disable all dates after new Date(not-after) | `string`\|`Date`| '' |
| disabled-days | Disable Days | `(date) => boolean` | - |
| shortcuts | the shortcuts for the range picker | [shortcuts](#shortcuts) | true |
| time-picker-options | custom time-picker | [time-picker-options](#time-picker-options) | null |
| time-select-options | custom time-select | [time-select-options](#time-select-options) | null |
| minute-step | if > 0 don't show the second picker | 0 - 60 | 0 |
| first-day-of-week | set the first day of week | 1 - 7  | 7 |
| input-class | the input class name | `string` | 'mx-input' |
| input-attr | the input attr(eg: { required: true, id: 'input'}) | `object` | — |
| confirm-text | the default text to display on confirm button | `string` | 'OK' |
| range-separator | the range separator text | `string` | '~' |
| date-format | format the time header and tooltip | `string` | '' |

#### value-type
set the format of binding value

| Value           | Description                               |
|-----------------|-------------------------------------------|
| date            | binding value will be a Date object       |
| timestamp       | binding value will be a timestamp number  |
| format          | binding value will be the format string   |

Advanced: You can also customize objects to implement two functions.
```js
{
  value2date: (value: any) => Date,  // transform the binding value to calendar Date Object
  date2value: (date: Date) => any   // transform the calendar Date Object to binding value
}

```
#### lang

| Type |
|------|
| 'en'\|'zh'\|'es'\|'pt-br'\|'fr'\|'ru'\|'de'\|'it'\|'cs' |
| { days: string[]; months: string[]; picker: string[]; placeholder: { date: string; dateRange: string  } } |

#### shortcuts
the shortcuts for the range picker

| Value           | Description |
|-----------------|-------------|
| true            | show the default shortcuts |
| false           | hide the defaualt shortcuts  |
| [{text: string, onClick: () => any }] | custom shortcuts |

#### time-picker-options
custom time-picker

| Type |
|------|
| {start: '00:00', step:'00:30' , end: '23:30'} |
| () => Array<{ label: string; values: { hours: number; minutes: number } }> |

#### time-select-options
custom time-select for columns

| Type |
|------|
| {hours: [9, 10, 11], minutes: [10, 20], seconds: [10, 20] } |

### Events
| Name            | Description                                            |  Callback Arguments    |
|-----------------|--------------------------------------------------------|------------------------|
| input           | When the value change(v-model event)                   | the currentValue       |
| change          | When the value change(same as input)                   | the currentValue       |
| confirm         | When click 'confirm' button                            | the currentValue       |
| clear           | When click 'clear' button                              |                        |
| input-error     | When user type a invalid Date                          | the input text         |
| panel-change    | When change the panel view(eg: from year to month view)| [panel](#panel), [oldPanel](#panel) |
| calendar-change | When calendar view year or month change                | now(Date), oldNow(Date)|
| focus           | When input focus                                       |                        |
| blur            | When input blur                                        |                        |

#### panel

| Value | Description          |
|-------|----------------------|
| NONE  | when panel is closed |
| DATE  | when panel is date   |
| YEAR  | when panel is year   |
| MONTH | when panel is month  |
| TIME  | when panel is time   |

### Slots

| Name            | Description              |
|-----------------|--------------------------|
| calendar-icon   | custom the calender icon |
| header          | popup header             |
| footer          | popup footer             |

## ChangeLog

[CHANGELOG](CHANGELOG.md)


## Donate

If you find this project useful, you can buy author a glass of juice

[PayPal](https://www.paypal.me/mengxiong10) |
[AliPay](https://user-images.githubusercontent.com/14135808/57742967-be1ac000-76f5-11e9-9607-c0854e0fdd11.png) |
[WeChat](https://user-images.githubusercontent.com/14135808/57743255-e2c36780-76f6-11e9-8bb8-7720a2607dc1.png)

## License

[MIT](https://github.com/mengxiong10/vue2-datepicker/blob/master/LICENSE)

Copyright (c) 2017-present xiemengxiong
