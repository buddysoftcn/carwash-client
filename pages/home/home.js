// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onCallPhone:function() {
    wx.makePhoneCall({
      phoneNumber:'18037994395'
    })
  },

  onShowAnnouncement:function(e) {
    console.log(e)
    wx.navigateTo({
      url: '../announcementDetail/announcementDetail',
    })
  },

  onShowGoods:function() {
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail'    
    })
  },
  
  onShowMap:function () {
    wx.openLocation({
      latitude: 34.629964,//要去的纬度-地址
      longitude: 112.446711,//要去的经度-地址
      name: "百邦汽车美容中心",
      address: '洛龙区太康路王城大道交叉口东100米路南'
    })
  }
})