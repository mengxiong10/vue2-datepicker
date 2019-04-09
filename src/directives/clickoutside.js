let mouseDownTarget

const handleMouseDown = evt => (mouseDownTarget = evt.target)

export default {
  bind (el, binding, vnode) {
    el['@clickoutside'] = e => {
      const mouseUpTarget = e.target
      const popupElm = vnode && vnode.context && vnode.context.popupElm
      if (
        mouseDownTarget &&
        mouseUpTarget &&
        !el.contains(mouseUpTarget) &&
        !el.contains(mouseDownTarget) &&
        !(
          popupElm &&
          (popupElm.contains(mouseDownTarget) ||
            popupElm.contains(mouseUpTarget))
        ) &&
        binding.expression &&
        vnode.context[binding.expression]
      ) {
        binding.value()
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', el['@clickoutside'])
  },
  unbind (el) {
    document.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('mouseup', el['@clickoutside'])
  }
}
