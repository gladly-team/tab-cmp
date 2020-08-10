const localStorageMgr = {}

localStorageMgr.setItem = (key, value) => {
  try {
    window.localStorage.setItem(key, value)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[tab-cmp] localStorage not supported.', e)
  }
}

localStorageMgr.getItem = (key) => {
  try {
    const value = window.localStorage.getItem(key)
    return value
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[tab-cmp] localStorage not supported.', e)
    return null
  }
}

localStorageMgr.removeItem = (key) => {
  try {
    window.localStorage.removeItem(key)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[tab-cmp] localStorage not supported.', e)
  }
}

export default localStorageMgr
