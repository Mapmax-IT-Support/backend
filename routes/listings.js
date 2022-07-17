const express = require('express');
const router = express.Router();
const listings_handler = require('../public/javascripts/handlers/listings-handler')
const Constants = require('../public/javascripts/constants')
const bodyParser = require("body-parser");
const path = require('path')
const cors = require('cors')
const fs = require('fs')
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

// download from s3
router.post('/download', async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const uri = req.body.uri
  let data = await listings_handler.downloadFromS3(uri)

  const fileName = uri.slice(uri.lastIndexOf('/')+1, uri.length);
  fs.writeFileSync(path.resolve(__dirname, fileName), data)
  res.sendFile(path.join(__dirname, fileName))
})

// test s3
router.post('/test', upload.single('contactPic'), async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  let data = await listings_handler.testS3(req.file)
  res.send(data)
})

// create listing
router.post('/create', async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  let data = await listings_handler.handleNewListing(req.body)
  res.send(data)
})

// update listing
router.put('/update', async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  let data = await listings_handler.updateListing(req.body)
  res.send(data)
})

// add photos
router.post('/photos/add', upload.fields([{name : 'cover_photos'}, {name : 'contact_photos'}, { name:'site_photos'}]), async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  let data = await listings_handler.handlePhotos(req.body.listingId, req.files)
  res.send(data)
})

// getListing by listing_id
router.get('/id/:listingId', async (req, res) => {
  const { listingId } = req.params;
  res.setHeader('Content-Type', 'application/json')
  let data = await listings_handler.getListingById(listingId)
  res.send(data)
})

// getListing by place_id
router.post('/place_id', async (req, res) => {
  const { place_id, includeDrafts } = req.body
  res.setHeader('Content-Type', 'application/json')
  let data = await listings_handler.getListingByPlaceId(place_id, includeDrafts)
  res.send(data)
})

// getListing by userif
router.post('/user_id', async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  let data = await listings_handler.getListingByUserId(req.body.user_id)
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


// get listings in radius
router.post('/nearby', async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  let data = await listings_handler.getNearby(req.body.zip, req.body.distance)
  res.send(data)
})

// delete listing
// get listings in radius
router.post('/delete', async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  let data = await listings_handler.deleteListing(req.body.listingId)
  res.send(data)
})

router.post('/publish', async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const { listingId, published } = req.body
  let data = await listings_handler.setPublished(listingId, published)
  res.send(data)
})


module.exports = router;
