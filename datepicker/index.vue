<template>
<div class="mx-datepicker"
  :class="{'disabled': disabled}"
  :style="{'width': width + 'px','min-width':range ? (type === 'datetime' ? '320px' : '210px') : '140px'}"
  v-clickoutside="closePopup">
  <input name="date"
    :disabled="disabled"
    :class="inputClass"
    :value="text"
    :readonly="!editable || range"
    :placeholder="innerPlaceholder"
    ref="input"
    @mouseenter="hoverIcon"
    @mouseleave="hoverIcon"
    @click="togglePopup"
    @input="handleInput"
    @change="handleChange"
    @mousedown="$event.preventDefault()">
  <i class="mx-input-icon"
    :class="showCloseIcon ? 'mx-input-icon__close' : 'mx-input-icon__calendar'"
    @mouseenter="hoverIcon"
    @mouseleave="hoverIcon"
    @click="clickIcon"></i>
  <div class="mx-datepicker-popup"
    :class="{'range':range}"
    :style="position"
    ref="calendar"
    v-show="showPopup">
    <calendar-panel v-if="!range"
      v-model="currentValue"
      @select="selectDate"
      :show="showPopup"></calendar-panel>
    <div v-else
      style="overflow:hidden">
      <div class="mx-datepicker-top"
        v-if="ranges.length">
        <span v-for="range in ranges"
          @click="selectRange(range)">{{range.text}}</span>
      </div>
      <calendar-panel style="width:50%;box-shadow:1px 0 rgba(0, 0, 0, .1)"
        v-model="currentValue[0]"
        :end-at="currentValue[1]"
        @select="selectDate"
        :show="showPopup"></calendar-panel>
      <calendar-panel style="width:50%;"
        v-model="currentValue[1]"
        :start-at="currentValue[0]"
        @select="selectDate"
        :show="showPopup"></calendar-panel>
    </div>
    <div class="mx-datepicker-footer"
      v-if="confirm">
      <button type="button"
        class="mx-datepicker-btn mx-datepicker-btn-confirm"
        @click="confirmDate"> {{ confirmText }}</button>
    </div>
  </div>
</div>

</template>

<script>
import CalendarPanel from './calendar-panel.vue'
import Languages from './languages.js'

