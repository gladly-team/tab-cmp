// Code manually copied from QC Choice and modified as needed.
/* eslint no-underscore-dangle:0, no-useless-concat:0, eqeqeq:0 */

export const setUpQuantcastChoice = () => {
  // First section of QC Choice JS.
  // Modified: remove script tag creation for CMP JS. We load
  // the CMP JS ourselves.
  // const cmpFile =
  // 'noModule' in HTMLScriptElement.prototype ? 'cmp2.js' : 'cmp2-polyfilled.js'
  // const cmpScriptElement = document.createElement('script')
  // const firstScript = document.getElementsByTagName('script')[0]
  // cmpScriptElement.async = true
  // cmpScriptElement.type = 'text/javascript'
  // let cmpVersion
  // const tagUrl = document.currentScript.src
  // if (tagUrl.includes('tag_version')) {
  //   cmpVersion =
  //     'https://cmp.quantcast.com/tcfv2/45/CMP_FILE?referer=tab.gladly.dev'.replace(
  //       'CMP_FILE',
  //       cmpFile
  //     )
  // } else {
  //   cmpVersion =
  //     'https://quantcast.mgr.consensu.org/tcfv2/45/CMP_FILE?referer=tab.gladly.dev'.replace(
  //       'CMP_FILE',
  //       cmpFile
  //     )
  // }
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

  // Modified: remove script tag creation for CMP JS. We load
  // the CMP JS ourselves.
  // firstScript.parentNode.insertBefore(cmpScriptElement, firstScript)

  // Fourth section of QC Choice JS.
  let css =
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
  // eslint-disable-next-line prefer-regex-literals
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

export const getLanguage = () => {
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
