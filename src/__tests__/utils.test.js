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
  it('returns true for undefined', () => {
    expect.assertions(1)
    const { isNil } = require('src/utils')
    expect(isNil()).toBe(true)
  })

  it('returns true for null', () => {
    expect.assertions(1)
    const { isNil } = require('src/utils')
    expect(isNil(null)).toBe(true)
  })

  it('returns false for zero', () => {
    expect.assertions(1)
    const { isNil } = require('src/utils')
    expect(isNil(0)).toBe(false)
  })

  it('returns false for an empty string', () => {
    expect.assertions(1)
    const { isNil } = require('src/utils')
    expect(isNil('')).toBe(false)
  })

  it('returns false for false', () => {
    expect.assertions(1)
    const { isNil } = require('src/utils')
    expect(isNil(false)).toBe(false)
  })
})

describe('utils: getCurrentISOString', () => {
  it('returns the expected value', () => {
    expect.assertions(1)
    const { getCurrentISOString } = require('src/utils')
    expect(getCurrentISOString()).toEqual('2019-12-24T14:32:01.000Z')
  })

  it('returns the expected value for another timestamp', () => {
    expect.assertions(1)
    MockDate.set('2020-03-10T00:00:01.000Z')
    const { getCurrentISOString } = require('src/utils')
    expect(getCurrentISOString()).toEqual('2020-03-10T00:00:01.000Z')
  })
})

describe('utils: ISOStringToDate', () => {
  it('works as expected', () => {
    expect.assertions(1)
    const { ISOStringToDate } = require('src/utils')
    const ISOString = '2019-10-31T18:02:45.421Z' // UTC ms = 1572544965421
    const expectedDate = new Date(1572544965421)
    expect(ISOStringToDate(ISOString)).toEqual(expectedDate)
  })

  it('throws if no input is provided', () => {
    expect.assertions(1)
    const { ISOStringToDate } = require('src/utils')
    expect(() => {
      ISOStringToDate()
    }).toThrow()
  })

  it('throws if a number is provided', () => {
    expect.assertions(1)
    const { ISOStringToDate } = require('src/utils')
    expect(() => {
      ISOStringToDate(1572544965421)
    }).toThrow()
  })
})

describe('utils: getNumDaysBetweenDates', () => {
  it('works for exactly 2 days', () => {
    expect.assertions(1)
    const { getNumDaysBetweenDates, ISOStringToDate } = require('src/utils')
    const firstDate = ISOStringToDate('2019-10-29T18:02:45.421Z')
    const laterDate = ISOStringToDate('2019-10-31T18:02:45.421Z')
    expect(getNumDaysBetweenDates(laterDate, firstDate)).toEqual(2)
  })

  it('works for 2 days and change', () => {
    expect.assertions(1)
    const { getNumDaysBetweenDates, ISOStringToDate } = require('src/utils')
    const firstDate = ISOStringToDate('2019-10-29T18:02:45.421Z')
    const laterDate = ISOStringToDate('2019-10-31T19:04:12.001Z')
    expect(getNumDaysBetweenDates(laterDate, firstDate)).toEqual(2.04266875)
  })

  it('returns a negative value when the inputs are reversed', () => {
    expect.assertions(1)
    const { getNumDaysBetweenDates, ISOStringToDate } = require('src/utils')
    const firstDate = ISOStringToDate('2019-10-29T18:02:45.421Z')
    const laterDate = ISOStringToDate('2019-10-31T19:04:12.001Z')
    expect(getNumDaysBetweenDates(firstDate, laterDate)).toEqual(-2.04266875)
  })

  it('works for a multi-month time diff', () => {
    expect.assertions(1)
    const { getNumDaysBetweenDates, ISOStringToDate } = require('src/utils')
    const firstDate = ISOStringToDate('2019-04-29T12:02:45.421Z')
    const laterDate = ISOStringToDate('2019-10-31T18:02:45.421Z')
    expect(getNumDaysBetweenDates(laterDate, firstDate)).toEqual(185.25)
  })
})
