// pages/editCar/editCar.js
let shopModel = require('../../model/shop.js')
let plateModel = require('../../model/plate.js')
let request = require('../../operation/operation.js')
let carWash = require('../../utils/carWash.js')
let mode = 'create'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    plateNumber:'',
    plate:null,
    carModels:[],
    carModelIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initCarModelView()

    if (options.mode) {
      mode = options.mode
      this.initPlate()
    }else {
      mode = 'create'
    }   
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

  bindPlateNumberInput: function (event) {
    let value = event.detail.value

    this.setData({
      plateNumber: value.toUpperCase()
    })
  },

  onSave:function(event) {
    let that = this
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

      let params = { 'number': number, 'carModelSid': this.data.carModels[this.data.carModelIndex].sid, 'desc': desc }
      if ('create' == mode) {
        let plates = plateModel.getPlates()      
        if (null == plates) { // 第一辆车默认绑定到会员卡         
          params.binded = 1
        }
        
        request.postRequest('/plates', params,true)
        .then(data => {
          that.back()
        }).catch(e => {
          that.showMessage(e)
        })
      }else if ('edit' == mode) {
        request.putRequest('/plates/' + this.data.plate.sid, params, true)
          .then(data => {
            that.back()
          }).catch(e => {
            that.showMessage(e)            
          })
      }      
    }
    
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
  },

  initPlate:function() {
    let plate = getApp().globalData.param, carModelIndex = 0
    for (let size = this.data.carModels.length; carModelIndex < size; carModelIndex++) {
      if (plate.carModelSid == this.data.carModels[carModelIndex].sid) {
        break
      }
    }
    this.setData({
      plateNumber:plate.number,
      plate:plate,
      carModelIndex: carModelIndex
    })
  },

  back:function() {
    wx.hideLoading()

    getApp().notificationCenter.post(carWash.UPDATE_PLATE_MESSAGE, {})
    wx.navigateBack({
      delta: 1,
    })
  },

  showMessage:function(e) {
    wx.hideLoading()
    wx.showToast({
      title: e.msg,
      icon: 'none'
    })
  }
})