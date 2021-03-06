import localStorageMgr from 'src/localStorageMgr'
import { logDebugging, logError } from 'src/logger'
import awaitCMPLoad from 'src/awaitCMPLoad'

const TCF_LOCAL_DATA_KEY = 'tabCMP.tcfv2.data'
const USP_LOCAL_DATA_KEY = 'tabCMP.usp.data'
const USP_PING_LOCAL_DATA_KEY = 'tabCMP.uspPing.data'

// Get the TCF and USP data from Quantcast Choice and
// store them in local storage. This gives our stub
// functions quicker access to the user's choices.
const updateStoredPrivacyData = async () => {
  // It's critical Quantcast Choice is loaded, replacing our
  // modified stub functions, before we sync.
  // Otherwise, we'd be receiving our own local storage data
  // when trying to update local storage data.
  try {
    await awaitCMPLoad()
  } catch (e) {
    logDebugging(`Could not update stored privacy data.`)
    return
  }

  try {
    logDebugging(`Syncing local storage TCF and USP data.`)

    // TCF/GDPR
    if (typeof window.__tcfapi === 'function') {
      window.__tcfapi('getTCData', 2, (tcData, success) => {
        if (success && tcData) {
          localStorageMgr.setItem(TCF_LOCAL_DATA_KEY, JSON.stringify(tcData))
          logDebugging(
            `Successfully updated TCF local storage data. Value:`,
            tcData
          )
        } else {
          logDebugging(
            `Could not update TCF local storage data. The CMP errored and provided these data:`,
            tcData
          )
        }
      })
    } else {
      logError(
        new Error(
          `[tab-cmp] Could not update TCF local storage data. window.__tcfapi is not defined.`
        )
      )
    }

    // USP/CCPA
    if (typeof window.__uspapi === 'function') {
      window.__uspapi('uspPing', 1, (uspPingResponse, status) => {
        if (status) {
          localStorageMgr.setItem(
            USP_PING_LOCAL_DATA_KEY,
            JSON.stringify(uspPingResponse)
          )
          logDebugging(
            `Successfully updated USP ping local storage data. Value:`,
            uspPingResponse
          )

          window.__uspapi('getUSPData', 1, (uspData, success) => {
            if (success && uspData) {
              localStorageMgr.setItem(
                USP_LOCAL_DATA_KEY,
                JSON.stringify(uspData)
              )
              logDebugging(
                `Successfully updated USP local storage data. Value:`,
                uspData
              )
            } else {
              logDebugging(
                `Could not update USP local storage data. The CMP errored and provided these data:`,
                uspData
              )
            }
          })
        } else {
          logDebugging(
            `Could not update USP local storage data. The CMP errored.`
          )
        }
      })
    } else {
      logError(
        new Error(
          `[tab-cmp] Could not update USP local storage data. window.__uspapi is not defined.`
        )
      )
    }
  } catch (e) {
    logError(e)
  }
}

export default updateStoredPrivacyData
