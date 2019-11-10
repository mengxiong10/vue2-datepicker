import { mount } from '@vue/test-utils';
import flushPromises from 'flush-promises';
import CalendarRange from '../src/calendar/calendar-range';
import CalendarPanel from '../src/calendar/calendar-panel';

let wrapper;

afterEach(() => {
  wrapper.destroy();
});

describe('CalendarRange', () => {
  it('feat: correct classes', () => {
    wrapper = mount(CalendarRange, {
      sync: false,
      propsData: {
        value: [new Date(2019, 9, 30), new Date(2019, 10, 2)],
      },
    });
    const activeTds = wrapper.findAll('.mx-table-date .active');
    const rangeTds = wrapper.findAll('.mx-table-date .in-range');
    expect(activeTds.length).toBe(2);
    expect(activeTds.at(0).text()).toBe('30');
    expect(activeTds.at(1).text()).toBe('2');
    expect(rangeTds.length).toBe(2);
    expect(rangeTds.at(0).text()).toBe('31');
    expect(rangeTds.at(1).text()).toBe('1');
  });

  it('feat: click range', async () => {
    wrapper = mount(CalendarRange, {
      sync: false,
      propsData: {
        defaultValue: new Date(2019, 9, 1),
      },
    });
    expect(wrapper.vm.calendars).toEqual([new Date(2019, 9, 1), new Date(2019, 10, 1)]);
    const tds = wrapper.findAll('.mx-table-date td');
    tds.at(2).trigger('click');
    await flushPromises();
    expect(wrapper.emitted().select).toBeUndefined();
    tds.at(8).trigger('click');
    await flushPromises();
    expect(wrapper.emitted().select[0][0]).toEqual([new Date(2019, 9, 1), new Date(2019, 9, 7)]);
  });

  it('feat: calendars min gap', async () => {
    wrapper = mount(CalendarRange, {
      sync: false,
      propsData: {
        defaultValue: new Date(2019, 6, 1),
      },
    });
    const panels = wrapper.findAll(CalendarPanel);
    const startPanel = panels.at(0);
    const endPanel = panels.at(1);

    startPanel.find('.mx-btn-icon-right').trigger('click');
    await flushPromises();
    expect(wrapper.vm.calendars).toEqual([new Date(2019, 7, 1), new Date(2019, 8, 1)]);

    endPanel.find('.mx-btn-icon-left').trigger('click');
    await flushPromises();
    expect(wrapper.vm.calendars).toEqual([new Date(2019, 6, 1), new Date(2019, 7, 1)]);
  });
});
