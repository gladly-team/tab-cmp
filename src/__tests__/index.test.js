/* eslint no-underscore-dangle:0 */

import initCMP from 'src/initCMP'
import getClientLocation from 'src/getClientLocation'

jest.mock('src/initCMP')
jest.mock('src/getClientLocation')
jest.mock('src/qcCmpModified')

beforeEach(() => {
  window.__tcfapi = jest.fn()
  getClientLocation.mockResolvedValue({
    countryISOCode: 'DE',
    isInUS: false,
    isInEuropeanUnion: true,
    queryTime: '2018-05-15T10:30:00.000Z',
  })
})

afterEach(() => {
  jest.clearAllMocks()
  delete window.tabCMP
})

describe('index.js: initializeCMP', () => {
  it('defines initializeCMP', () => {
    expect.assertions(1)
    const index = require('src/index')
    expect(index.initializeCMP).toBeDefined()
  })

  it('calls initCMP', async () => {
    expect.assertions(1)
    const index = require('src/index')
    await index.initializeCMP()
    expect(initCMP).toHaveBeenCalled()
  })

  it('sets window.tabCMP.doesGDPRApply to true when the client location is in the EU', async () => {
    expect.assertions(1)
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

  it('sets window.tabCMP.doesGDPRApply adn window.tabCMP.doesCCPAApply to false when the client location fails', async () => {
    expect.assertions(2)
    getClientLocation.mockRejectedValue(new Error('Uh oh.'))
    const index = require('src/index')
    await index.initializeCMP()
    expect(window.tabCMP.doesGDPRApply).toBe(false)
    expect(window.tabCMP.doesCCPAApply).toBe(false)
  })
})

describe('index.js:', () => {
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
