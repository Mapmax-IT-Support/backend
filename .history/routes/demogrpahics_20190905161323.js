const express = require('express');
const router = express.Router();
const citysdkHandler = require('../public/javascripts/handlers')
const Constants = require('../../constants')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Demographics' });
});

router.get('/population/city/:lat/:lng', async (req, res) => {
  let data = await citysdkHandler.getCityPopulation(req.params.lat, req.params.lng).then(data => data)
  res.header("Access-Control-Allow-Origin", ORIGIN)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
})

// get age info
router.get('/age/:range/:lat/:lng', async (req, res) => {
  let data = await citysdkHandler.getAge(req.params.range, req.params.lat, req.params.lng).then(data => data)
  res.header("Access-Control-Allow-Origin", ORIGIN)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
})

// get income 
router.get('income/:range/:lat/:lng', async (req, res) => {
  let data = await citysdkHandler.getIncome(req.params.range, req.params.lat, req.params.lng).then(data => data)
  res.setHeader('Content-Type', 'application/json');
  res.header("Access-Control-Allow-Origin", ORIGIN)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.send(data);
})

// get social
router.get('social/:range/:lat/:lng', async (req, res) => {
  let data = await citysdkHandler.getSocial(req.params.range, req.params.lat, req.params.lng).then(data => data)
  res.setHeader('Content-Type', 'application/json');
  res.header("Access-Control-Allow-Origin", ORIGIN)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.send(data);
})

// get basic
router.get('basic/:range/:lat/:lng', async (req, res) => {
  let data = await citysdkHandler.getBasic(req.params.range, req.params.lat, req.params.lng).then(data => data)
  res.setHeader('Content-Type', 'application/json');
  res.header("Access-Control-Allow-Origin", ORIGIN)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.send(data);
})

// get tract
router.get('/tract/:lat/:lng', async (req, res) => {
  let data = await citysdkHandler.getTract(req.params.lat, req.params.lng).then(data => data)
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", ORIGIN)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.send(data);
})

module.exports = router;