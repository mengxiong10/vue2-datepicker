
export default {
  bind (el, binding, vnode) {
    el['@clickoutside'] = e => {
      if (
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
