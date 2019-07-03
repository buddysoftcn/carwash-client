// pages/carList/carList.js
let carWash = require('../../utils/carWash.js')
let getPlateOperaion = require('../../operation/getPlates.js')
let shopModel = require('../../model/shop.js')
let request = require('../../operation/operation.js')
let carModelsMap = new Map()

let maxBindingPlates = 0,bindedPlates = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,  // 是否显示类似actinSheet视图
    actions:null,
    plates:[],
    currentPlate:null // 当前要处理的Plate
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initCarModels()
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

  onShowMore:function(event) {    
    let currentPlate = event.currentTarget.dataset.plate
    let action = '', className = 'action-sheet_normal', disable = false
    if (0 == currentPlate.binded) {
      action = '绑定到会员卡'
      if (bindedPlates == maxBindingPlates) {
        className = 'action-sheet_disable'
        disable = true
      }
    }else if (1 == currentPlate.binded) {
      action = '解除绑定'
    }

    this.setData({      
      show:true,
      actions:[
        {
          name: action,
          className: className,
          disable: disable,
          index:0
        },
        {
          name: '修改',
          index:1
        },
        {
          name: '删除',
          index:2,
          className: 'action-sheet_del'
        }
      ],
      currentPlate: currentPlate
    })
  },

  onClose() {
    this.setData({ show: false });
  },

  onSelect(event) {    
    this.setData({ show: false })

    if (0 == event.detail.index) {
      if (0 == this.data.currentPlate.binded && false == event.detail.disable) { // 绑定会员卡操作
        this.bindPlate(1)
      }else if (1 == this.data.currentPlate.binded) { // 解除绑定
        this.bindPlate(0)
      } 
    }else if (1 == event.detail.index) {  // 修改操作
      getApp().globalData.param = this.data.currentPlate

      wx.navigateTo({
        url: '../editCar/editCar?mode=edit'
      })
    }else if (2 == event.detail.index) {  // 删除操作
      let that = this

      wx.showModal({
        title: '删除',
        content: '删除后，车牌信息将不存在，确定要删除吗？',
        success(res) {
          if (res.confirm) {
            that.deletePlate()
          } else if (res.cancel) {

          }
        }
      })

    }
  },
  
  onEditCar:function() {
    wx.navigateTo({
      url: '../editCar/editCar' 
    })
  },

  bindPlate:function(binded) {
    let that = this

    wx.showLoading({
      title: '请稍候',
      mask: true
    })
    request.putRequest('/plates/' + this.data.currentPlate.sid, { 'binded': binded }, true)
      .then(data => {
        wx.hideLoading()
        that.getPlates()
      }).catch(e => {
        wx.hideLoading()
        wx.showToast({
          title: e.msg,
          icon: 'none'
        })
      })
  },

  deletePlate:function() {
    let that = this

    wx.showLoading({
      title: '请稍候',
      mask: true
    })
    request.deleteRequest('/plates/' + this.data.currentPlate.sid, null, true)
      .then(data => {
        wx.hideLoading()
        that.getPlates()
      }).catch(e => {
        wx.hideLoading()
        wx.showToast({
          title: e.msg,
          icon: 'none'
        })
      })
  },

  initCarModels:function() {
    let shopInfo = shopModel.getShopInfo()
    maxBindingPlates = shopInfo.shopSetting.bindingPlates
    
    let carModels = shopInfo.carModels    
    for (let index = 0, size = carModels.length; index < size; index++) {
      carModelsMap.set(carModels[index].sid,carModels[index])
    }
  },

  getPlates:function() {
    let that = this 
    bindedPlates = 0

    getPlateOperaion.getPlates()
    .then(data => {
        for (let index = 0, size = data.length; index < size; index++) {
          if (carModelsMap.get(data[index].carModelSid)) {
            data[index].carModel = carModelsMap.get(data[index].carModelSid)
          }else {
            data[index].carModel = null
          }

          if (1 == data[index].binded) {
            bindedPlates++
          }
        }

        that.setData({
          plates:data
        })
    })
  }
})