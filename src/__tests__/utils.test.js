afterEach(() => {
  jest.clearAllMocks()
})

describe('utils: isNil', () => {
  test('returns true for undefined', () => {
    expect.assertions(1)
    const { isNil } = require('src/utils')
    expect(isNil()).toBe(true)
  })

  test('returns true for null', () => {
    expect.assertions(1)
    const { isNil } = require('src/utils')
    expect(isNil(null)).toBe(true)
  })

  test('returns false for zero', () => {
    expect.assertions(1)
    const { isNil } = require('src/utils')
    expect(isNil(0)).toBe(false)
  })

  test('returns false for an empty string', () => {
    expect.assertions(1)
    const { isNil } = require('src/utils')
    expect(isNil('')).toBe(false)
  })

  test('returns false for false', () => {
    expect.assertions(1)
    const { isNil } = require('src/utils')
    expect(isNil(false)).toBe(false)
  })
})

// TODO: more tests
