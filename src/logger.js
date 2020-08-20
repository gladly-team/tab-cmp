let debugEnabled = false
let onErrorCallbackFn = () => {}

export const setUpLogger = ({ debug, onErrorCallback }) => {
  debugEnabled = debug
  if (typeof onErrorCallback === 'function') {
    onErrorCallbackFn = onErrorCallback
  }
}

export const logDebugging = (...args) => {
  if (debugEnabled) {
    // eslint-disable-next-line no-console
    console.log.apply(this, [`[tab-cmp] [debug]:`, ...args])
  }
}

export const logError = (err) => {
  onErrorCallbackFn(err)
}
