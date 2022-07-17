const express = require('express');
const router = express.Router();
const listings_handler= require('../public/javascripts/handlers/listings-handler')
const Constants = require('../public/javascripts/constants')
const bodyParser = require("body-parser");
const cors = require('cors')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

// upload photos
const fields = [
  { name : 'contact_photos', maxCount : 1 },
  { name : 'site_photos', maxCount : 3} 
]

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(cors())

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", Constants.ORIGIN)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next();
});

// test s3
router.post('/test', upload.single('contactPic'), async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  let data =  await listings_handler.testS3(req.file)
  res.send(data)
})

// create listing
router.post('/create', async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  let data = await listings_handler.handleNewListing(req.body)
  res.send(data)
})

// add photos
router.post('/photos/add', upload.fields([{name : 'cover_photos'}, {name : 'contact_photos'}, { name:'site_photos'}]), async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  console.log('form_data', req.body, req.files)
  let data = await listings_handler.handlePhotos(req.body.listingId, req.files)
  res.send(data)
})

// getListing by place_id
router.get('/id/:listingId', async (req, res) => {
  console.log("get_listing_by_did", req.params.listingId)
  res.setHeader('Content-Type', 'application/json')
  let data = await listings_handler.getListingById(req.params.listingId)
  res.send(data)
})

// getListing by formatted address
router.post('/place_id', async (req, res) => {
  console.log("LISTING_POST_BODY", req.body)
  res.setHeader('Content-Type', 'application/json')
  let data = await listings_handler.getListingByAddress(req.body.place_id)
  res.send(data)
})

// get recent listings
router.get('/recent', async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  let data = await listings_handler.getRecentListings()
  res.send(data)
})

// get listings
router.post('/get', async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  let data = await listings_handler.getListings(req.body.start, req.body.limit)
  res.send(data)
})


module.exports = router;
