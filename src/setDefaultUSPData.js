// If no USP data is set, then set it to a default value.
// https://help.quantcast.com/hc/en-us/articles/360047078534-Choice-CMP2-CCPA-API-Index-TCF-v2-0-
const setDefaultUSPData = () => {
  if (typeof window.__uspapi === 'function') {
    window.__uspapi('uspPing', 1, (obj, status) => {
      if (
        status &&
        obj.mode.includes('USP') &&
        obj.jurisdiction.includes(obj.location.toUpperCase())
      ) {
        window.__uspapi('setUspDftData', 1, () => {
          if (!status) {
            // eslint-disable-next-line no-console
            console.log('Error: USP string not updated!')
          }
        })
      }
    })
  }
}

export default setDefaultUSPData
