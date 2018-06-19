
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
      if (component && component.language) {
        const arr = path.split('.')
        let current = component.language
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
      }
      return ''
    }
  }
}
