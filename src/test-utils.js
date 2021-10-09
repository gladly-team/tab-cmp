/**
 * Flush the Promise resolution queue. See:
 * https://github.com/facebook/jest/issues/2157
 * @return {Promise<undefined>}
 */
export const flushAllPromises = async () =>
  // https://github.com/facebook/jest/issues/2157#issuecomment-897935688
  new Promise(jest.requireActual('timers').setImmediate)

/**
 * Flush the Promise resolution queue, then all timers, and
 * repeat the given number of times. This is useful for
 * recursive async code that sets new timers.
 * https://github.com/facebook/jest/issues/2157
 * @return {Promise<undefined>}
 */
export const runAsyncTimerLoops = async (numLoops = 2) => {
  for (let i = 0; i < numLoops; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await flushAllPromises()
    jest.runAllTimers()
  }
}

export const getMockTabCMPGlobal = () => ({
  doesGDPRApply: false,
  doesCCPAApply: true,
  uspStubFunction: () => {},
})

export const getMockUSPPingResponse = () => ({
  cmpLoaded: true,
  jurisdiction: ['US'],
  location: 'US',
  mode: ['GDPR', 'USP'],
})

export const getMockUSPDataInUS = () => ({
  uspString: '1YNN',
  version: '1',
})

export const getMockUSPDataNonUS = () => ({
  uspString: '1---',
  version: '1',
})

export const getMockTCFDataInEU = () => ({
  cmpId: 10,
  cmpVersion: 11,
  gdprApplies: true,
  tcfPolicyVersion: 2,
  eventStatus: 'tcloaded',
  cmpStatus: 'loaded',
  listenerId: null,
  tcString: 'mock-tc-string-here',
  isServiceSpecific: true,
  useNonStandardStacks: false,
  purposeOneTreatment: false,
  publisherCC: 'US',
  outOfBand: {
    allowedVendors: {},
    disclosedVendors: {},
  },
  purpose: {
    consents: {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
      9: true,
      10: true,
    },
    legitimateInterests: {
      1: false,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
      9: true,
      10: true,
    },
  },
  vendor: {
    consents: {},
    legitimateInterests: {
      1: false,
      2: true,
      3: false,
      // ... etc.
    },
  },
  specialFeatureOptins: {
    1: true,
    2: true,
  },
  publisher: {
    consents: {},
    legitimateInterests: {
      1: false,
      2: true,
      3: false,
      4: false,
      5: false,
      6: false,
      7: true,
      8: true,
      9: false,
      10: true,
    },
    customPurpose: {
      consents: {},
      legitimateInterests: {},
    },
    restrictions: {},
  },
  addtlConsent: '1.2.3.4.5.', // mocked
})

export const getMockTCFDataNonEU = () => ({
  addtlConsent: '1.2.3.4.5.', // mocked
  cmpId: 10,
  cmpStatus: 'loaded',
  cmpVersion: 11,
  eventStatus: 'tcloaded',
  gdprApplies: false,
  listenerId: null,
  tcfPolicyVersion: undefined,
})
