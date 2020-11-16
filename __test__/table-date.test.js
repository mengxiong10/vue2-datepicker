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
        calendar: new Date(2019, 9, 1, 0, 0, 0),
        titleFormat: 'DD/MM/YYYY',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
