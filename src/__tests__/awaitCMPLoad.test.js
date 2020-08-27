// import { logDebugging } from 'src/logger'
import { getMockTabCMPGlobal } from 'src/test-utils'
import awaitCMPLoad from 'src/awaitCMPLoad'

jest.mock('src/logger')

beforeAll(() => {
  jest.useFakeTimers()
})

beforeEach(() => {
  window.__tcfapi = jest.fn()
  window.__uspapi = jest.fn()
  window.tabCMP = {
    ...getMockTabCMPGlobal(),
    uspStubFunction: window.__uspapi,
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

// TODO: more tests
describe('awaitCMPLoad', () => {
  it('resolves when the USP stub function is replaced', () => {
    expect.assertions(0)
    const promise = awaitCMPLoad()

    // Mock that the CMP replaces the stub function.
    window.__uspapi = () => {
      // some new function
    }

    // Run our timer that's used in polling the stub.
    jest.runAllTimers()

    return new Promise((done) => {
      promise
        .then(() => {
          done()
        })
        .catch((e) => {
          throw e
        })
    })
  })
})
