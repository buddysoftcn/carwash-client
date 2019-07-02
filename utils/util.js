const formatDateTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 今天
 */
function today() {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

/**
 * 明天
 */
function tomorrow() {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth()
  let day = date.getDate()

  date = new Date(year, month, day + 1)
  year = date.getFullYear()
  month = date.getMonth() + 1
  day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

/**
 * 后天
 */
function afterTomorrow() {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth()
  let day = date.getDate()

  date = new Date(year, month, day + 2)
  year = date.getFullYear()
  month = date.getMonth() + 1
  day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

function formatDate(date) {
  date = date.split('-')
  return date[1] + "月" + date[2] + "日 "
}

function formatTime(time) {
  time = time.split(':')
  return time[0] + ":" + time[1]
}

function makeDate(datetime) {
  datetime = datetime.replace(/-/g, ':').replace(' ', ':'); // 将字符串转换成正确的格式
  datetime = datetime.split(':');
  datetime = new Date(datetime[0], (datetime[1] - 1), datetime[2], datetime[3], datetime[4], datetime[5])

  return datetime
}

function week(date) {
  date = date.split('-')
  date = new Date(date[0], date[1] - 1, date[2])
  let weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
  let day = date.getDay()

  return weeks[day]
}

function subtractOneDay(date) {
  date = date.split('-')
  date = new Date(date[0], date[1], date[2])

  let year = date.getFullYear()
  let month = date.getMonth()
  let day = date.getDate()

  date = new Date(year, month, day - 1)
  year = date.getFullYear()
  month = date.getMonth()
  day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

function addOneDay(date) {
  date = date.split('-')
  date = new Date(date[0], date[1], date[2])

  let year = date.getFullYear()
  let month = date.getMonth()
  let day = date.getDate()

  date = new Date(year, month, day + 1)
  year = date.getFullYear()
  month = date.getMonth()
  day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}



module.exports = {
  formatDateTime: formatDateTime,
  today: today,
  afterTomorrow: afterTomorrow,
  tomorrow: tomorrow,
  week: week,
  formatDate: formatDate,
  formatTime: formatTime,
  makeDate: makeDate,
  subtractOneDay: subtractOneDay,
  addOneDay: addOneDay,
  formatNumber: formatNumber
}
