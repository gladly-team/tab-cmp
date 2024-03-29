[![Build Status](https://travis-ci.org/gladly-team/tab-cmp.svg?branch=master)](https://travis-ci.org/gladly-team/tab-cmp)
[![codecov](https://codecov.io/gh/gladly-team/tab-cmp/branch/master/graph/badge.svg)](https://codecov.io/gh/gladly-team/tab-cmp)
[![npm](https://img.shields.io/npm/v/tab-cmp.svg)](https://www.npmjs.com/package/tab-cmp)

# tab-cmp

A Consent Management Platform (CMP) for [Tab for a Cause](https://github.com/gladly-team/tab). Creates IAB-compliant `window.__tcfapi` and `window.__uspapi` functions and saves users' data privacy options.

- [Get Started](#get-started)
- [Why This Package Exists](#why-this-package-exists)
- [API](#api)
- [Developing & Updating](#developing--updating)
- [Notes on Testing](#preparing-to-test-the-integration)
- [Test Checklist](#test-checklist)

## Get Started

1. Add the [`tagModified.html`](./src/tagModified.html) code to the `<head />` of the page.
2. `yarn add tab-cmp`
3. On any page that should have a functional CMP (likely the entire app), intialize the CMP:

```js
import tabCMP from 'tab-cmp'

tabCMP.initializeCMP({
  // Set configuration as needed.
  displayPersistentConsentLink: false,
  onError: (err) => {
    console.error(err)
  },
  primaryButtonColor: '#9d4ba3',
  publisherName: 'Tab for a Cause',
  publisherLogo: tabLogoWithText,
})
```

4. _Optional:_ Ignore unhelpful unhandled rejections from Quantcast Choice. In your app's error logging logic, ignore:
   - Errors with name `GVLError`. This is a network failure when fetching the vendor list.
   - Errors with message `Failed to read the 'localStorage' property from 'Window': Access is denied for this document.`. This is an expected error for the new tab page cross-domain frame in some browsers.

## Why This Package Exists

There are two reasons we aren't simply relying on another vanilla, third-party CMP:

- **iframe support:** Our app often loads within a cross-domain iframe in the new tab page extension. We need the CMP to work normally in the iframe as it would on a top frame.
- **Speed:** Third-party CMPs can take 100s of milliseconds to load and respond, which delays ad requests. The nature of our app requires the CMP to be faster.

If a third-party CMP can support these needs, we can consider deprecating this module.

## API

#### async initializeCMP(config)

Required before calling other methods. Determines the user's country location, runs the QC Choice JS, and sets default USP data as needed.

#### async doesGDPRApply()

Resolves to true if the user is in the EU. Use this to know whether to render GDPR-related privacy options.

#### async doesCCPAApply()

Resolves to true if the user is in the US. Use this to know whether to render CCPA-related privacy options.

#### async openTCFConsentDialog()

Opens the GDPR consent dialog.

#### async openCCPAConsentDialog()

Opens the CCPA data privacy dialog.

## Developing & Updating

### What We Changed

This module wraps the Quantcast Choice CMP. We modify its behavior in a few ways:

- We change the privacy data cookies to `SameSite=None` (from `SameSite=Lax`) so the CMP works in a cross-domain iframe. We package a static version of QC Choice's CMP JS file with the necessary changes.
- We handle geolocation ourselves. This is necessary because QC Choice's CMP JS file is normally dynamic based on location, and we use static JS.
- We add functional stubs for the TCF and USP APIs that relies on data we sync to local storage. This allows our CMP to respond rapidly before QC Choice JS has initialized.
- We add debugging and error logging.

### External Links/Documentation

- Quantcast Choice
  - [QC Choice sites management portal](https://www.quantcast.com/protect/sites)
  - [QC Choice release notes](https://help.quantcast.com/hc/en-us/articles/360047357574-Quantcast-Choice-Code-Release-Notes-TCF-v2-0-)
  - [QC Choice API docs](https://help.quantcast.com/hc/en-us/articles/360047078534-Choice-CMP2-CCPA-API-Index-TCF-v2-0-)
- Ad partners
  - Prebid [GDPR](https://docs.prebid.org/dev-docs/modules/consentManagement.html) and [US privacy](https://docs.prebid.org/dev-docs/modules/consentManagementUsp.html) docs
  - Amazon [privacy docs](https://ams.amazon.com/webpublisher/uam/docs/web-integration-documentation/integration-guide/uam-ccpa.html)
  - Index Exchange [privacy docs](https://kb.indexexchange.com/publishers/managing_your_ix_library/enable_privacy_regulation_support.htm)

### How to Modify Settings or Update to a New Version

Upgrading or modifying Quantcast Choice settings requires a combination of modifying the settings in the QC Choice management panel and modifying local code. Note that some of our CMP settings use the QC Choice panel settings directly, but many settings are hardcoded locally.

1. Update the `tab.gladly.dev` settings in the QC Choice management panel
2. Update the version in the URL of the NPM script `quantcast:cmp-js:download` to match the portal version
3. Run `yarn run quantcast:update`
4. Manually reconcile changes in `./quantcast/qcChoiceOriginal.js` to update `./src/qcChoiceModified.js` and `./src/initCMP.js`
5. If `./quantcast/qcCmpOriginal.js` has changed:
   - Ensure it still uses the cookie and geolocation logic that we expect to modify (see the `quantcast:cmp-js:copy-with-edits` NPM script)
   - Run `yarn run quantcast:cmp-js:copy-with-edits`
6. Manually test the CMP in a staging environment. See the test checklist below.
7. Update `tab.gladly.io` settings in the QC Choice management panel to match the `tab.gladly.dev` settings

### Debugging

- Add a `tabCMPDebug=true` URL parameter to the page to enable debug logging
- For `tab-ads`, which is useful to test ad partner behavior: add a `tabAdsDebug=true` URL parameter to the page to enable debug logging
- For Google Ad Manager: enable the [Google Publisher Console](https://support.google.com/admanager/answer/2462712?hl=en)

## Preparing to Test the Integration

We'll want to test

1. basic CMP functionality
2. the CMP UI consent dialogs
3. the integration with ad partners

for each combination of

- privacy context (GDPR/EU or CCPA/US)
- frame context (as a top-level frame or in the new tab page iframe).

This section has info on how to set up these test contexts.

### Clearing Existing Data

To reset CMP state:

- delete `tabCMP*` local storage values
- delete the following coookies: `euconsent-v2`, `usprivacy`, `addtl_consent`
- Clear cache storage after changing VPN location to ensure the geolocation is updated for third party scripts (e.g. Google Ad Manager or Amazon)

### How to Set Geolocation

#### EU/GDPR

- In local storage, ensure `tabCMP.clientLocation.isInEU` has a value of `true` and `tabCMP.clientLocation.countryISOCode` has a value of `FR` (or some other EU country ISO code).
- Enable a VPN into that country so our ad partners behave as they will with EU traffic. The Outline app with AWS Lightsail serves as a functional VPN.

#### US/CCPA

- In local storage, ensure `tabCMP.clientLocation.isInEU` has a value of `false` and `tabCMP.clientLocation.countryISOCode` has a value of `US`.
- If you're not in the US, enable a VPN into the US.

### How to Set Frame Context

Our app often loads in the new tab page iframe, in the context of a browser extension. CMP and ad partner behavior can be different in an iframe, so we have to specifically test it.

#### App as Top Frame

- Visit [Tab for a Cause](https://tab.gladly.io/newtab/) directly and test there.

#### Within an Iframe

- Open a new tab page with the Tab for a Cause browser extension enabled.
- If testing non-production versions of the app, manually modify the iframe `src` to use that domain. To refresh, modify the `src` rather than refreshing the top-level page.
- When testing CMP APIs, do so from the app frame, not the top-level extension frame.

## Test Checklist

### US/CCPA

**Basic CMP functionality**

- A new user has the expected default privacy string. Clear the CMP data, then run:

  ```js
  __uspapi('getUSPData', 1, (uspData, success) => {
    console.log('cmp responded:', uspData, success)
  })
  ```

  The `uspString` property value should be `1YNN`.

  Works on:

  - [ ] top frame
  - [ ] iframed new tab

- GDPR should not apply. Run:
  ```js
  __tcfapi('getTCData', 2, (tcData, success) => {
    console.log('cmp responded:', tcData, success)
  })
  ```
  The `gdprApplies` property value should be `false`.
  Works on:
  - [ ] top frame
  - [ ] iframed new tab

**CMP Consent Dialog**

- The user's account page should show a "Do Not Show My Info" link that opens the CCPA dialog.

  Works on:

  - [ ] top frame
  - [ ] iframed new tab

- The user's choice should persist. Open the dialog, opt out of data sale, and save. Refresh the app, open the dialog, and confirm you are still opted out.

  Works on:

  - [ ] top frame
  - [ ] iframed new tab

- After opting out of data sale, the USP string changes. Run:

  ```js
  __uspapi('getUSPData', 1, (uspData, success) => {
    console.log('cmp responded:', uspData, success)
  })
  ```

  The `uspString` property value should be `1YYN`.

  Works on:

  - [ ] top frame
  - [ ] iframed new tab

**Ad Partner Behavior**

- The request to Google Ad Manager includes the expected privacy options. For the request to `securepubads.g.doubleclick.net/gampad/`: the `us_privacy` query string value is `1YNN` and the `gdpr` value is `0`.

  Works on:

  - [ ] top frame
  - [ ] iframed new tab

- The request to Amazon has expected privacy options. For the request to `https://c.amazon-adsystem.com/e/dtb/bid`: the `pj` query string value is `{"us_privacy":"1YNN"}`, the `gdpre` value is `0`, and the `gdprl.status` value is `tcfv2-success`.

  Works on:

  - [ ] top frame
  - [ ] iframed new tab

- A Prebid partner uses expected privacy options. E.g., for the Sonobi request to `apex.go.sonobi.com/trinity.json`: the `us_privacy` query string value is `1YNN` and the `gdpr` value is `false`.

  Works on:

  - [ ] top frame
  - [ ] iframed new tab

- Index Exchange uses expected privacy options. For the request to `htlb.casalemedia.com/cygnus`: the `r` query string value includes the `regs` property equal to `{"ext":{"gdpr":0,"us_privacy":"1YNN"}}`.

  Works on:

  - [ ] top frame
  - [ ] iframed new tab

- The request to fetch ads is not substantially slower than prior to making CMP changes. Compare the request time of `securepubads.g.doubleclick.net/gampad/` to a prior deployment.

  Confirmed on:

  - [ ] top frame

  _It's challenging to accurately test timing in the iframe, so no need to._

### EU/GDPR

**Basic CMP functionality**
Start by clearing the CMP data, then consenting to data usage.

- The CMP responds with expected data. Run:

  ```js
  __tcfapi('getTCData', 2, (tcData, success) => {
    console.log('cmp responded:', tcData, success)
  })
  ```

  The `gdprApplies` property value should be `true`, and the `tcString` and `addtlConsent` properties should be set.

  Works on:

  - [ ] top frame
  - [ ] iframed new tab

- CCPA should not apply. Run:
  ```js
  __uspapi('getUSPData', 1, (uspData, success) => {
    console.log('cmp responded:', uspData, success)
  })
  ```
  The `uspString` property value should be `1---`.
  Works on:
  - [ ] top frame
  - [ ] iframed new tab

**CMP Consent Dialog**

- The consent dialog appears on first use.

  - Clear the CMP data, then refresh the page.
  - Ensure the dialog appears.
  - Choose some custom data use consents and save.
  - Refresh the page and ensure the dialog does _not_ reappear.

  ####

  Works on:

  - [ ] top frame
  - [ ] iframed new tab

- The user's account page should show a "Privacy Options" button that opens the GDPR dialog. Opening it should show the options you previously selected.

  Works on:

  - [ ] top frame
  - [ ] iframed new tab

- The user's choices should persist. Open the dialog, change your options, and save. Refresh the app, open the dialog, and confirm your changes are still there.

  Works on:

  - [ ] top frame
  - [ ] iframed new tab

**Ad Partner Behavior**

- The request to Google Ad Manager includes the expected privacy options. For the request to `securepubads.g.doubleclick.net/gampad/`: the `us_privacy` query string value is `1---`, the `gdpr` value is `1`, the `gdpr_consent` value is the consent string (matching the `euconsent-v2` cookie value), and `addtl_consent` is a string of numbers.

  Works on:

  - [ ] top frame
  - [ ] iframed new tab

- The request to Amazon has expected privacy options. For the request to `https://c.amazon-adsystem.com/e/dtb/bid`: the `pj` query string value is `{"us_privacy":"1---"}`, the `gdpre` value is `1`, the `gdprc` value is the consent string, and the `gdprl.status` value is `tcfv2-success`.

  Works on:

  - [ ] top frame
  - [ ] iframed new tab

- A Prebid partner uses expected privacy options. E.g., for the Sonobi request to `apex.go.sonobi.com/trinity.json`: the `us_privacy` query string value is `1---`, the `gdpr` value is `true`, and the `consent_string` value is the consent string.

  Works on:

  - [ ] top frame
  - [ ] iframed new tab

- Index Exchange uses expected privacy options. For the request to `htlb.casalemedia.com/cygnus`: the `r` query string value includes the `regs` property equal to `{"ext":{"gdpr":1,"us_privacy":"1---"}}` and an `ext` property with a `consent` value equal to the consent string.

  Works on:

  - [ ] top frame
  - [ ] iframed new tab

- The request to fetch ads is not substantially slower than prior to making CMP changes. Compare the request time of `securepubads.g.doubleclick.net/gampad/` to a prior deployment.

  Confirmed on:

  - [ ] top frame

  _It's challenging to accurately test timing in the iframe, so no need to._
