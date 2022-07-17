var express = require('express');
var router = express.Router();
const dbBuilder = require('../public/javascripts/mongo/dbBuilder')
const mongo = require("../public/javascripts/mongo/mongo")
const cors = require('cors')
router.use(cors())


router.get('/mongo/test', async function(req, res) {
  return await mongo.testDB()
});

// generic DB updating - takes stringified json for query and data
router.post('/publish/all', async function(req, res) {
  const mongoRes = await mongo.updateManyDB("locations", "listings", {}, { $set: {"published" : true }})
  res.send(mongoRes)
});

// DB Building tools /////////////////////////////
router.post('/county/stats', function(req, res, next) {
  dbBuilder.buildTractStats(req.body.state, req.body.county)
  res.send('Building Db, check console')
});

router.post('/state/tracts', (req, res) => {
  dbBuilder.runTractBuilder(req.body.state, req.body.counties)
  res.send('Fetching Tracts, writing to DB, check console.')
})

// block group 
router.post('/blocks/stats', function(req, res, next) {
  dbBuilder.buildBlockStats(req.body.state, req.body.county)
  res.send('Building Db, check console')
});

router.post('/build/zipgson', (req, res) => {
  dbBuilder.buildGeoJson()
  res.send('Updating DB, check console.')
})

router.post('/update', (req, res) => {
  dbBuilder.updateDB()
  res.send('Updating DB, check console.')
})

router.post('/cleanup', (req,res) => {
  dbBuilder.cleanUpZeroValueZone()
  res.send('Cleaning values')
})

// TZ 2.0 DB Building tools /////////////////////////////

router.post('/build/zips/:state', async (req, res) => {
  const { state } = req.params;
  const results = await dbBuilder.buildZipStats(state.toLowerCase());
  res.send(results)
});

router.post('/build/blocks/:region', async (req, res) => {
  const { region } = req.params;
  const results = await dbBuilder.buildBlockStats(region.toLowerCase());
  res.send(results);
});

module.exports = router;
