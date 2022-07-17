const Constants = require('../constants')
const googleMapsClient = require('@google/maps').createClient({
  key: Constants.GOOGLE_KEY
});
const fetch = require('node-fetch');
const methods = {


  getCoordsFromZip : (zip) => {
    let url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zip + '//&key=' + Constants.GOOGLE_KEY
    return fetch(url, 
    {
      method: "GET"
    })
    .then(res => res.json())
    .catch(err => err)
  },

  // get nearby places
  getNearBy: (lat, lng, type) => {
    return new Promise((resolve, reject) => {
      googleMapsClient.placesNearby({
        language: 'en',
        location: [lat, lng],
        rankby: 'distance',
        type: type
      }, (err, response) => {
      if (!err) {
        resolve(response.json)
      } else {
        console.error('Places error:', err)
        reject(err)
      }
      })
    })
      
  },

  // get nearby places
  getNearByNextPage: function(token, callBack) {
    googleMapsClient.placesNearby({
      pagetoken: token
    }, function(err, response) {
    if (!err) {
      console.log('get nearby-next page:', 'success');
      callBack(response.json)
    } else {
      console.log('Get Nearby:', 'Error', err)
    }
    })
  },

  // Geocode an address.
  geoCode: function(add, callBack) {
    googleMapsClient.geocode({
      address: add.toString()
    }, function(err, response) {
      if (!err) {
        callBack(response.json.results)
    //   console.log(response.json.results);
      } else {
        console.log('Error:', err)
      }
    })
  },

  getPlaceDetails: (placeId) => {
    return new Promise((resolve, reject) => {
      googleMapsClient.place({
        placeid: placeId,
        language: 'en',
        fields: ['formatted_address', 'opening_hours', 'website', 'price_level']
      }, (err, response) => {
      if (!err) {
        resolve(response.json)
      } else {
        console.error('Place details error:', err)
        reject(err)
      }
      })
    })
  },

  // get photo
  getPhoto: function(ref, width, height, callback) {
    fetch(
      //'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key=' + KEY
      Constants.PLACES_API + 'photo?key=' + Constants.GOOGLE_KEY 
    + '&photoreference=' + ref 
    + '&maxwdith=' + width
    + '&maxheight=' + height,
    {
      method : 'GET'
    })
    .then(response => {
      console.log(JSON.stringify({url: response.url}))
      callback(JSON.stringify({url: response.url}))
    })
    //.then(data => callback(data))
    .catch(error => console.error('Photo Error:', error))
  }

}

module.exports = methods;