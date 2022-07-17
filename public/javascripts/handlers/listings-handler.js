const s3 = require('../s3')
const mongo = require('../mongo/mongo')
const googleHandler = require('../handlers/google-handler')
const Constants = require('../constants')
const { MONGO } = require('../constants')
const { compressImage, deleteUploads } = require('../utils/fileManager')
const Landmark = MONGO.DATABASES.LARNDMARK;
const Listings = MONGO.COLLECTIONS.LANDMARK.LISTINGS;

const methods = {

    setPublished : async function(listingId, published) {
        return await mongo.updateOneToDB(Landmark, Listings, { listingId}, { $set : { listingId, published }} )
    },

    testS3 : async function(data) {

        let mimetype;
        switch (data.mimetype.substring(data.mimetype.indexOf('/')+1, data.mimetype.length)) {
            case "png": mimetype = ".png"; break;
            default: mimetype = ".jpg"; break;
        }
 
        return await s3.uploadFile(data, Constants.S3_BUCKET, "conway/machine"+mimetype)
        .catch(err => console.log("s3_error", err))
    },

    downloadFromS3 : async function(uri) {
        return await s3.downloadFile(Constants.S3_BUCKET, uri)
    },

    // recent listings
    getRecentListings : async function() {
        let res = await mongo.getSortedRecord(Landmark, Listings, {"published" : true}, { _id : -1}, 15)
        return res
    },

    // get listings
    getListings : async function(start, limit) {
        let res = await mongo.getSortedInterval(Landmark, Listings, {"published" : true}, { _id : -1}, start, limit )
        return res
    },

    getListingById : async function(listingId) {
        let res =  await mongo.getRecord(Landmark, Listings, { "listingId" : Number(listingId) })
        return res
    },

    getListingByUserId : async function(user_id) {
        const admins = ['615de03a2dc20c2ead0d19fd', '5e4edab5a8926d0024f7cff9', '5e4678451a36094d088230db'];
        let res;
        if (admins.indexOf(user_id) > -1) {
            res =  await mongo.getRecord(Landmark, Listings, {})
        } else {
            res =  await mongo.getRecord(Landmark, Listings, { "user_id" : String(user_id) })

        }
        return res
    },

    getListingByPlaceId : async function(place_id, includeDrafts) {
        let query = (includeDrafts) ? { "location.place.place_id" : place_id } : { "location.place.place_id" : place_id, "published" : true }
        let res =  await mongo.getRecord(Landmark, Listings, query)
        return res
    },

    handleNewListing: async function(data) {
        let id = Math.floor(Math.random() * 1000000000) 
        let res = await mongo.writeOneToDB(Landmark, Listings, {...data, listingId : id})
        return {mongoRes : res, listingId : id };
    },

    updateListing: async function(data) {
        let res = await mongo.updateOneToDB(Landmark, Listings, { "listingId" : Number(data.listingId) }, { 
            $set: { 
                'location': data.location,
                'contactInfo': data.contactInfo,
                'locationDetails': data.locationDetails,
                'pricingInfo': data.pricingInfo,
                'photos': data.photos,
                'published': data.published
            }
        })
        return {mongoRes : res, listingId : data.listingId };
    },

    // delete listing
    deleteListing: async function(listingId) {
        let res = await mongo.deleteRecord(Landmark, Listings,{listingId : listingId})
        return {mongoRes : res, listingId : listingId };
    },

    // todo needs error handling
    handlePhotos : async function(listingId, data) {

        if (listingId == undefined) return { error : "no listingId provided"};
        data = Object.entries(data)
        let promises = []
        let mongoData = { cover_photos : [], site_photos : [], contact_photos : [] }
        for (let [field, files] of data) {
            mongoData[field] = []
            for (let i = 0; i < files.length; i++) {
                let mimetype;
                switch (files[i].mimetype.substring(files[i].mimetype.indexOf('/')+1, files[i].mimetype.length)) {
                    // case "png": mimetype = ".png"; break;
                    default: mimetype = ".jpg"; break;
                }

                //compress 
                const filePath = files[i].path
                let height, width; 

                if (field === 'contact_photos') {
                    height = 180
                    width = 180
                } else {
                    height = 1080
                    width = 1920
                }
                const compressedStream = await compressImage(filePath, width, height)
                
                // upload to S3
                promises.push(s3.uploadFileStream(compressedStream, Constants.S3_BUCKET, "listings/"+listingId + "/" + field + "/"+ filePath + mimetype)
                .catch(err => console.log("s3_error", err)))

                // mongo 
                mongoData[field][i] = "listings/"+listingId + "/" + field + "/"+filePath + mimetype
            }   
        }
        
        let res =  await Promise.all(promises) 

        deleteUploads()

        // push photo counts to mongo
        if (res.length > 0) {
            let mongoRes = await mongo.updateOneToDB(Landmark, Listings,{ "listingId" : Number(listingId) }, { $set: { 'photos': mongoData }})
            return { s3Res : res, mongoRes : mongoRes.result.n}
        }

        return { s3Res : res }
    },

    getNearby : async function (zip, distance) {
        let res = await googleHandler.getGeoDataFromZip(zip)

        // bad zip
        if (res.results.length == 0) return ({ error : zip + " is not a valid zip code", errorCode : 10 })

        let coords = res.results[0].geometry.location 

        // Pull all Listings and filter by coordinate distance
        let listings = await mongo.getRecord(Landmark, Listings, {"published" : true})


        let nearbyListings = listings.filter((listing) => {
            return calcCrow(coords.lat, coords.lng, listing.location.coords.lat, listing.location.coords.lng) < distance
        })

        return { results : nearbyListings }
    }
}

module.exports = methods;


// https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
 //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
 function calcCrow(lat1, lon1, lat2, lon2) 
 {
   var R = 6371; // km
   var dLat = toRad(lat2-lat1);
   var dLon = toRad(lon2-lon1);
   var lat1 = toRad(lat1);
   var lat2 = toRad(lat2);

   var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
     Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
   var d = R * c;
   return getMiles(d);
 }

 // Converts numeric degrees to radians
 function toRad(Value) 
 {
     return Value * Math.PI / 180;
 }

 // https://stackoverflow.com/questions/20674439/how-to-convert-meters-to-miles
 function getMiles(i) {
    return i*0.621371192;
}