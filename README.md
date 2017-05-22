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
    }
  }
}
</script>

<template>
  <div>
    <date-picker v-model="time1"></date-picker>
    <date-picker v-model="time2" range></date-picker>
  </div>
</template>
```
## Attributes

| Prop            | Type          | Default     | Description                           |
|-----------------|---------------|-------------|---------------------------------------|
| range           | Boolean       | false       | if true, the type is daterange        |
| format          | String        | yyyy-MM-dd  | Date formatting string                |
| lang            | String        | zh          | Translation (en/zh)      |
| placeholder     | String        |             | input placeholder text                |
| width           | String/Number | 210         | input size                            |


