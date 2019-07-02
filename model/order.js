const CURRENT_ORDER_KEY = 'currentOrderKey'

function setCurrentOrder(order) {
  wx.setStorageSync(CURRENT_ORDER_KEY, order)
}

function getCurrentOrder() {
  let result = wx.getStorageSync(CURRENT_ORDER_KEY)

  if (result) {
    return result
  }

  return null
}

function removeCurrentOrder() {
  wx.removeStorageSync(CURRENT_ORDER_KEY)
}

module.exports = {
  setCurrentOrder: setCurrentOrder,
  getCurrentOrder: getCurrentOrder,
  removeCurrentOrder: removeCurrentOrder
}