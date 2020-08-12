/* eslint-env jest */

import MockDate from 'mockdate'
import { isNil, getCurrentISOString } from 'src/utils'

jest.mock('src/localStorageMgr')

const mockNow = '2018-05-15T10:30:00.000Z'

// Local storage keys.
const STORAGE_LOCATION_COUNTRY_ISO_CODE = 'tabCMP.clientLocation.countryISOCode'
const STORAGE_LOCATION_IS_IN_EU = 'tabCMP.clientLocation.isInEU'
const STORAGE_LOCATION_QUERY_TIME = 'tabCMP.clientLocation.queryTime'

const getMockMaxMindResponse = (
  countryIsoCode = 'US',
  isInEuropeanUnion = null,
  continentIsoCode = 'NA'
) => ({
  continent: {
    code: continentIsoCode,
    geoname_id: 12345678,
    names: {
      en: 'North America',
    },
  },
  country: {
    iso_code: countryIsoCode,
    geoname_id: 24681012,
    names: {
      en: 'United States',
    },
    ...(!isNil(isInEuropeanUnion) && {
      is_in_european_union: isInEuropeanUnion,
    }),
  },
  registered_country: {
    iso_code: countryIsoCode,
    geoname_id: 24681012,
    names: {
      en: 'United States',
    },
    ...(!isNil(isInEuropeanUnion) && {
      is_in_european_union: isInEuropeanUnion,
    }),
  },
  traits: {
    ip_address: '73.xxx.xxx.x',
  },
})

const mockGeoIP = {
  country: jest.fn((successCallback) =>
    successCallback(getMockMaxMindResponse())
  ),
}

beforeAll(() => {
  MockDate.set(mockNow)
  window.geoip2 = mockGeoIP
})

afterEach(() => {
  const localStorageMgr = require('src/localStorageMgr').default
  localStorageMgr.clear()
  jest.clearAllMocks()

  // Because client-location.js stores location in memory
  jest.resetModules()
})

afterAll(() => {
  MockDate.reset()
  delete window.geoip2
})

describe('client-location: response data', () => {
  it('returns the expected set of data', async () => {
    expect.assertions(1)
    mockGeoIP.country.mockImplementationOnce((successCallback) => {
      // Mock that MaxMind says the location is Germany
      return successCallback(getMockMaxMindResponse('DE', true))
    })
    const getClientLocation = require('src/getClientLocation').default
    const data = await getClientLocation()
    expect(data).toEqual({
      countryISOCode: 'DE',
      isInEuropeanUnion: true,
      queryTime: mockNow,
    })
  })

  it('returns expected value for isInEuropeanUnion when it is false (via MaxMind)', async () => {
    expect.assertions(1)
    const getClientLocation = require('src/getClientLocation').default
    const { isInEuropeanUnion } = await getClientLocation()
    expect(isInEuropeanUnion).toBe(false)
  })

  it('returns expected value for isInEuropeanUnion when it is true (via MaxMind)', async () => {
    expect.assertions(1)
    mockGeoIP.country.mockImplementationOnce((successCallback) => {
      // Mock that MaxMind says the location is Germany
      return successCallback(getMockMaxMindResponse('DE', true))
    })
    const getClientLocation = require('src/getClientLocation').default
    const { isInEuropeanUnion } = await getClientLocation()
    expect(isInEuropeanUnion).toBe(true)
  })

  it('returns expected value for isInEuropeanUnion when it is false (via localStorage)', async () => {
    expect.assertions(1)

    // Location exists in localStorage
    const localStorageMgr = require('src/localStorageMgr').default
    localStorageMgr.setItem(STORAGE_LOCATION_COUNTRY_ISO_CODE, 'DE')
    localStorageMgr.setItem(STORAGE_LOCATION_IS_IN_EU, 'false')
    localStorageMgr.setItem(STORAGE_LOCATION_QUERY_TIME, getCurrentISOString())

    const getClientLocation = require('src/getClientLocation').default
    const { isInEuropeanUnion } = await getClientLocation()
    expect(isInEuropeanUnion).toBe(false)
  })

  it('returns expected value for isInEuropeanUnion when it is true (via localStorage)', async () => {
    expect.assertions(1)

    // Location exists in localStorage
    const localStorageMgr = require('src/localStorageMgr').default
    localStorageMgr.setItem(STORAGE_LOCATION_COUNTRY_ISO_CODE, 'DE')
    localStorageMgr.setItem(STORAGE_LOCATION_IS_IN_EU, 'true')
    localStorageMgr.setItem(STORAGE_LOCATION_QUERY_TIME, getCurrentISOString())

    const getClientLocation = require('src/getClientLocation').default
    const { isInEuropeanUnion } = await getClientLocation()
    expect(isInEuropeanUnion).toBe(true)
  })

  it('throws an error if MaxMind returns an error when trying to get the client location', async () => {
    expect.assertions(1)

    // Suppress expected console error
    jest.spyOn(console, 'error').mockImplementationOnce(() => {})

    // Mock a MaxMind error
    mockGeoIP.country.mockImplementationOnce(
      (successCallback, failureCallback) => {
        return failureCallback({ code: 'BAD_THING_HAPPENED' })
      }
    )

    const getClientLocation = require('src/getClientLocation').default
    await expect(getClientLocation()).rejects.toThrow(
      'Could not determine client location.'
    )
  })
})

