import Vue from 'vue'
import { mount, shallowMount } from '@vue/test-utils'
import DatePicker from '../src/index.vue'
import CalendarPanel from '../src/calendar.vue'
import DatePanel from '../src/panel/date'
import TimePanel from '../src/panel/time'
import YearPanel from '../src/panel/year'

let wrapper

afterEach(() => {
  wrapper.destroy()
})

describe('datepicker', () => {
  it('click: pick date', () => {
    wrapper = mount(DatePicker, {
      propsData: {
        value: new Date(2018, 4, 2)
      }
    })
    // 2018-05-03
    const vm = wrapper.vm

    let td = wrapper.find('.mx-panel-date td:nth-child(5)')
    expect(td.classes()).not.toContain('actived')
    expect(vm.text).toBe('2018-05-02')
    const time = new Date(2018, 4, 3).getTime()
    td.trigger('click')
    const emitted = wrapper.emitted()
    expect(emitted.input[0][0].getTime()).toBe(time)
    expect(emitted.change[0][0].getTime()).toBe(time)
    wrapper.setProps({ value: emitted.input[0][0] })
    td = wrapper.find('.mx-panel-date td:nth-child(5)')
    expect(td.classes()).toContain('actived')
    expect(vm.text).toBe('2018-05-03')
  })

  it('click: clear icon', () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        value: new Date(2018, 4, 2)
      }
    })
    const vm = wrapper.vm
    const clear = wrapper.find('.mx-clear-wrapper')
    clear.trigger('click')
    const emitted = wrapper.emitted()
    expect(emitted.input[0][0]).toBe(null)
    wrapper.setProps({ value: null })
    expect(vm.text).toBe('')
  })

  it('prop: range', (done) => {
    wrapper = mount(DatePicker, {
      propsData: {
        range: true,
        value: [],
        confirm: false
      },
      sync: false // sync bug
    })

    const calendars = wrapper.findAll(CalendarPanel)
    const calendar1 = calendars.at(0)
    const calendar2 = calendars.at(1)

    const td1 = calendar1.findAll('.mx-panel-date tbody td')
    const td2 = calendar2.findAll('.mx-panel-date tbody td')

    td1.at(14).trigger('click')

    Vue.nextTick(() => {
      let emitted = wrapper.emittedByOrder()
      expect(emitted).toHaveLength(0)
      expect(td1.at(14).classes()).toContain('actived')
      expect(td2.at(13).classes()).toContain('disabled')
      expect(td2.at(14).classes()).not.toContain('disabled')

      const date1 = new Date(td1.at(14).element.title)
      td2.at(16).trigger('click')
      Vue.nextTick(() => {
        emitted = wrapper.emittedByOrder()

        const date2 = new Date(td2.at(16).element.title)

        expect(td2.at(16).classes()).toContain('actived')
        expect(td1.at(15).classes()).toContain('inrange')
        expect(td1.at(16).classes()).toContain('inrange')
        expect(td1.at(17).classes()).toContain('disabled')

        expect(emitted).toHaveLength(2)
        expect(emitted[0].args[0]).toEqual([date1, date2])
        done()
      })
    })
  })

  it('prop: rangeSeparator', () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        range: true,
        value: [new Date('2018-06-01'), new Date('2018-06-10')],
        rangeSeparator: '至'
      }
    })
    const vm = wrapper.vm
    expect(vm.text).toBe('2018-06-01 至 2018-06-10')
  })

  it('prop: confirm', () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        confirm: true
      }
    })
    const vm = wrapper.vm
    const btn = wrapper.find('.mx-datepicker-btn-confirm')
    expect(btn.exists()).toBe(true)
    // click the date expect popup don't close
    wrapper.setData({ popupVisible: true })
    vm.selectDate(new Date(2018, 5, 5))
    expect(vm.popupVisible).toBe(true)
    expect(wrapper.emittedByOrder()).toHaveLength(0)
    btn.trigger('click')
    expect(wrapper.emittedByOrder()).toHaveLength(3)
    expect(vm.popupVisible).toBe(false)
  })

  it('prop: confirmText', () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        confirm: true,
        confirmText: '确定'
      }
    })
    const btn = wrapper.find('.mx-datepicker-btn-confirm')
    expect(btn.text()).toBe('确定')
  })

  it('prop: width', () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        width: 300
      }
    })
    const el = wrapper.find('.mx-datepicker').element
    let width = el.style.width
    expect(width).toBe('300px')
    wrapper.setProps({ width: '100%' })
    width = el.style.width
    expect(width).toBe('100%')
  })

  it('prop: disabled', () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        disabled: true,
        value: new Date(2018, 4, 5),
        clearable: true
      }
    })
    const vm = wrapper.vm
    // don't show the clearIocn
    expect(vm.showClearIcon).toBe(false)
    // don't show the popup
    vm.showPopup()
    expect(vm.popupVisible).toBe(false)
  })

  it('prop: input attribte - inputName inputClass placeholder', () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        value: new Date(2018, 4, 5),
        inputName: 'datepicker',
        inputClass: ['mx-input', 'mx-my'],
        placeholder: 'hehe'
      }
    })
    const el = wrapper.find('.mx-input').element

    expect(el.className).toBe('mx-input mx-my')
    expect(el.getAttribute('name')).toBe('datepicker')
    expect(el.getAttribute('placeholder')).toBe('hehe')
  })

  it('prop: lang', () => {
    wrapper = mount(DatePicker, {
      propsData: {
        lang: 'en',
        value: new Date(2018, 5, 5)
      }
    })
    const el = wrapper.find('.mx-current-month')
    expect(el.text()).toBe('Jun')
    wrapper.setProps({
      lang: 'zh'
    })
    expect(el.text()).toBe('6月')
  })

  it('prop: shortcuts', () => {
    const today = new Date()
    wrapper = shallowMount(DatePicker, {
      propsData: {
        shortcuts: [
          {
            text: 'Today',
            start: today,
            end: today
          }
        ],
        range: true
      }
    })
    let shortcuts = wrapper.findAll('.mx-shortcuts')
    expect(shortcuts).toHaveLength(1)
    shortcuts = shortcuts.at(0)
    shortcuts.trigger('click')
    expect(wrapper.emitted()).toEqual({
      input: [[[today, today]]],
      change: [[[today, today]]]
    })
    wrapper.setProps({
      shortcuts: false
    })
    shortcuts = wrapper.find('.mx-shortcuts-wrapper')
    expect(shortcuts.exists()).toBe(false)
  })

  it('type input should be right', (done) => {
    wrapper = mount(DatePicker, {
      propsData: {
        format: 'YYYY-MM-DD'
      },
      sync: false
    })
    const input = wrapper.find('input')
    input.setValue('2018-09-10')
    input.trigger('input')
    input.trigger('change')
    const expectDate = new Date(2018, 8, 10)
    wrapper.setProps({
      range: true
    })
    Vue.nextTick(() => {
      input.setValue('2018-09-10 ~ 2018-09-11')
      input.trigger('input')
      input.trigger('change')
      const expectRange = [new Date(2018, 8, 10), new Date(2018, 8, 11)]
      input.setValue('2018-09-10 ~ 2018-08-10')
      input.trigger('input')
      input.trigger('change')
      expect(wrapper.emitted()).toEqual({
        input: [[expectDate], [expectRange]],
        change: [[expectDate], [expectRange]],
        'input-error': [['2018-09-10 ~ 2018-08-10']]
      })
      done()
    })
  })
})

