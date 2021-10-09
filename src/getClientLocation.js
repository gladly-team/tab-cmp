// Get the client location with a country-level granularity.
// This expects that the MaxMind script already created the
// `window.geoip2` object.

import localStorageMgr from 'src/localStorageMgr'
import {
  isNil,
  getCurrentISOString,
  getNumDaysBetweenDates,
  ISOStringToDate,
} from 'src/utils'
import { logError } from 'src/logger'

// Local storage keys.
const STORAGE_PREFIX = 'tabCMP'
const STORAGE_CLIENT_LOCATION_PREFIX = 'clientLocation'
const makeStorageKey = (keyName) =>
  `${STORAGE_PREFIX}.${STORAGE_CLIENT_LOCATION_PREFIX}.${keyName}`
const STORAGE_COUNTRY_ISO_CODE = makeStorageKey('countryISOCode')
const STORAGE_IS_IN_EU = makeStorageKey('isInEU')
const STORAGE_QUERY_TIME = makeStorageKey('queryTime')

// Store location in memory to avoid unnecessary queries.
// This will be an instance of ClientLocation.
let location = null

// To store in-progress fetches so we don't fetch location
// more than once.
let locationFetchPromise = null

function ClientLocation(countryISOCode, isInEuropeanUnion, queryTime) {
  this.countryISOCode = countryISOCode
  this.isInEuropeanUnion = isInEuropeanUnion
  this.isInUS = countryISOCode && countryISOCode.toUpperCase() === 'US'

  // An ISO string
  this.queryTime = queryTime
}

/**
 * Whether a MaxMind error concerns us enough to log.
 * @param {Object} err - The MaxMind error object
 * @return {Boolean} Whether we should log the MaxMind error
 */
const shouldLogMaxMindError = (err) =>
  ['QUERY_FORBIDDEN', 'OUT_OF_QUERIES', 'PERMISSION_REQUIRED'].indexOf(
    err.code
  ) > -1

/**
 * Call MaxMind for location data and return a ClientLocation object.
 * @return {ClientLocation} The location object
 */
const getLocationFromMaxMind = () => {
  // MaxMind response structure. See:
  // https://dev.maxmind.com/geoip/geoip2/web-services/
  // The key "country.is_in_european_union" will be true if the country
  // is in EU. Otherwise, it will be undefined.
  // {
  //   "continent": {
  //     "code": "NA",
  //     "geoname_id": 6255149,
  //     "names": {
  //       "en": "North America"
  //       ...
  //     }
  //   },
  //   "country": {
  //     "iso_code": "US",
  //     "geoname_id": 6252001,
  //     "names": {
  //       "en": "United States",
  //       ...
  //     }
  //   },
  //   "registered_country": {
  //     "iso_code": "US",
  //     "geoname_id": 6252001,
  //     "names": {
  //       "en": "United States",
  //       ...
  //     }
  //   },
  //   "traits": {
  //     "ip_address": "73.xxx.xxx.x"
  //   }
  // }

  // If a fetch is in progress, return that promise
  // so we don't fetch location more than once.
  if (locationFetchPromise) {
    return locationFetchPromise
  }

  // Store the promise so subsequent requests can use it
  // if this request is still in progress.
  locationFetchPromise = new Promise((resolve, reject) => {
    // https://dev.maxmind.com/geoip/geoip2/javascript/
    try {
      window.geoip2.country(
        (data) => {
          const isInEuropeanUnion = data.country.is_in_european_union === true
          resolve(
            new ClientLocation(
              data.country.iso_code,
              isInEuropeanUnion,
              getCurrentISOString()
            )
          )
        },
        (err) => {
          // Log a subset of errors that we care about to Sentry.
          if (shouldLogMaxMindError(err)) {
            logError(err)
          }
          reject(err)
        }
      )
    } catch (err) {
      // Log a subset of errors that we care about to Sentry.
      if (shouldLogMaxMindError(err)) {
        logError(err)
      }
      reject(err)
    }
  })
  return locationFetchPromise
}

/**
 * Try to get location data from localStorage. If it exists and hasn't
 * expired, return a ClientLocation object; else return null.
 * @return {ClientLocation|null} The location object, or null if no
 *   unexpired location exists in localStorage.
 */
const getLocationFromLocalStorage = () => {
  const countryCode = localStorageMgr.getItem(STORAGE_COUNTRY_ISO_CODE)
  const isInEuropeanUnionStr = localStorageMgr.getItem(STORAGE_IS_IN_EU)
  const queryTimeISO = localStorageMgr.getItem(STORAGE_QUERY_TIME)
  let queryTime
  try {
    queryTime = ISOStringToDate(queryTimeISO)
  } catch (e) {
    queryTime = null
  }
  const isInEuropeanUnion = localStorageMgr.getItem(STORAGE_IS_IN_EU) === 'true'

  // If the location data does not exist, return null.
  const isDataValid =
    !isNil(countryCode) && !isNil(isInEuropeanUnionStr) && !isNil(queryTime) // null if the date is invalid
  if (!isDataValid) {
    return null
  }

  // If the location data is too old, return null.
  const now = new Date()
  const daysSinceLocationQuery = getNumDaysBetweenDates(now, queryTime)
  const LOCATION_EXPIRE_DAYS = 60
  if (daysSinceLocationQuery > LOCATION_EXPIRE_DAYS) {
    return null
  }

  return new ClientLocation(countryCode, isInEuropeanUnion, queryTime)
}

/**
 * Store the location data in localStorage.
 * @param {ClientLocation} location - The ClientLocation object
 * @return {undefined}
 */
const setLocationInLocalStorage = (userClientLocation) => {
  localStorageMgr.setItem(
    STORAGE_COUNTRY_ISO_CODE,
    userClientLocation.countryISOCode
  )
  localStorageMgr.setItem(
    STORAGE_IS_IN_EU,
    userClientLocation.isInEuropeanUnion.toString()
  )
  localStorageMgr.setItem(STORAGE_QUERY_TIME, userClientLocation.queryTime)
}

/**
 * Return the client's location. Try to get the location data from memory;
 * fall back to localStorage; then fall back to querying MaxMind for
 * new location data. Throw an error if we cannot determine location.
 * @return {Promise<ClientLocation>} The client's location
 */
const getClientLocation = async () => {
  // Only fetch location if we haven't already.
  if (!location) {
    // Try to get the location data from localStorage.
    const locationLocalStorage = getLocationFromLocalStorage()
    if (locationLocalStorage) {
      location = locationLocalStorage
      // If location isn't in localStorage, query for it.
    } else {
      // Throw an error if MaxMind cannot determine the location.
      let maxMindLocation = null
      try {
        maxMindLocation = await getLocationFromMaxMind()
      } catch (e) {
        throw new Error(
          `Could not determine client location. Error: ${JSON.stringify(e)}`
        )
      }
      if (!maxMindLocation) {
        throw new Error('Could not determine client location.')
      }

      // Save the location to localStorage and return it.
      location = maxMindLocation
      setLocationInLocalStorage(location)
    }
  }
  return location
}

export default getClientLocation
