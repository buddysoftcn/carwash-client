// pages/my/my.js
let userModel = require('../../model/user.js')
let shopModel = require('../../model/shop.js')

let currentUser = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    vip:false,
    shop:null,
    user:null,
    showAuthView: false,  // 是否显示授权提示视图
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initShopView()
    this.initUserView()

    this.updateUserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.checkUser()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.updateUserInfo()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  onPaymentView:function() {
    wx.navigateTo({
      url: '../paymentView/paymentView'     
    })
  },

  bindGetUserInfo: function (event) {    
    let that = this

    this.setData({
      showAuthView: false
    })

    if (event.detail.rawData) { // 允许授权
      getApp().login(event.detail, function (userInfo, message) {
        if (null != userInfo) {
          userModel.setCurrentUser(userInfo)          
          that.checkUser()
          that.initUserView()
        }
      })
    }   
  },

  updateUserInfo:function() {
    if (this.data.user) {
      let that = this

      getApp().getUserInfo(function (data) {
        wx.stopPullDownRefresh()

        if (data) {
          currentUser = userModel.getCurrentUser()
          that.initUserView()
        }
      })
    }   
  },

  checkUser: function () {
    let role = userModel.getRole()

    if (userModel.ROLE_NO_LOGIN == role.role) {
      this.setData({
        showAuthView:true,
        vip:false
      })
    } else if (userModel.ROLE_NORMAL == role.role) {
      this.setData({        
        vip:true        
      })
    } else if (userModel.ROLE_OWNER == role.role || userModel.ROLE_OWNER == role.role) {
      wx.showModal({
        title: '提示',
        content: '请登录店铺端小程序',
        showCancel: false
      })

      this.setData({
        vip: true
      })
    }
  },

  initShopView:function() {
    let shop = shopModel.getShopInfo().shop
    this.setData({
      shop:shop
    })
  },

  initUserView:function() {
    currentUser = userModel.getCurrentUser()        
    if (currentUser) {      
      currentUser.credit.desc = userModel.getCredit(currentUser.credit.value).desc
      currentUser.member.uiExpiredAt = currentUser.member.expiredAt.substring(0,11)
      this.setData({
        user:currentUser
      })
    }
  }
})