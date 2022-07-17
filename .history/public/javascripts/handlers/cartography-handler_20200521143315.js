const citySDK = require('./citysdk-handler')
const zipwriter = require('../mongo/zipwriter')
const tractWriter = require('../mongo/tractWriter')
const mongo = require('../mongo/mongo')
const Constants = require('../constants')

var methods = {

    getZipCartograpahy: async (state, zip) => {
      let res = await zipwriter.findZip(state, zip)
      return res
    },

    fetchZipCartography : async (lat, lng) => {
      return await citySDK.getZipCartography(lat, lng)
    },

    getTractCart: async (state, geoId) => {
      let res = await tractWriter.findTract(state, geoId)
      return res
    },

  getTradeZoneCartography : async (state, center, bounds) => {
    console.log("FIREEEEE")
    state = state.toLowerCase()
    let db = 'gson'
    let collection = 'zip-' + state
    let geoids = []
    var res;

    let county = await citySDK.getCounty()
    
    switch (geoUnit) {
      
      case 'zip':
          collection = 'zip-' + state

          // geoid
          for (let i =0; i < bounds.length; i++) {
            geoids.push(bounds[i][0]['zip-code-tabulation-area'])
          }

          res = await mongo.getRecord(db, collection, { "properties.ZCTA5CE10" :  { $in : geoids }}).catch(err => console.error('Mongo Error', err))
          return res;
        
      case 'tract':
          collection = 'tract-' + state

          // geoid
          for (let i =0; i < bounds.length; i++) {
            geoids.push(bounds[i][0]['state'] + bounds[i][0]['county'] + bounds[i][0]['tract'])
          }
          console.log("GEOIDS", geoids)
          res = await mongo.getRecord(db, collection, { "properties.GEOID" :  { $in : geoids }}).catch(err => console.error('Mongo Error', err))
          console.log("MONGO_RES", db, collection, res)
          return res;
          
      case 'block':
        collection = 'block-group-' + state 
        // geoid
        for (let i =0; i < bounds.length; i++) {
          geoids.push(bounds[i][0]['state'] + bounds[i][0]['county'] + bounds[i][0]['tract'] + bounds[i][0]['block-group'])
        }
        console.log("GEOIDS", geoids)
        res = await mongo.getRecord(db, collection, { "properties.GEOID" :  { $in : geoids }}).catch(err => console.error('Mongo Error', err))
        console.log("MONGO_RES", db, collection, res)
        return res;
    }   
  },

  getLoadedTradeZoneCartography : async (pid, range) => {
    let res = await mongo.getRecord('locations', 'tradezone_cartography', {'pid': pid, 'range': range})
    
    console.log('Loaded cart', range)
    return res;
  }
}

module.exports = methods