/* eslint no-underscore-dangle:0 */

import { setUpQuantcastChoice } from 'src/qcChoiceModified'
import loadQCCmpModified from 'src/loadQCCmpModified'

jest.mock('src/logger')
jest.mock('src/qcChoiceModified')
jest.mock('src/loadQCCmpModified')

beforeEach(() => {
  window.__tcfapi = jest.fn()
})

afterEach(() => {
  jest.clearAllMocks()
})

const getMockOptions = () => ({
  debug: false,
  displayPersistentConsentLink: true,
  onError: () => {},
  primaryButtonColor: '#FF0000',
  publisherName: 'My Cool Site',
  publisherLogo: 'https://example.com/some-logo.png',
})

describe('initCMP', () => {
  it('defines a default export function', () => {
    expect.assertions(1)
    const initCMP = require('src/initCMP').default
    expect(initCMP).toBeDefined()
  })

  it('calls setUpQuantcastChoice', () => {
    expect.assertions(1)
    const initCMP = require('src/initCMP').default
    const opts = getMockOptions()
    initCMP(opts)
    expect(setUpQuantcastChoice).toHaveBeenCalled()
  })

  it('throws if window.__tcfapi is undefined', () => {
    expect.assertions(1)
    window.__tcfapi = undefined
    const initCMP = require('src/initCMP').default
    const opts = getMockOptions()
    expect(() => {
      initCMP(opts)
    }).toThrow(
      'window.__tcfapi must be defined before initializing the CMP. Confirm the head tag is set.'
    )
  })

  it('inits __tcfapi with the provided publisherName', () => {
    expect.assertions(1)
    const initCMP = require('src/initCMP').default
    const opts = getMockOptions()
    initCMP(opts)
    const initData = window.__tcfapi.mock.calls[0][3]
    expect(initData.coreConfig.publisherName).toEqual('My Cool Site')
  })

  it('inits __tcfapi with the provided publisherLogo', () => {
    expect.assertions(1)
    const initCMP = require('src/initCMP').default
    const opts = getMockOptions()
    initCMP(opts)
    const initData = window.__tcfapi.mock.calls[0][3]
    expect(initData.coreConfig.publisherLogo).toEqual(
      'https://example.com/some-logo.png'
    )
  })

  it('inits __tcfapi with the provided displayPersistentConsentLink value', () => {
    expect.assertions(1)
    const initCMP = require('src/initCMP').default
    const opts = getMockOptions()
    initCMP(opts)
    const initData = window.__tcfapi.mock.calls[0][3]
    expect(initData.coreConfig.displayPersistentConsentLink).toBe(true)
  })

  it('inits __tcfapi with the provided primaryButtonColor', () => {
    expect.assertions(1)
    const initCMP = require('src/initCMP').default
    const opts = getMockOptions()
    initCMP(opts)
    const initData = window.__tcfapi.mock.calls[0][3]
    expect(initData.theme.uxPrimaryButtonColor).toEqual('#FF0000')
  })

  it('calls loadQCCmpModified.js', () => {
    expect.assertions(1)
    const initCMP = require('src/initCMP').default
    const opts = getMockOptions()
    initCMP(opts)
    expect(loadQCCmpModified).toHaveBeenCalled()
  })

  it('throws if loadQCCmpModified.js throws', () => {
    expect.assertions(1)
    loadQCCmpModified.mockImplementationOnce(() => {
      throw new Error('Problem.')
    })
    const initCMP = require('src/initCMP').default
    const opts = getMockOptions()
    expect(() => {
      initCMP(opts)
    }).toThrow('Problem.')
  })

  it('does not throw if loadQCCmpModified.js throws with a GVLError (global vendor list failure due to network conditions)', () => {
    expect.assertions(1)
    loadQCCmpModified.mockImplementationOnce(() => {
      const customErr = new Error('Some GVL error.')
      customErr.name = 'GVLError'
      throw customErr
    })
    const initCMP = require('src/initCMP').default
    const opts = getMockOptions()
    expect(() => {
      initCMP(opts)
    }).not.toThrow()
  })

  it('does not throw if loadQCCmpModified.js throws with a localStorage-related getItem error', () => {
    expect.assertions(1)
    loadQCCmpModified.mockImplementationOnce(() => {
      throw new TypeError("Cannot read property 'getItem' of null")
    })
    const initCMP = require('src/initCMP').default
    const opts = getMockOptions()
    expect(() => {
      initCMP(opts)
    }).not.toThrow()
  })

  it('does not throw if loadQCCmpModified.js throws with a localStorage-related iframe error', () => {
    expect.assertions(1)
    loadQCCmpModified.mockImplementationOnce(() => {
      const customErr = new Error(
        "Failed to read the 'localStorage' property from 'Window': Access is denied for this document."
      )
      customErr.name = 'SecurityError'
      throw customErr
    })
    const initCMP = require('src/initCMP').default
    const opts = getMockOptions()
    expect(() => {
      initCMP(opts)
    }).not.toThrow()
  })
})
