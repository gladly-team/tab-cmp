/* eslint no-underscore-dangle:0, no-useless-concat:0, eqeqeq:0 */

const setUpQuantcastChoice = () => {
  // First section of QC Choice JS.
  // Modified: remove script tag creation for CMP JS. We load
  // the CMP JS ourselves.
  // const cmpScriptElement = document.createElement('script')
  const firstScript = document.getElementsByTagName('script')[0]
  // cmpScriptElement.async = true
  // cmpScriptElement.type = 'text/javascript'
  // const cmpVersion = 'https://quantcast.mgr.consensu.org/tcfv2/9/cmp2.js'
  // cmpScriptElement.src = cmpVersion
  window._qevents = window._qevents || []

  // Second section of QC Choice JS.
  const elem = document.createElement('script')
  elem.src = `${
    document.location.protocol == 'https:' ? 'https://secure' : 'http://edge'
  }.quantserve.com/quant.js`
  elem.async = true
  elem.type = 'text/javascript'
  const scpt = document.getElementsByTagName('script')[0]
  scpt.parentNode.insertBefore(elem, scpt)

  // Third section of QC Choice JS.
  const qcaccount = 'p-' + 'FPBLJYpJgR9Zu'
  window._qevents.push({ qacct: qcaccount, source: 'choice' })
  const cmpNoScriptElement = document.createElement('noscript')
  const div = document.createElement('div')
  div.style.display = 'none;'
  const img = document.createElement('img')
  img.src = '//pixel.quantserve.com/pixel/p-' + 'FPBLJYpJgR9Zu' + '.gif'
  img.border = '0'
  img.height = '1'
  img.width = '1'
  img.alt = 'Quantcast'
  div.appendChild(img)
  cmpNoScriptElement.appendChild(div)
  firstScript.parentNode.insertBefore(cmpNoScriptElement, firstScript)
  // Modified: remove script tag creation for CMP JS. We load
  // the CMP JS ourselves.
  // firstScript.parentNode.insertBefore(cmpScriptElement, firstScript)

  // Fourth section of QC Choice JS.
  let css = ''
  // eslint-disable-next-line no-unused-expressions
  '' +
    ' .qc-cmp-button { ' +
    '   background-color: #9d4ba3 !important; ' +
    '   border-color: #9d4ba3 !important; ' +
    ' } ' +
    ' .qc-cmp-button:hover { ' +
    '   border-color: #9d4ba3 !important; ' +
    ' } ' +
    ' .qc-cmp-alt-action, ' +
    ' .qc-cmp-link { ' +
    '   color: #9d4ba3 !important; ' +
    ' } ' +
    ' .qc-cmp-button.qc-cmp-secondary-button:hover { ' +
    '   background-color: #9d4ba3 !important; ' +
    '   border-color: #9d4ba3 !important; ' +
    ' } ' +
    ' .qc-cmp-button.qc-cmp-secondary-button:hover { ' +
    '   color: #ffffff !important; ' +
    ' } ' +
    ' .qc-cmp-button.qc-cmp-secondary-button { ' +
    '   color: #368bd6 !important; ' +
    ' } ' +
    ' .qc-cmp-button.qc-cmp-secondary-button { ' +
    '   background-color: #eee !important; ' +
    '   border-color: transparent !important; ' +
    ' } ' +
    '' +
    ''
  const stylesElement = document.createElement('style')
  const re = new RegExp('&quote;', 'g')
  css = css.replace(re, '"')
  stylesElement.type = 'text/css'
  if (stylesElement.styleSheet) {
    stylesElement.styleSheet.cssText = css
  } else {
    stylesElement.appendChild(document.createTextNode(css))
  }
  const head = document.head || document.getElementsByTagName('head')[0]
  head.appendChild(stylesElement)
}

const getLanguage = () => {
  // Fifth section of QC Choice JS.
  let autoDetectedLanguage = 'en'
  function splitLang(lang) {
    return lang.length > 2 ? lang.split('-')[0] : lang
  }
  function isSupported(lang) {
    const langs = [
      'en',
      'fr',
      'de',
      'it',
      'es',
      'da',
      'nl',
      'el',
      'hu',
      'pt',
      'ro',
      'fi',
      'pl',
      'sk',
      'sv',
      'no',
      'ru',
      'bg',
      'ca',
      'cs',
      'et',
      'hr',
      'lt',
      'lv',
      'mt',
      'sl',
      'tr',
      'zh',
    ]
    return langs.indexOf(lang) !== -1
  }
  if (isSupported(splitLang(document.documentElement.lang))) {
    autoDetectedLanguage = splitLang(document.documentElement.lang)
  } else if (isSupported(splitLang(navigator.language))) {
    autoDetectedLanguage = splitLang(navigator.language)
  }
  return autoDetectedLanguage
}

const initCMP = (options = {}) => {
  // eslint-disable-next-line no-console
  console.log(`[tab-cmp] initCMP called with ${JSON.stringify(options)}`)

  setUpQuantcastChoice()

  const language = getLanguage()

  // TODO: support customizations
  window.__tcfapi('init', 2, () => {}, {
    premiumProperties: {},
    coreUiLabels: {},
    premiumUiLabels: {
      uspDnsText: [
        '<p>We, and our partners, use technologies to process personal information, including IP addresses, pseudonymous identifiers associated with cookies, and in some cases mobile ad IDs. This information is processed to personalize content based on your interests, run and optimize marketing campaigns, measure the performance of ads and content, and derive insights about the audiences who engage with ads and content. This data is an integral part of how we raise money for non-profit partners, make revenue to support our staff, and generate relevant content for our audience. You can learn more about our data collection and use practices in our Privacy Policy.</p><br/><p>If you wish to request that your personal information is not shared with third parties, please click on the below checkbox and confirm your selection. Please note that after your opt out request is processed, we may still collect your information in order to operate our site.</p>',
      ],
    },
    theme: { uxPrimaryButtonColor: '#9d4ba3' },
    coreConfig: {
      initScreenBodyTextOption: 1,
      consentScope: 'service',
      lang_: language,
      defaultToggleValue: 'off',
      displayUi: 'inEU',
      displayPersistentConsentLink: true,
      initScreenRejectButtonShowing: false,
      publisherLogo:
        'https://tab.gladly.io/static/logo-with-text-257bbffc6dcac5076e8ac31eed8ff73c.svg',
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
      hashCode: 'csG3IDVSxoj0rG+udKdEXA',
      publisherCountryCode: 'US',
      publisherName: 'LOCAL - Tab for a Cause',
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
  require('src/qcCmpModified')
}

export default initCMP
