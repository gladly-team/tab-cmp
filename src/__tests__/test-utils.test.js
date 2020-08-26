afterEach(() => {
  jest.clearAllMocks()
})

describe('test-utils', () => {
  test('getMockUSPPingResponse returns an object', () => {
    expect.assertions(1)
    const { getMockUSPPingResponse } = require('src/test-utils')
    expect(getMockUSPPingResponse()).toEqual(expect.any(Object))
  })

  test('getMockUSPDataInUS returns an object with expected uspString', () => {
    expect.assertions(1)
    const { getMockUSPDataInUS } = require('src/test-utils')
    expect(getMockUSPDataInUS()).toMatchObject({
      uspString: '1YNN',
    })
  })

  test('getMockUSPDataNonUS returns an object with expected uspString', () => {
    expect.assertions(1)
    const { getMockUSPDataNonUS } = require('src/test-utils')
    expect(getMockUSPDataNonUS()).toMatchObject({
      uspString: '1---',
    })
  })

  test('getMockTCFDataInEU returns an object with expected "gdprApplies" value', () => {
    expect.assertions(1)
    const { getMockTCFDataInEU } = require('src/test-utils')
    expect(getMockTCFDataInEU()).toMatchObject({
      gdprApplies: true,
    })
  })

  test('getMockTCFDataNonEU returns an object with expected "gdprApplies" value', () => {
    expect.assertions(1)
    const { getMockTCFDataNonEU } = require('src/test-utils')
    expect(getMockTCFDataNonEU()).toMatchObject({
      gdprApplies: false,
    })
  })
})
