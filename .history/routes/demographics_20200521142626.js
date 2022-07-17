const express = require('express');
const router = express.Router();
const citySdkHandler = require('../public/javascripts/handlers/citysdk-handler')
const Constants = require('../public/javascripts/constants')
const demoHandler = require('../public/javascripts/handlers/demographics-handler')
const tradezoneHandler = require('../public/javascripts/handlers/tradeZone-handler')
const cors = require('cors')


router.use(cors())
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", Constants.ORIGIN)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Demographics' });
});

// test 40.8259, -74.2090

// tract stats
router.get('/stats/tract/:lat/:lng', async (req, res, next) => {
  let data = await demoHandler.getTractStats(req.params.lat, req.params.lng)
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
})

// zip stats
router.get('/stats/zip/:lat/:lng', async (req, res, next) => {
  let data = await demoHandler.getZipStats(req.params.lat, req.params.lng, 'zip code tabulation area')
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
})

// zip age stats
router.get('/stats/zip/age/:lat/:lng', async (req, res, next) => {
  let data = await demoHandler.getZipAgeStats(req.params.lat, req.params.lng, 'zip code tabulation area')
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
})

//getTradeZoneStats
router.post('/stats/tradezone', async (req, res) => {
  let bounds = req.body.bounds
  let data = await tradezoneHandler.getZoneStatsTracts(bounds)
  res.setHeader('Content-Type', 'application/json')
  res.send(data)
})
  
// get loaded tradezone stats
router.post('/stats/tradezone/loaded', async (req, res) => {
  let pid = req.body.pid
  let range = req.body.range
  let data = await tradezoneHandler.getLoadedTradeZoneStats(pid, range)
  res.setHeader('Content-Type', 'application/json')
  res.send(data)  
})

// get block group tradezone stats
router.post('/stats/tradezone/blocks', async (req, res) => {
  let data = await tradezoneHandler.getZoneStatsBlockGroups(req.body.center, req.body.bounds)
  res.setHeader('Content-Type', 'application/json')
  res.send(data)

})

// get zip code tradezone stats
router.post('/stats/tradezone/zip', async (req, res) => {
  let data = await tradezoneHandler.getZoneStatsZip(req.body.bounds)
  res.setHeader('Content-Type', 'application/json')
  res.send(data)

})

// get population of city
router.get('/population/city/:lat/:lng', async (req, res) => {
  let data = await citySdkHandler.getCityPopulation(req.params.lat, req.params.lng).then(data => data)
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
})

// get age 
router.get('/age/:range/:lat/:lng', async (req, res) => {
  let data = await citySdkHandler.getAge(req.params.range, req.params.lat, req.params.lng).then(data => data)
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
})

// get income 
router.get('/income/:range/:lat/:lng', async (req, res) => {
  let data = await citySdkHandler.getIncome(req.params.range, req.params.lat, req.params.lng).then(data => data)
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
})

// get social
router.get('/social/:range/:lat/:lng', async (req, res) => {
  let data = await citySdkHandler.getSocial(req.params.range, req.params.lat, req.params.lng).then(data => data)
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
})

// get basic stats
router.get('/basic/:range/:lat/:lng', async (req, res) => {
  let data = await citySdkHandler.getBasic(req.params.range, req.params.lat, req.params.lng).then(data => data)
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
})

// get tract id info
router.get('/tract/:lat/:lng', async (req, res) => {
  let data = await citysdkHandler.getTract(req.params.lat, req.params.lng).then(data => data)
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
})


module.exports = router;