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
    const tds = wrapper.findAll('.mx-table-date td');
    tds.at(0).trigger('click');
    expect(wrapper.emitted().select[0][0]).toEqual(new Date(2019, 8, 29));
  });

  it('feat: type = month, should emit event when click month', () => {
    wrapper = mount(CalendarPanel, {
      propsData: {
        type: 'month',
        defaultValue: new Date(2019, 9, 1),
      },
    });
    const tds = wrapper.findAll('.mx-table-month td > div');
    tds.at(0).trigger('click');
    expect(wrapper.emitted().select[0][0]).toEqual(new Date(2019, 0, 1));
  });

  it('feat: type = year, should emit event when click year', () => {
    wrapper = mount(CalendarPanel, {
      propsData: {
        type: 'year',
        defaultValue: new Date(2019, 9, 1),
      },
    });
    const tds = wrapper.findAll('.mx-table-year td > div');
    tds.at(0).trigger('click');
    expect(wrapper.emitted().select[0][0]).toEqual(new Date(2010, 0));
  });

  it('feat: active class', () => {
    wrapper = mount(CalendarPanel);
    const td = wrapper.find('.mx-table-date td:nth-child(6)');
    expect(td.classes()).not.toContain('active');
    wrapper.setProps({ value: new Date(2019, 9, 4) });
    expect(td.classes()).toContain('active');
  });

  const renderType = type => {
    it(`prop: type=${type}`, () => {
      wrapper = shallowMount(CalendarPanel, {
        propsData: {
          type,
          value: new Date(Date.UTC(2019, 9, 1, 10)),
        },
      });
      expect(wrapper.element).toMatchSnapshot();
    });
  };
  ['date', 'month', 'year'].forEach(renderType);

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

  it('feat: click prev/next month', () => {
    wrapper = shallowMount(CalendarPanel);

    const nextBtn = wrapper.find('.mx-btn-icon-right');
    const lastBtn = wrapper.find('.mx-btn-icon-left');
    const { vm } = wrapper;
    let count = 12;
    while (count--) {
      const oldYear = vm.calendarYear;
      const oldMonth = vm.calendarMonth;
      nextBtn.trigger('click');
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
      lastBtn.trigger('click');
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

  it('feat: click prev/next year', () => {
    wrapper = shallowMount(CalendarPanel, {
      propsData: {
        value: new Date(2018, 4, 5),
      },
    });
    const nextBtn = wrapper.find('.mx-btn-icon-double-right');
    const lastBtn = wrapper.find('.mx-btn-icon-double-left');
    const yearBtn = wrapper.find('.mx-btn-current-year');
    const { vm } = wrapper;
    const oldYear = vm.calendarYear;
    expect(oldYear).toBe(2018);
    nextBtn.trigger('click');
    let newYear = vm.calendarYear;
    expect(newYear).toBe(2019);
    lastBtn.trigger('click');
    newYear = vm.calendarYear;
    expect(newYear).toBe(oldYear);
    // 年视图测试
    yearBtn.trigger('click');
    expect(vm.panel).toBe('year');
    expect(vm.calendarDecade).toBe(2010);
    nextBtn.trigger('click');
    expect(vm.calendarDecade).toBe(2020);
    lastBtn.trigger('click');
    lastBtn.trigger('click');
    expect(vm.calendarDecade).toBe(2000);
  });
});
