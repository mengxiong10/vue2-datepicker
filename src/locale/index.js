import Languages from './languages'
import { isPlainObject } from '@/utils/index'

let lang = 'zh'

export function use (target) {
  if (isPlainObject(target)) {
    lang = { ...Languages.en, ...target }
  } else {
    lang = Languages[target] || Languages.en
  }
}

export function t (path) {
  const arr = path.split('.')
  let current = lang
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
  return ''
}
