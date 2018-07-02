# vue2-datepicker

[English Version](https://github.com/mengxiong10/vue2-datepicker/blob/master/README_CN.md)

> 一个基于Vue2.x的日期时间选择组件

<a href="https://travis-ci.org/mengxiong10/vue2-datepicker">
  <img src="https://travis-ci.org/mengxiong10/vue2-datepicker.svg?branch=master" alt="build:passed">
</a>
<a href="https://coveralls.io/github/mengxiong10/vue2-datepicker">
  <img src="https://coveralls.io/repos/github/mengxiong10/vue2-datepicker/badge.svg?branch=master&service=github" alt="Badge">
</a>
<a href="LICENSE">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT">
</a>

## 线上Demo
<https://mengxiong10.github.io/vue2-datepicker/demo/index.html>

![image](https://github.com/mengxiong10/vue2-datepicker/raw/master/screenshot/demo.PNG)

## 安装

```bash
$ npm install vue2-datepicker --save
```

## 用法

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
      shortcuts: [
        {
          text: '今天',
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
    <date-picker v-model="time1" :first-day-of-week="1"></date-picker>
    <date-picker v-model="time2" type="datetime" :time-picker-options="timePickerOptions"></date-picker>
    <date-picker v-model="time3" range :shortcuts="shortcuts"></date-picker>
  </div>
</template>
```
### Props

| Prop                | Type          | Default     | Description                                         
|---------------------|---------------|-------------|-----------------------------------------------------
| type                | String        | 'date'      | 选择日期或日期时间(可选：date,datetime)                 
| range               | Boolean       | false       | 如果是true， 显示日历范围选择     
| format              | String        | YYYY-MM-DD  | 格式化显示日期 api类似moment.js     
| lang                | String/Object | zh          | 选择语言或自定义 (en/zh/es/pt-br/fr/ru/de/it/cs)(custom) 
| clearable           | Boolean       | true        | 如果设置false, 不显示清除图标                 
| confirm             | Boolean       | false       | 如果是true， 显示确认按钮且需要确认才更新时间  
| editable            | Boolean       | true        | 如果是false, 用户不能手动输入更新日期                       
| disabled            | Boolean       | false       | 禁用组件                               
| placeholder         | String        |             | 输入框placeholder                              
| width               | String/Number | 210         | 设置宽度                                          
| not-before          | String/Date   | ''          | 禁止选择这个时间之前的时间     
| not-after           | String/Date   | ''          | 禁止选择这个时间之前=后的时间        
| disabled-days       | Array/function| []          | 自定义禁止的日期                                        
| shortcuts           | Boolean/Array | true        | 自定义范围选择的时候快捷选项(见下表)                 
| time-picker-options | Object        | {}          | 自定义时间选择的开始，结束，步进(见下表)            
| minute-step         | Number        | 0           | 设置分钟的步进， 设置后不显示秒的选择         
| first-day-of-week   | Number        | 7           | 设置日历星期几开头(1-7)                     
| input-class         | String        | 'mx-input'  | 自定义输入框的类名                                
| input-name          | String        | 'date'      | 自定义input 的 name 属性                                 
| confirm-text        | String        | 'OK'        | 确认按钮的名称       
| range-separator     | String        | '~'         | range 分隔符                            

#### lang
* String (en/zh/es/pt-br/fr/ru/de/it/cs)
* Object (自定义)

```html
<script>
export default {
  data() {
    return {
      value: '',
      lang: {
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        pickers: ['next 7 days', 'next 30 days', 'previous 7 days', 'previous 30 days'],
        placeholder: {
          date: 'Select Date',
          dateRange: 'Select Date Range'
        }
      }
    }
  }
}
</script>

<template>
  <date-picker v-model="value" :lang="lang"></date-picker>
</template>

```

#### shortcuts
* true -      显示默认快捷选择
* false -     隐藏快捷选择
* Object[] -  自定义快捷选择, 格式：[{text, start, end}]
* Object[] -  自定义快捷选择, 格式：[{text, onClick}]

| 名称             | 类型          |  说明           |
|-----------------|---------------|----------------|
| text            | String        | 显示文字         |
| start           | Date          | 开始日期         |
| end             | Date          | 结束日期         |
| onClick         | Function      | 点击时候触发的函数 |

#### time-picker-options
* Object[] -  自定义时间选择, 格式：[{start, step, end}]

| 名称             | 类型           |  说明                 |
|-----------------|---------------|-----------------------|
| start           | String        | 开始时间 (eg '00:00')   |
| step            | String        | 步进时间  (eg '00:30')  |
| end             | String        | 结束时间   (eg '23:30') |


### Events
| Name            | 说明                          |  回调参数       |
|-----------------|----------------------------- |----------------|
| change          | 日期改变的时候触发              | 选择的日期       |
| input           | 日期改变的时候触发              | 选择的日期       |
| confirm         | 点击确认按钮触发的事件           | 选择的日期       |
| input-error     | 当用户输入的值无效时候触发       | 用户输入的字符串   |

## 许可证

[MIT](https://github.com/mengxiong10/vue2-datepicker/blob/master/LICENSE)

Copyright (c) 2017-present xiemengxiong