describe('calendar-panel', () => {
  it('click: prev/next month', () => {
    wrapper = mount(CalendarPanel)

    const nextBtn = wrapper.find('.mx-icon-next-month')
    const lastBtn = wrapper.find('.mx-icon-last-month')
    const vm = wrapper.vm
    let count = 12
    while (count--) {
      const oldYear = vm.calendarYear
      const oldMonth = vm.calendarMonth
      nextBtn.trigger('click')
      const newYear = vm.calendarYear
      const newMonth = vm.calendarMonth
      if (oldMonth === 11) {
        expect(newMonth).toBe(0)
        expect(newYear).toBe(oldYear + 1)
      } else {
        expect(newMonth).toBe(oldMonth + 1)
        expect(newYear).toBe(oldYear)
      }
    }
    count = 12
    while (count--) {
      const oldYear = vm.calendarYear
      const oldMonth = vm.calendarMonth
      lastBtn.trigger('click')
      const newYear = vm.calendarYear
      const newMonth = vm.calendarMonth
      if (oldMonth === 0) {
        expect(newMonth).toBe(11)
        expect(newYear).toBe(oldYear - 1)
      } else {
        expect(newMonth).toBe(oldMonth - 1)
        expect(newYear).toBe(oldYear)
      }
    }
  })

  it('click: prev/next year', () => {
    wrapper = mount(CalendarPanel, {
      value: new Date(2018, 4, 5)
    })
    const nextBtn = wrapper.find('.mx-icon-next-year')
    const lastBtn = wrapper.find('.mx-icon-last-year')
    const yearBtn = wrapper.find('.mx-current-year')
    const vm = wrapper.vm
    const oldYear = vm.calendarYear
    expect(oldYear).toBe(2018)
    nextBtn.trigger('click')
    let newYear = vm.calendarYear
    expect(newYear).toBe(2019)
    lastBtn.trigger('click')
    newYear = vm.calendarYear
    expect(newYear).toBe(oldYear)
    // 年视图测试
    yearBtn.trigger('click')
    expect(vm.panel).toBe('YEAR')
    expect(vm.firstYear).toBe(2010)
    nextBtn.trigger('click')
    expect(vm.firstYear).toBe(2020)
    lastBtn.trigger('click')
    lastBtn.trigger('click')
    expect(vm.firstYear).toBe(2000)
  })

  it('prop: notBefore/notAfter', () => {
    wrapper = mount(CalendarPanel, {
      propsData: {
        value: new Date(2018, 4, 2),
        notBefore: new Date(2018, 4, 1, 12),
        notAfter: new Date(2018, 4, 31, 12)
      }
    })
    const tds = wrapper.findAll('.mx-panel-date td')
    for (let i = 0; i < 42; i++) {
      const td = tds.at(i)
      const classes = td.classes()
      if (i < 2 || i > 32) {
        expect(classes).toContain('disabled')
      } else {
        expect(classes).not.toContain('disabled')
      }
    }
  })

  it('prop: disabledDays(Array)', () => {
    const disabledDays = ['2018-05-01', new Date(2018, 4, 3)]
    wrapper = mount(CalendarPanel, {
      propsData: {
        value: new Date(2018, 4, 2),
        disabledDays
      }
    })
    const tds = wrapper.findAll('.mx-panel-date td.disabled')
    expect(tds.length).toBe(disabledDays.length)
    for (let i = 0, len = tds.length; i < len; i++) {
      const tdDate = new Date(tds.at(i).element.title).getTime()
      const expectDate = new Date(disabledDays[i]).setHours(0, 0, 0, 0)
      expect(tdDate).toBe(expectDate)
    }
  })

  it('prop: disabledDays(Function)', () => {
    const disabledDays = function (date) {
      return date < new Date(2018, 4, 1) || date > new Date(2018, 4, 31)
    }
    wrapper = mount(CalendarPanel, {
      propsData: {
        value: new Date(2018, 4, 4),
        disabledDays
      }
    })
    const tds = wrapper.findAll('.mx-panel-date td')
    for (let i = 0; i < 42; i++) {
      const td = tds.at(i)
      const classes = td.classes()
      if (i < 2 || i > 32) {
        expect(classes).toContain('disabled')
      } else {
        expect(classes).not.toContain('disabled')
      }
    }
  })

  it('feat: when the time panel show, scroll to the right position', (done) => {
    wrapper = mount(CalendarPanel, {
      propsData: {
        value: new Date(2018, 4, 4),
        type: 'datetime'
      }
    })
    wrapper.setData({
      panel: 'TIME'
    })
    const list = wrapper.find('.mx-time-list').element
    list.scrollTop = 200
    wrapper.setData({
      panel: 'DATE'
    })
    wrapper.setData({
      panel: 'TIME'
    })
    setTimeout(() => {
      expect(list.scrollTop).toBe(0)
      done()
    }, 0)
  })
})

