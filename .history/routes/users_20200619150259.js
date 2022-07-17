var express = require('express');
var router = express.Router();
const users_handler = require('../public/javascripts/handlers/users-handler')
const Constants = require('../public/javascripts/constants')
const cors = require('cors')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
const bodyParser = require("body-parser");

router.use(cors())

router.post('/register', async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.header("Access-Control-Allow-Origin", Constants.ORIGIN)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  let data = await users_handler.registerUser(req.body)
  res.send(data)
});

router.post('/login', async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    res.header("Access-Control-Allow-Origin", Constants.ORIGIN)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    let data = await users_handler.loginUser(req.body)
    res.send(data)
  });


router.post('/edit', async (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.header("Access-Control-Allow-Origin", Constants.ORIGIN)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

  let data = await users_handler.editUser(req.body)
  res.send(data)
});


  router.post('/recents', async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    res.header("Access-Control-Allow-Origin", Constants.ORIGIN)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    let data = await users_handler.pushRecentSearch(req.body)
    res.send(data)
  });

  router.post('/info', async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    res.header("Access-Control-Allow-Origin", Constants.ORIGIN)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    let data = await users_handler.getUserInfo(req.body)
    res.send(data)
  });


// profile picture
router.post('/profile/upload', upload.single('profile'), async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  console.log('form_data', req.body, req.file)

  if (!req.file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }

  let data = await listings_handler.handlePhotos(req.body.listingId, req.files)
  res.send(data)
})


module.exports = router;
