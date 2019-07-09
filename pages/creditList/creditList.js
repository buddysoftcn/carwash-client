// pages/creditList/creditList.js
let request = require('../../operation/operation.js')
let userModel = require('../../model/user.js')
let shopModel = require('../../model/shop.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    creditValue:100,
    discreditUserBanDays:30,
    orders:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCredits()

    this.initView()
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  getCredits:function() {
    let that = this

    wx.showLoading({
      title: '请稍候',
    })

    request.getRequest('/orders?category=client_orders&state=discredit',null,true)
    .then(data => {
      wx.hideLoading()
      that.setData({
        orders:data.items
      })
    }).catch(e => {
      wx.hideLoading()        
      wx.showToast({
        title: e.msg,
        icon:'none'
      })
    })
  },

  initView:function() {
    let currentUser = userModel.getCurrentUser()
    let shopSetting = shopModel.getShopInfo().shopSetting
    console.log(shopSetting)
    this.setData({
      creditValue:currentUser.credit.value,
      discreditUserBanDays: shopSetting.discreditUserBanDays
    })
  }

})