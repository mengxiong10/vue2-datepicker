import { mount } from '@vue/test-utils';
import TableDate from '../src/calendar/table-date.vue';

let wrapper;

afterEach(() => {
  wrapper.destroy();
});

describe('TableDate', () => {
  it('corrent render', () => {
    wrapper = mount(TableDate, {
      propsData: {
        calendarYear: 2019,
        calendarMonth: 9,
        firstDayOfWeek: 1,
        titleFormat: 'DD/MM/YYYY',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
