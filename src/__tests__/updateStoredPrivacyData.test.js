import { logError } from 'src/logger'

jest.mock('src/logger')

beforeEach(() => {
  window.__tcfapi = jest.fn()
  window.__uspapi = jest.fn()
})

afterEach(() => {
  jest.clearAllMocks()
})

// const getMockPingResponse = () => ({
//   cmpLoaded: true,
//   jurisdiction: ['US'],
//   location: 'US',
//   mode: ['GDPR', 'USP'],
// })

describe('updateStoredPrivacyData', () => {
  it('does not throw if window.__uspapi is undefined', () => {
    expect.assertions(1)
    delete window.__uspapi
    const updateStoredPrivacyData = require('src/updateStoredPrivacyData')
      .default
    expect(() => {
      updateStoredPrivacyData()
    }).not.toThrow()
  })

  it('logs an error if window.__uspapi is undefined', () => {
    expect.assertions(1)
    delete window.__uspapi
    const updateStoredPrivacyData = require('src/updateStoredPrivacyData')
      .default
    updateStoredPrivacyData()
    expect(logError).toHaveBeenCalledWith(
      new Error(
        '[tab-cmp] Could not update USP local storage data. window.__uspapi is not defined.'
      )
    )
  })

  it('does not throw if window.__tcfapi is undefined', () => {
    expect.assertions(1)
    delete window.__tcfapi
    const updateStoredPrivacyData = require('src/updateStoredPrivacyData')
      .default
    expect(() => {
      updateStoredPrivacyData()
    }).not.toThrow()
  })

  it('logs an error if window.__tcfapi is undefined', () => {
    expect.assertions(1)
    delete window.__tcfapi
    const updateStoredPrivacyData = require('src/updateStoredPrivacyData')
      .default
    updateStoredPrivacyData()
    expect(logError).toHaveBeenCalledWith(
      new Error(
        '[tab-cmp] Could not update TCF local storage data. window.__tcfapi is not defined.'
      )
    )
  })
})

// TODO: more tests
