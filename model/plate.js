const PLATES_KEY = 'platesKey'

function setPlates(plates) {
  wx.setStorageSync(PLATES_KEY, plates)
}

function getPlates() {
  let result = wx.getStorageSync(PLATES_KEY)

  if (result && 0 < result.length) {
    return result
  }

  return null
}

module.exports = {
  setPlates: setPlates,
  getPlates: getPlates
}