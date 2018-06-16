## Changelog

<a name="2.0.0"></a>
# [2.0.0]() (2018-06-16)

### New features

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
