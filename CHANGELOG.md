<a name="2.4.0"></a>
# [2.4.0](https://github.com/mengxiong10/vue2-datepicker/compare/v2.3.2...v2.4.0) (2018-08-08)


### Features

* add `type` time to show only time picker ([1046731](https://github.com/mengxiong10/vue2-datepicker/commit/1046731))

### 新功能

* 添加属性`type`为`time`的时候只显示时间组件

<a name="2.3.2"></a>
## [2.3.2](https://github.com/mengxiong10/vue2-datepicker/compare/v2.2.0...v2.3.2) (2018-08-07)

### Features

* add prop `date-format` to format time header and date tooltip ([3c27647](https://github.com/mengxiong10/vue2-datepicker/commit/3c27647))

### 新功能

* 添加属性 `date-format` 格式化时间组件头部和日期的tooltip

<a name="2.2.0"></a>
# [2.2.0](https://github.com/mengxiong10/vue2-datepicker/compare/v2.1.0...v2.2.0) (2018-08-06)

### Bug Fixes

* set input autocomplete off ([264458c](https://github.com/mengxiong10/vue2-datepicker/commit/264458c))

### Features

* add event 'change-calendar-year' 'change-calendar-month' ([bc80708](https://github.com/mengxiong10/vue2-datepicker/commit/bc80708))

### 修复bug
* 设置input的autocomplete为off避免下拉框的干扰

### 新功能

* 添加时间'change-calendar-yeaer', 'change-calendar-month'方便联动两个窗口


<a name="2.1.0"></a>
# [2.1.0]() (2018-07-24)

### Features

* Add `type` year and month

### 新特性
* 添加`type` 支持月和年的单独选择


<a name="2.0.0"></a>
# [2.0.0]() (2018-06-16)

### Features

* Add `clearable` used to show clear icon
* Add slot `calendar-icon` to custom calendar icon
* Add slot `header` and `footer` to custom popup area
* `disabledDays` supports custom functions

### Breaking changes

* Refactored code. This may fail if you hacked the code
* `format` default value changes from yyyy-MM-dd to YYYY-MM-DD, now the parsing tokens are similar to the moment.js, not supports lowercase yyyy
* remove `custom-formatter`
* `editable` default value changes from false to true, now supports range
* select the year or month panel will not change the value(Because it causes many problems when set the `not-before` or `not-after`)

### 新特性
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
