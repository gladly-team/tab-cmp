import { logDebugging, logError } from 'src/logger'
import localStorageMgr from 'src/localStorageMgr'
import {
  getMockUSPDataInUS,
  getMockUSPDataNonUS,
  getMockUSPPingResponse,
  getMockTCFDataInEU,
  getMockTCFDataNonEU,
} from 'src/test-utils'

jest.mock('src/logger')
jest.mock('src/localStorageMgr')

beforeEach(() => {
  window.__tcfapi = jest.fn()
  window.__uspapi = jest.fn()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('updateStoredPrivacyData: TCF', () => {
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

  it('sets the TCF local storage value when in the EU', () => {
    expect.assertions(1)
    const mockTCFData = getMockTCFDataInEU() // EU
    window.__tcfapi.mockImplementation((cmd, version, callback) => {
      switch (cmd) {
        case 'getTCData': {
          callback(mockTCFData, true)
          break
        }
        default:
      }
    })
    const updateStoredPrivacyData = require('src/updateStoredPrivacyData')
      .default
    updateStoredPrivacyData()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tabCMP.tcfv2.data',
      JSON.stringify(mockTCFData)
    )
  })

  it('sets the TCF local storage value when not in the EU', () => {
    expect.assertions(1)
    const mockTCFData = getMockTCFDataNonEU() // non-EU
    window.__tcfapi.mockImplementation((cmd, version, callback) => {
      switch (cmd) {
        case 'getTCData': {
          callback(mockTCFData, true)
          break
        }
        default:
      }
    })
    const updateStoredPrivacyData = require('src/updateStoredPrivacyData')
      .default
    updateStoredPrivacyData()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tabCMP.tcfv2.data',
      JSON.stringify(mockTCFData)
    )
  })

  it('calls logDebugging after updating local storage TCF data', () => {
    expect.assertions(1)
    const mockTCFData = getMockTCFDataInEU()
    window.__tcfapi.mockImplementation((cmd, version, callback) => {
      switch (cmd) {
        case 'getTCData': {
          callback(mockTCFData, true)
          break
        }
        default:
      }
    })
    const updateStoredPrivacyData = require('src/updateStoredPrivacyData')
      .default
    updateStoredPrivacyData()
    expect(logDebugging).toHaveBeenCalledWith(
      `Successfully updated TCF local storage data. Value:`,
      mockTCFData
    )
  })

  it('calls logDebugging when failing to update local storage TCF data', () => {
    expect.assertions(1)
    const mockTCFData = getMockTCFDataInEU()
    window.__tcfapi.mockImplementation((cmd, version, callback) => {
      switch (cmd) {
        case 'getTCData': {
          callback(mockTCFData, false) // false === unsuccessful
          break
        }
        default:
      }
    })
    const updateStoredPrivacyData = require('src/updateStoredPrivacyData')
      .default
    updateStoredPrivacyData()
    expect(logDebugging).toHaveBeenCalledWith(
      'Could not update TCF local storage data. The CMP errored and provided these data:',
      mockTCFData
    )
  })
})

describe('updateStoredPrivacyData: USP', () => {
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

  it('sets the USP local storage value when in the US', () => {
    expect.assertions(1)
    const mockPingResponse = {
      ...getMockUSPPingResponse(),
      location: 'US', // in US
    }
    const mockUSPData = getMockUSPDataInUS()
    window.__uspapi.mockImplementation((cmd, version, callback) => {
      switch (cmd) {
        case 'uspPing': {
          callback(mockPingResponse, true)
          break
        }
        case 'getUSPData': {
          callback(mockUSPData, true)
          break
        }
        default:
      }
    })
    const updateStoredPrivacyData = require('src/updateStoredPrivacyData')
      .default
    updateStoredPrivacyData()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tabCMP.usp.data',
      JSON.stringify(mockUSPData)
    )
  })

  it('sets the USP local storage value when not in the US', () => {
    expect.assertions(1)
    const mockPingResponse = {
      ...getMockUSPPingResponse(),
      location: 'non-US', // not in the US
    }
    const mockUSPData = getMockUSPDataNonUS()
    window.__uspapi.mockImplementation((cmd, version, callback) => {
      switch (cmd) {
        case 'uspPing': {
          callback(mockPingResponse, true)
          break
        }
        case 'getUSPData': {
          callback(mockUSPData, true)
          break
        }
        default:
      }
    })
    const updateStoredPrivacyData = require('src/updateStoredPrivacyData')
      .default
    updateStoredPrivacyData()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tabCMP.usp.data',
      JSON.stringify(mockUSPData)
    )
  })

  it('calls logDebugging after updating local storage USP data', () => {
    expect.assertions(1)
    const mockPingResponse = getMockUSPPingResponse()
    const mockUSPData = getMockUSPDataInUS()
    window.__uspapi.mockImplementation((cmd, version, callback) => {
      switch (cmd) {
        case 'uspPing': {
          callback(mockPingResponse, true)
          break
        }
        case 'getUSPData': {
          callback(mockUSPData, true)
          break
        }
        default:
      }
    })
    const updateStoredPrivacyData = require('src/updateStoredPrivacyData')
      .default
    updateStoredPrivacyData()
    expect(logDebugging).toHaveBeenCalledWith(
      'Successfully updated USP local storage data. Value:',
      mockUSPData
    )
  })

  it('calls logDebugging when failing to update local storage USP data due to ping failure', () => {
    expect.assertions(1)
    const mockPingResponse = getMockUSPPingResponse()
    const mockUSPData = getMockUSPDataInUS()
    window.__uspapi.mockImplementation((cmd, version, callback) => {
      switch (cmd) {
        case 'uspPing': {
          callback(mockPingResponse, false) // false === unsuccessful
          break
        }
        case 'getUSPData': {
          callback(mockUSPData, true)
          break
        }
        default:
      }
    })
    const updateStoredPrivacyData = require('src/updateStoredPrivacyData')
      .default
    updateStoredPrivacyData()
    expect(logDebugging).toHaveBeenCalledWith(
      'Could not update USP local storage data. The CMP errored.'
    )
  })

  it('calls logDebugging when failing to update local storage USP data due to getUSPData failure', () => {
    expect.assertions(1)
    const mockPingResponse = getMockUSPPingResponse()
    const mockUSPData = getMockUSPDataInUS()
    window.__uspapi.mockImplementation((cmd, version, callback) => {
      switch (cmd) {
        case 'uspPing': {
          callback(mockPingResponse, true)
          break
        }
        case 'getUSPData': {
          callback(mockUSPData, false) // false === unsuccessful
          break
        }
        default:
      }
    })
    const updateStoredPrivacyData = require('src/updateStoredPrivacyData')
      .default
    updateStoredPrivacyData()
    expect(logDebugging).toHaveBeenCalledWith(
      'Could not update USP local storage data. The CMP errored and provided these data:',
      mockUSPData
    )
  })
})
