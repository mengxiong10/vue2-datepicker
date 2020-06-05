<!-- Basic -->

### Basic

You can select or input a date, month, year, time or datetime

<!-- ValueType -->

### ValueType

You can set the type of the v-model value by `valueType`.

- "format": return a string same as the input value.
- "date"(default): return a Date Object.
- "timestamp": return a Number.
- token: a accepted format string pattern.

<!-- Range -->

### Range

Support to select a date range.

<!-- DisabledDateTime -->

### DisabledDate & DisabledTime

Disabled part of dates and time by `disabledDate` and `disabledTime` respectively.

**You should let the `defaultValue` not be disabled, when you use `disabledDate` or `disabledTime`.**

<!-- Disabled -->

### Disabled & editable

- disabled: A disabled state of the DatePicker
- editable: Whether to allow manual input

<!-- Shortcut -->

### Shortcut

You can set `shortcuts` to improve user experience.

Use the header slot or the footer slot to render extra element in panel for customized requirements.

<!-- ControlTimePanel -->

### Control TimePanel visible(datetime mode)

The display or hiding of the time panel can be controlled by `showTimePanel`.

The time panel is displayed after the date is selected by default.

<!-- ControlOpen -->

### Control Open

You can use the prop `open` to control the visible of popup.

This example shows how to close the popup when the seconds is selected.

<!-- HideSeconds -->

### Hide seconds selection & display AMPM selection

The columns of the time Picker is displayed according to the value of format(HH:mm:ss) by default.

You can also set `showHour` `showMinute` `showSecond` to override the default value

<!-- MinuteStep -->

### Interval and custom time options

Set stepped time options by `hourStep` `minuteStep` `secondStep`

Set custom time options by `hourOptions` `minuteOptions` `secondOptions`.

<!-- FixedTimeList -->

### Select fixed time list

You can provide a list of fixed time for users to choose by `timePickerOptions`
