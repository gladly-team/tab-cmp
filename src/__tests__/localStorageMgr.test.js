/* eslint-disable no-console */
import localStorageMgr from 'src/localStorageMgr'

beforeEach(() => {
  // Spy and mock all localStorage methods.
  ;['clear', 'getItem', 'removeItem', 'setItem'].forEach((methodName) => {
    // https://github.com/facebook/jest/issues/6798#issuecomment-440988627
    jest
      .spyOn(Object.getPrototypeOf(window.localStorage), methodName)
      .mockImplementation(() => {})
  })

  // Spy and mock console.warn.
  jest.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('localStorageMgr', () => {
  test('getItem calls localStorage.getItem', () => {
    expect.assertions(1)
    localStorageMgr.getItem('bar')
    expect(window.localStorage.getItem).toHaveBeenCalledWith('bar')
  })

  test('getItem warns in console if using localStorage throws', () => {
    expect.assertions(1)
    const mockErr = new Error('This browser is quite private.')
    window.localStorage.getItem.mockImplementation(() => {
      throw mockErr
    })
    localStorageMgr.getItem('bar')
    expect(console.warn).toHaveBeenCalledWith(
      '[tab-cmp] localStorage not supported.',
      mockErr
    )
  })

  test('setItem calls localStorage.setItem', () => {
    expect.assertions(1)
    localStorageMgr.setItem('foo', 123)
    expect(window.localStorage.setItem).toHaveBeenCalledWith('foo', 123)
  })

  test('setItem warns in console if using localStorage throws', () => {
    expect.assertions(1)
    const mockErr = new Error('This browser is quite private.')
    window.localStorage.setItem.mockImplementation(() => {
      throw mockErr
    })
    localStorageMgr.setItem('foo', 123)
    expect(console.warn).toHaveBeenCalledWith(
      '[tab-cmp] localStorage not supported.',
      mockErr
    )
  })

  test('removeItem calls localStorage.removeItem', () => {
    expect.assertions(1)
    localStorageMgr.removeItem('bar')
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('bar')
  })

  test('removeItem warns in console if using localStorage throws', () => {
    expect.assertions(1)
    const mockErr = new Error('This browser is quite private.')
    window.localStorage.removeItem.mockImplementation(() => {
      throw mockErr
    })
    localStorageMgr.removeItem('bar')
    expect(console.warn).toHaveBeenCalledWith(
      '[tab-cmp] localStorage not supported.',
      mockErr
    )
  })
})
