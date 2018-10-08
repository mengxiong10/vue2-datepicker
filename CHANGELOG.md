<a name="2.5.0"></a>
# [2.5.0](https://github.com/mengxiong10/vue2-datepicker/compare/v2.4.3...v2.5.0) (2018-10-05)

### Features

* add panel-change event ([5cdba7b](https://github.com/mengxiong10/vue2-datepicker/commit/5cdba7b))


<a name="2.4.3"></a>
## [2.4.3](https://github.com/mengxiong10/vue2-datepicker/compare/v2.4.0...v2.4.3) (2018-09-28)


### Bug Fixes

* fix the selectTime 'am' and 'pm' ([8e475b3](https://github.com/mengxiong10/vue2-datepicker/commit/8e475b3))
* IE compatibility ([fefed17](https://github.com/mengxiong10/vue2-datepicker/commit/fefed17))
* when select time picker option close popup ([#154](https://github.com/mengxiong10/vue2-datepicker/issues/154)) ([12907ad](https://github.com/mengxiong10/vue2-datepicker/commit/12907ad))
* year and month disable don't right ([#169](https://github.com/mengxiong10/vue2-datepicker/issues/169)) ([42bc068](https://github.com/mengxiong10/vue2-datepicker/commit/42bc068))


### Features

*  emit `clear` event for the clear button ([e0776b6](https://github.com/mengxiong10/vue2-datepicker/commit/e0776b6))

<a name="2.4.0"></a>
# [2.4.0](https://github.com/mengxiong10/vue2-datepicker/compare/v2.3.2...v2.4.0) (2018-08-08)


### Features

* add `type` time to show only time picker ([1046731](https://github.com/mengxiong10/vue2-datepicker/commit/1046731))

<a name="2.3.2"></a>
## [2.3.2](https://github.com/mengxiong10/vue2-datepicker/compare/v2.2.0...v2.3.2) (2018-08-07)

### Features

* add prop `date-format` to format time header and date tooltip ([3c27647](https://github.com/mengxiong10/vue2-datepicker/commit/3c27647))

<a name="2.2.0"></a>
# [2.2.0](https://github.com/mengxiong10/vue2-datepicker/compare/v2.1.0...v2.2.0) (2018-08-06)

### Bug Fixes

* set input autocomplete off ([264458c](https://github.com/mengxiong10/vue2-datepicker/commit/264458c))

### Features

* add event 'change-calendar-year' 'change-calendar-month' ([bc80708](https://github.com/mengxiong10/vue2-datepicker/commit/bc80708))

<a name="2.1.0"></a>
# [2.1.0]() (2018-07-24)

### Features

* Add `type` year and month

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
