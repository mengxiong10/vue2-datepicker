import CalendarPanel from '../calendar/calendar-panel';
import TimePanel from '../time/time-panel.vue';
import { isValidDate } from '../util/date';
import { pick } from '../util/base';

export default {
  name: 'DatetimePanel',
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
      const time = isValidDate(this.value) ? this.value : new Date(this.defaultValue);
      const datetime = new Date(date);
      datetime.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
      if (this.disabledTime(new Date(datetime))) {
        this.currentValue = date;
      } else {
        this.emitDate(datetime, type);
      }
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
    return (
      <div>
        <CalendarPanel {...calendarProps} />
        {this.timeVisible && <TimePanel class="mx-calendar-time" {...timeProps} />}
      </div>
    );
  },
};
