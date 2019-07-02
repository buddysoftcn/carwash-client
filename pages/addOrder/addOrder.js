// pages/addOrder/addOrder.js
let getPlatesOperation = require('../../operation/getPlates.js')
let carWash = require('../../utils/carWash.js')
let plateModel = require('../../model/plate.js')
let util = require('../../utils/util.js')
let request = require('../../operation/operation.js')
let worktime = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    datetime:'',
    showPopupView:false,
    plates:[],
    currentPlate:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    
    this.initDateTime()
    this.initPlates(plateModel.getPlates())
    this.getPlates()


    getApp().notificationCenter.register(carWash.UPDATE_PLATE_MESSAGE, this, "getPlates");
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
    getApp().notificationCenter.remove(carWash.UPDATE_PLATE_MESSAGE, this)
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

  onAddCar:function() {
    wx.navigateTo({
      url: '../editCar/editCar',
    })
  },

  /**
   * 确认预约事件
   */
  onSave:function() {
    if (null == this.data.currentPlate) {
      wx.showModal({
        title: '提示',
        content: '请选择您的车辆',
        showCancel:false
      })
    }else {
      wx.showLoading({
        title: '请稍候',
        mask:true
      })

      request.postRequest('/orders',{'type':0,'date':worktime.date,'time':worktime.time,'plateNumber':this.data.currentPlate.number},true)
      .then(data => {
        wx.hideLoading()
        getApp().globalData.param = data.object
        // 通知首页更新订单视图
        getApp().notificationCenter.post(carWash.UPDATE_ORDER_MESSAGE, {})
        wx.navigateTo({
          url: '../addOrderFinished/addOrderFinished',
        })
      }).catch(e => {
        wx.hideLoading()

        wx.showToast({
          title: e.msg,
          icon:'none'
        })
      })
    }
   
  },

  onShowPopView:function() {
    this.setData({
      showPopupView: true
    })
  },

  checkboxChange:function(event) {
    let plates = this.data.plates, values = event.detail.value,item = null
    for (var i = 0, lenI = plates.length; i < lenI; ++i) {
      plates[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (plates[i].sid == values[j]) {
          plates[i].checked = true;
        } else {
          plates[i].checked = false;
        }
      }
    }
  
    for (let index = 0, size = plates.length; index < size; index++) {
      if (true == plates[index].checked) {
        item = plates[index]
        break
      }
    }

    this.setData({
      currentPlate: item,
      showPopupView: false,
      plates: plates
    });
  },

  onClose:function() {
    this.setData({
      showPopupView:false
    })
  },

  initDateTime:function() {
    worktime = getApp().globalData.param
    
    this.setData({
      datetime: util.formatDate(worktime.date) +  ' ' + worktime.time
    })
  },

  initPlates:function(plates) {
    let currentPlate = null

    if (plates && 0 < plates.length) {            
      for (let index = 0, size = plates.length; index < size; index++) {
        if (0 == index) {
          plates[index].checked = true
        }else {
          plates[index].checked = false
        }
        
      }

      currentPlate = plates[0]
    }

    this.setData({
      plates:plates,
      currentPlate:currentPlate
    })
  },

  getPlates:function() {
    let that = this 

    getPlatesOperation.getPlates()
      .then(data => {
        that.initPlates(data)
      })
  }

})