describe('date-panel', () => {
  const testRenderCalendar = (i) => it(`feat: render the corrent date panel firstDayOfWeek: ${i}`, () => {
    wrapper = mount(DatePanel, {
      propsData: {
        value: new Date(2018, 4, 1),
        calendarMonth: 4,
        calendarYear: 2018,
        firstDayOfWeek: i
      }
    })
    const lastMonth = new Date(2018, 3, 30)
    const lastMonthDay = 30
    const lastMonthLength = (lastMonth.getDay() + 7 - i) % 7 + 1
    const currentMonthLength = 31
    const tds = wrapper.findAll('.mx-panel-date td')
    for (let i = 0; i < 42; i++) {
      const td = tds.at(i)
      const text = parseInt(td.text(), 10)
      const classes = td.classes()
      if (i < lastMonthLength) {
        expect(classes).toContain('last-month')
        expect(text).toBe(lastMonthDay - lastMonthLength + 1 + i)
      } else if (i < lastMonthLength + currentMonthLength) {
        expect(text).toBe(i - lastMonthLength + 1)
        expect(classes).toContain('cur-month')
        if (text === 1) {
          expect(classes).toContain('actived')
        }
      } else {
        expect(text).toBe(i - lastMonthLength - currentMonthLength + 1)
        expect(classes).toContain('next-month')
      }
    }
    const week = ['一', '二', '三', '四', '五', '六', '日']
    const firstWeek = wrapper.find('tr th').text()
    expect(firstWeek).toBe(week[i - 1])
  })

  for (let i = 1; i <= 7; i++) {
    testRenderCalendar(i)
  }
})