export default {
  name: 'DatePicker',
  components: { CalendarPanel },
  props: {
    value: null,
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    range: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'date' // ['date', 'datetime']
    },
    width: {
      type: [String, Number],
      default: 210
    },
    placeholder: String,
    lang: {
      type: String,
      default: 'zh'
    },
    shortcuts: {
      type: [Boolean, Array],
      default: true
    },
    disabledDays: {
      type: Array,
      default: function () {
        return []
      }
    },
    notBefore: {
      default: ''
    },
    notAfter: {
      default: ''
    },
    firstDayOfWeek: {
      default: 7,
      type: Number,
      validator: val => val >= 1 && val <= 7
    },
    minuteStep: {
      type: Number,
      default: 0,
      validator: val => val >= 0 && val <= 60
    },
    timePickerOptions: {
      type: Object,
      default () {
        return {}
      }
    },
    confirm: {
      type: Boolean,
      default: false
    },
    inputClass: {
      type: String,
      default: 'mx-input'
    },
    confirmText: {
      type: String,
      default: 'OK'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showPopup: false,
      showCloseIcon: false,
      currentValue: this.value,
      position: null,
      userInput: '',
      ranges: [] // 快捷选项
    }
  },
  watch: {
    value: {
      handler (val) {
        if (!this.range) {
          this.currentValue = this.isValidDate(val) ? val : undefined
        } else {
          this.currentValue = this.isValidRange(val)
            ? val.slice(0, 2)
            : [undefined, undefined]
        }
      },
      immediate: true
    },
    showPopup (val) {
      if (val) {
        this.$nextTick(this.displayPopup)
      } else {
        this.userInput = null
      }
    }
  },
  computed: {
    translation () {
      return Languages[this.lang] || Languages['en']
    },
    innerPlaceholder () {
      return (
        this.placeholder ||
        (this.range
          ? this.translation.placeholder.dateRange
          : this.translation.placeholder.date)
      )
    },
    text () {
      if (!this.range && this.isValidDate(this.value)) {
        return this.userInput !== null ? this.userInput : this.stringify(this.value)
      }
      if (this.range && this.isValidRange(this.value)) {
        return (
          this.stringify(this.value[0]) + ' ~ ' + this.stringify(this.value[1])
        )
      }
      return ''
    }
  },
  methods: {
    handleInput (event) {
      this.userInput = event.target.value
    },
    handleChange (event) {
      const value = event.target.value
      const date = this.parseDate(value, this.format)
      if (date && this.editable && !this.range) {
        if (this.notBefore && date < new Date(this.notBefore)) {
          return
        }
        if (this.notAfter && date > new Date(this.notAfter)) {
          return
        }
        for (let i = 0, len = this.disabledDays.length; i < len; i++) {
          if (date.getTime() === new Date(this.disabledDays[i]).getTime()) {
            return
          }
        }
        this.$emit('input', date)
        this.$emit('change', date)
        this.closePopup()
      }
    },
    updateDate () {
      const val = this.currentValue
      if ((!this.range && val) || (this.range && val[0] && val[1])) {
        this.$emit('input', val)
        this.$emit('change', val)
        this.closePopup()
      }
    },
    confirmDate () {
      this.updateDate()
      this.closePopup()
      this.$emit('confirm', this.currentValue)
    },
    selectDate (show = false) {
      if (!this.confirm && !this.disabled) {
        this.updateDate()
        if (!show && this.type === 'date' && !this.range) {
          this.closePopup()
        }
      }
    },
    closePopup () {
      this.showPopup = false
    },
    togglePopup () {
      if (this.showPopup) {
        this.$refs.input.blur()
        this.showPopup = false
      } else {
        this.$refs.input.focus()
        this.showPopup = true
      }
    },
    hoverIcon (e) {
      if (this.disabled) {
        return
      }
      if (e.type === 'mouseenter' && this.text) {
        this.showCloseIcon = true
      }
      if (e.type === 'mouseleave') {
        this.showCloseIcon = false
      }
    },
    clickIcon () {
      if (this.disabled) {
        return
      }
      if (this.showCloseIcon) {
        this.$emit('input', '')
        this.$emit('change', '')
      } else {
        this.togglePopup()
      }
    },
    parseDate (str, fmt = 'yyyy-MM-dd') {
      let isValid = true
      const obj = { y: 0, M: 1, d: 0, H: 0, h: 0, m: 0, s: 0 }
      fmt.replace(/([^yMdHhms]*?)(([yMdHhms])\3*)([^yMdHhms]*?)/g, function (m, $1, $2, $3, $4, idx, old) {
        const rgs = new RegExp($1 + '(\\d{' + $2.length + '})' + $4)
        const index = str.search(rgs)
        if (index === -1) {
          isValid = false
        } else {
          str = str.replace(rgs, function (_m, _$1) {
            obj[$3] = parseInt(_$1);
            return ''
          });
        }
        return ''
      });
      if (!isValid) {
        return false
      }
      obj.M--
      return new Date(obj.y, obj.M, obj.d, obj.H || obj.h, obj.m, obj.s)
    },
    formatDate (date, fmt = 'yyyy-MM-dd HH:mm:ss') {
      const hour = date.getHours()
      const map = {
        'M+': date.getMonth() + 1, // 月份
        '[Dd]+': date.getDate(), // 日
        'H+': hour, // 小时
        'h+': (hour % 12) || 12, // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds(), // 毫秒
        'a': hour >= 12 ? 'pm' : 'am',
        'A': hour >= 12 ? 'PM' : 'AM'
      }
      let str = fmt.replace(/[Yy]+/g, function (str) {
        return ('' + date.getFullYear()).slice(4 - str.length)
      })
      Object.keys(map).forEach(key => {
        str = str.replace(new RegExp(key), function (str) {
          const value = '' + map[key]
          return str.length === 1 ? value : ('00' + value).slice(value.length)
        })
      })
      return str
    },
    stringify (date) {
      return this.formatDate(new Date(date), this.format)
    },
    isValidDate (date) {
      return !!new Date(date).getTime()
    },
    isValidRange (date) {
      return (
        Array.isArray(date) &&
        date.length === 2 &&
        this.isValidDate(date[0]) &&
        this.isValidDate(date[1])
      )
    },
    selectRange (range) {
      this.$emit('input', [range.start, range.end])
      this.$emit('change', [range.start, range.end])
    },
    initRanges () {
      if (Array.isArray(this.shortcuts)) {
        this.ranges = this.shortcuts
      } else if (this.shortcuts) {
        this.ranges = [
          {
            text: '未来7天',
            start: new Date(),
            end: new Date(Date.now() + 3600 * 1000 * 24 * 7)
          },
          {
            text: '未来30天',
            start: new Date(),
            end: new Date(Date.now() + 3600 * 1000 * 24 * 30)
          },
          {
            text: '最近7天',
            start: new Date(Date.now() - 3600 * 1000 * 24 * 7),
            end: new Date()
          },
          {
            text: '最近30天',
            start: new Date(Date.now() - 3600 * 1000 * 24 * 30),
            end: new Date()
          }
        ]
        this.ranges.forEach((v, i) => {
          v.text = this.translation.pickers[i]
        })
      } else {
        this.ranges = []
      }
    },
    displayPopup () {
      if (this.disabled) {
        return
      }
      const dw = document.documentElement.clientWidth
      const dh = document.documentElement.clientHeight
      const InputRect = this.$el.getBoundingClientRect()
      const PopupRect = this.$refs.calendar.getBoundingClientRect()
      this.position = {}
      if (
        dw - InputRect.left < PopupRect.width &&
        InputRect.right < PopupRect.width
      ) {
        this.position.left = 1 - InputRect.left + 'px'
      } else if (InputRect.left + InputRect.width / 2 <= dw / 2) {
        this.position.left = 0
      } else {
        this.position.right = 0
      }
      if (
        InputRect.top <= PopupRect.height + 1 &&
        dh - InputRect.bottom <= PopupRect.height + 1
      ) {
        this.position.top = dh - InputRect.top - PopupRect.height - 1 + 'px'
      } else if (InputRect.top + InputRect.height / 2 <= dh / 2) {
        this.position.top = '100%'
      } else {
        this.position.bottom = '100%'
      }
    }
  },
  created () {
    this.initRanges()
  },
  directives: {
    clickoutside: {
      bind (el, binding, vnode) {
        el['@clickoutside'] = e => {
          if (
            !el.contains(e.target) &&
            binding.expression &&
            vnode.context[binding.expression]
          ) {
            binding.value()
          }
        }
        document.addEventListener('click', el['@clickoutside'], true)
      },
      unbind (el) {
        document.removeEventListener('click', el['@clickoutside'], true)
      }
    }
  }
}
</script>


