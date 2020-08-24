/* eslint no-underscore-dangle:0 */

import { setUpQuantcastChoice } from 'src/qcChoiceModified'

jest.mock('src/logger')
jest.mock('src/qcChoiceModified')
jest.mock('src/qcCmpModified')

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
})
