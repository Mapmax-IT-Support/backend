var express = require('express');
var router = express.Router();
const subway_handler = require('../public/javascripts/handlers/subway-handler')
const Constants = require('../public/javascripts/constants')
const cors = require('cors')
const mysql = require('../public/javascripts/mysql')

router.use(cors())
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", Constants.ORIGIN)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next();
});

// get subway stats
router.post('/totals', async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  let data = await subway_handler.getEntries(req.body.coords)
  res.send(data)
});

// get subway lines geojson
router.post('/lines', async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  let data = await subway_handler.getLines(req.body.lines)
  res.send(data)

})

router.get('/mysql', async (req, res) => {
  // 40.7986° N, 74.2391° W
  let data = await mysql.testMysql(8.04672, '40.7986', '-74.2391')
  return data;
})

module.exports = router;
