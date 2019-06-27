const PAY_TYPE_KEY = 'payTypeKey'

function setCurrentPayTypes(payTypes) {
  wx.setStorageSync(PAY_TYPE_KEY, payTypes)
}

function getCurrentPayTypes() {
  return wx.getStorageSync(PAY_TYPE_KEY)
}

module.exports = {
  setCurrentPayTypes: setCurrentPayTypes,
  getCurrentPayTypes: getCurrentPayTypes
}