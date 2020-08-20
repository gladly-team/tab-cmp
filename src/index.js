import initCMP from 'src/initCMP'
import { logDebugging, setUpLogger } from 'src/logger'
import getClientLocation from 'src/getClientLocation'
import setDefaultUSPData from 'src/setDefaultUSPData'

let tabCMPInitialized = false

const requireCMPInitialized = (func) => (args) => {
  if (!tabCMPInitialized) {
    // We don't want tab-cmp to ever throw. We'd rather it fail
    // silently than disrupt its parent app.
    // Here, the onError callback won't have been provided, so just
    // log to console.
    // eslint-disable-next-line no-console
    console.error(
      `[tab-cmp] initializeCMP must be called before calling any other tab-cmp methods.`
    )

    // To allow composition.
    return () => {}
  }

  return func(args)
}

// TODO: try/catch all code here.
// TODO: gracefully handle if this code is run on the
// server side.

export const getCMPHeadScript = requireCMPInitialized(() => {
  logDebugging(`TODO: getCMPHeadScript`)
})

export const initializeCMP = async (userOptions) => {
  // Ensure initializeCMP is called only once.
  if (tabCMPInitialized) {
    // eslint-disable-next-line no-console
    console.warn(
      `[tab-cmp] initializeCMP was called more than once. Ignoring this initialization.`
    )
    return
  }
  tabCMPInitialized = true

  const options = {
    debug: false,
    displayPersistentConsentLink: false,
    onError: () => {},
    primaryButtonColor: '#9d4ba3',
    publisherName: 'Tab for a Cause',
    publisherLogo:
      'https://tab.gladly.io/static/logo-with-text-257bbffc6dcac5076e8ac31eed8ff73c.svg',
    ...userOptions,
  }

  // Set up error and debug logging.
  setUpLogger({ debug: options.debug, onErrorCallback: options.onError })

  logDebugging(`Called initializeCMP with options: ${JSON.stringify(options)}`)

  // Determine the client location to know which privacy laws apply.
  let isInUS = false
  let isInEuropeanUnion = false
  try {
    ;({ isInUS, isInEuropeanUnion } = await getClientLocation())
    // If client location determination fails, default to no GDPR/CCPA,
    // which will fall back on IP geolocation in calls to ad partners.
    // eslint-disable-next-line no-empty
  } catch (e) {}

  logDebugging(
    `Client location. isInEU: ${isInEuropeanUnion}. isInUS: ${isInUS}`
  )

  // Set (as needed) the tab-cmp window variable. Then, set whether
  // GDPR and CCPA apply, if not set already. We use these values
  // in the modified version of the Quantcast Choice CMP JS.
  window.tabCMP = window.tabCMP || {}
  window.tabCMP.doesGDPRApply = Object.prototype.hasOwnProperty.call(
    window.tabCMP,
    'doesGDPRApply'
  )
    ? window.tabCMP.doesGDPRApply
    : isInEuropeanUnion
  window.tabCMP.doesCCPAApply = Object.prototype.hasOwnProperty.call(
    window.tabCMP,
    'doesCCPAApply'
  )
    ? window.tabCMP.doesCCPAApply
    : isInUS

  // Initialize our modified version of Quantcast Choice.
  initCMP(options)

  // We need to set the default USP data, which QC Choice does
  // not do automatically.
  setDefaultUSPData()
}

export const doesGDPRApply = requireCMPInitialized(async () => {
  logDebugging(`TODO: doesGDPRApply`)
})

export const doesCCPAApply = requireCMPInitialized(async () => {
  logDebugging(`TODO: doesCCPAApply`)
})

export const openTCFConsentDialog = requireCMPInitialized(async () => {
  logDebugging(`TODO: openTCFConsentDialog`)
})

export const openCCPAConsentDialog = requireCMPInitialized(async () => {
  logDebugging(`TODO: openCCPAConsentDialog`)
})
