var express = require('express');
var router = express.Router();
const cors = require('cors')
const Constants = require('../public/javascripts/constants')
const tradezoneHandler = require('../public/javascripts/handlers/tradeZone-handler')
const citySDKHandler = require('../public/javascripts/handlers/citysdk-handler')
const mysql = require('../public/javascripts/mysql')
const mongo = require('../public/javascripts/mongo/mongo')

router.use(cors())
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", Constants.ORIGIN)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next();
});

/*
// zip bounds, custom radii
router.get('/tradezone/zip/:isCity/:lat/:lng', async (req, res, next) => {
  let center = {}
  center.lat = req.params.lat
  center.lng = req.params.lng
  let data = await tradezoneHandler.getZipTradeZoneBounds(req.params.isCity, center)
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
})
*/

// isCity = blocks, !isCity = tracts
router.get('/tradezone/:isCity/:lat/:lng', async (req, res) => {
    let center = {}
    center.lat = req.params.lat
    center.lng = req.params.lng
    let data = await tradezoneHandler.getTradeZoneBounds(req.params.isCity, center)
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
})

router.get('/county/:lat/:lng/', async (req, res) => {
  let data = await citySDKHandler.getCounty(req.params.lat, req.params.lng)
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
})

router.get('/zip/:lat/:lng/', async (req, res) => {
  let data = await citySDKHandler.getZip(req.params.lat, req.params.lng)
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
})

router.post('/zip', async (req, res) => {
  let data = await citySDKHandler.getZip(req.body.coordinates.lat, req.body.coordinates.lng)
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
})

// get zip from geocode
router.get('/zcta5/:lat/:lng/', async (req, res) => {
  let data = await citySDKHandler.getZipHierarchy(req.params.lat, req.params.lng)
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
})

router.get('/zips/:state/:lat/:lng', async (req, res) => {
    const { state, lat, lng } = req.params;
   const stateF = state.toLowerCase()
    mysql.getNearbyZips(stateF, lat, lng, async (results) => {

      if (results.length > 0) {
        const zips = results.map(e => e.zipcode)
        // get zips 
        const zipCarts = await mongo.getRecord('ZipGson', stateF, { 'properties.ZCTA5CE10' : { $in: zips }})
        res.send(zipCarts)
      } else {
        res.send([]);
      }
    });
});

module.exports = router;
