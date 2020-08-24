[![Build Status](https://travis-ci.org/gladly-team/tab-cmp.svg?branch=master)](https://travis-ci.org/gladly-team/tab-cmp)
[![codecov](https://codecov.io/gh/gladly-team/tab-cmp/branch/master/graph/badge.svg)](https://codecov.io/gh/gladly-team/tab-cmp)
[![npm](https://img.shields.io/npm/v/tab-cmp.svg)](https://www.npmjs.com/package/tab-cmp)

# tab-cmp

A wrapper for the Consent Management Platform used on [Tab for a Cause](https://github.com/gladly-team/tab)

## Get Started

TODO: how to add this to a project.

## API

TODO: methods

## Developing & Updating

TODO: info on what we changed in the CMP and how to update it

## Preparing to Test the Integration

We'll want to test
1. basic CMP functionality
2. the CMP UI consent dialogs
3. the integration with ad partners

for each combination of
* privacy context (GDPR/EU or CCPA/US)
* frame context (as a top-level frame or in the new tab page iframe).

This section has info on how to set up these test contexts.

### Clearing Existing Data

To reset CMP state:
* delete `tabCMP*` local storage values
* delete the following coookies: `euconsent-v2`, `usprivacy`, `addtl_consent`
* if using unmodified Quantcast Choice, which we are not currently doing, clear the browser cache after changing VPNs to ensure the geolocation is updated

### How to Set Geolocation

#### EU/GDPR
* In local storage, ensure `tabCMP.clientLocation.isInEU` has a value of `true` and `tabCMP.clientLocation.countryISOCode` has a value of `FR` (or some other EU country ISO code).
* Enable a VPN into that country so our ad partners behave as they will with EU traffic. The Outline app with AWS Lightsail serves as a functional VPN.

#### US/CCPA
* In local storage, ensure `tabCMP.clientLocation.isInEU` has a value of `false` and `tabCMP.clientLocation.countryISOCode` has a value of `US`.
* If you're not in the US, enable a VPN into the US.

### How to Set Frame Context
Our app often loads in the new tab page iframe, in the context of a browser extension. CMP and ad partner behavior can be different in an iframe, so we have to specifically test it.

#### App as Top Frame
* Visit [Tab for a Cause](https://tab.gladly.io/newtab/) directly and test there.

#### Within an Iframe
* Open a new tab page with the Tab for a Cause browser extension enabled.
* If testing non-production versions of the app, manually modify the iframe `src` to use that domain. To refresh, modify the `src` rather than refreshing the top-level page.

## Test Checklist
TODO
