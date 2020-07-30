/* eslint no-underscore-dangle:0 */

import initCMP from 'src/initCMP'

jest.mock('src/initCMP')
jest.mock('src/qcCmpModified')

beforeEach(() => {
  window.__tcfapi = jest.fn()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('index.js: initializeCMP', () => {
  it('defines initializeCMP', () => {
    expect.assertions(1)
    const index = require('src/index')
    expect(index.initializeCMP).toBeDefined()
  })

  it('calls initCMP', () => {
    expect.assertions(1)
    const index = require('src/index')
    index.initializeCMP()
    expect(initCMP).toHaveBeenCalledWith()
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
