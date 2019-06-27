// pages/worktimeList/worktimeList.js
let util = require('../../utils/util.js')
let shopModel = require('../../model/shop.js')
let worktimesMap = null // 所有工作时间放入字典中
let worktimes = null    // 按小时将工作时间进行分组 
let currentDate = null
let currentWorktime = null
let shop = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    days:[],
    worktimes: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    shop = shopModel.getShopInfo()
    currentDate = util.today()

    wx.setNavigationBarTitle({
      title: shop.shop.name,
    })

    this.initDaysView()
    this.initWorktimeList()

    this.setData({
      worktimes:worktimes
    })
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

  onPayment:function (event) {
    currentWorktime = event.currentTarget.dataset.worktime

    wx.showModal({
      title: '确认时间',
      content: '预约时间为：' + util.formatDate(currentWorktime.date) + currentWorktime.time,
      confirmText:'下一步',
      confirmColor:'#2ECC71',
      success(res) {
        if (res.confirm) {
          getApp().globalData.param = currentWorktime

          wx.navigateTo({
            url: '../addOrder/addOrder',
          })
        } else if (res.cancel) {
        }
      }
    })
  },

  initDaysView:function() {
    let days = [],date = null
    date = util.today()    
    days.push({ 'date': date, 'uiDate': util.formatDate(date), 'week': util.week(date)})

    date = util.tomorrow()
    days.push({ 'date': date, 'uiDate': util.formatDate(date), 'week': util.week(date) })

    this.setData({
      days:days
    })
  },

  initWorktimeList: function () {
    this.initWorktimesMap()
    this.initWorktimes()
    console.log(worktimes)
    // this.getOrders()
  },

  initWorktimesMap: function () {
    console.log(shop)

    if (shop) {
      worktimesMap = new Map()

      let workTimeBegin = util.makeDate(currentDate + ' ' + shop.shopSetting.workTimeBegin)
      const workTimeEnd = util.makeDate(currentDate + ' ' + shop.shopSetting.workTimeEnd)
      const washMinutes = shop.shopSetting.washMinutes
      const lunchTimeBegin = util.makeDate(currentDate + ' ' + shop.shopSetting.lunchTimeBegin)
      const lunchTimeEnd = util.makeDate(currentDate + ' ' + shop.shopSetting.lunchTimeEnd)
      let worktime = null

      // 计算上午工作时间
      while (workTimeBegin < lunchTimeBegin && parseInt(lunchTimeBegin - workTimeBegin) / 1000 / 60 >= washMinutes) {
        worktime = this.initWorktime(workTimeBegin)
        worktimesMap.set(worktime.datetime, worktime)
        workTimeBegin = this.makeNextWorktime(workTimeBegin, washMinutes)
      }

      workTimeBegin = lunchTimeEnd

      //计算下午工作时间
      while (workTimeBegin < workTimeEnd && parseInt(workTimeEnd - workTimeBegin) / 1000 / 60 >= washMinutes) {
        worktime = this.initWorktime(workTimeBegin)
        worktimesMap.set(worktime.datetime, worktime)
        workTimeBegin = this.makeNextWorktime(workTimeBegin, washMinutes)
      }
    }
  },

  initWorktime: function (datetime) {
    let worktime = {}
    worktime.datetime = util.formatDateTime(datetime)
    worktime.hour = datetime.getHours()
    worktime.date = [datetime.getFullYear(), datetime.getMonth() + 1, datetime.getDate()].map(util.formatNumber).join('-')
    worktime.time = [datetime.getHours(), datetime.getMinutes()].map(util.formatNumber).join(':')
    worktime.order = null

    return worktime
  },

  initWorktimes: function () {
    let worktimesGroupMap = new Map(), index = -1
    worktimes = []

    if (worktimesMap) {
      let worktimeGroup = null, tmpWorktimes = null

      for (let worktime of worktimesMap) {
        worktimeGroup = worktimesGroupMap.get(worktime[1].hour)
        if (worktimeGroup) {
          worktimes[index].worktimes.push(worktime[1])
        } else {
          tmpWorktimes = []
          tmpWorktimes.push(worktime[1])
          worktimes.push({ 'hour': worktime[1].hour, 'worktimes': tmpWorktimes })
          worktimesGroupMap.set(worktime[1].hour, tmpWorktimes)

          index++
        }
      }
    }
  },

  makeNextWorktime: function (datetime, washMinutes) {
    datetime = datetime.setMinutes(datetime.getMinutes() + washMinutes) // 计算向后的时间
    datetime = new Date(datetime)
    return datetime
  }

})