export const isNil = (value) => {
  return value == null
}

export const getCurrentISOString = () => new Date().toISOString()

export const ISOStringToDate = (ISOString) => {
  const utcMs = Date.parse(ISOString)
  if (Number.isNaN(utcMs)) {
    throw new Error('Invalid string passed to ISOStringToDate.')
  }
  return new Date(utcMs)
}

export const getNumDaysBetweenDates = (dateA, dateB) => {
  const msInDay = 1000 * 60 * 60 * 24
  return (dateA - dateB) / msInDay
}

export const getURL = () => window.location.href
