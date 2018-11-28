import Languages from '@/locale/languages'

const defaultLang = Languages.zh

export default {
  methods: {
    t (path) {
      let component = this
      let name = component.$options.name
      while (component && (!name || name !== 'DatePicker')) {
        component = component.$parent
        if (component) {
          name = component.$options.name
        }
      }
      const lang = (component && component.language) || defaultLang
      const arr = path.split('.')
      let current = lang
      let value
      for (let i = 0, len = arr.length; i < len; i++) {
        const prop = arr[i]
        value = current[prop]
        if (i === len - 1) {
          return value
        }
        if (!value) {
          return ''
        }
        current = value
      }
      return ''
    }
  }
}