describe('client-location: requests and storage', () => {
  it('calls MaxMind when location is not in localStorage or memory', async () => {
    expect.assertions(2)
    const getClientLocation = require('src/getClientLocation').default
    const { countryISOCode } = await getClientLocation()
    expect(countryISOCode).toBe('US')
    expect(mockGeoIP.country).toHaveBeenCalled()
  })

  it('does not call MaxMind when the location is in localStorage', async () => {
    expect.assertions(2)

    // Location exists in localStorage
    const localStorageMgr = require('src/localStorageMgr').default
    localStorageMgr.setItem(STORAGE_LOCATION_COUNTRY_ISO_CODE, 'DE')
    localStorageMgr.setItem(STORAGE_LOCATION_IS_IN_EU, 'true')
    localStorageMgr.setItem(STORAGE_LOCATION_QUERY_TIME, getCurrentISOString())

    const getClientLocation = require('src/getClientLocation').default
    const { countryISOCode } = await getClientLocation()
    expect(countryISOCode).toBe('DE')
    expect(mockGeoIP.country).not.toHaveBeenCalled()
  })

  it('calls MaxMind when the location is in localStorage but has expired', async () => {
    expect.assertions(2)

    // Location exists in localStorage but is expired
    const localStorageMgr = require('src/localStorageMgr').default
    localStorageMgr.setItem(STORAGE_LOCATION_COUNTRY_ISO_CODE, 'CA')
    localStorageMgr.setItem(STORAGE_LOCATION_IS_IN_EU, 'false')
    localStorageMgr.setItem(
      STORAGE_LOCATION_QUERY_TIME,
      '2018-02-10T09:00:00.000'
    ) // expired

    const getClientLocation = require('src/getClientLocation').default
    const { countryISOCode } = await getClientLocation()
    expect(countryISOCode).toBe('US')
    expect(mockGeoIP.country).toHaveBeenCalledTimes(1)
  })

  it('does not call MaxMind when the location is in localStorage and has not quite expired', async () => {
    expect.assertions(2)

    // Location exists in localStorage
    const localStorageMgr = require('src/localStorageMgr').default
    localStorageMgr.setItem(STORAGE_LOCATION_COUNTRY_ISO_CODE, 'CA')
    localStorageMgr.setItem(STORAGE_LOCATION_IS_IN_EU, 'false')
    localStorageMgr.setItem(
      STORAGE_LOCATION_QUERY_TIME,
      '2018-04-21T09:00:00.000'
    ) // not yet expired

    const getClientLocation = require('src/getClientLocation').default
    const { countryISOCode } = await getClientLocation()
    expect(countryISOCode).toBe('CA')
    expect(mockGeoIP.country).not.toHaveBeenCalled()
  })

  it('calls MaxMind when the location is in localStorage but is missing some data', async () => {
    expect.assertions(1)

    // Location exists in localStorage but we're missing the "isInEuropeanUnion" key
    const localStorageMgr = require('src/localStorageMgr').default
    localStorageMgr.setItem(STORAGE_LOCATION_COUNTRY_ISO_CODE, 'DE')
    localStorageMgr.setItem(STORAGE_LOCATION_QUERY_TIME, getCurrentISOString())

    const getClientLocation = require('src/getClientLocation').default
    await getClientLocation()
    expect(mockGeoIP.country).toHaveBeenCalledTimes(1)
  })

  it('stores the location result in localStorage after calling MaxMind', async () => {
    expect.assertions(3)
    const getClientLocation = require('src/getClientLocation').default
    await getClientLocation()

    // Check that localStorage has the correct values
    const localStorageMgr = require('src/localStorageMgr').default
    expect(localStorageMgr.getItem(STORAGE_LOCATION_COUNTRY_ISO_CODE)).toBe(
      'US'
    )
    expect(localStorageMgr.getItem(STORAGE_LOCATION_IS_IN_EU)).toBe('false')
    expect(localStorageMgr.getItem(STORAGE_LOCATION_QUERY_TIME)).toBe(
      getCurrentISOString()
    )
  })

  it('stores the location result in localStorage after calling MaxMind (EU country variant)', async () => {
    expect.assertions(3)
    mockGeoIP.country.mockImplementationOnce((successCallback) => {
      // Mock that MaxMind says the location is Germany
      return successCallback(getMockMaxMindResponse('DE', true))
    })
    const getClientLocation = require('src/getClientLocation').default
    await getClientLocation()

    // Check that localStorage has the correct values
    const localStorageMgr = require('src/localStorageMgr').default
    expect(localStorageMgr.getItem(STORAGE_LOCATION_COUNTRY_ISO_CODE)).toBe(
      'DE'
    )
    expect(localStorageMgr.getItem(STORAGE_LOCATION_IS_IN_EU)).toBe('true')
    expect(localStorageMgr.getItem(STORAGE_LOCATION_QUERY_TIME)).toBe(
      getCurrentISOString()
    )
  })

  it('does not set localStorage when having fetched from localStorage (i.e., no call to MaxMind)', async () => {
    expect.assertions(1)

    // Location exists in localStorage
    const localStorageMgr = require('src/localStorageMgr').default
    localStorageMgr.setItem(STORAGE_LOCATION_COUNTRY_ISO_CODE, 'DE')
    localStorageMgr.setItem(STORAGE_LOCATION_IS_IN_EU, 'true')
    localStorageMgr.setItem(STORAGE_LOCATION_QUERY_TIME, getCurrentISOString())
    jest.clearAllMocks()

    const getClientLocation = require('src/getClientLocation').default
    await getClientLocation()

    expect(localStorageMgr.setItem).not.toHaveBeenCalled()
  })

  it('only calls MaxMind once, even with multiple simultaneous location calls', async () => {
    expect.assertions(1)
    const getClientLocation = require('src/getClientLocation').default
    getClientLocation()
    getClientLocation()
    await getClientLocation()
    expect(mockGeoIP.country).toHaveBeenCalledTimes(1)
  })

  it('does not call MaxMind more then once, because the location should be in memory', async () => {
    expect.assertions(2)
    const getClientLocation = require('src/getClientLocation').default
    await getClientLocation()
    expect(mockGeoIP.country).toHaveBeenCalledTimes(1)
    jest.clearAllMocks()
    await getClientLocation()
    expect(mockGeoIP.country).not.toHaveBeenCalled()
  })

  it('does not call localStorage more then once, because the location should be in memory', async () => {
    expect.assertions(2)

    // Location exists in localStorage
    const localStorageMgr = require('src/localStorageMgr').default
    localStorageMgr.setItem(STORAGE_LOCATION_COUNTRY_ISO_CODE, 'DE')
    localStorageMgr.setItem(STORAGE_LOCATION_IS_IN_EU, 'true')
    localStorageMgr.setItem(STORAGE_LOCATION_QUERY_TIME, getCurrentISOString())

    const getClientLocation = require('src/getClientLocation').default
    await getClientLocation()
    expect(localStorageMgr.getItem).toHaveBeenCalled()
    jest.clearAllMocks()
    await getClientLocation()
    expect(localStorageMgr.getItem).not.toHaveBeenCalled()
  })
})

