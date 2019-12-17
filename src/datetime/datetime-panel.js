import CalendarPanel from '../calendar/calendar-panel';
import TimePanel from '../time/time-panel.vue';
import { assignTime, getValidDate } from '../util/date';
import { pick } from '../util/base';

export default {
  name: 'DatetimePanel',
  inject: {
    prefixClass: {
      default: 'mx',
    },
  },
  props: {
    ...CalendarPanel.props,
    ...TimePanel.props,
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
    },
    openTimePanel() {
      this.defaultTimeVisible = true;
    },
    emitDate(date, type) {
      this.$emit('select', date, type);
    },
    handleSelect(date, type) {
      if (type === 'date') {
        this.openTimePanel();
      }
      let datetime = assignTime(date, getValidDate(this.value, this.defaultValue));
      if (this.disabledTime(new Date(datetime))) {
        // set the time of defalutValue;
        datetime = assignTime(date, this.defaultValue);
        if (this.disabledTime(new Date(datetime))) {
          // if disabled don't emit date
          this.currentValue = datetime;
          return;
        }
      }
      this.emitDate(datetime, type);
    },
  },
  render() {
    const calendarProps = {
      props: {
        ...pick(this, Object.keys(CalendarPanel.props)),
        type: 'date',
        value: this.currentValue,
      },
      on: {
        select: this.handleSelect,
      },
    };
    const timeProps = {
      props: {
        ...pick(this, Object.keys(TimePanel.props)),
        showTimeHeader: true,
        value: this.currentValue,
      },
      on: {
        select: this.emitDate,
        'title-click': this.closeTimePanel,
      },
    };

    const { prefixClass } = this;

    return (
      <div>
        <CalendarPanel {...calendarProps} />
        {this.timeVisible && <TimePanel class={`${prefixClass}-calendar-time`} {...timeProps} />}
      </div>
    );
  },
};
