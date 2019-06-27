// pages/editCar/editCar.js
let shopModel = require('../../model/shop.js')
let request = require('../../operation/operation.js')
let mode = 'create'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carModels:[],
    carModelIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initCarModelView()
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

  onSave:function(event) {
    let number = event.detail.value.number,desc = event.detail.value.desc
    if (0 == number.length || 7 != number.length) {
      wx.showModal({
        title: '提示',
        content: '请正确输入完整车牌号码',
        showCancel:false
      })
    }else {
      wx.showLoading({
        title: '请稍候',
        mask:true
      })

      if ('create' == mode) {
        request.postRequest('/plates', { 'number': number, 'carModelSid': this.data.carModels[this.data.carModelIndex].sid, 'desc': desc },true)
        .then(data => {
          wx.hideLoading()
          console.log(data)
        }).catch(e => {
          wx.hideLoading()
          wx.showToast({
            title: e.msg,
            icon:'none'
          })
        })
      }
      
    }
    
    // wx.navigateBack({
    //   delta: 1,
    // })
  },

  bindCarModelChange:function(event) {    
    this.setData({
      carModelIndex:event.detail.value
    })
  },

  initCarModelView:function() {
    let carModels = shopModel.getShopInfo().carModels
    console.log(carModels)

    this.setData({
      carModels:carModels
    })
  }
})