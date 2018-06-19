import locale from '@/mixins/locale'

export default {
  name: 'panelMonth',
  mixins: [locale],
  props: {
    value: null,
    calendarYear: {
      default: new Date().getFullYear()
    }
  },
  methods: {
    selectMonth (month) {
      this.$emit('select', month)
    }
  },
  render (h) {
    let months = this.t('months')
    const currentYear = this.value && new Date(this.value).getFullYear()
    const currentMonth = this.value && new Date(this.value).getMonth()
    months = months.map((v, i) => {
      return <span
        class={{
          'cell': true,
          'actived': currentYear === this.calendarYear && currentMonth === i
        }}
        onClick={this.selectMonth.bind(this, i)}>
        {v}
      </span>
    })
    return <div class="mx-panel mx-panel-month">{months}</div>
  }
}
