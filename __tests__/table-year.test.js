import { mount } from '@vue/test-utils';
import TableYear from '../src/calendar/table-year';

let wrapper;

afterEach(() => {
  wrapper.unmount();
});

describe('TableYear', () => {
  it('decade=2010', () => {
    wrapper = mount(TableYear, {
      props: {
        calendar: new Date(2019, 9, 1, 0, 0, 0),
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
