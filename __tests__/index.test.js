
describe('index.js', () => {
  it('defines initializeCMP', () => {
    expect.assertions(1)
    const index = require('src/index')
    expect(index.initializeCMP).toBeDefined()
  })
})
