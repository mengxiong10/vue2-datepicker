import TimePanel from './time-panel';
import { isValidRangeDate } from '../util/date';

export default {
  name: 'TimeRange',
  inject: {
    prefixClass: {
      default: 'mx',
    },
  },
  props: {
    ...TimePanel.props,
  },
  data() {
    return {
      startValue: new Date(NaN),
      endValue: new Date(NaN),
    };
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        if (isValidRangeDate(this.value)) {
          const [startValue, endValue] = this.value;
          this.startValue = startValue;
          this.endValue = endValue;
        } else {
          this.startValue = new Date(NaN);
          this.endValue = new Date(NaN);
        }
      },
    },
  },
  methods: {
    emitChange(type, index) {
      const date = [this.startValue, this.endValue];
      this.$emit('select', date, type === 'time' ? 'time-range' : type, index);
    },
    handleSelectStart(date, type) {
      this.startValue = date;
      // check the NaN
      if (!(this.endValue.getTime() >= date.getTime())) {
        this.endValue = date;
      }
      this.emitChange(type, 0);
    },
    handleSelectEnd(date, type) {
      // check the NaN
      this.endValue = date;
      if (!(this.startValue.getTime() <= date.getTime())) {
        this.startValue = date;
      }
      this.emitChange(type, 1);
    },
    disabledStartTime(date) {
      return this.disabledTime(date, 0);
    },
    disabledEndTime(date) {
      return date.getTime() < this.startValue.getTime() || this.disabledTime(date, 1);
    },
  },
  render() {
    const defaultValues = Array.isArray(this.defaultValue)
      ? this.defaultValue
      : [this.defaultValue, this.defaultValue];

    const { prefixClass } = this;

    return (
      <div class={`${prefixClass}-range-wrapper`}>
        <TimePanel
          {...{
            props: {
              ...this.$props,
              value: this.startValue,
              defaultValue: defaultValues[0],
              disabledTime: this.disabledStartTime,
            },
            on: {
              ...this.$listeners,
              select: this.handleSelectStart,
            },
          }}
        />
        <TimePanel
          {...{
            props: {
              ...this.$props,
              value: this.endValue,
              defaultValue: defaultValues[1],
              disabledTime: this.disabledEndTime,
            },
            on: {
              ...this.$listeners,
              select: this.handleSelectEnd,
            },
          }}
        />
      </div>
    );
  },
};
