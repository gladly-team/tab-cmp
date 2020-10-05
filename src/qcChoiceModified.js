// Code manually copied from QC Choice and modified as needed.
/* eslint no-underscore-dangle:0, no-useless-concat:0, eqeqeq:0 */

export const setUpQuantcastChoice = () => {
  // First section of QC Choice JS.
  // Modified: remove script tag creation for CMP JS. We load
  // the CMP JS ourselves.
  // const cmpScriptElement = document.createElement('script')
  const firstScript = document.getElementsByTagName('script')[0]
  // cmpScriptElement.async = true
  // cmpScriptElement.type = 'text/javascript'
  // const cmpVersion = 'https://quantcast.mgr.consensu.org/tcfv2/14/cmp2.js'
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
