beforeEach(() => {
  window.__uspapi = jest.fn()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('setDefaultUSPData', () => {
  it('does not error if window.__uspapi is undefined', () => {
    expect.assertions(1)
    delete window.__uspapi
    const setDefaultUSPData = require('src/setDefaultUSPData').default
    expect(() => {
      setDefaultUSPData()
    }).not.toThrow()
  })
})
