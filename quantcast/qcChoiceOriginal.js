;(function () {
  const cmpFile =
    'noModule' in HTMLScriptElement.prototype ? 'cmp2.js' : 'cmp2-polyfilled.js'
  ;(function () {
    const cmpScriptElement = document.createElement('script')
    const firstScript = document.getElementsByTagName('script')[0]
    cmpScriptElement.async = true
    cmpScriptElement.type = 'text/javascript'
    const cmpVersion =
      'https://quantcast.mgr.consensu.org/tcfv2/35/CMP_FILE?referer=tab.gladly.dev'.replace(
        'CMP_FILE',
        cmpFile
      )
    cmpScriptElement.src = cmpVersion
    window._qevents = window._qevents || []
    ;(function () {
      const elem = document.createElement('script')
      elem.src = `${
        document.location.protocol == 'https:'
          ? 'https://secure'
          : 'http://edge'
      }.quantserve.com/quant.js`
      elem.async = true
      elem.type = 'text/javascript'
      const scpt = document.getElementsByTagName('script')[0]
      scpt.parentNode.insertBefore(elem, scpt)
    })()
    const qcaccount = 'p-' + 'FPBLJYpJgR9Zu'
    window._qevents.push({ qacct: qcaccount, source: 'choice' })
    firstScript.parentNode.insertBefore(cmpScriptElement, firstScript)
  })()
  ;(function () {
    let css = ''
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
  })()
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
  const choiceMilliSeconds = new Date().getTime()
  window.__tcfapi('init', 2, () => {}, {
    premiumProperties: { googleWhitelist: [1] },
    coreUiLabels: {},
    premiumUiLabels: {
      uspDnsText: [
        '<p>This preference sets whether advertisers can personalize ads to you. Personalized ads can be more interesting and often raise more money for charity. We <strong>never</strong> sell personal information like email addresses, nor do we collect your browsing history on other sites.</p>\n<p><br></p>\n<p>We and our partners use technologies to process personal information, including IP addresses and pseudonymous identifiers associated with cookies. This information is processed to personalize ads based on your interests, run and optimize marketing campaigns, measure the performance of ads and content, and derive insights about the audiences who engage with ads and content. This data is an integral part of how we raise money for non-profit partners, make revenue to support our staff, and generate relevant content for our audience. You can learn more about our data collection and use practices in our Privacy Policy.</p>\n<p><br></p>\n<p>If you wish to request that your personal information is not shared with third parties, please click on the below checkbox and confirm your selection. Please note that after your opt out request is processed, we may still collect your information in order to operate our site.</p>',
      ],
    },
    theme: { uxPrimaryButtonColor: '#9d4ba3' },
    coreConfig: {
      consentScope: 'service',
      thirdPartyStorageType: 'iframe',
      consentOnSafari: false,
      lang_: 'en',
      displayUi: 'inEU',
      initScreenBodyTextOption: 1,
      defaultToggleValue: 'off',
      initScreenRejectButtonShowing: false,
      publisherConsentRestrictionIds: [],
      publisherLIRestrictionIds: [],
      softOptInEnabled: false,
      showSummaryView: true,
      persistentConsentLinkLocation: 4,
      displayPersistentConsentLink: false,
      uiLayout: 'popup',
      publisherLogo:
        'https://tab.gladly.io/static/logo-with-text-257bbffc6dcac5076e8ac31eed8ff73c.svg',
      publisherPurposeIds: [1, 3, 4, 5, 6, 9],
      publisherPurposeLegitimateInterestIds: [2, 7, 8, 10],
      publisherSpecialPurposesIds: [1, 2],
      publisherFeaturesIds: [],
      publisherSpecialFeaturesIds: [],
      stacks: [1, 42],
      vendorListUpdateFreq: 90,
      quantcastAccountId: 'FPBLJYpJgR9Zu',
      privacyMode: ['GDPR', 'USP'],
      hashCode: 'r4Yq4GlcC8fElXrt+v/1AA',
      publisherCountryCode: 'US',
      publisherName: 'LOCAL - Tab for a Cause',
      vendorPurposeIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 1],
      vendorFeaturesIds: [1, 3, 2],
      vendorPurposeLegitimateInterestIds: [3, 5, 7, 8, 9, 2, 4, 10, 6],
      vendorSpecialFeaturesIds: [1, 2],
      vendorSpecialPurposesIds: [1, 2],
      googleEnabled: true,
      uspVersion: 1,
      uspJurisdiction: ['US'],
      uspLspact: 'N',
      suppressCcpaLinks: true,
    },
    nonIabVendorsInfo: {},
  })
})()
