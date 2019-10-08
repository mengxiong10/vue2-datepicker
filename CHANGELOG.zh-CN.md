# [2.10.0](https://github.com/mengxiong10/vue2-datepicker/compare/v2.9.2...v2.10.0) (2019-02-12)


### 新功能

* 添加属性default-value作为打开日历的默认时间 ([#94](https://github.com/mengxiong10/vue2-datepicker/issues/94)) ([4ff6945](https://github.com/mengxiong10/vue2-datepicker/commit/4ff6945))
* 输入框有焦点的时候自动打开日历选择, 失去焦点时关闭 ([3bcedf5](https://github.com/mengxiong10/vue2-datepicker/commit/3bcedf5))



## [2.9.2](https://github.com/mengxiong10/vue2-datepicker/compare/v2.9.1...v2.9.2) (2019-02-10)


### 修复Bug

* 选择年的面板的标题显示错误 ([#245](https://github.com/mengxiong10/vue2-datepicker/issues/245)) ([7bc2785](https://github.com/mengxiong10/vue2-datepicker/commit/7bc2785))



## [2.9.1](https://github.com/mengxiong10/vue2-datepicker/compare/v2.9.0...v2.9.1) (2019-02-01)


### 修复Bug

* 修复当绑定的值是null时格式化字符串返回的时间错误 ([#244](https://github.com/mengxiong10/vue2-datepicker/issues/244)) ([92243ab](https://github.com/mengxiong10/vue2-datepicker/commit/92243ab))



# [2.9.0](https://github.com/mengxiong10/vue2-datepicker/compare/v2.8.1...v2.9.0) (2019-01-29)


### 新功能

* 支持自定义格式化函数 ([c801516](https://github.com/mengxiong10/vue2-datepicker/commit/c801516))



## [2.8.1](https://github.com/mengxiong10/vue2-datepicker/compare/v2.8.0...v2.8.1) (2019-01-24)


### 修复Bug

* 点击外部关闭监听的函数从捕获改成冒泡, 可以用stopPropagation 阻止关闭 ([054758e](https://github.com/mengxiong10/vue2-datepicker/commit/054758e))


# [2.8.0](https://github.com/mengxiong10/vue2-datepicker/compare/v2.7.0...v2.8.0) (2019-01-13)


### 新功能

* 添加属性 `valueType` 格式化绑定值 ([dd6f2ea](https://github.com/mengxiong10/vue2-datepicker/commit/dd6f2ea))

| 可选值           | 描述                              
|-----------------|--------------------------------------- 
| date            | 返回的绑定值是Date对象       
| timestamp       | 返回的绑定值是时间戳数字  
| format          | 返回的绑定值是通过`format`属性格式化的值 


# [2.7.0](https://github.com/mengxiong10/vue2-datepicker/compare/v2.6.3...v2.7.0) (2019-01-08)

### 新功能

* 在mx-calendar元素上添加class去表明现在的窗口类型(mx-clendar-panel-(year, date, time, month)) ([#219](https://github.com/mengxiong10/vue2-datepicker/issues/219)) ([1d0a67b](https://github.com/mengxiong10/vue2-datepicker/commit/1d0a67b))
* 添加新的属性inputAttr 去自定义input 的属性 ([2381089](https://github.com/mengxiong10/vue2-datepicker/commit/2381089))



## [2.6.4](https://github.com/mengxiong10/vue2-datepicker/compare/v2.6.3...v2.6.4) (2018-12-19)


### 修复Bug

* 修复当手动清空输入框时间没有改变 ([39d2c40](https://github.com/mengxiong10/vue2-datepicker/commit/39d2c40))

## [2.6.3](https://github.com/mengxiong10/vue2-datepicker/compare/v2.6.2...v2.6.3) (2018-12-08)


### 修复Bug

* 修复手动输入范围时无法成功的问题 ([#209](https://github.com/mengxiong10/vue2-datepicker/issues/209)) ([97289d1](https://github.com/mengxiong10/vue2-datepicker/commit/97289d1))



## [2.6.2](https://github.com/mengxiong10/vue2-datepicker/compare/v2.6.1...v2.6.2) (2018-10-30)


### 修复Bug

* `calendar-change`事件在正确的时候触发 ([b1a5a41](https://github.com/mengxiong10/vue2-datepicker/commit/b1a5a41))


### 新功能

* 添加 `calendar-change` 事件 ([ef9314e](https://github.com/mengxiong10/vue2-datepicker/commit/ef9314e))



## [2.6.1](https://github.com/mengxiong10/vue2-datepicker/compare/v2.6.0...v2.6.1) (2018-10-17)


### 修复Bug

* 阻止组件的事件冒泡到外面 ([de177d8](https://github.com/mengxiong10/vue2-datepicker/commit/de177d8))


### 新功能

* script直接引用的时候自动注册组件 ([a310f59](https://github.com/mengxiong10/vue2-datepicker/commit/a310f59))



# [2.6.0](https://github.com/mengxiong10/vue2-datepicker/compare/v2.5.0...v2.6.0) (2018-10-11)


### 修复Bug

* 修复快捷方式的颜色 ([ac4aa87](https://github.com/mengxiong10/vue2-datepicker/commit/ac4aa87))


### 新功能

*  添加属性 `appendToBody` ([e26e1f5](https://github.com/mengxiong10/vue2-datepicker/commit/e26e1f5))


# [2.5.0](https://github.com/mengxiong10/vue2-datepicker/compare/v2.4.3...v2.5.0) (2018-10-05)

### 新功能

* 添加 `panel-change` 事件 ([5cdba7b](https://github.com/mengxiong10/vue2-datepicker/commit/5cdba7b))


## [2.4.3](https://github.com/mengxiong10/vue2-datepicker/compare/v2.4.0...v2.4.3) (2018-09-28)

### 修复Bug

* 修复选择时间时候显示'am', 'pm' ([8e475b3](https://github.com/mengxiong10/vue2-datepicker/commit/8e475b3))
* 修复一个IE兼容性问题 ([fefed17](https://github.com/mengxiong10/vue2-datepicker/commit/fefed17))
* 当选择一个时间的时候关闭面板 ([#154](https://github.com/mengxiong10/vue2-datepicker/issues/154)) ([12907ad](https://github.com/mengxiong10/vue2-datepicker/commit/12907ad))
* 修复年和月的禁用函数错误 ([#169](https://github.com/mengxiong10/vue2-datepicker/issues/169)) ([42bc068](https://github.com/mengxiong10/vue2-datepicker/commit/42bc068))

### 新功能

*  添加一个`clear`事件 ([e0776b6](https://github.com/mengxiong10/vue2-datepicker/commit/e0776b6))


<a name="2.4.0"></a>
# [2.4.0](https://github.com/mengxiong10/vue2-datepicker/compare/v2.3.2...v2.4.0) (2018-08-08)


### 新功能

* 添加属性`type`为`time`的时候只显示时间组件

## [2.3.2](https://github.com/mengxiong10/vue2-datepicker/compare/v2.2.0...v2.3.2) (2018-08-07)

### 新功能

* 添加属性 `date-format` 格式化时间组件头部和日期的tooltip

# [2.2.0](https://github.com/mengxiong10/vue2-datepicker/compare/v2.1.0...v2.2.0) (2018-08-06)

### 修复bug

* 设置input的autocomplete为off避免下拉框的干扰

### 新功能

* 添加时间'change-calendar-yeaer', 'change-calendar-month'方便联动两个窗口


# [2.1.0]() (2018-07-24)


### 新功能

* 添加`type` 支持月和年的单独选择


# [2.0.0]() (2018-06-16)

### 新功能

* 添加`clearable` 用于控制是否显示清除按钮
* 添加 slot `calendar-icon` 自定义日历图标
* 添加 slot `header` 和 `footer` 自定义弹出日历的头部和尾部
* `disabledDays` 现在支持函数

### 非兼容性更新

* 重构代码. 如果你自己hack过代码可能会失效
* `format` 默认值由 yyyy-MM-dd 改成 YYYY-MM-DD, 现在格式类似moment.js. 不支持小写的yyyy
* 移除了`custom-formatter`
* `editable` 默认由false改成true, 现在日历范围也支持手动修改
* 当选择年或月的面板的时候不会修改日期(因为当设置了`not-before`或者`not-after`的时候会引发很多问题和bug)
