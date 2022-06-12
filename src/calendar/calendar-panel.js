import {
  getValidDate,
  isValidDate,
  createDate,
  setMonth,
  startOfYear,
  startOfMonth,
  startOfDay,
} from '../util/date';
import TableDate from './table-date';
import TableMonth from './table-month';
import TableYear from './table-year';

export default {
  name: 'CalendarPanel',
  inject: {
    prefixClass: {
      default: 'mx',
    },
    dispatchDatePicker: {
      default: () => () => {},
    },
  },
  props: {
    value: {},
    defaultValue: {
      default() {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
      },
    },
    defaultPanel: {
      type: String,
    },
    disabledCalendarChanger: {
      type: Function,
      default: () => false,
    },
    disabledDate: {
      type: Function,
      default: () => false,
    },
    type: {
      type: String,
      default: 'date',
    },
    getClasses: {
      type: Function,
      default: () => [],
    },
    showWeekNumber: {
      type: Boolean,
      default: undefined,
    },
    getYearPanel: {
      type: Function,
    },
    titleFormat: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    calendar: Date,
    // update date when select year or month
    partialUpdate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const panels = ['date', 'month', 'year'];
    const index = Math.max(panels.indexOf(this.type), panels.indexOf(this.defaultPanel));
    const panel = index !== -1 ? panels[index] : 'date';
    return {
      panel,
      innerCalendar: new Date(),
    };
  },
  computed: {
    innerValue() {
      const value = Array.isArray(this.value) ? this.value : [this.value];
      const map = {
        year: startOfYear,
        month: startOfMonth,
        date: startOfDay,
      };
      const start = map[this.type] || map.date;
      return value.filter(isValidDate).map(v => start(v));
    },
    calendarYear() {
      return this.innerCalendar.getFullYear();
    },
    calendarMonth() {
      return this.innerCalendar.getMonth();
    },
  },
  watch: {
    value: {
      immediate: true,
      handler: 'initCalendar',
    },
    calendar: {
      handler: 'initCalendar',
    },
    defaultValue: {
      handler: 'initCalendar',
    },
  },
  methods: {
    initCalendar() {
      let calendarDate = this.calendar;
      if (!isValidDate(calendarDate)) {
        const { length } = this.innerValue;
        calendarDate = getValidDate(length > 0 ? this.innerValue[length - 1] : this.defaultValue);
      }
      this.innerCalendar = startOfMonth(calendarDate);
    },
    isDisabled(date) {
      return this.disabledDate(new Date(date), this.innerValue);
    },
    emitDate(date, type) {
      if (!this.isDisabled(date)) {
        this.$emit('select', date, type, this.innerValue);
        // someone need get the first selected date to set range value. (#429)
        this.dispatchDatePicker('pick', date, type);
      }
    },
    handleCalendarChange(calendar, type) {
      const oldCalendar = new Date(this.innerCalendar);
      this.innerCalendar = calendar;
      this.$emit('update:calendar', calendar);
      this.dispatchDatePicker('calendar-change', calendar, oldCalendar, type);
    },
    handelPanelChange(panel) {
      const oldPanel = this.panel;
      this.panel = panel;
      this.dispatchDatePicker('panel-change', panel, oldPanel);
    },
    handleSelectYear(year) {
      if (this.type === 'year') {
        const date = this.getYearCellDate(year);
        this.emitDate(date, 'year');
      } else {
        this.handleCalendarChange(createDate(year, this.calendarMonth), 'year');
        this.handelPanelChange('month');
        if (this.partialUpdate && this.innerValue.length === 1) {
          const date = new Date(this.innerValue[0]);
          date.setFullYear(year);
          this.emitDate(date, 'year');
        }
      }
    },
    handleSelectMonth(month) {
      if (this.type === 'month') {
        const date = this.getMonthCellDate(month);
        this.emitDate(date, 'month');
      } else {
        this.handleCalendarChange(createDate(this.calendarYear, month), 'month');
        this.handelPanelChange('date');
        if (this.partialUpdate && this.innerValue.length === 1) {
          const date = new Date(this.innerValue[0]);
          date.setFullYear(this.calendarYear);
          this.emitDate(setMonth(date, month), 'month');
        }
      }
    },
    handleSelectDate(date) {
      this.emitDate(date, this.type === 'week' ? 'week' : 'date');
    },
    getMonthCellDate(month) {
      return createDate(this.calendarYear, month);
    },
    getYearCellDate(year) {
      return createDate(year, 0);
    },
    getDateClasses(cellDate) {
      const notCurrentMonth = cellDate.getMonth() !== this.calendarMonth;
      const classes = [];
      if (cellDate.getTime() === new Date().setHours(0, 0, 0, 0)) {
        classes.push('today');
      }
      if (notCurrentMonth) {
        classes.push('not-current-month');
      }
      const state = this.getStateClass(cellDate);
      if (!(state === 'active' && notCurrentMonth)) {
        classes.push(state);
      }
      return classes.concat(this.getClasses(cellDate, this.innerValue, classes.join(' ')));
    },
    getMonthClasses(month) {
      const classes = [];
      if (this.type !== 'month') {
        if (this.calendarMonth === month) {
          classes.push('active');
        }
        const cellDate = this.getMonthCellDate(month);
        if (this.disabledCalendarChanger(cellDate, 'month')) {
          classes.push('disabled');
        }
        return classes;
      }
      const cellDate = this.getMonthCellDate(month);
      classes.push(this.getStateClass(cellDate));
      return classes.concat(this.getClasses(cellDate, this.innerValue, classes.join(' ')));
    },
    getYearClasses(year) {
      const classes = [];
      if (this.type !== 'year') {
        if (this.calendarYear === year) {
          classes.push('active');
        }
        const cellDate = this.getYearCellDate(year);
        if (this.disabledCalendarChanger(cellDate, 'year')) {
          classes.push('disabled');
        }
        return classes;
      }
      const cellDate = this.getYearCellDate(year);
      classes.push(this.getStateClass(cellDate));
      return classes.concat(this.getClasses(cellDate, this.innerValue, classes.join(' ')));
    },
    getStateClass(cellDate) {
      if (this.isDisabled(cellDate)) {
        return 'disabled';
      }
      if (this.innerValue.some(v => v.getTime() === cellDate.getTime())) {
        return 'active';
      }
      return '';
    },
    getWeekState(row) {
      if (this.type !== 'week') return '';
      const start = row[0].getTime();
      const end = row[6].getTime();
      const active = this.innerValue.some(v => {
        const time = v.getTime();
        return time >= start && time <= end;
      });
      return active ? `${this.prefixClass}-active-week` : '';
    },
  },
  render() {
    const { panel, innerCalendar } = this;
    if (panel === 'year') {
      return (
        <TableYear
          disabledCalendarChanger={this.disabledCalendarChanger}
          calendar={innerCalendar}
          getCellClasses={this.getYearClasses}
          getYearPanel={this.getYearPanel}
          onSelect={this.handleSelectYear}
          onChangecalendar={this.handleCalendarChange}
        />
      );
    }
    if (panel === 'month') {
      return (
        <TableMonth
          disabledCalendarChanger={this.disabledCalendarChanger}
          calendar={innerCalendar}
          getCellClasses={this.getMonthClasses}
          onSelect={this.handleSelectMonth}
          onChangepanel={this.handelPanelChange}
          onChangecalendar={this.handleCalendarChange}
        />
      );
    }
    return (
      <TableDate
        disabledCalendarChanger={this.disabledCalendarChanger}
        class={{ [`${this.prefixClass}-calendar-week-mode`]: this.type === 'week' }}
        calendar={innerCalendar}
        getCellClasses={this.getDateClasses}
        getRowClasses={this.getWeekState}
        titleFormat={this.titleFormat}
        showWeekNumber={
          typeof this.showWeekNumber === 'boolean' ? this.showWeekNumber : this.type === 'week'
        }
        onSelect={this.handleSelectDate}
        onChangepanel={this.handelPanelChange}
        onChangecalendar={this.handleCalendarChange}
      />
    );
  },
};