<style lang="scss">
.mx-datepicker {
  position: relative;
  display: inline-block;
  color: #73879c;
  font: 14px/1.5 'Helvetica Neue', Helvetica, Arial, 'Microsoft Yahei',
    sans-serif;
  * {
    box-sizing: border-box;
  }
  &.disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}
.mx-datepicker-popup {
  position: absolute;
  width: 250px;
  margin-top: 1px;
  margin-bottom: 1px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  z-index: 1000;
  &.range {
    width: 496px;
  }
}

.mx-input {
  display: inline-block;
  width: 100%;
  height: 34px;
  padding: 6px 30px 6px 10px;
  font-size: 14px;
  line-height: 1.4;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  &:disabled,
  &.disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  &:focus {
    outline: none;
  }
}

.mx-input-icon {
  top: 0;
  right: 0;
  position: absolute;
  width: 30px;
  height: 100%;
  color: #888;
  text-align: center;
  font-style: normal;
  &::after {
    content: '';
    display: inline-block;
    width: 0;
    height: 100%;
    vertical-align: middle;
  }
}

.mx-input-icon__calendar {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA00lEQVQ4T72SzQ2CQBCF54UGKIES6EAswQq0BS/A3PQ0hAt0oKVQgiVYAkcuZMwSMOyCyRKNe9uf+d6b2Qf6csGtL8sy7vu+Zebn/E5EoiAIwjRNH/PzBUBEGiJqmPniAMw+YeZkFSAiJwA3j45aVT0wsxGitwOjDGDnASBVvU4OLQARRURk9e4CAcSqWn8CLHp3Ae6MXAe/B4yzUeMkz/P9ZgdFUQzFIwD/B4yKgwMTos0OtvzCHcDRJ0gAzlmW1VYSq6oKu66LfQBTjC2AT+Hamxcml5IRpPq3VQAAAABJRU5ErkJggg==);
  background-position: center;
  background-repeat: no-repeat;
}
.mx-input-icon__close::before {
  content: '\2716';
  vertical-align: middle;
}

.mx-datepicker-top {
  text-align: left;
  padding: 0 12px;
  line-height: 34px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  & > span {
    white-space: nowrap;
    cursor: pointer;
    &:hover {
      color: #1284e7;
    }
    &:after {
      content: '|';
      margin: 0 10px;
      color: #48576a;
    }
  }
}

.mx-datepicker-footer {
  padding: 4px;
  clear: both;
  text-align: right;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}
.mx-datepicker-btn {
  font-size: 12px;
  line-height: 1;
  padding: 7px 15px;
  margin: 0 5px;
  cursor: pointer;
  background-color: transparent;
  outline: none;
  border: none;
  border-radius: 3px;
}
.mx-datepicker-btn-confirm {
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #73879c;
  &:hover {
    color: #1284e7;
    border-color: #1284e7;
  }
}
</style>
