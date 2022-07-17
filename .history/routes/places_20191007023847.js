const express = require('express');
const router = express.Router();
const googleHandler = require('../public/javascripts/handlers/google-handler')
const Constants = require('../public/javascripts/constants')
const cors = require('cors')
router.use(cors())

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// nearby places 
router.get('/nearby/:lat/:lng/:type', async (req, res) => {
  let data = await googleHandler.getNearBy(req.params.lat, req.params.lng, req.params.type)
  res.setHeader('Content-Type', 'application/json');
  res.header("Access-Control-Allow-Origin", Constants.ORIGIN)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.set('Pragma', data.next_page_token)
  res.send(data.results);
})

// next page 
router.get('/pages/:token', (req, res) => {
  googleHandler.getNearByNextPage(req.params.token, (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", Constants.ORIGIN)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.set('Pragma', data.next_page_token)
    res.send(data.results);
  })
})

// get photo endpoint
router.get('/photos/:ref/:width/:height', (req, res) => {
  googleHandler.getPhoto(req.params.ref, req.params.width, req.params.height, (data) => {
    res.header("Access-Control-Allow-Origin", Constants.ORIGIN)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.send(data)
  })
})

// get place Details
router.get('/details/:placeId', async (req, res) => {
  let data = await googleHandler.getPlaceDetails(req.params.placeId)
  res.header("Access-Control-Allow-Origin", Constants.ORIGIN)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.set('Pragma', data.next_page_token)
  res.send(data.results);
})

module.exports = router;
