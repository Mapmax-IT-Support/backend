var express = require('express');
var router = express.Router();
const dbBuilder = require('../public/javascripts/mongo/dbBuilder')
const cors = require('cors')
router.use(cors())

/* GET home page. */
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
  dbBuilder.updateDB()
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
module.exports = router;