describe('year-panel', () => {
  it('feat: render the corrent year panel', () => {
    wrapper = mount(YearPanel, {
      propsData: {
        value: new Date(2018, 4, 1),
        firstYear: 2010
      }
    })

    const cells = wrapper.findAll('.cell')

    for (let i = 0, len = cells.length; i < len; i++) {
      const cell = cells.at(i)
      expect(parseInt(cell.text())).toBe(2010 + i)
      if (i === 8) {
        expect(cell.classes()).toContain('actived')
      }
    }

    wrapper.setProps({ firstYear: 2020 })

    for (let i = 0, len = cells.length; i < len; i++) {
      const cell = cells.at(i)
      expect(parseInt(cell.text())).toBe(2020 + i)
    }
  })
})

describe('time-panel', () => {
  it('click: pick time emitted the select event', () => {
    wrapper = mount(TimePanel, {
      propsData: {
        value: new Date(2018, 5, 5)
      }
    })
    const list = wrapper.findAll('.mx-time-list')
    expect(list).toHaveLength(3)
    const hours = list.at(0).findAll('.cell')
    const minutes = list.at(1).findAll('.cell')
    const seconds = list.at(2).findAll('.cell')

    expect(hours).toHaveLength(24)
    expect(minutes).toHaveLength(60)
    expect(seconds).toHaveLength(60)

    hours.at(1).trigger('click')
    minutes.at(1).trigger('click')
    seconds.at(1).trigger('click')
    expect(wrapper.emitted()).toEqual({
      select: [[new Date(2018, 5, 5, 1)], [new Date(2018, 5, 5, 0, 1)], [new Date(2018, 5, 5, 0, 0, 1)]]
    })
  })

  it('prop: minuteStep', () => {
    wrapper = mount(TimePanel, {
      propsData: {
        value: new Date(2018, 5, 5),
        minuteStep: 30
      }
    })
    const list = wrapper.findAll('.mx-time-list')
    expect(list).toHaveLength(2)
    const minutes = list.at(1).findAll('.cell')
    expect(minutes).toHaveLength(2)
    expect(minutes.at(0).text()).toBe('00')
    expect(minutes.at(1).text()).toBe('30')
  })

  it('prop: timePickerOptions', () => {
    wrapper = mount(TimePanel, {
      propsData: {
        value: new Date(2018, 5, 5),
        timePickerOptions: { start: '01:00', step: '00:30', end: '23:00' }
      }
    })
    const list = wrapper.findAll('.mx-time-list')
    expect(list).toHaveLength(1)
    const cells = list.at(0).findAll('.cell')
    expect(cells).toHaveLength(45)
    expect(cells.at(0).text()).toBe('01:00')
    expect(cells.at(44).text()).toBe('23:00')
    cells.at(0).trigger('click')
    const emitted = wrapper.emitted()
    expect(emitted).toEqual({
      select: [[new Date(2018, 5, 5, 1)]]
    })
  })
})
