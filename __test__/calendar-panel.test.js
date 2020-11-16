/* eslint-disable no-await-in-loop */
import { mount, shallowMount } from '@vue/test-utils';
import CalendarPanel from '../src/calendar/calendar-panel';

let wrapper;

afterEach(() => {
  wrapper.destroy();
});

describe('CalendarPanel', () => {
  it('feat: type = date, should emit select when click date', () => {
    wrapper = mount(CalendarPanel, {
      propsData: {
        value: new Date(2019, 9, 4),
      },
    });
    const td = wrapper.find('.mx-table-date td');
    td.trigger('click');
    expect(wrapper.emitted().select[0][0]).toEqual(new Date(2019, 8, 29));
  });

  it('feat: type = month, should emit event when click month', () => {
    wrapper = mount(CalendarPanel, {
      propsData: {
        type: 'month',
        defaultValue: new Date(2019, 9, 1),
      },
    });
    const td = wrapper.find('.mx-table-month td > div');
    td.trigger('click');
    expect(wrapper.emitted().select[0][0]).toEqual(new Date(2019, 0, 1));
  });

  it('feat: type = year, should emit event when click year', () => {
    wrapper = mount(CalendarPanel, {
      propsData: {
        type: 'year',
        defaultValue: new Date(2019, 9, 1),
      },
    });
    const td = wrapper.find('.mx-table-year td > div');
    td.trigger('click');
    expect(wrapper.emitted().select[0][0]).toEqual(new Date(2010, 0));
  });

  it('feat: when year >= 0 && year < 100, should be emit right', () => {
    wrapper = mount(CalendarPanel, {
      propsData: {
        type: 'year',
        defaultValue: new Date().setFullYear(11),
      },
    });
    const td = wrapper.find('.mx-table-year td > div');
    td.trigger('click');
    const expectedDate = new Date(10, 0).setFullYear(10);
    expect(wrapper.emitted().select[0][0].getTime()).toBe(expectedDate);
  });

  it('feat: active class', async () => {
    wrapper = mount(CalendarPanel);
    const td = wrapper.find('.mx-table-date td:nth-child(6)');
    expect(td.classes()).not.toContain('active');
    await wrapper.setProps({ value: new Date(2019, 9, 4) });
    expect(td.classes()).toContain('active');
  });

  it('feat: panel change', async () => {
    wrapper = mount(CalendarPanel);
    const { vm } = wrapper;
    await wrapper.find('.mx-btn-current-year').trigger('click');
    expect(vm.panel).toBe('year');
    await wrapper.find('.mx-table-year td > div').trigger('click');
    expect(vm.panel).toBe('month');
    await wrapper.find('.mx-table-month td > div').trigger('click');
    expect(vm.panel).toBe('date');
    await wrapper.find('.mx-btn-current-month').trigger('click');
    expect(vm.panel).toBe('month');
    await wrapper.find('.mx-calendar-header-label > button').trigger('click');
    expect(vm.panel).toBe('year');
  });

  it('feat: click prev/next month', async () => {
    wrapper = mount(CalendarPanel);

    const nextBtn = wrapper.find('.mx-btn-icon-right');
    const lastBtn = wrapper.find('.mx-btn-icon-left');
    const { vm } = wrapper;
    let count = 12;
    while (count--) {
      const oldYear = vm.calendarYear;
      const oldMonth = vm.calendarMonth;
      await nextBtn.trigger('click');
      const newYear = vm.calendarYear;
      const newMonth = vm.calendarMonth;
      if (oldMonth === 11) {
        expect(newMonth).toBe(0);
        expect(newYear).toBe(oldYear + 1);
      } else {
        expect(newMonth).toBe(oldMonth + 1);
        expect(newYear).toBe(oldYear);
      }
    }
    count = 12;
    while (count--) {
      const oldYear = vm.calendarYear;
      const oldMonth = vm.calendarMonth;
      await lastBtn.trigger('click');
      const newYear = vm.calendarYear;
      const newMonth = vm.calendarMonth;
      if (oldMonth === 0) {
        expect(newMonth).toBe(11);
        expect(newYear).toBe(oldYear - 1);
      } else {
        expect(newMonth).toBe(oldMonth - 1);
        expect(newYear).toBe(oldYear);
      }
    }
  });

  ['date', 'month'].forEach(type => {
    it(`feat: click prev/next year in ${type} panel`, async () => {
      wrapper = mount(CalendarPanel, {
        propsData: {
          value: new Date(2018, 4, 5),
          defaultPanel: type,
        },
      });
      const nextBtn = wrapper.find('.mx-btn-icon-double-right');
      const lastBtn = wrapper.find('.mx-btn-icon-double-left');
      const { vm } = wrapper;
      const oldYear = vm.calendarYear;
      expect(oldYear).toBe(2018);
      await nextBtn.trigger('click');
      let newYear = vm.calendarYear;
      expect(newYear).toBe(2019);
      await lastBtn.trigger('click');
      newYear = vm.calendarYear;
      expect(newYear).toBe(oldYear);
    });
  });

  it('feat: click prev/next decade', () => {
    wrapper = mount(CalendarPanel, {
      propsData: {
        value: new Date(2018, 4, 5),
        defaultPanel: 'year',
      },
    });
    const nextBtn = wrapper.find('.mx-btn-icon-double-right');
    const lastBtn = wrapper.find('.mx-btn-icon-double-left');
    nextBtn.trigger('click');
    expect(wrapper.vm.calendarYear).toBe(2028);
    lastBtn.trigger('click');
    lastBtn.trigger('click');
    expect(wrapper.vm.calendarYear).toBe(2008);
  });

  const renderType = type => {
    it(`prop: type=${type}`, () => {
      wrapper = shallowMount(CalendarPanel, {
        propsData: {
          type,
          value: new Date(2019, 9, 1, 10),
        },
      });
      expect(wrapper.vm.panel).toBe(type);
    });
  };
  ['date', 'month', 'year'].forEach(renderType);

  it('feat: select year to change the calendar', async () => {
    wrapper = mount(CalendarPanel, {
      propsData: {
        value: new Date(2018, 4, 5),
        defaultPanel: 'year',
      },
    });
    await wrapper.find('.mx-table-year td > div').trigger('click');
    expect(wrapper.vm.calendarYear).toBe(2010);
    await wrapper.find('.mx-table-month td > div').trigger('click');
    expect(wrapper.vm.calendarMonth).toBe(0);
  });

  it('prop: disabledDate', () => {
    const disabledDate = date => {
      return date < new Date(2019, 9, 1) || date > new Date(2019, 9, 20);
    };
    wrapper = mount(CalendarPanel, {
      propsData: {
        value: new Date(2019, 9, 4),
        disabledDate,
      },
    });
    const tds = wrapper.findAll('.mx-table-date td');
    for (let i = 0; i < 42; i++) {
      const td = tds.at(i);
      const classes = td.classes();
      if (i < 2 || i > 21) {
        expect(classes).toContain('disabled');
      } else {
        expect(classes).not.toContain('disabled');
      }
    }
    tds.at(1).trigger('click');
    expect(wrapper.emitted().select).toBeUndefined();
  });

  it('prop: partialUpdate', async () => {
    wrapper = mount(CalendarPanel, {
      propsData: {
        value: new Date(2019, 9, 4),
        partialUpdate: true,
        defaultPanel: 'year',
      },
    });
    wrapper
      .findAll('.mx-table-year td > div')
      .at(0)
      .trigger('click');
    expect(wrapper.emitted().select[0][0]).toEqual(new Date(2010, 9, 4));
    await wrapper.setProps({ value: new Date(2010, 9, 4) });
    wrapper.find('.mx-table-month td > div').trigger('click');
    expect(wrapper.emitted().select[1][0]).toEqual(new Date(2010, 0, 4));
  });

  it('prop: defaultPanel', () => {
    wrapper = mount(CalendarPanel, {
      propsData: {
        open: true,
        type: 'month',
        defaultPanel: 'year',
      },
    });
    expect(wrapper.vm.panel).toBe('year');
  });
});
