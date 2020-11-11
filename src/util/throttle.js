/* istanbul ignore file */
export function rafThrottle(fn) {
  let isRunning = false;
  return function fnBinfRaf(...args) {
    if (isRunning) return;
    isRunning = true;
    requestAnimationFrame(() => {
      isRunning = false;
      fn.apply(this, args);
    });
  };
}
