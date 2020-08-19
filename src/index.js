import initCMP from 'src/initCMP'
import getClientLocation from 'src/getClientLocation'

let tabCMPInitialized = false

const requireCMPInitialized = (func) => (args) => {
  if (!tabCMPInitialized) {
    // We don't want tab-cmp to ever throw. We'd rather it fail
    // silently than disrupt its parent app.
    // eslint-disable-next-line no-console
    console.error(
      `[tab-cmp] initializeCMP must be called before calling any other tab-cmp methods.`
    )

    // To allow composition.
    return () => {}
  }

  return func(args)
}

// TODO: gracefully handle if this code is run on the
// server side.

export const getCMPHeadScript = requireCMPInitialized(() => {
  // eslint-disable-next-line no-console
  console.log(`[tab-cmp] TODO: getCMPHeadScript`)
})

export const initializeCMP = async (options) => {
  // Ensure initializeCMP is called only once.
  if (tabCMPInitialized) {
    // eslint-disable-next-line no-console
    console.warn(
      `[tab-cmp] initializeCMP was called more than once. Ignoring this initialization.`
    )
    return
  }
  tabCMPInitialized = true

  // eslint-disable-next-line no-console
  console.log(
    `[tab-cmp] Called initializeCMP with options: ${JSON.stringify(options)}`
  )

  // Determine the client location to know which privacy laws apply.
  let isInUS = false
  let isInEuropeanUnion = false
  try {
    ;({ isInUS, isInEuropeanUnion } = await getClientLocation())
    // If client location determination fails, default to no GDPR/CCPA,
    // which will fall back on IP geolocation in calls to ad partners.
    // eslint-disable-next-line no-empty
  } catch (e) {}

  // eslint-disable-next-line no-console
  console.log(
    `[tab-cmp] Client location. isInEU: ${isInEuropeanUnion}. isInUS: ${isInUS}`
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
  initCMP()

  // TODO: move into separate module.
  // We need to set the default USP data, which QC Choice does
  // not do.
  // https://help.quantcast.com/hc/en-us/articles/360047078534-Choice-CMP2-CCPA-API-Index-TCF-v2-0-
  if (typeof window.__uspapi === 'function') {
    window.__uspapi('uspPing', 1, (obj, status) => {
      if (
        status &&
        obj.mode.includes('USP') &&
        obj.jurisdiction.includes(obj.location.toUpperCase())
      ) {
        window.__uspapi('setUspDftData', 1, () => {
          if (!status) {
            // eslint-disable-next-line no-console
            console.log('Error: USP string not updated!')
          }
        })
      }
    })
  }
}

export const doesGDPRApply = requireCMPInitialized(async () => {
  // eslint-disable-next-line no-console
  console.log(`[tab-cmp] TODO: doesGDPRApply`)
})

export const doesCCPAApply = requireCMPInitialized(async () => {
  // eslint-disable-next-line no-console
  console.log(`[tab-cmp] TODO: doesCCPAApply`)
})

export const openTCFConsentDialog = requireCMPInitialized(async () => {
  // eslint-disable-next-line no-console
  console.log(`[tab-cmp] TODO: openTCFConsentDialog`)
})

export const openCCPAConsentDialog = requireCMPInitialized(async () => {
  // eslint-disable-next-line no-console
  console.log(`[tab-cmp] TODO: openCCPAConsentDialog`)
})
