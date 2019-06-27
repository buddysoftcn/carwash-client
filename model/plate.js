const PLATES_KEY = 'platesKey'

function setPlates(plates) {
  wx.setStorageSync(PLATES_KEY, plates)
}

function getPlates() {
  return wx.getStorageSync(PLATES_KEY)
}

module.exports = {
  setPlates: setPlates,
  getPlates: getPlates
}