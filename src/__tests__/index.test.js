/* eslint no-underscore-dangle:0 */

jest.mock('src/initCMP')
jest.mock('src/getClientLocation')
jest.mock('src/qcCmpModified')
jest.mock('src/setDefaultUSPData')

beforeEach(() => {
  window.__tcfapi = jest.fn()
  window.__uspapi = jest.fn()
  const getClientLocation = require('src/getClientLocation').default
  getClientLocation.mockResolvedValue({
    countryISOCode: 'DE',
    isInUS: false,
    isInEuropeanUnion: true,
    queryTime: '2018-05-15T10:30:00.000Z',
  })
})

afterEach(() => {
  // Reset console mocks.
  // eslint-disable-next-line no-console
  if (console.warn.mockRestore) {
    // eslint-disable-next-line no-console
    console.warn.mockRestore()
  }
  // eslint-disable-next-line no-console
  if (console.error.mockRestore) {
    // eslint-disable-next-line no-console
    console.error.mockRestore()
  }
  jest.clearAllMocks()
  jest.resetModules()
  delete window.tabCMP
})

describe('index.js:', () => {
  it('defines initializeCMP', () => {
    expect.assertions(1)
    const index = require('src/index')
    expect(index.initializeCMP).toBeDefined()
  })

  it('defines getCMPHeadScript', () => {
    expect.assertions(1)
    const index = require('src/index')
    expect(index.getCMPHeadScript).toBeDefined()
  })

  it('defines doesGDPRApply', () => {
    expect.assertions(1)
    const index = require('src/index')
    expect(index.doesGDPRApply).toBeDefined()
  })

  it('defines doesCCPAApply', () => {
    expect.assertions(1)
    const index = require('src/index')
    expect(index.doesCCPAApply).toBeDefined()
  })

  it('defines openTCFConsentDialog', () => {
    expect.assertions(1)
    const index = require('src/index')
    expect(index.openTCFConsentDialog).toBeDefined()
  })

  it('defines openCCPAConsentDialog', () => {
    expect.assertions(1)
    const index = require('src/index')
    expect(index.openCCPAConsentDialog).toBeDefined()
  })
})

describe('index.js: initializeCMP', () => {
  it('warns if calling initializeCMP more than once', () => {
    expect.assertions(2)
    const index = require('src/index')
    const mockConsoleWarn = jest.fn()
    jest.spyOn(console, 'warn').mockImplementation(mockConsoleWarn)
    index.initializeCMP()
    expect(mockConsoleWarn).not.toHaveBeenCalled()
    index.initializeCMP()
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      '[tab-cmp] initializeCMP was called more than once. Ignoring this initialization.'
    )
  })

  it('calls initCMP', async () => {
    expect.assertions(1)
    const index = require('src/index')
    await index.initializeCMP()
    const initCMP = require('src/initCMP').default
    expect(initCMP).toHaveBeenCalled()
  })

  it('passes default options to initCMP when no options are provided', async () => {
    expect.assertions(1)
    const index = require('src/index')
    await index.initializeCMP()
    const initCMP = require('src/initCMP').default
    expect(initCMP).toHaveBeenCalledWith({
      publisherName: 'Tab for a Cause',
      publisherLogo:
        'https://tab.gladly.io/static/logo-with-text-257bbffc6dcac5076e8ac31eed8ff73c.svg',
      displayPersistentConsentLink: false,
      primaryButtonColor: '#9d4ba3',
    })
  })

  it('sets window.tabCMP.doesGDPRApply to true when the client location is in the EU', async () => {
    expect.assertions(1)
    const getClientLocation = require('src/getClientLocation').default
    getClientLocation.mockResolvedValue({
      countryISOCode: 'DE',
      isInUS: false,
      isInEuropeanUnion: true,
      queryTime: '2018-05-15T10:30:00.000Z',
    })
    const index = require('src/index')
    await index.initializeCMP()
    expect(window.tabCMP.doesGDPRApply).toBe(true)
  })

  it('sets window.tabCMP.doesGDPRApply to false when the client location is not in the EU', async () => {
    expect.assertions(1)
    const getClientLocation = require('src/getClientLocation').default
    getClientLocation.mockResolvedValue({
      countryISOCode: 'JP',
      isInUS: false,
      isInEuropeanUnion: false,
      queryTime: '2018-05-15T10:30:00.000Z',
    })
    const index = require('src/index')
    await index.initializeCMP()
    expect(window.tabCMP.doesGDPRApply).toBe(false)
  })

  it('sets window.tabCMP.doesCCPAApply to true when the client location is in the US', async () => {
    expect.assertions(1)
    const getClientLocation = require('src/getClientLocation').default
    getClientLocation.mockResolvedValue({
      countryISOCode: 'US',
      isInUS: true,
      isInEuropeanUnion: false,
      queryTime: '2018-05-15T10:30:00.000Z',
    })
    const index = require('src/index')
    await index.initializeCMP()
    expect(window.tabCMP.doesCCPAApply).toBe(true)
  })

  it('sets window.tabCMP.doesCCPAApply to false when the client location is not in the US', async () => {
    expect.assertions(1)
    const getClientLocation = require('src/getClientLocation').default
    getClientLocation.mockResolvedValue({
      countryISOCode: 'DE',
      isInUS: false,
      isInEuropeanUnion: true,
      queryTime: '2018-05-15T10:30:00.000Z',
    })
    const index = require('src/index')
    await index.initializeCMP()
    expect(window.tabCMP.doesCCPAApply).toBe(false)
  })

  it('sets window.tabCMP.doesGDPRApply and window.tabCMP.doesCCPAApply to false when the client location fails', async () => {
    expect.assertions(2)
    const getClientLocation = require('src/getClientLocation').default
    getClientLocation.mockRejectedValue(new Error('Uh oh.'))
    const index = require('src/index')
    await index.initializeCMP()
    expect(window.tabCMP.doesGDPRApply).toBe(false)
    expect(window.tabCMP.doesCCPAApply).toBe(false)
  })
})

