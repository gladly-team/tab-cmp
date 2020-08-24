let debugEnabled = false
let onErrorCallbackFn = () => {}

const prefix = [
  '%ctab-cmp',
  'background: #7c7c7c; color: #fff; border-radius: 2px; padding: 2px 6px',
]

export const setUpLogger = ({ debug, onErrorCallback }) => {
  debugEnabled = debug
  if (typeof onErrorCallback === 'function') {
    onErrorCallbackFn = onErrorCallback
  }
}

export const logDebugging = (...args) => {
  if (debugEnabled) {
    // eslint-disable-next-line no-console
    console.log.apply(this, [...prefix, ...args])
  }
}

export const logError = (err) => {
  // eslint-disable-next-line no-console
  console.error(...prefix, err)
  onErrorCallbackFn(err)
}
