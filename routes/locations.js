const express = require('express');
const router = express.Router();
const locations_handler= require('../public/javascripts/handlers/locations-handler')
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

// get location with pid
router.get('/:pid', async (req, res) => {
  res.setHeader('Content-Type', 'application/json') 
  let data = await locations_handler.getLocation(req.params.pid)
  res.send(data)
})

// create location
router.post('/create', async (req, res) => {
  let pid = req.body.pid
  let location = req.body.location

  let data = await locations_handler.createLocation(pid, location)
  res.setHeader('Content-Type', 'application/json')
  res.send(data)
})

// get comments
router.get('/comments/:pid', async (req, res) => {
    res.setHeader('Content-Type', 'application/json') 
    let data = await locations_handler.getComments(req.params.pid)
    res.send(data)
  })

// post comment
router.post('/comments/create', async (req, res) => {
    let pid = req.body.pid
    let user = req.body.user
    let body = req.body.body
    res.setHeader('Content-Type', 'application/json') 
    let data = await locations_handler.createComment(pid, user, body)
    res.send(data)
  })

// post tradezone cartography
router.post('/tradezone/cartography/create', async (req, res) => {
    let pid = req.body.pid
    let cartography = req.body.cartography
    let range = req.body.range
    res.setHeader('Content-Type', 'application/json') 
    let data = await locations_handler.createTradezoneCartography(pid, cartography, range )
    res.send(data)
})
  
// post tradezone stats
router.post('/tradezone/stats/create', async (req, res) => {
  let pid = req.body.pid
  let stats = req.body.stats
  let range = req.body.range
  res.setHeader('Content-Type', 'application/json') 
  let data = await locations_handler.createTradezoneStats(pid, stats, range)
  res.send(data)
})
module.exports = router;
