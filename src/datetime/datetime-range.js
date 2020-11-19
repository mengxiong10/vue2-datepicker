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
  props: {
    ...CalendarRange.props,
    ...TimeRange.props,
    showTimePanel: {
      type: Boolean,
      default: undefined,
    },
  },
  emits: ['select', 'update:showTimePanel'],
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
    defaultTimeVisible(val) {
      this.$emit('update:showTimePanel', val);
    },
  },
  methods: {
    closeTimePanel() {
      this.defaultTimeVisible = false;
    },
    openTimePanel() {
      this.defaultTimeVisible = true;
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
      ...pick(this.$props, Object.keys(CalendarRange.props)),
      type: 'date',
      value: this.currentValue,
      onSelect: this.handleSelect,
    };
    const timeProps = {
      ...pick(this.$props, Object.keys(TimeRange.props)),
      value: this.currentValue,
      showTimeHeader: true,
      onSelect: this.emitDate,
      onClicktitle: this.closeTimePanel,
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
