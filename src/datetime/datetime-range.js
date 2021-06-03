import CalendarRange from '../calendar/calendar-range';
import TimeRange from '../time/time-range';
import { pick } from '../util/base';
import { isValidRangeDate, assignTime } from '../util/date';

export default {
  name: 'DatetimeRange',
  inject: {
    prefixClass: {
      default: 'mx',
    },
  },
  emits: ['select', 'update:show-time-panel'],
  props: {
    ...CalendarRange.props,
    ...TimeRange.props,
    showTimePanel: {
      type: Boolean,
      default: undefined,
    },
  },
  data() {
    return {
      defaultTimeVisible: false,
      currentValue: this.value,
    };
  },
  computed: {
    timeVisible() {
      return typeof this.showTimePanel === 'boolean' ? this.showTimePanel : this.defaultTimeVisible;
    },
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
  },
  methods: {
    closeTimePanel() {
      this.defaultTimeVisible = false;
      this.$emit('update:show-time-panel', false);
    },
    openTimePanel() {
      this.defaultTimeVisible = true;
      this.$emit('update:show-time-panel', true);
    },
    emitDate(dates, type) {
      this.$emit('select', dates, type);
    },
    handleSelect(dates, type) {
      if (type === 'date') {
        this.openTimePanel();
      }
      const defaultValues = Array.isArray(this.defaultValue)
        ? this.defaultValue
        : [this.defaultValue, this.defaultValue];
      let datetimes = dates.map((date, i) => {
        const time = isValidRangeDate(this.value) ? this.value[i] : defaultValues[i];
        return assignTime(date, time);
      });
      if (datetimes[1].getTime() < datetimes[0].getTime()) {
        datetimes = [datetimes[0], datetimes[0]];
      }
      if (datetimes.some(this.disabledTime)) {
        datetimes = dates.map((date, i) => assignTime(date, defaultValues[i]));
        if (datetimes.some(this.disabledTime)) {
          this.currentValue = datetimes;
          return;
        }
      }
      this.emitDate(datetimes, type);
    },
  },
  render() {
    const calendarProps = {
      props: {
        ...pick(this.$props, Object.keys(CalendarRange.props)),
        type: 'date',
        value: this.currentValue,
      },
      on: {
        select: this.handleSelect,
      },
    };
    const timeProps = {
      props: {
        ...pick(this.$props, Object.keys(TimeRange.props)),
        value: this.currentValue,
        showTimeHeader: true,
      },
      on: {
        select: this.emitDate,
        clicktitle: this.closeTimePanel,
      },
    };

    const { prefixClass } = this;

    return (
      <div>
        <CalendarRange {...calendarProps} />
        {this.timeVisible && <TimeRange class={`${prefixClass}-calendar-time`} {...timeProps} />}
      </div>
    );
  },
};
