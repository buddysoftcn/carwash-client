const CURRENT_USER_KEY = 'currentUserKey'

const ROLE_NO_LOGIN = -2  // 用户未登录
const ROLE_NORMAL = 0    // 用户授权登录，但没有绑定身份
const ROLE_OWNER = 1      // 店长
const ROLE_CLERK = 2      // 店员

const CREDIT = [{'value':0,'desc':'信用较差'},{'value':50,'desc':'信用较好'},{'value':100,'desc':'信用极好'}]

function setCurrentUser(user) {
  wx.setStorageSync(CURRENT_USER_KEY, user)
}

function getCurrentUser() {
  let result = wx.getStorageSync(CURRENT_USER_KEY)
  if (result) {    
    return result
  }

  return null
}

function removeCurrentUser() {
  wx.removeStorageSync(CURRENT_USER_KEY)
}

function getRole() {
  let user = getCurrentUser()
  
  if (null != user) {
    if (false == user.asOwner && false == user.asClerk) {
      return { 'role': ROLE_NORMAL, 'desc': '普通用户' }    
    }else if (true == user.asOwner) {
      return { 'role': ROLE_OWNER, 'desc': '店长' }    
    }else if (true == user.asClerk) {
      return { 'role': ROLE_CLERK, 'desc': '店员' }    
    }
  }

  return {'role':ROLE_NO_LOGIN,'desc':'未授权登录'}
}

function getCredit(value) {
  let credit = null
  for (let index = 0,size = CREDIT.length; index < size; index++) {
    if (value == CREDIT[index].value) {
      credit = CREDIT[index]
      break
    }
  }

  return credit
}

module.exports = {
  setCurrentUser: setCurrentUser,
  getCurrentUser: getCurrentUser,
  getRole: getRole,
  getCredit: getCredit,
  removeCurrentUser: removeCurrentUser,
  ROLE_NO_LOGIN: ROLE_NO_LOGIN,
  ROLE_NORMAL: ROLE_NORMAL,
  ROLE_OWNER: ROLE_OWNER,
  ROLE_CLERK: ROLE_CLERK
}