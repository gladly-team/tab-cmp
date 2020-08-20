/* eslint no-console:0 */

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  // Reset console mocks.
  // eslint-disable-next-line no-console
  if (console.log.mockRestore) {
    // eslint-disable-next-line no-console
    console.log.mockRestore()
  }

  jest.resetModules()
  jest.clearAllMocks()
})

describe('logger: setUpLogger', () => {
  it('does not throw', () => {
    expect.assertions(1)
    const { setUpLogger } = require('src/logger')
    expect(() => {
      setUpLogger({
        debug: true,
        onErrorCallback: () => {},
      })
    }).not.toThrow()
  })
})

describe('logger: logDebugging', () => {
  it('logs to console when debug is enabled', () => {
    const mockConsoleLog = jest.fn()
    console.log.mockImplementation(mockConsoleLog)
    expect.assertions(1)
    const { logDebugging, setUpLogger } = require('src/logger')
    setUpLogger({
      debug: true,
    })
    logDebugging('something here')
    expect(console.log).toHaveBeenCalledWith(
      '[tab-cmp] [debug]:',
      'something here'
    )
  })

  it('does not log to console when debug is not enabled', () => {
    const mockConsoleLog = jest.fn()
    console.log.mockImplementation(mockConsoleLog)
    expect.assertions(1)
    const { logDebugging, setUpLogger } = require('src/logger')
    setUpLogger({
      debug: false,
    })
    logDebugging('something here')
    expect(console.log).not.toHaveBeenCalled()
  })

  it('logs multiple arguments to console when debug is enabled', () => {
    const mockConsoleLog = jest.fn()
    console.log.mockImplementation(mockConsoleLog)
    expect.assertions(1)
    const { logDebugging, setUpLogger } = require('src/logger')
    setUpLogger({
      debug: true,
    })
    logDebugging('something here', { a: 123 }, 'more info here')
    expect(console.log).toHaveBeenCalledWith(
      '[tab-cmp] [debug]:',
      'something here',
      { a: 123 },
      'more info here'
    )
  })
})

describe('logger: logError', () => {
  it('does not throw when calling logError and no callback has been set', () => {
    const mockConsoleLog = jest.fn()
    console.log.mockImplementation(mockConsoleLog)
    expect.assertions(1)
    const { logError, setUpLogger } = require('src/logger')
    setUpLogger({
      onErrorCallback: undefined, // no callback set
    })
    const mockErr = new Error('Uh oh!')
    expect(() => {
      logError(mockErr)
    }).not.toThrow()
  })

  it('calls the onError callback when logError is called', () => {
    const mockConsoleLog = jest.fn()
    console.log.mockImplementation(mockConsoleLog)
    expect.assertions(1)
    const { logError, setUpLogger } = require('src/logger')
    const onErrCallback = jest.fn()
    setUpLogger({
      onErrorCallback: onErrCallback,
    })
    const mockErr = new Error('Uh oh!')
    logError(mockErr)
    expect(onErrCallback).toHaveBeenCalledWith(mockErr)
  })
})
