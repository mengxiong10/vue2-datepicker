import { shallowMount, createWrapper, mount } from '@vue/test-utils';
import { format, parse } from 'date-fns';
import Popup from '../src/popup';
import DatePicker from '../src/date-picker';

let wrapper;

afterEach(() => {
  wrapper.destroy();
});

describe('DatePicker', () => {
  it('feat: open and close the popup', async () => {
    wrapper = mount(DatePicker, {
      attachTo: document.body,
    });
    expect(wrapper.find('.mx-datepicker-popup').exists()).toBe(false);
    // expect click input should show the popup
    const input = wrapper.find('input');
    await input.trigger('click');
    expect(wrapper.find('.mx-datepicker-popup').exists()).toBe(true);
    // expect click out side should hide the popup
    const bodyWrapper = createWrapper(document.body);
    await bodyWrapper.trigger('mousedown');
    expect(wrapper.find('.mx-datepicker-popup').exists()).toBe(false);
    // expect focus input should show the popop
    await input.trigger('focus');
    expect(wrapper.find('.mx-datepicker-popup').exists()).toBe(true);
    // expoce keydown tab should hide the popup
    await input.trigger('keydown.tab');
    expect(wrapper.find('.mx-datepicker-popup').exists()).toBe(false);
  });

  it('feat: should init panel and calendar when reopen', async () => {
    wrapper = mount(DatePicker, {
      propsData: {
        defaultValue: new Date(2019, 9, 1),
        open: true,
      },
    });
    const yearBtn = wrapper.find('.mx-btn-current-year');
    await yearBtn.trigger('click');
    // change to year panel
    expect(wrapper.find('.mx-calendar-panel-year').exists()).toBe(true);
    await wrapper.setProps({ open: false });
    await wrapper.setProps({ open: true });
    expect(wrapper.find('.mx-calendar-panel-year').exists()).toBe(false);
  });

  it('prop: open', async () => {
    wrapper = mount(DatePicker, {
      propsData: {
        open: false,
      },
    });
    const { vm } = wrapper;
    vm.openPopup();
    expect(wrapper.find('.mx-datepicker-popup').exists()).toBe(false);
    await wrapper.setProps({ open: true });
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

  it('prop: formatter', () => {
    wrapper = mount(DatePicker, {
      propsData: {
        valueType: 'format',
        value: '13/10/2019',
        open: true,
        type: 'week',
        formatter: {
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

  it('prop: valueType', async () => {
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
    await wrapper.setProps({ valueType: 'format', value: '2019/10/20' });
    expect(vm.text).toBe('2019/10/20');
    vm.emitValue(emitValue);
    await wrapper.setProps({ valueType: 'timestamp', value: value.getTime() });
    expect(vm.text).toBe('2019/10/20');
    vm.emitValue(emitValue);
    await wrapper.setProps({ valueType: 'DD/MM/YYYY', value: '20/10/2019' });
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

  it('prop: shortcut', async () => {
    const date = new Date(2019, 4, 10);
    wrapper = shallowMount(DatePicker, {
      propsData: {
        open: true,
        valueType: 'YYYY/MM/DD',
        range: false,
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
    await btn.trigger('click');
    const emitted = wrapper.emitted();
    expect(emitted.input).toEqual([['2019/05/10']]);
    await wrapper.setProps({
      range: true,
      shortcuts: [
        {
          text: 'range',
          onClick() {
            return [date, date];
          },
        },
      ],
    });
    btn.trigger('click');
    expect(emitted.input[1]).toEqual([['2019/05/10', '2019/05/10']]);
  });

  it('prop: popupClass', () => {
    wrapper = mount(DatePicker, {
      propsData: {
        open: true,
        popupClass: 'test',
      },
    });
    const popup = wrapper.findComponent(Popup);
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
    const popup = wrapper.findComponent(Popup);
    expect(popup.element.style.color).toBe('red');
  });

  it('prop: confirm', async () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        confirm: true,
      },
    });
    const { vm } = wrapper;
    await wrapper.find('input').trigger('focus');
    const btn = wrapper.find('.mx-datepicker-btn-confirm');
    expect(btn.exists()).toBe(true);
    // click the date expect popup don't close
    vm.handleSelectDate(new Date(2018, 5, 5));
    expect(wrapper.emitted().input).toBeUndefined();
    expect(vm.popupVisible).toBe(true);
    await btn.trigger('click');
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

    const popup = wrapper.findComponent(Popup);
    expect(popup.element.parentNode).toBe(document.body);
  });

  it('feat: should emit clear event when click clear button', async () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        value: new Date(2019, 10, 9),
      },
    });
    await wrapper.find('.mx-input-wrapper').trigger('mouseenter');
    const clearButton = wrapper.find('.mx-icon-clear');

    clearButton.trigger('click');
    const emitted = wrapper.emitted();
    expect(emitted.clear).toBeTruthy();
    expect(emitted.input[0][0]).toBe(null);
  });

  it('feat: should emit [null, null] when clear range', async () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        range: true,
        value: [new Date(2019, 10, 9), new Date(2019, 11, 9)],
      },
    });
    await wrapper.find('.mx-input-wrapper').trigger('mouseenter');
    const clearButton = wrapper.find('.mx-icon-clear');
    clearButton.trigger('click');
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

  // present the button submit form
  it('the type of all buttons should be button', () => {
    wrapper = mount(DatePicker, {
      propsData: {
        open: true,
        showTimePanel: true,
      },
    });
    const els = wrapper.findAll('button');
    els.wrappers.forEach(v => {
      expect(v.element.type).toBe('button');
    });
  });

  it('should emit pick event on first click', () => {
    wrapper = mount(DatePicker, {
      propsData: {
        range: true,
        open: true,
        defaultValue: new Date(2019, 9, 1),
      },
    });
    const td = wrapper.find('.mx-table-date td');
    td.trigger('click');
    expect(wrapper.emitted().pick[0][0]).toEqual(new Date(2019, 8, 29));
  });

  it('Ignore whitespace around separator on manual range input', async () => {
    const rangeSeparator = ' ~ ';
    const text = '2020-02-12';
    wrapper = mount(DatePicker, {
      propsData: {
        range: true,
        rangeSeparator: ' ~ ',
        valueType: 'format',
      },
    });
    const input = wrapper.find('input');

    await input.setValue(`${text} ${rangeSeparator} ${text}`);
    await input.trigger('change');
    await input.setValue(`${text}${rangeSeparator.trim()}${text}`);
    await input.trigger('change');
    await wrapper.setProps({ rangeSeparator: ' - ' });
    await input.setValue(`${text} - ${text}`);
    await input.trigger('change');
    expect(wrapper.emitted().input).toEqual([[[text, text]], [[text, text]], [[text, text]]]);
  });

  it('prop: multiple', () => {
    const value = [new Date(2020, 5, 6), new Date(2020, 6, 7)];
    wrapper = mount(DatePicker, {
      propsData: {
        multiple: true,
        open: true,
        value,
      },
    });
    wrapper.find('.mx-date-row .active').trigger('click');
    expect(wrapper.emitted().input[0][0]).toEqual(value.slice(0, 1));
    wrapper.find('[title="2020-07-15"]').trigger('click');
    expect(wrapper.emitted().input[1][0]).toEqual(value.concat(new Date(2020, 6, 15)));
  });

  it('prop: invalid multiple', () => {
    wrapper = shallowMount(DatePicker, {
      propsData: {
        multiple: true,
        range: true,
      },
    });
    const { vm } = wrapper;
    expect(vm.validMultipleType).toBe(false);
    wrapper.setProps({
      range: false,
      type: 'datetime',
    });
    expect(vm.validMultipleType).toBe(false);
  });

  it('If the value entered manually is in the disabled range should be invalid', () => {
    const someday = new Date(2020, 6, 1);
    wrapper = shallowMount(DatePicker, {
      format: 'YYYY-MM-DD',
      propsData: {
        disabledDate: date => {
          return date < someday;
        },
      },
    });
    const textInput = wrapper.find('input');
    textInput.setValue('2020-08-01');
    textInput.trigger('change');
    expect(wrapper.emitted().input[0][0]).toEqual(new Date(2020, 7, 1));
    textInput.setValue('2020-05-01');
    textInput.trigger('change');
    expect(wrapper.emitted().input[1]).toBe(undefined);
    expect(wrapper.emitted()['input-error'][0][0]).toBe('2020-05-01');
  });

  it('panel-change event should be emitd', async () => {
    wrapper = mount(DatePicker, {
      propsData: {
        open: true,
      },
    });
    const yearBtn = wrapper.find('.mx-btn-current-year');
    await yearBtn.trigger('click');
    expect(wrapper.emitted()['panel-change'][0]).toEqual(['year', 'date']);
  });
});
