export default {
  bind (el, binding, vnode) {
    el['@clickoutside'] = e => {
      let prevent = false
      if (vnode.context.clickOutsideMode === 'allExceptDatePickers') {
        let pickers = Array.from(document.querySelectorAll('div.mx-datepicker'))

        let index
        if ((index = pickers.indexOf(el)) > -1) pickers.splice(index, 1)

        prevent = pickers.some(p => p.contains(e.target))
      }

      if (
        !prevent &&
        !el.contains(e.target) &&
        !(vnode.context.popupElm && vnode.context.popupElm.contains(e.target)) &&
        binding.expression &&
        vnode.context[binding.expression]
      ) {
        binding.value()
      }
    }
    document.addEventListener('click', el['@clickoutside'], false)
  },
  unbind (el) {
    document.removeEventListener('click', el['@clickoutside'], false)
  }
}
