import { mount } from '@vue/test-utils';
import TableYear from '../src/calendar/table-year.vue';

let wrapper;

afterEach(() => {
  wrapper.destroy();
});

describe('TableYear', () => {
  it('decade=2010', () => {
    wrapper = mount(TableYear, {
      propsData: {
        calendar: new Date(2019, 9, 1, 0, 0, 0),
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
