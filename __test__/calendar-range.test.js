import { mount } from '@vue/test-utils';
import { parse } from 'date-fns';
import CalendarRange from '../src/calendar/calendar-range';
import CalendarPanel from '../src/calendar/calendar-panel';

let wrapper;

afterEach(() => {
  wrapper.destroy();
});

describe('CalendarRange', () => {
  it('feat: correct classes', () => {
    const start = new Date(2019, 9, 30);
    const end = new Date(2019, 10, 2);
    wrapper = mount(CalendarRange, {
      propsData: {
        value: [start, end],
      },
    });
    const tds = wrapper.findAll('.mx-table-date td');

    for (let i = 0; i < tds.length; i++) {
      const td = tds.at(i);
      const { title } = td.element;
      const cell = parse(title, 'yyyy-MM-dd', new Date()).getTime();
      if (cell > start.getTime() && cell < end.getTime()) {
        expect(td.classes()).toContain('in-range');
      } else {
        expect(td.classes()).not.toContain('hover-in-range');
      }
    }
  });

  it('feat: click range', async () => {
    wrapper = mount(CalendarRange, {
      propsData: {
        defaultValue: new Date(2019, 9, 1),
      },
    });
    expect(wrapper.vm.calendars).toEqual([new Date(2019, 9, 1), new Date(2019, 10, 1)]);
    const tds = wrapper.findAll('.mx-table-date td');
    await tds.at(2).trigger('click');
    expect(wrapper.emitted().select).toBeUndefined();
    await tds.at(8).trigger('click');
    expect(wrapper.emitted().select[0][0]).toEqual([new Date(2019, 9, 1), new Date(2019, 9, 7)]);
  });

  it('feat: calendars min gap', async () => {
    wrapper = mount(CalendarRange, {
      propsData: {
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
      propsData: {
        partialUpdate: true,
      },
    });
    const panels = wrapper.findAllComponents(CalendarPanel);
    const startPanel = panels.at(0);
    const endPanel = panels.at(1);
    expect(startPanel.vm.partialUpdate).toBe(false);
    expect(endPanel.vm.partialUpdate).toBe(false);
  });

  it('supports defaultValue is Array', () => {
    wrapper = mount(CalendarRange, {
      propsData: {
        defaultValue: [new Date(2019, 9, 1), new Date(2019, 11, 1)],
      },
    });
    const panels = wrapper.findAllComponents(CalendarPanel);
    const startPanel = panels.at(0);
    const endPanel = panels.at(1);
    expect(startPanel.vm.calendarMonth).toBe(9);
    expect(endPanel.vm.calendarMonth).toBe(11);
  });

  it('feat: hover range', async () => {
    wrapper = mount(CalendarRange, {
      propsData: {
        defaultValue: new Date(2019, 9, 1),
      },
    });
    const tds = wrapper.findAll('.mx-table-date td');
    await tds.at(10).trigger('click');
    await tds.at(60).trigger('mouseenter');

    for (let i = 0; i < tds.length; i++) {
      if (i > 10 && i < 60) {
        expect(tds.at(i).classes()).toContain('hover-in-range');
      } else {
        expect(tds.at(i).classes()).not.toContain('hover-in-range');
      }
    }

    await tds.at(60).trigger('click');

    // hover to back
    await tds.at(60).trigger('click');
    await tds.at(10).trigger('mouseenter');

    for (let i = 0; i < tds.length; i++) {
      if (i > 10 && i < 60) {
        expect(tds.at(i).classes()).toContain('hover-in-range');
      } else {
        expect(tds.at(i).classes()).not.toContain('hover-in-range');
      }
    }
  });
});
