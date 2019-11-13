const API_URL = ''
const SUCCESSED = 0

var base64 = require('../utils/base64.js')
var userModel = require('../model/user.js')

function getRequest(relativePath,params={},auth=false) {
    return startRequest('GET',relativePath,params,auth)
}

function postRequest(relativePath,params={},auth=false,loading= true) {
    return startRequest('POST',relativePath,params,auth,loading)
}

function putRequest(relativePath,params={},auth=false) {
    return startRequest('PUT',relativePath,params,auth)
}

function deleteRequest(relativePath,params={},auth=false) {
    return startRequest('DELETE',relativePath,params,auth)
}

module.exports.getRequest = getRequest
module.exports.postRequest = postRequest
module.exports.putRequest = putRequest
module.exports.startRequest = startRequest
module.exports.deleteRequest = deleteRequest
module.exports.SUCCESSED = SUCCESSED
module.exports.API_URL = API_URL
module.exports.makeAuthValue = makeAuthValue

// 私有函数
function makeRequestPath(relativePath) {
    return API_URL + relativePath
}

function makeAuthValue() {
    var authValue = ''
    var userInfo = userModel.getCurrentUser()
    var userInfo = userModel.getCurrentUser()
    
    if(userInfo) {
        authValue = userInfo.user.accessToken + ":" + ""
        authValue = base64.encode(authValue)
        authValue = "Basic " + authValue
    }
  
    return authValue
}

function startRequest(method,relativePath,params={},auth=false,loading = true) {
    if (loading) {
      wx.showNavigationBarLoading()
    }

    var authValue = ''
    if (true == auth) {
        authValue = makeAuthValue()
    }
    
    return new Promise((resolve, reject) => {
        console.log('method=' + method + ' relativePath=' + relativePath + ' params=')
        console.log(params)
        wx.request({
            url: makeRequestPath(relativePath),
            data: params,
            method: method,
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': authValue
            },
            success(res) {
              if (loading) {
                wx.hideNavigationBarLoading()
              }
              
              console.log('startRequest success')
              console.log(res.data)
              if (SUCCESSED == res.data.status) {
                resolve(res.data)
              }else {
                reject(res.data)
              }
             

              if (-2 == res.data.status) {  // 如果是验证问题，重新登录
                getApp().showLoginPrompt()
              }
            },
            fail(res) {  
              if (loading) {
                wx.hideNavigationBarLoading()
              }
              // console.log('startRequest fail')
              // console.log(res)
              reject(res)
            }
        })
    })
}