
export default {
  methods: {
    dispatch (componentName, eventName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.name

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.name
        }
      }
      if (name && name === componentName) {
        parent = parent || this
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    }
  }
}
