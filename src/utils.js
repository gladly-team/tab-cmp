export const isNil = (value) => {
  return value == null
}

export const getCurrentISOTimestamp = () => new Date().toISOString()

export const parseISOTimestamp = (timestamp) => Date.parse(timestamp)

export const getNumDaysBetweenDatetimes = (dateA, dateB) => {
  const msInDay = 1000 * 60 * 60 * 24
  return (dateA - dateB) / msInDay
}
