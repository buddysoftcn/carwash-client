let request = require('operation.js')
let shop = require('../model/shop.js')
let payTypeModel = require('../model/payType.js')

module.exports.getShopInfo = getShopInfo

function getShopInfo() {
  return new Promise((resolve, reject) => {
    request.getRequest('/shop-info?shopSid=' + getApp().buddysoft.shopSid, null, false)
      .then(data => {        
        shop.setShopInfo(data)          
        payTypeModel.setCurrentPayTypes(data.payTypes)
        resolve(data)        
      })
      .catch(e => {
        reject(e)        
      })
  })
}