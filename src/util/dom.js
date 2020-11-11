/**
 * get the hidden element width, height
 * @param {HTMLElement} element dom
 */
export function getPopupElementSize(element) {
  const originalDisplay = element.style.display;
  const originalVisibility = element.style.visibility;
  element.style.display = 'block';
  element.style.visibility = 'hidden';
  const styles = window.getComputedStyle(element);
  const width =
    element.offsetWidth + parseInt(styles.marginLeft, 10) + parseInt(styles.marginRight, 10);
  const height =
    element.offsetHeight + parseInt(styles.marginTop, 10) + parseInt(styles.marginBottom, 10);
  element.style.display = originalDisplay;
  element.style.visibility = originalVisibility;
  return { width, height };
}

/**
 * get the popup position
 * @param {HTMLElement} el relative element
 * @param {Number} targetWidth target element's width
 * @param {Number} targetHeight target element's height
 * @param {Boolean} fixed
 */
export function getRelativePosition(el, targetWidth, targetHeight, fixed) {
  let left = 0;
  let top = 0;
  let offsetX = 0;
  let offsetY = 0;
  const relativeRect = el.getBoundingClientRect();
  const dw = document.documentElement.clientWidth;
  const dh = document.documentElement.clientHeight;
  if (fixed) {
    offsetX = window.pageXOffset + relativeRect.left;
    offsetY = window.pageYOffset + relativeRect.top;
  }
  if (dw - relativeRect.left < targetWidth && relativeRect.right < targetWidth) {
    left = offsetX - relativeRect.left + 1;
  } else if (relativeRect.left + relativeRect.width / 2 <= dw / 2) {
    left = offsetX;
  } else {
    left = offsetX + relativeRect.width - targetWidth;
  }
  if (relativeRect.top <= targetHeight && dh - relativeRect.bottom <= targetHeight) {
    top = offsetY + dh - relativeRect.top - targetHeight;
  } else if (relativeRect.top + relativeRect.height / 2 <= dh / 2) {
    top = offsetY + relativeRect.height;
  } else {
    top = offsetY - targetHeight;
  }
  return { left: `${left}px`, top: `${top}px` };
}

export function getScrollParent(node, until = document.body) {
  if (!node || node === until) {
    return null;
  }

  const style = (value, prop) => getComputedStyle(value, null).getPropertyValue(prop);

  const regex = /(auto|scroll)/;

  const scroll = regex.test(
    style(node, 'overflow') + style(node, 'overflow-y') + style(node, 'overflow-x')
  );

  return scroll ? node : getScrollParent(node.parentNode, until);
}
