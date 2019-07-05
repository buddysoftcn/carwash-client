//app.js
let buddysoft = require('/buddysoft/buddysoft.js')
let request = require('/operation/operation.js')
let userModel = require('/model/user.js')
let notificationCenter = require('/utils/notification.js')

App({
  buddysoft: null,
  notificationCenter: null,

  onLaunch: function () {
    this.buddysoft = buddysoft.buddysoftShop
    this.notificationCenter = notificationCenter.center()
  },

  // 登录请求
  login: function (wxUserInfo, cb) {
    console.log(wxUserInfo)
    wx.login({
      success: function (res) {
        wxUserInfo.userInfo.code = res.code

        var that = this, params = { 'wxCode': wxUserInfo.userInfo.code, 'shopSid': getApp().buddysoft.shopSid,'app':'client' }
        if (wxUserInfo.encryptedData) {
          params.encryptedData = wxUserInfo.encryptedData
          params.iv = wxUserInfo.iv
        }

        request.postRequest('/user/wx-login', params, false)
          .then(data => {
            if (request.SUCCESSED == data.status) {
              typeof cb == "function" && cb(data, '')
            } else {
              cb(null, '登录失败')
            }
          }).catch(e => {
            cb(null, '登录失败')
          })
      },
      fail: function (res) {
        cb(null, '微信获取用户信息失败')
      }
    })
  },

  // 更新用户信息请求
  getUserInfo: function (cb) {
    request.getRequest('/user/info', null, true)
      .then(data => {       
        if (request.SUCCESSED == data.status) {
          userModel.setCurrentUser(data)          
          cb(data)
        } else {
          cb(null)
        }
      }).catch(e => {
        cb(null)
      })
  },

  globalData: {
    param:{}
  }
})