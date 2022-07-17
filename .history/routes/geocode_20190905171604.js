var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// geocode
router.get('/geocode/:location', (req, res) => {
  var f_address = req.params.address.toString().replace('+', / /g)
  google.geoCode(f_address, (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", ORIGIN)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.send(data);
  })
})

module.exports = router;