describe('index.js: getCMPHeadScript', () => {
  it("calls console.error if it's called before calling initializeCMP", () => {
    expect.assertions(1)
    const index = require('src/index')
    const mockConsoleError = jest.fn()
    jest.spyOn(console, 'error').mockImplementation(mockConsoleError)
    index.getCMPHeadScript()
    expect(mockConsoleError).toHaveBeenCalledWith(
      '[tab-cmp] initializeCMP must be called before calling any other tab-cmp methods.'
    )
  })

  it("does not call console.error if it's called after calling initializeCMP", () => {
    expect.assertions(1)
    const index = require('src/index')
    const mockConsoleError = jest.fn()
    jest.spyOn(console, 'error').mockImplementation(mockConsoleError)
    index.initializeCMP()
    index.getCMPHeadScript()
    expect(mockConsoleError).not.toHaveBeenCalled()
  })

  it('calls setDefaultUSPData', async () => {
    expect.assertions(1)
    const index = require('src/index')
    await index.initializeCMP()
    const setDefaultUSPData = require('src/setDefaultUSPData').default
    expect(setDefaultUSPData).toHaveBeenCalled()
  })
})

describe('index.js: doesGDPRApply', () => {
  it("calls console.error if it's called before calling initializeCMP", async () => {
    expect.assertions(1)
    const index = require('src/index')
    const mockConsoleError = jest.fn()
    jest.spyOn(console, 'error').mockImplementation(mockConsoleError)
    await index.doesGDPRApply()
    expect(mockConsoleError).toHaveBeenCalledWith(
      '[tab-cmp] initializeCMP must be called before calling any other tab-cmp methods.'
    )
  })

  it("does not call console.error if it's called after calling initializeCMP", async () => {
    expect.assertions(1)
    const index = require('src/index')
    const mockConsoleError = jest.fn()
    jest.spyOn(console, 'error').mockImplementation(mockConsoleError)
    index.initializeCMP()
    await index.doesGDPRApply()
    expect(mockConsoleError).not.toHaveBeenCalled()
  })
})

describe('index.js: doesCCPAApply', () => {
  it("calls console.error if it's called before calling initializeCMP", async () => {
    expect.assertions(1)
    const index = require('src/index')
    const mockConsoleError = jest.fn()
    jest.spyOn(console, 'error').mockImplementation(mockConsoleError)
    await index.doesCCPAApply()
    expect(mockConsoleError).toHaveBeenCalledWith(
      '[tab-cmp] initializeCMP must be called before calling any other tab-cmp methods.'
    )
  })

  it("does not call console.error if it's called after calling initializeCMP", async () => {
    expect.assertions(1)
    const index = require('src/index')
    const mockConsoleError = jest.fn()
    jest.spyOn(console, 'error').mockImplementation(mockConsoleError)
    index.initializeCMP()
    await index.doesCCPAApply()
    expect(mockConsoleError).not.toHaveBeenCalled()
  })
})

describe('index.js: openTCFConsentDialog', () => {
  it("calls console.error if it's called before calling initializeCMP", async () => {
    expect.assertions(1)
    const index = require('src/index')
    const mockConsoleError = jest.fn()
    jest.spyOn(console, 'error').mockImplementation(mockConsoleError)
    await index.openTCFConsentDialog()
    expect(mockConsoleError).toHaveBeenCalledWith(
      '[tab-cmp] initializeCMP must be called before calling any other tab-cmp methods.'
    )
  })

  it("does not call console.error if it's called after calling initializeCMP", async () => {
    expect.assertions(1)
    const index = require('src/index')
    const mockConsoleError = jest.fn()
    jest.spyOn(console, 'error').mockImplementation(mockConsoleError)
    index.initializeCMP()
    await index.openTCFConsentDialog()
    expect(mockConsoleError).not.toHaveBeenCalled()
  })
})

describe('index.js: openCCPAConsentDialog', () => {
  it("calls console.error if it's called before calling initializeCMP", async () => {
    expect.assertions(1)
    const index = require('src/index')
    const mockConsoleError = jest.fn()
    jest.spyOn(console, 'error').mockImplementation(mockConsoleError)
    await index.openCCPAConsentDialog()
    expect(mockConsoleError).toHaveBeenCalledWith(
      '[tab-cmp] initializeCMP must be called before calling any other tab-cmp methods.'
    )
  })

  it("does not call console.error if it's called after calling initializeCMP", async () => {
    expect.assertions(1)
    const index = require('src/index')
    const mockConsoleError = jest.fn()
    jest.spyOn(console, 'error').mockImplementation(mockConsoleError)
    index.initializeCMP()
    await index.openCCPAConsentDialog()
    expect(mockConsoleError).not.toHaveBeenCalled()
  })
})
