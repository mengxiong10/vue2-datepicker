import { mount } from '@vue/test-utils';
import CalendarRange from '../src/calendar/calendar-range';
import CalendarPanel from '../src/calendar/calendar-panel';

let wrapper;

afterEach(() => {
  wrapper.unmount();
});

describe('CalendarRange', () => {
  it('feat: correct classes', () => {
    wrapper = mount(CalendarRange, {
      props: {
        value: [new Date(2019, 9, 30), new Date(2019, 10, 2)],
      },
    });
    const activeTds = wrapper.findAll('.mx-table-date .active');
    const rangeTds = wrapper.findAll('.mx-table-date .in-range');
    expect(activeTds.length).toBe(2);
    expect(activeTds[0].text()).toBe('30');
    expect(activeTds[1].text()).toBe('2');
    expect(rangeTds.length).toBe(2);
    expect(rangeTds[0].text()).toBe('31');
    expect(rangeTds[1].text()).toBe('1');
  });

  it('feat: click range', async () => {
    wrapper = mount(CalendarRange, {
      props: {
        defaultValue: new Date(2019, 9, 1),
      },
    });
    expect(wrapper.vm.calendars).toEqual([new Date(2019, 9, 1), new Date(2019, 10, 1)]);
    const tds = wrapper.findAll('.mx-table-date td');
    await tds[2].trigger('click');
    expect(wrapper.emitted().select).toBeUndefined();
    await tds[8].trigger('click');
    expect(wrapper.emitted().select[0][0]).toEqual([new Date(2019, 9, 1), new Date(2019, 9, 7)]);
  });

  it('feat: calendars min gap', async () => {
    wrapper = mount(CalendarRange, {
      props: {
        defaultValue: new Date(2019, 6, 1),
      },
    });
    const firstRightIcon = wrapper.find('.mx-calendar-panel-date .mx-btn-icon-right');
    const secondLeftIcon = wrapper.find('.mx-calendar-panel-date:nth-child(2) .mx-btn-icon-left');

    await firstRightIcon.trigger('click');
    expect(wrapper.vm.calendars).toEqual([new Date(2019, 7, 1), new Date(2019, 8, 1)]);

    await secondLeftIcon.trigger('click');
    expect(wrapper.vm.calendars).toEqual([new Date(2019, 6, 1), new Date(2019, 7, 1)]);
  });

  it('partialUpdate should be false', () => {
    wrapper = mount(CalendarRange, {
      props: {
        partialUpdate: true,
      },
    });
    const panels = wrapper.findAllComponents(CalendarPanel);
    const startPanel = panels[0];
    const endPanel = panels[1];
    expect(startPanel.vm.partialUpdate).toBe(false);
    expect(endPanel.vm.partialUpdate).toBe(false);
  });

  it('supports defaultValue is Array', () => {
    wrapper = mount(CalendarRange, {
      props: {
        defaultValue: [new Date(2019, 9, 1), new Date(2019, 11, 1)],
      },
    });
    const panels = wrapper.findAllComponents(CalendarPanel);
    const startPanel = panels[0];
    const endPanel = panels[1];
    expect(startPanel.vm.calendarMonth).toBe(9);
    expect(endPanel.vm.calendarMonth).toBe(11);
  });
});