// TODO
// eslint-disable-next-line jest/no-commented-out-tests
// describe('client-location: isInEuropeanUnion', () => {
// eslint-disable-next-line jest/no-commented-out-tests
//   it('does not log an error for a typical MaxMind error', async () => {
//     expect.assertions(1)
//     const logger = require('js/utils/logger').default
//
//     // Suppress expected console error
//     jest.spyOn(console, 'error').mockImplementationOnce(() => {})
//
//     // Mock a MaxMind error
//     mockGeoIP.country.mockImplementationOnce(
//       (successCallback, failureCallback) => {
//         return failureCallback({ code: 'HTTP_TIMEOUT' })
//       }
//     )
//
// const getClientLocation = require('src/getClientLocation').default
//     try {
//       await getClientLocation()
//     } catch (e) {}
//     expect(logger.error).not.toHaveBeenCalled()
//   })
//
//  eslint-disable-next-line jest/no-commented-out-tests
//   it('does log an error for a problematic MaxMind error', async () => {
//     expect.assertions(1)
//
//     const logger = require('js/utils/logger').default
//
//     // Suppress expected console error
//     jest.spyOn(console, 'error').mockImplementationOnce(() => {})
//
//     // Mock a MaxMind error
//     mockGeoIP.country.mockImplementationOnce(
//       (successCallback, failureCallback) => {
//         return failureCallback({ code: 'OUT_OF_QUERIES' })
//       }
//     )
//
// const getClientLocation = require('src/getClientLocation').default
//     try {
//       await getClientLocation()
//     } catch (e) {}
//     expect(logger.error).toHaveBeenCalled()
//   })
// })
