export default {
  name: 'panelYear',
  props: {
    value: null,
    firstYear: Number
  },
  methods: {
    selectYear (year) {
      this.$emit('select', year)
    }
  },
  render (h) {
    // 当前年代
    const firstYear = Math.floor(this.firstYear / 10) * 10
    const currentYear = this.value && new Date(this.value).getFullYear()
    const years = Array.apply(null, { length: 10 }).map((_, i) => {
      const year = firstYear + i
      return <span
        class={{
          'cell': true,
          'actived': currentYear === year
        }}
        onClick={this.selectYear.bind(this, year)}
      >{year}</span>
    })
    return <div class="mx-panel mx-panel-year">{years}</div>
  }
}
