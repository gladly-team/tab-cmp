import MockDate from 'mockdate'

const mockNow = '2019-12-24T14:32:01.000Z'

beforeEach(() => {
  MockDate.set(mockNow)
})

afterEach(() => {
  MockDate.reset()
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

describe('utils: getCurrentISOString', () => {
  test('returns the expected value', () => {
    expect.assertions(1)
    const { getCurrentISOString } = require('src/utils')
    expect(getCurrentISOString()).toEqual('2019-12-24T14:32:01.000Z')
  })

  test('returns the expected value for another timestamp', () => {
    expect.assertions(1)
    MockDate.set('2020-03-10T00:00:01.000Z')
    const { getCurrentISOString } = require('src/utils')
    expect(getCurrentISOString()).toEqual('2020-03-10T00:00:01.000Z')
  })
})

describe('utils: ISOStringToDate', () => {
  test('works as expected', () => {
    expect.assertions(1)
    const { ISOStringToDate } = require('src/utils')
    const ISOString = '2019-10-31T18:02:45.421Z' // UTC ms = 1572544965421
    const expectedDate = new Date(1572544965421)
    expect(ISOStringToDate(ISOString)).toEqual(expectedDate)
  })
})

// TODO: more tests
