import { mount } from '@vue/test-utils';
import DatetimePanel from '../src/datetime/datetime-panel';

let wrapper;

afterEach(() => {
  wrapper.destroy();
});

describe('DatetimePanel', () => {
  it('feat: click date', () => {
    wrapper = mount(DatetimePanel, {
      propsData: {
        type: 'datetime',
        defaultValue: new Date(2019, 9, 1, 12),
      },
    });
    const td = wrapper.find('.mx-table-date td:nth-child(4)');
    td.trigger('click');
    expect(wrapper.emitted().select[0][0]).toEqual(new Date(2019, 9, 2, 12));
    let timeTitle = wrapper.find('.mx-time-header-title');
    expect(timeTitle.exists()).toBe(true);
    timeTitle.trigger('click');
    timeTitle = wrapper.find('.mx-time-header-title');
    expect(timeTitle.exists()).toBe(false);
  });

  it('feat: disabled time', () => {
    const disabledDate = date => date < new Date(2019, 9, 2);
    const disabledTime = date => date < new Date(2019, 9, 2, 12);
    wrapper = mount(DatetimePanel, {
      propsData: {
        defaultValue: new Date(2019, 9, 1),
        disabledDate,
        disabledTime,
      },
    });
    const td = wrapper.find('.mx-table-date td:nth-child(4)');
    td.trigger('click');
    expect(wrapper.emitted().select).toBeUndefined();
    const timeTitle = wrapper.find('.mx-time-header-title');
    expect(timeTitle.text()).toBe('2019-10-02');
  });
});
