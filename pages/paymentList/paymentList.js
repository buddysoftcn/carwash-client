// pages/paymentList/paymentList.js
let request = require('../../operation/operation.js')
let util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrders()
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

  getOrders:function() {
    let that = this

    wx.showLoading({
      title: '请稍候',
      mask:true
    })

    request.getRequest('/orders?category=client_orders',null,true)
    .then(data => {
      wx.hideLoading()
      console.log(data)
      that.renderOrdersList(data.items)
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: e.msg,
      })
    })    
  },

  renderOrdersList:function(orders) {
    for (let index = 0, size = orders.length; index < size; index++) {
      if ( 0 == orders[index].type) {
        orders[index].typeDesc = '预约洗车'
      }else if ( 1 == orders[index].type) {
        orders[index].typeDesc = '会员充值'
      }

      if ('created' == orders[index].state) {
        orders[index].stateDesc = '已预约'
      }else if ('canceled' == orders[index].state) {
        if (null == orders[index].clerkUserSid) {
          orders[index].stateDesc = '用户取消预约'
        }else {
          orders[index].stateDesc = '店员取消预约'
        }
      }else if ('finished' == orders[index].state) {
        orders[index].stateDesc = '已完成'
      } else if ('discredit' == orders[index].state) {
        orders[index].stateDesc = '车主违约'
      }

      orders[index].datetimeDesc = orders[index].date + ' ' + util.formatTime(orders[index].time)
    }

    this.setData({
      orders:orders
    })
  }
})