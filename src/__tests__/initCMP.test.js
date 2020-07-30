/* eslint no-underscore-dangle:0 */
jest.mock('src/qcCmpModified')

beforeEach(() => {
  window.__tcfapi = jest.fn()
})

describe('initCMP', () => {
  it('defines a default export function', () => {
    expect.assertions(1)
    const initCMP = require('src/initCMP').default
    expect(initCMP).toBeDefined()
  })
})
