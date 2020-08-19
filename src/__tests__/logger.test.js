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
    const mockConsoleLog = jest.fn()
    console.log.mockImplementation(mockConsoleLog)
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
