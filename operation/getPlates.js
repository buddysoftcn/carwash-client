let request = require('operation.js')
let plateModel = require('../model/plate.js')

module.exports.getPlates = getPlates

function getPlates() {
  return new Promise((resolve, reject) => {
    request.getRequest('/plates', null, true)
      .then(data => {                
        plateModel.setPlates(data.items)        
        resolve(data.items)
      })
      .catch(e => {
        reject(e)
      })
  })
}