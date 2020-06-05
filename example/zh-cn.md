<!-- Basic -->

### 基本

可以选择或手动输入一个日期, 月, 年, 时间或者日期加时间

<!-- ValueType -->

### 绑定值的类型

通过`valueType`去设置`ｖ-model`绑定的值的类型

- "format": 返回一个字符串，和输入框格式化之后的一样．
- "date"(default): 返回一个 Date 对象.
- "timestamp": 返回一个时间戳.
- token: 一个可以被解析的 token, 返回格式化这个 token 的字符串.

<!-- Range -->

### 日期范围

支持选择一个日期范围

<!-- DisabledDateTime -->

### 不可选择的日期和时间

可用 `disabledDate` 和 `disabledTime` 分别禁止选择部分日期和时间.

**当你使用`disabledDate` 或 `disabledTime`的时候, 应该设置`defaultValue`的值是不被禁止选择的.**

<!-- Disabled -->

### 禁用和可编辑

- `disabled`: 设置组件是否禁用
- `editable`: 设置是否可手动输入

<!-- Shortcut -->

### 快捷选项

可以通过设置 `shortcuts` 提升用户体验.

也可以使用 slot header 或者 footer 去设置额外的元素.

<!-- ControlTimePanel -->

### 控制时间选择的显示和隐藏(日期时间模式)

时间选择的显示可以通过 `showTimePanel` 控制.

默认情况下选择一个日期后时间面板就自动显示.

<!-- ControlOpen -->

### 控制弹窗打开

可以通过 `open` 去控制弹窗的显示

下面的例子说明怎么关闭弹窗当选择秒的时候

<!-- HideSeconds -->

### 隐藏秒和显示 am/pm

时间选择的列是自动显示通过 `format`的设置.

你可以通过 `showHour` `showMinute` `showSecond` 覆盖默认值

<!-- MinuteStep -->

### 间隔的时间和自定义时间选择

设置间隔的时间通过`hourStep` `minuteStep` `secondStep`.

设置自定义的选择通过`hourOptions` `minuteOptions` `secondOptions`.

<!-- FixedTimeList -->

### 固定的时间列表

可以通过 `timePickerOptions` 提供一个固定的时间列表选择
