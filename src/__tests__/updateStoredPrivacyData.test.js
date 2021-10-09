import { logDebugging, logError } from 'src/logger'
import localStorageMgr from 'src/localStorageMgr'
import {
  getMockTabCMPGlobal,
  getMockUSPDataInUS,
  getMockUSPDataNonUS,
  getMockUSPPingResponse,
  getMockTCFDataInEU,
  getMockTCFDataNonEU,
} from 'src/test-utils'
import awaitCMPLoad from 'src/awaitCMPLoad'

jest.mock('src/logger')
jest.mock('src/localStorageMgr')
jest.mock('src/awaitCMPLoad')

beforeEach(() => {
  awaitCMPLoad.mockResolvedValue()
  window.tabCMP = getMockTabCMPGlobal()
  window.__tcfapi = jest.fn()
  window.__uspapi = jest.fn()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('updateStoredPrivacyData: CMP failure', () => {
  it('does not throw if awaitCMPLoad rejects', async () => {
    expect.assertions(1)
    awaitCMPLoad.mockRejectedValue(new Error('Timed out.'))
    const updateStoredPrivacyData =
      require('src/updateStoredPrivacyData').default
    await expect(updateStoredPrivacyData()).resolves.not.toThrow()
  })

  it('does not call __tcfapi or __uspapi if awaitCMPLoad rejects', async () => {
    expect.assertions(2)
    awaitCMPLoad.mockRejectedValue(new Error('Timed out.'))
    const updateStoredPrivacyData =
      require('src/updateStoredPrivacyData').default
    await updateStoredPrivacyData()
    expect(window.__tcfapi).not.toHaveBeenCalled()
    expect(window.__uspapi).not.toHaveBeenCalled()
  })

  it('calls logDebugging if awaitCMPLoad rejects', async () => {
    expect.assertions(1)
    awaitCMPLoad.mockRejectedValue(new Error('Timed out.'))
    const updateStoredPrivacyData =
      require('src/updateStoredPrivacyData').default
    await updateStoredPrivacyData()
    expect(logDebugging).toHaveBeenCalledWith(
      `Could not update stored privacy data.`
    )
  })
})

describe('updateStoredPrivacyData: TCF', () => {
  it('does not throw if window.__tcfapi is undefined', async () => {
    expect.assertions(1)
    delete window.__tcfapi
    const updateStoredPrivacyData =
      require('src/updateStoredPrivacyData').default
    await expect(updateStoredPrivacyData()).resolves.not.toThrow()
  })

  it('logs an error if window.__tcfapi is undefined', async () => {
    expect.assertions(1)
    delete window.__tcfapi
    const updateStoredPrivacyData =
      require('src/updateStoredPrivacyData').default
    await updateStoredPrivacyData()
    expect(logError).toHaveBeenCalledWith(
      new Error(
        '[tab-cmp] Could not update TCF local storage data. window.__tcfapi is not defined.'
      )
    )
  })

  it('sets the TCF local storage value when in the EU', async () => {
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
    const updateStoredPrivacyData =
      require('src/updateStoredPrivacyData').default
    await updateStoredPrivacyData()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tabCMP.tcfv2.data',
      JSON.stringify(mockTCFData)
    )
  })

  it('sets the TCF local storage value when not in the EU', async () => {
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
    const updateStoredPrivacyData =
      require('src/updateStoredPrivacyData').default
    await updateStoredPrivacyData()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tabCMP.tcfv2.data',
      JSON.stringify(mockTCFData)
    )
  })

  it('calls logDebugging after updating local storage TCF data', async () => {
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
    const updateStoredPrivacyData =
      require('src/updateStoredPrivacyData').default
    await updateStoredPrivacyData()
    expect(logDebugging).toHaveBeenCalledWith(
      `Successfully updated TCF local storage data. Value:`,
      mockTCFData
    )
  })

  it('calls logDebugging when failing to update local storage TCF data', async () => {
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
    const updateStoredPrivacyData =
      require('src/updateStoredPrivacyData').default
    await updateStoredPrivacyData()
    expect(logDebugging).toHaveBeenCalledWith(
      'Could not update TCF local storage data. The CMP errored and provided these data:',
      mockTCFData
    )
  })
})

describe('updateStoredPrivacyData: USP', () => {
  it('does not throw if window.__uspapi is undefined', async () => {
    expect.assertions(1)
    delete window.__uspapi
    const updateStoredPrivacyData =
      require('src/updateStoredPrivacyData').default
    await expect(updateStoredPrivacyData()).resolves.not.toThrow()
  })

  it('logs an error if window.__uspapi is undefined', async () => {
    expect.assertions(1)
    delete window.__uspapi
    const updateStoredPrivacyData =
      require('src/updateStoredPrivacyData').default
    await updateStoredPrivacyData()
    expect(logError).toHaveBeenCalledWith(
      new Error(
        '[tab-cmp] Could not update USP local storage data. window.__uspapi is not defined.'
      )
    )
  })

  it('sets the USP ping local storage value', async () => {
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
    const updateStoredPrivacyData =
      require('src/updateStoredPrivacyData').default
    await updateStoredPrivacyData()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tabCMP.uspPing.data',
      JSON.stringify(mockPingResponse)
    )
  })

  it('calls logDebugging after setting the USP ping local storage value', async () => {
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
    const updateStoredPrivacyData =
      require('src/updateStoredPrivacyData').default
    await updateStoredPrivacyData()
    expect(logDebugging).toHaveBeenCalledWith(
      `Successfully updated USP ping local storage data. Value:`,
      mockPingResponse
    )
  })

  it('sets the USP local storage value when in the US', async () => {
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
    const updateStoredPrivacyData =
      require('src/updateStoredPrivacyData').default
    await updateStoredPrivacyData()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tabCMP.usp.data',
      JSON.stringify(mockUSPData)
    )
  })

  it('sets the USP local storage value when not in the US', async () => {
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
    const updateStoredPrivacyData =
      require('src/updateStoredPrivacyData').default
    await updateStoredPrivacyData()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tabCMP.usp.data',
      JSON.stringify(mockUSPData)
    )
  })

  it('calls logDebugging after updating local storage USP data', async () => {
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
    const updateStoredPrivacyData =
      require('src/updateStoredPrivacyData').default
    await updateStoredPrivacyData()
    expect(logDebugging).toHaveBeenCalledWith(
      'Successfully updated USP local storage data. Value:',
      mockUSPData
    )
  })

  it('calls logDebugging when failing to update local storage USP data due to ping failure', async () => {
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
    const updateStoredPrivacyData =
      require('src/updateStoredPrivacyData').default
    await updateStoredPrivacyData()
    expect(logDebugging).toHaveBeenCalledWith(
      'Could not update USP local storage data. The CMP errored.'
    )
  })

  it('calls logDebugging when failing to update local storage USP data due to getUSPData failure', async () => {
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
    const updateStoredPrivacyData =
      require('src/updateStoredPrivacyData').default
    await updateStoredPrivacyData()
    expect(logDebugging).toHaveBeenCalledWith(
      'Could not update USP local storage data. The CMP errored and provided these data:',
      mockUSPData
    )
  })
})
