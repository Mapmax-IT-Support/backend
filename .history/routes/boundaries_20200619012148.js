var express = require('express');
var router = express.Router();
const cors = require('cors')
const Constants = require('../public/javascripts/constants')
const tradezoneHandler = require('../public/javascripts/handlers/tradeZone-handler')
const citySDKHandler = require('../public/javascripts/handlers/citysdk-handler')

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
router.get('/tradezone/:isCity/:lat/:lng/:geounit', async (req, res, next) => {
    let center = {}
    center.lat = req.params.lat
    center.lng = req.params.lng
    let data = await tradezoneHandler.getTradeZoneBounds(req.params.isCity, center, req.params.geounit)
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
})

router.get('/county/:lat/:lng/', async (req, res, next) => {
  console.log("FIRE_COUNTY")
  let data = await citySDKHandler.getCounty(req.params.lat, req.params.lng)
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
})

router.get('/zip', async (req, res, next) => {
  console.log("FIRE_COUNTY")
  let data = await citySDKHandler.getZip(req.body.coordinates.lat, req.body.coordinates.lng)
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
})



//getTradeZoneCartography



module.exports = router;
