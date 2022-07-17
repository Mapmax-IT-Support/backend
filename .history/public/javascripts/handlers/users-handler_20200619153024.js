const mongo = require('../mongo/mongo')
const {ObjectId} = require('mongodb');
const passwordHash = require('password-hash');
const s3 = require('../s3')
let methods = {

    registerUser(data) {
        return new Promise(async (resolve, reject) => {
            let isValid = true
            let promises = []
            let results = { emailError: '', usernameError: ''}
            console.log('USER DATA', data)
            promises.push(mongo.getRecord('users', 'users', {'email': data.email}))
            promises.push(mongo.getRecord('users', 'users', {'username': data.username}))
            let checkValid = await Promise.all(promises)

            // email
            if (checkValid[0].length > 0) {
                results = {...results, emailError: 'Email taken'}
                isValid = false
            }
            // username
            if (checkValid[1].length > 0) {
                results = {...results, usernameError: 'Username taken'}
                isValid = false
            }

            if (isValid) {
                let unHashedPw = data.password 
                data.password = passwordHash.generate(unHashedPw)
                 results = {...results, res: await mongo.writeOneToDB('users','users', {...data, recentSearches : []})}
            }
            resolve({'res': results, 'newUser': data})
        })
       
    },

    loginUser(data) {
        let validPassword = false
        return new Promise(async (resolve, reject) => {
            let results = await mongo.getRecord('users', 'users', {'email': data.email})

            if (results.length <= 0) { 
                 results = {error: 'Email not found', res : [] }
            } else {        

                // verify hash if email found
                let hashedPw = results[0].password
                validPassword = passwordHash.verify(data.password, hashedPw)

                if (!validPassword) {
                    results = {error: 'Password not found', res : [] }
                } 
            }
         
            resolve(results)
        })
    },

    editUser(data) {
        return new Promise(async (resolve, reject) => {
            let isValid = true
            let promises = []
            let results = { updateError: '',  emailError: '', usernameError: ''}
            let newEmail = true
            let newUsername = true
            let newFirst = true
            let newLast = true

            promises.push(mongo.getRecord('users', 'users', {_id : ObjectId(data.uid)}))
            promises.push(mongo.getRecord('users', 'users', {'email': data.email}))
            promises.push(mongo.getRecord('users', 'users', {'username': data.username}))
            let checkValid = await Promise.all(promises)

            // check delta
            if (checkValid[0].length == 0) {
                results = {...results, userError: 'User not found'}
                isValid = false
            } else {
                newEmail = checkValid[0][0].email != data.email
                newUsername = checkValid[0][0].username != data.username
                newFirst = checkValid[0][0].first != data.first
                newLast = checkValid[0][0].last != data.last

                console.log('DELTA', newFirst, checkValid[0][0].first, data.first)
                console.log('DELTA', newLast, checkValid[0][0].last, data.last)

                if (!newEmail && !newUsername && !newFirst && !newLast) {
                    console.log('NO_CHANGE')
                    results={...results, updateError: 'No change' }
                    isValid = false
                }
            }

            // email
            if (newEmail && checkValid[1].length > 0) {
                results = {...results, emailError: 'Email taken'}
                isValid = false
            }
            // username
            if ( newUsername && checkValid[2].length > 0) {
                results = {...results, usernameError: 'Username taken'}
                isValid = false
            }

            if (isValid) {
                if (newUsername && !newEmail) {
                    console.log('PUSHED NEW EMAIL',  data.email)
                 results = {...results, res: await mongo.updateOneToDB('users','users', {_id : ObjectId(data.uid) }, {$set: 
                    {'username': data.username, 'first': data.first, 'last': data.last }})}
                }
                else if (newEmail && ! newUsername) {
                    console.log('PUSHED NEW USERNAME',  data.username)
                    results = {...results, res: await mongo.updateOneToDB('users','users', 
                    {_id : ObjectId(data.uid) }, {$set: {'email': data.email, 'first': data.first, 'last': data.last }})}
                } 
                else if (newEmail && newUsername) {
                    console.log('PUSHED NEW USERNAME & EMAIL',  data.username, data.email)
                    results = {...results, res: await mongo.updateOneToDB('users','users', {_id : ObjectId(data.uid) }, 
                    {$set: {'username': data.username, 'email': data.email, 'first': data.first, 'last': data.last }})}
                } 
                else {
                    console.log('PUSHED NEW NAMES',  data.email)
                    results = {...results, res: await mongo.updateOneToDB('users','users', {_id : ObjectId(data.uid) }, {$set: 
                       { 'first': data.first, 'last': data.last }})}
                }
            }
            resolve({'res': results, 'newUser': data})
        })
       
    },

    pushRecentSearch(data) { 

        return new Promise(async (resolve, reject) => {
            let res = await mongo.updateOneToDB('users', 'users', {_id : ObjectId(data.uid) }, {$set: {'recentSearches': data.locations }})
            resolve({'res': res, 'newRecentSearch': data})
        })
    },

    getUserInfo(data) { 

        return new Promise(async (resolve, reject) => {
            let res = await mongo.getRecord('users', 'users', {_id : ObjectId(data.uid)})
            resolve({'res': res, 'fetched user info for ': data})
        })
    },

    // profile upload
    async handleProfileUpload(user_id, file)  {
       
        if (user_id == undefined) return { error : "no user_id provided"};


        let mimetype;
        switch (file.mimetype.substring(file.mimetype.indexOf('/')+1, file.mimetype.length)) {
            case "png": mimetype = ".png"; break;
            default: mimetype = ".jpg"; break;
        }

        let res = await s3.uploadFile(file, "landmarkbucket2", "users/"+user_id + "/profile"+ mimetype)
                .catch(err => console.log("s3_error", err))

        console.log("S3_profile_res", res)

        let mongoRes = await mongo.updateOneToDB('users', 'users', { _id : ObjectId(user_id) }, { $set : { hasProfile : true }})

        return ({ uid : user_id, s3Res : res, mongoRes : mongoRes })

    },
////////////////
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
    },


}



module.exports = methods;