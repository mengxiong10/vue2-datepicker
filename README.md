# vue2-datepicker

> A Datepicker Component For Vue2

## Demo
<>
![image](https://github.com/mengxiong10/vue2-datepicker/tree/master/screenshot/demo.png)

## Usage

```html
<template>
  <div>
    <date-picker v-model="time1"></date-picker>
    <date-picker v-model="time2" range></date-picker>
  </div>
</template>

<script>
import DatePicker from 'datepicker/index.vue'

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
```
## Attributes

| Prop            | Type          | Default     | Description                           |
|-----------------|---------------|-------------|---------------------------------------|
| range           | Boolean       | false       | if true, the type is daterange        |
| format          | String        | yyyy-MM-dd  | Date formatting string                |
| language        | String        | zh          | Translation (en/zh)      |
| placeholder     | String        |             | input placeholder text                |
| width           | String/Number | 210         | input size                            |


