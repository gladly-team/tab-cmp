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

  setUpQuantcastChoice()

  const language = getLanguage()

  window.__tcfapi('init', 2, () => {}, {
    premiumProperties: {},
    coreUiLabels: {},
    premiumUiLabels: {
      uspDnsText: [
        '<p>This preference sets whether advertisers can personalize ads to you. Personalized ads can be more interesting and often raise more money for charity. We <strong>never</strong> sell personal information like email addresses, nor do we collect your browsing history on other sites.</p><br/><p>We and our partners use technologies to process personal information, including IP addresses and pseudonymous identifiers associated with cookies. This information is processed to personalize ads based on your interests, run and optimize marketing campaigns, measure the performance of ads and content, and derive insights about the audiences who engage with ads and content. This data is an integral part of how we raise money for non-profit partners, make revenue to support our staff, and generate relevant content for our audience. You can learn more about our data collection and use practices in our Privacy Policy.</p><br/><p>If you wish to request that your personal information is not shared with third parties, please click on the below checkbox and confirm your selection. Please note that after your opt out request is processed, we may still collect your information in order to operate our site.</p>',
      ],
    },
    theme: { uxPrimaryButtonColor: primaryButtonColor },
    coreConfig: {
      initScreenBodyTextOption: 1,
      consentScope: 'service',
      lang_: language,
      defaultToggleValue: 'off',
      displayUi: 'inEU',
      displayPersistentConsentLink,
      initScreenRejectButtonShowing: false,
      publisherLogo,
      publisherPurposeIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      publisherPurposeLegitimateInterestIds: [2, 7, 8, 10],
      publisherSpecialPurposesIds: [1, 2],
      publisherFeaturesIds: [],
      publisherSpecialFeaturesIds: [],
      stacks: [1, 42],
      softOptInEnabled: false,
      uiLayout: 'popup',
      vendorListUpdateFreq: 90,
      thirdPartyStorageType: 'iframe',
      showSummaryView: true,
      persistentConsentLinkLocation: 4,
      quantcastAccountId: 'FPBLJYpJgR9Zu',
      privacyMode: ['GDPR', 'USP'],
      hashCode: 'itSkgHcJApF//qeoSHAXSQ',
      publisherCountryCode: 'US',
      publisherName,
      vendorPurposeIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      vendorFeaturesIds: [1, 2, 3],
      vendorPurposeLegitimateInterestIds: [2, 3, 4, 5, 6, 7, 8, 9, 10],
      vendorSpecialFeaturesIds: [1, 2],
      vendorSpecialPurposesIds: [1, 2],
      googleEnabled: true,
      uspVersion: 1,
      uspJurisdiction: ['US'],
      uspLspact: 'N',
      suppressCcpaLinks: true,
    },
  })

  // Important: the CMP JS apparently must load after the
  // initial call to __tcfapi above.
  try {
    loadQCCmpModified()
  } catch (e) {
    // Ignore global vendor list errors, which are just network
    // failures.
    if (e.name !== 'GVLError') {
      throw e
    }
  }
}

export default initCMP
