// pages/orderDetail/orderDetail.js
let util = require('../../utils/util.js')
let carWash = require('../../utils/carWash.js')
let request = require('../../operation/operation.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let order = getApp().globalData.param

    this.getOrderInfo(order)
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

  onCancelOrder:function() {
    let that = this

    wx.showModal({
      title: '提示',
      content: '取消订单后，可以再预约其它洗车时间，确定取消吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍候',
            mask:true
          })
          request.postRequest('/orders/cancel/' + that.data.order.sid,null,true)
          .then(data => {
            wx.hideLoading()  
            // 通知首页更新订单视图
            getApp().notificationCenter.post(carWash.UPDATE_ORDER_MESSAGE, {})
            // 返回首页
            wx.switchTab({
              url: '../home/home',
            })         
          }).catch(e => {
            wx.hideLoading()  
            wx.showToast({
              title: e.msg,
              icon:'none'
            })
          })
        } else if (res.cancel) {          
        }
      }
    })

  },

  /**
   * 获取订单最新的数据
   */
  getOrderInfo:function(order) {
    let that = this

    request.getRequest('/orders/' + order.sid,null,true)
    .then(data => {
      that.initView(data.object)
    })
  },

  initView:function(order) {
    order.uiDate = util.formatDate(order.date)
    order.uiTime = util.formatTime(order.time)

    this.setData({
      order: order
    })
  }
})