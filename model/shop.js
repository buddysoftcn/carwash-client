const SHOP_INFO_KEY = 'shopInfoKey'

function setShopInfo(shopInfo) {
  wx.setStorageSync(SHOP_INFO_KEY, shopInfo)
}

function getShopInfo() {
  return wx.getStorageSync(SHOP_INFO_KEY)
}

module.exports = {
  setShopInfo: setShopInfo,
  getShopInfo: getShopInfo
}