/**
 * @jest-environment node
 */
import isClientSide from 'src/isClientSide'

// Note the jest-environment docstring at the top of this file.
describe('isClientSide in a client environment', () => {
  it('returns false from isClientSide()', () => {
    expect.assertions(1)
    expect(isClientSide()).toBe(false)
  })
})
