const s3 = require('../s3')
const mongo = require('../mongo/mongo')

let methods = {

    testS3 : async function(data) {

        let mimetype;
        switch (data.mimetype.substring(data.mimetype.indexOf('/')+1, data.mimetype.length)) {
            case "png": mimetype = ".png"; break;
            default: mimetype = ".jpg"; break;
        }

        console.log(data, "landmarkbucket2", "conway/machine"+mimetype)
        return await s3.uploadFile(data, "landmarkbucket2", "conway/machine"+mimetype)
        .catch(err => console.log("s3_error", err))
    },

    // recent listings
    getRecentListings : async function() {
        let res = await mongo.getSortedRecord('locations', 'listings', {}, { _id : -1}, 15)
        return res
    },

    // get listings
    getListings : async function() {
        let res = await mongo.getSortedRecord('locations', 'listings', {}, { _id : -1}, )
        return res
    },

    getListingById : async function(listingId) {
        let res =  await mongo.getRecord('locations', 'listings', { "listingId" : Number(listingId) })
        console.log('listing_id_res', res, listingId)
        return res
    },

    getListingByAddress : async function(address) {
        let res =  await mongo.getRecord('locations', 'listings', { "location.formatted" : address })
        console.log('listing_from_address', res, address)
        return res
    },

    handleNewListing: async function(data) {
        let id = Math.floor(Math.random() * 1000000000) 
        let res = await mongo.writeOneToDB('locations','listings', {...data, listingId : id})

        return {mongoRes : res, listingId : id };
    },

    // todo needs error handling
    handlePhotos : async function(listingId, data) {

        if (listingId == undefined) return { error : "no listingId provided"};

        data = Object.entries(data)
        let promises = []
        let mongoData = {}
        for (let [field, files] of data) {
            mongoData[field] = []
            for (let i = 0; i < files.length; i++) {

                let mimetype;
                switch (files[i].mimetype.substring(files[i].mimetype.indexOf('/')+1, files[i].mimetype.length)) {
                    case "png": mimetype = ".png"; break;
                    default: mimetype = ".jpg"; break;
                }

                promises.push(s3.uploadFile(files[i], "landmarkbucket2", "listings/"+listingId + "/" + field + "/upload"+ (i+1) + mimetype)
                .catch(err => console.log("s3_error", err)))

                // mongo 
                mongoData[field][i] = "listings/"+listingId + "/" + field + "/upload"+ (i+1) + mimetype
                
            }   
        }
        
       
        let res =  await Promise.all(promises) 

        // push photo counts to mongo
        if (res.length > 0) {
            let mongoRes = await mongo.updateOneToDB('locations', 'listings', { "listingId" : Number(listingId) }, { $set: { 'photos': mongoData }})
            return { s3Res : res, mongoRes : mongoRes.result.n}
        }

        return { s3Res : res }
    }
}

module.exports = methods;