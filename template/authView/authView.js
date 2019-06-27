let that = null

function showView(source,show) {
  that = source
  
  that.setData({
    showAuthView:show
  })
}

module.exports = {
  showView: showView
}