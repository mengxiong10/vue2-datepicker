export function formatDate(date, fmt = 'YYYY-MM-DD hh:mm:ss') {
  date = date instanceof Date ? date : new Date(date)
  const map = {
    'M+': date.getMonth() + 1, // 月份
    '[Dd]+': date.getDate(), // 日
    '[Hh]+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds(), // 毫秒
  }
  fmt = fmt.replace(/[Yy]+/g, function (str) {
    return ('' + date.getFullYear()).slice(4 - str.length)
  })
  Object.keys(map).forEach((key) => {
    fmt = fmt.replace(new RegExp(key), function (str) {
      const value = '' + map[key]
      return str.length === 1 ? value : ('00' + value).slice(value.length)
    })
  })
  return fmt
}