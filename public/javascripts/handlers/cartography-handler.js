const citySDK = require('./citysdk-handler')
const zipwriter = require('../mongo/zipwriter')
const mongo = require('../mongo/mongo')
const { MONGO } = require('../constants')
const { LARNDMARK, GSON } = MONGO.DATABASES;


const methods = {

  fetchZipCartography : async (lat, lng) => {
    return await citySDK.getZipCartography(lat, lng)
  },

  getTractCart: async (state, geoId) => {
    let res = await tractWriter.findTract(state, geoId)
    return res
  },

  getZipCartograpahy: async (state, zip) => {
    try {
      const Collection = `zip-${state}`;
      const data = await mongo.getRecord(GSON, Collection, { 'properties.ZCTA5CE10': zip }).catch(err => console.error('Mongo Error', err))
      return data;
    }
    catch (err) {
      return { error}
    }
  
  },


  getTradeZoneCartography : async (state, center, bounds) => {
    state = state.toLowerCase()
    let collection = 'zip-' + state
    let geoids = []
    var res;

    let county = await citySDK.getCounty(center.lat, center.lng)
    let geoUnit = (county[0].state == '36' && county[0].county == '061') ? 'block' : 'zip'
    
    switch (geoUnit) {
      
      case 'zip':
          collection = 'zip-' + state

          // geoid
          for (let i =0; i < bounds.length; i++) {
            geoids.push(bounds[i][0]['zip-code-tabulation-area'])
          }

          res = await mongo.getRecord(GSON, collection, { "properties.ZCTA5CE10" :  { $in : geoids }}).catch(err => console.error('Mongo Error', err))
          return res;
          
      case 'block':
        collection = 'block-group-' + state 
        // geoid
        for (let i =0; i < bounds.length; i++) {
          geoids.push(bounds[i][0]['state'] + bounds[i][0]['county'] + bounds[i][0]['tract'] + bounds[i][0]['block-group'])
        }
        res = await mongo.getRecord(GSON, collection, { "properties.GEOID" :  { $in : geoids }}).catch(err => console.error('Mongo Error', err))
        return res;
    }   
  },

  // TO-DO attach data directly to locations
  getLoadedTradeZoneCartography : async (pid, range) => {
    let res = await mongo.getRecord(LARNDMARK, 'tradezone_cartography', {'pid': pid, 'range': range})
    return res;
  }
}

module.exports = methods