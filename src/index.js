import initCMP from 'src/initCMP'
import getClientLocation from 'src/getClientLocation'

// TODO: gracefully handle if this code is run on the
// server side.

export const getCMPHeadScript = () => {
  // eslint-disable-next-line no-console
  console.log(`[tab-cmp] TODO: getCMPHeadScript`)
}

export const initializeCMP = async (options) => {
  // eslint-disable-next-line no-console
  console.log(
    `[tab-cmp] Called initializeCMP with options: ${JSON.stringify(options)}`
  )

  // TODO: handle potential failure to fetch location
  const { isInUS, isInEuropeanUnion } = await getClientLocation()

  // eslint-disable-next-line no-console
  console.log(
    `[tab-cmp] Client location. isInEU: ${isInEuropeanUnion}. isInUS: ${isInUS}`
  )

  // TODO: add to head tag
  window.tabCMP = window.tabCMP || {}

  // Only set doesGDPRApply and doesCCPAApply if they're not
  // already defined.
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

export const doesGDPRApply = async () => {
  // eslint-disable-next-line no-console
  console.log(`[tab-cmp] TODO: doesGDPRApply`)
}

export const doesCCPAApply = async () => {
  // eslint-disable-next-line no-console
  console.log(`[tab-cmp] TODO: doesCCPAApply`)
}

export const openTCFConsentDialog = async () => {
  // eslint-disable-next-line no-console
  console.log(`[tab-cmp] TODO: openTCFConsentDialog`)
}

export const openCCPAConsentDialog = async () => {
  // eslint-disable-next-line no-console
  console.log(`[tab-cmp] TODO: openCCPAConsentDialog`)
}
