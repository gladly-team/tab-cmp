const mock = jest.genMockFromModule('src/utils')

mock.getURL = jest.fn(() => 'https://example.com/foo/bar/')

module.exports = mock
