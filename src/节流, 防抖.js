/**
 * @param callback
 * @param delay
 * @return {function(...[*]=)}
 */
function debounce(callback, delay) {
  let timeout = null;
  return function (...args) {
    const context = this;
    if (timeout !== null) clearTimeout(delay);
    timeout = setTimeout(() => {
      callback.apply(context, args);
    }, delay);
  };
}

/**
 * @param callback
 * @param threshhold
 * @return {function(...[*]=)}
 */
function throttle(callback, threshhold) {
  let timeout = null;
  // 保证第一次就会被调用
  let lastTime = 0;
  return function (...args) {
    let curr = new Date().getTime();
    const context = this;
    if (timeout !== null) clearTimeout(timeout);
    if (curr - lastTime >= threshhold) {
      callback.apply(context, args);
      lastTime = curr;
    } else {
      timeout = setTimeout(() => {
        callback.apply(context, args);
      }, threshhold);
    }
  };
}
