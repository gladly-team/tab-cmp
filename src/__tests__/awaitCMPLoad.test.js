import { logDebugging } from 'src/logger'
import { getMockTabCMPGlobal, runAsyncTimerLoops } from 'src/test-utils'
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

  it('rejects when the USP stub function is never replaced (it times out)', async () => {
    expect.assertions(1)
    const promise = awaitCMPLoad()
      .then(() => {})
      .catch((e) => {
        expect(e).toEqual(new Error('Timed out while waiting for the CMP.'))
      })

    // Run out our timer that's used in polling the stub.
    await runAsyncTimerLoops(40)

    return promise
  })

  it('calls logDebugging as expected when the CMP responds successfully', async () => {
    expect.assertions(2)
    const promise = awaitCMPLoad()
      .then(() => {
        expect(logDebugging).toHaveBeenCalledWith(
          `Polling for CMP to have loaded in updateStoredPrivacyData.`
        )
        expect(logDebugging).toHaveBeenCalledWith(
          `Polling for CMP loaded. Loaded? true`
        )
      })
      .catch((e) => {
        throw e
      })

    // Mock that the CMP replaces the stub function.
    window.__uspapi = () => {
      // some new function
    }

    // Run out our timer that's used in polling the stub.
    await runAsyncTimerLoops(40)

    return promise
  })

  it('calls logDebugging as expected when the CMP fails to respond', async () => {
    expect.assertions(3)
    const promise = awaitCMPLoad()
      .then(() => {})
      .catch(() => {
        expect(logDebugging).toHaveBeenCalledWith(
          `Polling for CMP to have loaded in updateStoredPrivacyData.`
        )
        expect(logDebugging).toHaveBeenCalledWith(
          `Polling for CMP loaded. Loaded? false`
        )
        expect(logDebugging).toHaveBeenCalledWith(
          `Polling for CMP has timed out.`
        )
      })

    // Run out our timer that's used in polling the stub.
    await runAsyncTimerLoops(40)

    return promise
  })
})
