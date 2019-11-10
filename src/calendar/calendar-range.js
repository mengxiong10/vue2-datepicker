import { addMonths, subMonths, differenceInCalendarMonths } from 'date-fns';
import CalendarPanel from './calendar-panel';
import { getValidDate, isValidDate, isValidRangeDate } from '../util/date';

export default {
  components: { CalendarPanel },
  props: {
    ...CalendarPanel.props,
  },
  data() {
    return {
      innerValue: [],
      calendars: [],
    };
  },
  computed: {
    // Minimum difference between start and end calendars
    calendarMinDiff() {
      const map = {
        date: 1, // type:date  min 1 month
        month: 1 * 12, // type:month min 1 year
        year: 10 * 12, // type:year  min 10 year
      };
      return map[this.type] || map.date;
    },
    calendarMaxDiff() {
      return Infinity;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        this.innerValue = isValidRangeDate(this.value)
          ? this.value
          : [new Date(NaN), new Date(NaN)];
        this.calendars = this.innerValue.map(v => getValidDate(v, this.defaultValue));
        this.validateCalendars(1);
      },
    },
  },
  methods: {
    handleSelect(date, type) {
      const [startValue, endValue] = this.innerValue;
      if (isValidDate(startValue) && !isValidDate(endValue)) {
        if (startValue.getTime() > date.getTime()) {
          this.innerValue = [date, startValue];
        } else {
          this.innerValue = [startValue, date];
        }
        this.emitDate(this.innerValue, type);
      } else {
        this.innerValue = [date, new Date(NaN)];
      }
    },
    emitDate(dates, type) {
      this.$emit('select', dates, type);
    },
    updateStartCalendar(value) {
      this.calendars.splice(0, 1, value);
      this.validateCalendars(1);
    },
    updateEndCalendar(value) {
      this.calendars.splice(1, 1, value);
      this.validateCalendars(0);
    },
    validateCalendars(index) {
      const gap = this.getCalendarGap();
      if (gap) {
        let calendar = this.calendars[index];
        if (index === 0) {
          calendar = subMonths(calendar, gap);
        } else {
          calendar = addMonths(calendar, gap);
        }
        this.calendars.splice(index, 1, calendar);
      }
    },
    getCalendarGap() {
      const diff = differenceInCalendarMonths(this.calendars[1], this.calendars[0]);
      const min = this.calendarMinDiff;
      const max = this.calendarMaxDiff;
      if (diff < min) {
        return min - diff;
      }
      if (diff > max) {
        return max - diff;
      }
      return 0;
    },
    getRangeClasses(cellDate, currentDates, classes) {
      if (
        !/disabled|active|not-current-month/.test(classes) &&
        currentDates.length === 2 &&
        cellDate.getTime() > currentDates[0].getTime() &&
        cellDate.getTime() < currentDates[1].getTime()
      ) {
        return 'in-range';
      }
      return '';
    },
  },
  render() {
    const calendarRange = this.calendars.map((calendar, index) => {
      const props = {
        ...this.$props,
        calendar,
        value: this.innerValue,
        getClasses: this.getRangeClasses,
      };
      const on = {
        select: this.handleSelect,
        'update:calendar': index === 0 ? this.updateStartCalendar : this.updateEndCalendar,
      };
      return <calendar-panel {...{ props, on }}></calendar-panel>;
    });
    return <div class="mx-range-wrapper">{calendarRange}</div>;
  },
};
