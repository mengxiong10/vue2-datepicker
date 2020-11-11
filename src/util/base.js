/**
 * chunk the array
 * @param {Array} arr
 * @param {Number} size
 */
export function chunk(arr, size) {
  if (!Array.isArray(arr)) {
    return [];
  }
  const result = [];
  const len = arr.length;
  let i = 0;
  size = size || len;
  while (i < len) {
    result.push(arr.slice(i, (i += size)));
  }
  return result;
}

/**
 * isObject
 * @param {*} obj
 * @returns {Boolean}
 */
export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * pick object
 * @param {Object} obj
 * @param {Array|String} props
 */
export function pick(obj, props) {
  if (!isObject(obj)) return {};
  if (!Array.isArray(props)) {
    props = [props];
  }
  const res = {};
  props.forEach(prop => {
    if (prop in obj) {
      res[prop] = obj[prop];
    }
  });
  return res;
}

/**
 * deep merge two object without merging array
 * @param {object} target
 * @param {object} source
 */
export function mergeDeep(target, source) {
  if (!isObject(target)) {
    return {};
  }
  let result = target;
  if (isObject(source)) {
    Object.keys(source).forEach(key => {
      let value = source[key];
      if (isObject(value) && isObject(target[key])) {
        value = mergeDeep(target[key], value);
      }
      result = { ...result, [key]: value };
    });
  }
  return result;
}
