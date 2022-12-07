// Code manually copied from QC Choice and modified as needed.
/* eslint no-underscore-dangle:0 */

import { setUpQuantcastChoice, getLanguage } from 'src/qcChoiceModified'
import loadQCCmpModified from 'src/loadQCCmpModified'

const initCMP = (options) => {
  const {
    publisherName,
    publisherLogo,
    displayPersistentConsentLink,
    primaryButtonColor,
  } = options

  if (typeof window.__tcfapi !== 'function') {
    throw new Error(
      'window.__tcfapi must be defined before initializing the CMP. Confirm the head tag is set.'
    )
  }

  setUpQuantcastChoice()

  const language = getLanguage()

  window.__tcfapi('init', 2, () => {}, {
    coreConfig: {
      uspVersion: 1,
      uspJurisdiction: ['US'],
      uspLspact: 'N',
      suppressCcpaLinks: true,
      quantcastAccountId: 'FPBLJYpJgR9Zu',
      privacyMode: ['GDPR', 'USP'],
      hashCode: 'r4Yq4GlcC8fElXrt+v/1AA',
      publisherCountryCode: 'US',
      publisherName,
      vendorPurposeIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 1],
      vendorFeaturesIds: [1, 3, 2],
      vendorPurposeLegitimateInterestIds: [3, 5, 7, 8, 9, 2, 4, 10, 6],
      vendorSpecialFeaturesIds: [1, 2],
      vendorSpecialPurposesIds: [1, 2],
      googleEnabled: true,
      consentScope: 'service',
      thirdPartyStorageType: 'iframe',
      consentOnSafari: false,
      displayUi: 'inEU',
      defaultToggleValue: 'off',
      initScreenRejectButtonShowing: false,
      softOptInEnabled: false,
      showSummaryView: true,
      persistentConsentLinkLocation: 4,
      displayPersistentConsentLink,
      uiLayout: 'popup',
      publisherLogo,
      vendorListUpdateFreq: 90,
      publisherPurposeIds: [1, 3, 4, 5, 6, 9],
      initScreenBodyTextOption: 1,
      publisherConsentRestrictionIds: [],
      publisherLIRestrictionIds: [],
      publisherPurposeLegitimateInterestIds: [2, 7, 8, 10],
      publisherSpecialPurposesIds: [1, 2],
      stacks: [1, 42],
      lang_: language,
    },
    premiumUiLabels: {
      uspDnsText: [
        '<p>This preference sets whether advertisers can personalize ads to you. Personalized ads can be more interesting and often raise more money for charity. We <strong>never</strong> sell personal information like email addresses, nor do we collect your browsing history on other sites.</p>\n<p><br></p>\n<p>We and our partners use technologies to process personal information, including IP addresses and pseudonymous identifiers associated with cookies. This information is processed to personalize ads based on your interests, run and optimize marketing campaigns, measure the performance of ads and content, and derive insights about the audiences who engage with ads and content. This data is an integral part of how we raise money for non-profit partners, make revenue to support our staff, and generate relevant content for our audience. You can learn more about our data collection and use practices in our Privacy Policy.</p>\n<p><br></p>\n<p>If you wish to request that your personal information is not shared with third parties, please click on the below checkbox and confirm your selection. Please note that after your opt out request is processed, we may still collect your information in order to operate our site.</p>',
      ],
    },
    premiumProperties: { googleWhitelist: [1] },
    coreUiLabels: {},
    theme: { uxPrimaryButtonColor: primaryButtonColor },
    nonIabVendorsInfo: {},
  })

  // Important: the CMP JS apparently must load after the
  // initial call to __tcfapi above.
  try {
    loadQCCmpModified()
  } catch (e) {
    // The QC Choice CMP async errors might be unhandled. The app's
    // error logging likely also needs to filter out these unhelpful
    // errors.
    const shouldIgnoreErr =
      // Ignore global vendor list errors, which are just network
      // failures.
      e.name === 'GVLError' ||
      // Ignore browsers without localStorage access.
      (e.name === 'TypeError' &&
        e.message === "Cannot read property 'getItem' of null") ||
      // Ignore cross-domain frame errors.
      (e.name === 'SecurityError' &&
        e.message ===
          "Failed to read the 'localStorage' property from 'Window': Access is denied for this document.")

    if (!shouldIgnoreErr) {
      throw e
    }
  }
}

export default initCMP
