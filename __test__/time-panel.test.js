import { mount } from '@vue/test-utils';
import TimePanel from '../src/time/time-panel';
import ListColumns from '../src/time/list-columns.vue';

let wrapper;

afterEach(() => {
  wrapper.destroy();
});

describe('TimePanel', () => {
  it('render: correct classes of the columns', () => {
    wrapper = mount(TimePanel, {
      propsData: {
        value: new Date(2019, 9, 4, 12, 30, 30),
        disabledTime: date => date.getHours() < 10,
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('render: correct columns by format', () => {
    wrapper = mount(TimePanel, {
      propsData: {
        value: new Date(2019, 9, 4),
        format: 'hh:mm a',
        minuteStep: 30,
        hourOptions: Array.from({ length: 10 }).map((_, i) => i + 8),
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('render: correct classes of the fixed time list', () => {
    wrapper = mount(TimePanel, {
      propsData: {
        value: new Date(2019, 10, 9, 12, 30),
        disabledTime: date => date.getHours() < 10,
        timePickerOptions: {
          start: '08:30',
          step: '00:30',
          end: '18:30',
        },
        format: 'HH:mm',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('render: correct 12hours in the fixed time list', () => {
    wrapper = mount(TimePanel, {
      propsData: {
        value: new Date(2019, 10, 9, 12, 30),
        timePickerOptions: {
          start: '08:30',
          step: '00:30',
          end: '18:30',
        },
        format: 'hh:mm A',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('feat: emit select event when click', async () => {
    wrapper = mount(TimePanel, {
      propsData: {
        format: 'hh:mm:ss a',
        defaultValue: new Date(2019, 9, 10, 2),
      },
    });
    const hour = wrapper.find('[data-type=hour] li:nth-child(2)');
    await hour.trigger('click');
    expect(wrapper.emitted().select[0][0]).toEqual(new Date(2019, 9, 10, 1));
    await wrapper.setProps({ value: new Date(2019, 9, 10, 1) });
    const minute = wrapper.find('[data-type=minute] li:nth-child(2)');
    await minute.trigger('click');
    expect(wrapper.emitted().select[1][0]).toEqual(new Date(2019, 9, 10, 1, 1));
    await wrapper.setProps({ value: new Date(2019, 9, 10, 1, 1) });
    const second = wrapper.find('[data-type=second] li:nth-child(2)');
    await second.trigger('click');
    expect(wrapper.emitted().select[2][0]).toEqual(new Date(2019, 9, 10, 1, 1, 1));
    await wrapper.setProps({ value: new Date(2019, 9, 10, 1, 1, 1) });
    const pm = wrapper.find('[data-type=ampm] li:nth-child(2)');
    await pm.trigger('click');
    expect(wrapper.emitted().select[3][0]).toEqual(new Date(2019, 9, 10, 13, 1, 1));
  });

  it('feat: disabledTime should not emit event', () => {
    wrapper = mount(TimePanel, {
      propsData: {
        value: new Date(2019, 9, 4, 12, 30, 30),
        disabledTime: date => date.getHours() < 10,
      },
    });
    const hour = wrapper.find('[data-type=hour] li:nth-child(2)');
    hour.trigger('click');
    expect(wrapper.emitted().select).toBeUndefined();
  });

  it('fix: when the custom format pass into time panel', () => {
    wrapper = mount(TimePanel, {
      propsData: {
        value: new Date(),
        format: {},
      },
    });
    const cols = wrapper.findComponent(ListColumns);
    expect(cols.props('showHour')).toBe(true);
    expect(cols.props('showMinute')).toBe(true);
    expect(cols.props('showSecond')).toBe(true);
  });
});
