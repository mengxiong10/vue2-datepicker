import { shallowMount, createWrapper, mount } from '@vue/test-utils';
import { format, parse } from 'date-fns';
import DatePicker from '../src/date-picker.vue';

let wrapper;

afterEach(() => {
  wrapper.destroy();
});

describe('DatePicker', () => {
  it('feat: open and close the popup', () => {
    wrapper = mount(DatePicker, {
      attachToDocument: true,
    });
    expect(wrapper.find('.mx-datepicker-popup').exists()).toBe(false);
    // expect click input should show the popup
    const input = wrapper.find('input');
    input.trigger('mousedown');
    expect(wrapper.find('.mx-datepicker-popup').exists()).toBe(true);
    // expect click out side should hide the popup
    const bodyWrapper = createWrapper(document.body);
    bodyWrapper.trigger('mousedown');
    expect(wrapper.find('.mx-datepicker-popup').exists()).toBe(false);
    // expect focus input should show the popop
    input.trigger('focus');
    expect(wrapper.find('.mx-datepicker-popup').exists()).toBe(true);
    // expoce keydown tab should hide the popup
    input.trigger('keydown.tab');
    expect(wrapper.find('.mx-datepicker-popup').exists()).toBe(false);
  });

  it('feat: should init panel and calendar when reopen', () => {
    wrapper = mount(DatePicker, {
      propsData: {
        defaultValue: new Date(2019, 9, 1),
        open: true,
      },
    });
    const yearBtn = wrapper.find('.mx-btn-current-year');
    yearBtn.trigger('click');
    // change to year panel
    expect(wrapper.find('.mx-calendar-panel-year').exists()).toBe(true);
    wrapper.setProps({ open: false });
    wrapper.setProps({ open: true });
    expect(wrapper.find('.mx-calendar-panel-year').exists()).toBe(false);
  });

  it('prop: open', () => {
    wrapper = mount(DatePicker, {
      propsData: {
        open: false,
      },
    });
    const { vm } = wrapper;
    vm.openPopup();
    expect(wrapper.find('.mx-datepicker-popup').exists()).toBe(false);
    wrapper.setProps({ open: true });
    expect(wrapper.find('.mx-datepicker-popup').exists()).toBe(true);
    vm.closePopup();
    expect(wrapper.find('.mx-datepicker-popup').exists()).toBe(true);
    const emitted = wrapper.emitted();
    expect(emitted['update:open'][0][0]).toBe(true);
    expect(emitted['update:open'][1][0]).toBe(false);
  });

  it('prop: disabled(should not show the popup)', () => {
    wrapper = mount(DatePicker, {
      propsData: {
        disabled: true,
      },
    });
    const input = wrapper.find('input');
    expect(input.attributes('disabled')).toBe('disabled');
    input.trigger('click');
    expect(wrapper.find('.mx-datepicker-popup').exists()).toBe(false);
  });

  it('prop: clearable', () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        value: new Date(2019, 4, 10),
        defaultValue: new Date(2019, 4, 10),
        clearable: false,
      },
      // calendar-panel: default-value="Fri May 10 2019 00:00:00 GMT+0800 (CST)"
      // Exclude the impact of timezone
      scopedSlots: {
        content: '<div></div>',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('prop: editable', () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        value: new Date(2019, 4, 10),
        defaultValue: new Date(2019, 4, 10),
        editable: false,
      },
      scopedSlots: {
        content: '<div></div>',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('prop: attrs of input', () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        defaultValue: new Date(2019, 4, 10),
        placeholder: 'test placeholder',
        inputClass: 'test',
        inputAttr: {
          type: 'number',
          name: 'test',
        },
      },
      scopedSlots: {
        content: '<div></div>',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('prop: format', () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        format: 'YYYY/MM/DD',
        value: new Date(2019, 9, 10),
      },
    });
    const input = wrapper.find('input').element;
    expect(input.value).toBe('2019/10/10');
  });

  it('prop: custom format', () => {
    wrapper = mount(DatePicker, {
      propsData: {
        valueType: 'format',
        value: '13/10/2019',
        open: true,
        type: 'week',
        format: {
          stringify(date) {
            return format(date, 'dd/MM/yyyy');
          },
          parse(value) {
            return parse(value, 'dd/MM/yyyy', new Date());
          },
          getWeek(date) {
            return date.getDate();
          },
        },
      },
    });
    const input = wrapper.find('input').element;
    expect(input.value).toBe('13/10/2019');
    const tableDate = wrapper.find('.mx-table-date');
    expect(tableDate.element).toMatchSnapshot();
  });

  it('prop: valueType', () => {
    const value = new Date(2019, 9, 20);
    const emitValue = new Date(2019, 9, 22);
    wrapper = shallowMount(DatePicker, {
      propsData: {
        value,
        format: 'YYYY/MM/DD',
      },
    });
    const { vm } = wrapper;
    expect(vm.text).toBe('2019/10/20');
    vm.emitValue(emitValue);
    wrapper.setProps({ valueType: 'format', value: '2019/10/20' });
    expect(vm.text).toBe('2019/10/20');
    vm.emitValue(emitValue);
    wrapper.setProps({ valueType: 'timestamp', value: value.getTime() });
    expect(vm.text).toBe('2019/10/20');
    vm.emitValue(emitValue);
    wrapper.setProps({ valueType: 'DD/MM/YYYY', value: '20/10/2019' });
    expect(vm.text).toBe('2019/10/20');
    vm.emitValue(emitValue);
    const emitted = wrapper.emitted();
    expect(emitted.input).toEqual([
      [emitValue],
      ['2019/10/22'],
      [emitValue.getTime()],
      ['22/10/2019'],
    ]);
  });

  it('prop: shortcut', () => {
    const date = new Date(2019, 4, 10);
    wrapper = shallowMount(DatePicker, {
      propsData: {
        open: true,
        valueType: 'YYYY/MM/DD',
        shortcuts: [
          {
            text: 'Today',
            onClick() {
              return date;
            },
          },
        ],
      },
    });

    const btn = wrapper.find('.mx-btn-shortcut');
    btn.trigger('click');
    const emitted = wrapper.emitted();
    expect(emitted.input).toEqual([['2019/05/10']]);
  });

  it('prop: popupClass', () => {
    wrapper = mount(DatePicker, {
      propsData: {
        open: true,
        popupClass: 'test',
      },
    });
    const popup = wrapper.find('.mx-datepicker-popup');
    expect(popup.classes()).toContain('test');
  });

  it('prop: popupStyle', () => {
    wrapper = mount(DatePicker, {
      propsData: {
        open: true,
        popupStyle: {
          color: 'red',
        },
      },
    });
    const popup = wrapper.find('.mx-datepicker-popup');
    expect(popup.element.style.color).toBe('red');
  });

  it('prop: confirm', () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        confirm: true,
      },
    });
    const { vm } = wrapper;
    vm.openPopup();
    const btn = wrapper.find('.mx-datepicker-btn-confirm');
    expect(btn.exists()).toBe(true);
    // click the date expect popup don't close
    vm.handleSelectDate(new Date(2018, 5, 5));
    expect(wrapper.emitted().input).toBeUndefined();
    expect(vm.popupVisible).toBe(true);
    btn.trigger('click');
    expect(wrapper.emitted().input[0][0]).toEqual(new Date(2018, 5, 5));
    expect(vm.popupVisible).toBe(false);
  });

  it('prop: confirmText', () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        open: true,
        confirm: true,
        confirmText: 'test',
      },
    });

    const btn = wrapper.find('.mx-datepicker-btn-confirm');
    expect(btn.text()).toBe('test');
  });

  it('prop: appendToBody', () => {
    wrapper = mount(DatePicker, {
      propsData: {
        open: true,
        appendToBody: true,
      },
    });

    const popup = wrapper.find('.mx-datepicker-popup');
    expect(popup.element.parentNode).toBe(document.body);
  });

  it('feat: should emit clear event when click clear button', () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        value: new Date(2019, 10, 9),
      },
    });
    const clearButton = wrapper.find('.mx-icon-clear');
    clearButton.trigger('mousedown');
    const emitted = wrapper.emitted();
    expect(emitted.clear).toBeTruthy();
    expect(emitted.input[0][0]).toBe(null);
  });

  it('feat: should emit [null, null] when clear range', () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        range: true,
        value: [new Date(2019, 10, 9), new Date(2019, 11, 9)],
      },
    });
    const clearButton = wrapper.find('.mx-icon-clear');
    clearButton.trigger('mousedown');
    const emitted = wrapper.emitted();
    expect(emitted.input[0][0]).toEqual([null, null]);
  });

  it('feat: should close popup when click time in datetime mode', () => {
    wrapper = mount(DatePicker, {
      propsData: {
        type: 'datetime',
        timePickerOptions: {
          start: '00:00',
          step: '00:30',
          end: '23:30',
        },
        open: true,
        showTimePanel: true,
      },
    });
    const el = wrapper.find('.mx-time-option');
    el.trigger('click');
    expect(wrapper.emitted().close).toBeTruthy();
  });
});
