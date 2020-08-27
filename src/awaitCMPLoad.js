import { logDebugging } from 'src/logger'

// Poll for changes to the USP stub function as a
// proxy for when the Quantcast Choice CMP has fully
// loaded. Resolves if successful and rejects if
// it times out.
const awaitCMPLoad = async () => {
  return new Promise((resolve, reject) => {
    logDebugging(`Polling for CMP to have loaded in updateStoredPrivacyData.`)
    const intervalMs = 500
    let timesChecked = 0
    const maxTimesToCheck = 20
    const checkIfCMPLoaded = () =>
      window.tabCMP.uspStubFunction !== window.__uspapi
    const checker = setInterval(() => {
      const isLoaded = checkIfCMPLoaded()
      logDebugging(`Polling for CMP loaded. Loaded? ${isLoaded}`)
      if (isLoaded) {
        clearInterval(checker)
        resolve()
      }
      timesChecked += 1
      if (timesChecked > maxTimesToCheck) {
        clearInterval(checker)
        logDebugging(`Polling for CMP has timed out.`)
        reject(new Error('Timed out while waiting for the CMP.'))
      }
    }, intervalMs)
  })
}

export default awaitCMPLoad
