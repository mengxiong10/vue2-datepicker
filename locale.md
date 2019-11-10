```js
{
  // the locale of formatting and parsing function
  formatLocale: {
    // MMMM
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    // MMM
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    // dddd
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    // ddd
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    // dd
    weekdaysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    // first day of week
    firstDayOfWeek: 0,
    // first week contains January 1st.
    firstWeekContainsDate: 1,
    // format 'a', 'A'
    meridiem: (h: number, _: number, isLowercase: boolean) {
      const word = h < 12 ? 'AM' : 'PM';
      return isLowercase ? word.toLocaleLowerCase() : word;
    },
    // parse ampm
    meridiemParse: /[ap]\.?m?\.?/i;
    // parse ampm
    isPM: (input: string) {
      return `${input}`.toLowerCase().charAt(0) === 'p';
    }
  },
  // the calendar header, default formatLocale.weekdaysMin
  days: [],
  // the calendar months, default formatLocale.monthsShort
  months: [],
  // the calendar title of year
  yearFormat: 'YYYY 年',
  // the calendar title of month
  monthFormat: 'MMM',
  // the calendar title of month before year
  monthBeforeYear: false,
}
```
