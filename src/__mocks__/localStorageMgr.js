import { isNil } from 'src/utils'

let mockStorage = {}

// TODO: remove
export const __mockClear = () => {
  mockStorage = {}
}

export default {
  getItem: jest.fn((key) => {
    return mockStorage[key]
  }),
  setItem: jest.fn((key, val) => {
    if (!isNil(val)) {
      mockStorage[key] = String(val)
    }
  }),
  removeItem: jest.fn((key) => {
    delete mockStorage[key]
  }),
  clear: () => {
    __mockClear()
  },
}
