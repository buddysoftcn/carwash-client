// pages/home/home.js
let util = require('../../utils/util.js')
let carWash = require('../../utils/carWash.js')
let authViewTemplate = require('../../template/authView/authView.js')
let getShopInfoOperation = require('../../operation/getShopInfo.js')
let request = require('../../operation/operation.js')
let shopModel = require('../../model/shop.js')
let userModel = require('../../model/user.js')
let orderModel = require('../../model/order.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    announces:[],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    goods:null,
    shop:null,
    order:null, // 用户当前自己的订单

    showAuthView: false  // 是否显示授权提示视图
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let shop = shopModel.getShopInfo()
    if (shop) {
      this.initView(shop)
    }
    let order = orderModel.getCurrentOrder()
    if (null != order) {
      this.initOrderView(order)
    }

    this.getShopInfo()
    this.getUnFinishedOrder()

    getApp().notificationCenter.register(carWash.UPDATE_ORDER_MESSAGE, this, "getUnFinishedOrder");
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
    getApp().notificationCenter.remove(carWash.UPDATE_ORDER_MESSAGE, this)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 点击开始预约按钮事件
   */
  onOrder:function() {
    let role = userModel.getRole()

    if (userModel.ROLE_NO_LOGIN == role.role){
      authViewTemplate.showView(this, true)
    }else if (userModel.ROLE_NORMAL == role.role) {
      wx.navigateTo({
        url: '../worktimeList/worktimeList',
      })
    }
  },

  onCallPhone:function() {
    wx.makePhoneCall({
      phoneNumber:this.data.shop.shop.phone
    })
  },

  onShowAnnouncement:function(event) {
    getApp().globalData.param = event.currentTarget.dataset.announcement
    wx.navigateTo({
      url: '../announcementDetail/announcementDetail',
    })
  },

  onShowGoods:function(event) {
    getApp().globalData.param = event.currentTarget.dataset.goods
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail'    
    })
  },
  
  /**
   * 显示地图导航界面
   */
  onShowMap:function () {
    let location = this.data.shop.shop.location.split(',')
    
    wx.openLocation({
      longitude: parseFloat(location[0]),//要去的经度-地址
      latitude: parseFloat(location[1]),//要去的纬度-地址      
      name: this.data.shop.shop.name,
      address: this.data.shop.shop.address
    })
  },

  /**
   * 查看用户当前订单详情
   */
  onShowOrderDetail:function() {
    getApp().globalData.param = this.data.order

    wx.navigateTo({
      url: '../orderDetail/orderDetail',
    })
  },

  bindGetUserInfo: function (event) {
    this.setData({
      showAuthView: false
    })

    getApp().login(event.detail, function (userInfo, message) {
      if (null != userInfo) {
        userModel.setCurrentUser(userInfo)
        let role = userModel.getRole()

        if (userModel.ROLE_NORMAL == role.role) {
          wx.navigateTo({
            url: '../worktimeList/worktimeList',
          })
        } if (userModel.ROLE_OWNER == role.role || userModel.ROLE_OWNER == role.role) {
          wx.showModal({
            title: '提示',
            content: '请登录店铺端小程序',
            showCancel:false
          })
        }
      }
    })
  },


  getShopInfo:function() {
    let that = this

    getShopInfoOperation.getShopInfo()
    .then(data => {
      that.initView(data)
    }).catch(e => {

    })
  },

  getUnFinishedOrder:function() {
    let role = userModel.getRole(),that = this
    if (userModel.ROLE_NORMAL == role.role) {
      request.getRequest('/orders?type=0&category=client_orders&state=created',null,true)
      .then(data => {
        if (0 < data.items.length) {
          orderModel.setCurrentOrder(data.items[0])          
          that.initOrderView(data.items[0])
        }else {
          orderModel.removeCurrentOrder()
          that.initOrderView(null)
        }               
      })
    }
  },

  initView:function(shop){
    wx.setNavigationBarTitle({
      title: shop.shop.name,
    })

    shop.shopSetting.uiWorkTimeBegin = util.formatTime(shop.shopSetting.workTimeBegin)
    shop.shopSetting.uiWorkTimeEnd = util.formatTime(shop.shopSetting.workTimeEnd)
    this.setData({
      shop:shop,
      announces:shop.announces,
      goods:shop.items
    })
  },

  initOrderView:function(order) {
    if (order) {
      let uiDatetime = null, today = util.today(), tomorrow = util.tomorrow()

      if (today == order.date) {
        uiDatetime = '今天'
      } else if (tomorrow == order.date) {
        uiDatetime = '明天'
      } else {
        uiDatetime = util.formatDate(order.date)
      }

      uiDatetime = uiDatetime + ' ' + util.formatTime(order.time) + ' '
      order.uiDatetime = uiDatetime
    }
    
    this.setData({
      order:order
    })
  }

})