import { mount } from '@vue/test-utils';
import TimeRange from '../src/time/time-range';

let wrapper;

afterEach(() => {
  wrapper.destroy();
});

describe('TimeRange', () => {
  it('render: correct classes of the columns', () => {
    wrapper = mount(TimeRange, {
      propsData: {
        format: 'hh:mm a',
        minuteStep: 30,
        hourStep: 2,
        value: [new Date(2019, 9, 4, 8, 30, 0), new Date(2019, 9, 4, 18, 30, 0)],
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('feat: change the end time when start > end', () => {
    wrapper = mount(TimeRange, {
      propsData: {
        value: [new Date(2019, 9, 4, 8, 30, 0), new Date(2019, 9, 4, 18, 30, 0)],
      },
    });
    const hour = wrapper.find('[data-type=hour] li:nth-child(20)');
    hour.trigger('click');
    expect(wrapper.emitted().select[0][0]).toEqual([
      new Date(2019, 9, 4, 19, 30, 0),
      new Date(2019, 9, 4, 19, 30, 0),
    ]);
  });
});
