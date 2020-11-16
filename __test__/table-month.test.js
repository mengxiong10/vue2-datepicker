import { mount } from '@vue/test-utils';
import TableMonth from '../src/calendar/table-month.vue';

let wrapper;

afterEach(() => {
  wrapper.destroy();
});

describe('TableMonth', () => {
  it('correct render', () => {
    wrapper = mount(TableMonth, {
      propsData: {
        calendar: new Date(2019, 9, 1, 0, 0, 0),
        getCellClasses: month => {
          if (month === 9) {
            return 'active';
          }
          return '';
        },
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
