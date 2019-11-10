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
        decade: 2010,
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
