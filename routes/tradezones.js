var express = require('express');
var router = express.Router();
const tradezones_handler = require('../public/javascripts/handlers/tradezones-handler')
const cors = require('cors')

router.use(cors())

// get tradezone
router.get('/:state/:zcta/:lat/:lng', async (req, res) => {
    const { state, zcta, lat, lng } = req.params;
    const { isnyc, radius } = req.query;

  tradezones_handler.getTradezone(state.toLowerCase(), zcta, lat, lng, radius, isnyc, (results) => {
    res.send(results);
  });   
})

// get zip data
router.get('/zip/:state/:zcta', async (req, res) => {
    const { state, zcta } = req.params;
    const data  = await tradezones_handler.getZipData(state.toLowerCase(), zcta);
    res.send(data);
});

// get block data 

module.exports = router;
