import initCMP from 'src/initCMP'
import { logDebugging, logError, setUpLogger } from 'src/logger'
import getClientLocation from 'src/getClientLocation'
import setDefaultUSPData from 'src/setDefaultUSPData'
import updateStoredPrivacyData from 'src/updateStoredPrivacyData'
import isClientSide from 'src/isClientSide'
import { getURL } from 'src/utils'

let tabCMPInitialized = false

const requireClientSide = (func) => (args) => {
  if (!isClientSide()) {
    throw new Error(`[tab-cmp] tab-cmp cannot be called server-side.`)
  }
  return func(args)
}

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
    return
  }

  // We're fine just returning above as a substitute for throwing.
  // eslint-disable-next-line consistent-return
  return func(args)
}

const catchAndLogErrors = (func) => async (args) => {
  let result
  try {
    result = await func(args)
  } catch (e) {
    logError(e)
    return
  }

  // We're fine just returning above as a substitute for throwing.
  // eslint-disable-next-line consistent-return
  return result
}

const commonWrapper = (func) =>
  requireClientSide(requireCMPInitialized(catchAndLogErrors(func)))

const isDebugParamSet = () => {
  let isDebug = false
  try {
    const urlStr = getURL()
    const url = new URL(urlStr)
    const tabCMPDebug = url.searchParams.get('tabCMPDebug')
    isDebug = tabCMPDebug === 'true'
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
  return isDebug
}

export const initializeCMP = requireClientSide(async (userOptions = {}) => {
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
    displayPersistentConsentLink: false,
    onError: () => {},
    primaryButtonColor: '#9d4ba3',
    publisherName: 'Tab for a Cause',
    publisherLogo:
      'https://tab.gladly.io/static/logo-with-text-257bbffc6dcac5076e8ac31eed8ff73c.svg',
    ...userOptions,
    debug: isDebugParamSet() ? true : userOptions.debug || false,
  }

  try {
    // Set up error and debug logging.
    setUpLogger({ debug: options.debug, onErrorCallback: options.onError })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`[tab-cmp] Failed to set up logger.`, e)
  }

  try {
    logDebugging(`Called initializeCMP with options:`, options)

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

    // Sync our TCF/USP data in local storage to the CMP.
    updateStoredPrivacyData()
  } catch (e) {
    logError(e)
  }
})

export const doesGDPRApply = commonWrapper(async () => {
  const { isInEuropeanUnion } = await getClientLocation()
  logDebugging(`Called doesGDPRApply. Response: ${isInEuropeanUnion}`)
  return isInEuropeanUnion
})

export const doesCCPAApply = commonWrapper(async () => {
  const { isInUS } = await getClientLocation()
  logDebugging(`Called doesCCPAApply. Response: ${isInUS}`)
  return isInUS
})

export const openTCFConsentDialog = commonWrapper(async () => {
  logDebugging(`Called openTCFConsentDialog.`)
  window.__tcfapi('displayConsentUi', 2, () => {})
})

export const openCCPAConsentDialog = commonWrapper(async () => {
  logDebugging(`Called openCCPAConsentDialog.`)
  window.__uspapi('displayUspUi')
})

export default {
  initializeCMP,
  doesGDPRApply,
  doesCCPAApply,
  openTCFConsentDialog,
  openCCPAConsentDialog,
}
