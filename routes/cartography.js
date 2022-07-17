const express = require('express');
const router = express.Router();
const cartographyHandler= require('../public/javascripts/handlers/cartography-handler')
const Constants = require('../public/javascripts/constants')
const bodyParser = require("body-parser");
const cors = require('cors')

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(cors())
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", Constants.ORIGIN)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// get zip cart from db
router.get('/zip/:state/:zip', async (req, res) => {
  let zip_cart = await cartographyHandler.getZipCartograpahy(req.params.state, req.params.zip)
  res.setHeader('Content-Type', 'application/json') 
  res.send(zip_cart)
})

// get zip from citysdk
router.get('/zip/fetch/:lat/:lng', async (req, res) => {
  let zip_cart = await cartographyHandler.fetchZipCartography(req.params.lat, req.params.lng)
  res.setHeader('Content-Type', 'application/json') 
  res.send(zip_cart)
})

router.get('/tract/:state/:geoCode', async (req, res) => {
  let tract_cart = await cartographyHandler.getTractCart(req.params.state, req.params.geoCode) 
  res.setHeader('Content-Type', 'application/json')
  res.send(tract_cart)
})

router.post('/tradezone', async (req, res) => {

  let state = req.body.state
  let center = req.body.center
  let bounds =req.body.bounds

  let data = await cartographyHandler.getTradeZoneCartography(state, center, bounds)
  res.setHeader('Content-Type', 'application/json')
  res.send(data)
})

router.post('/tradezone/loaded', async (req, res) => {
  
  let pid = req.body.pid
  let range = req.body.range
  let data = await cartographyHandler.getLoadedTradeZoneCartography(pid, range)
  res.setHeader('Content-Type', 'application/json')
  res.send(data)
})

module.exports = router;
