const mongo = require('../mongo/mongo')
const {ObjectId} = require('mongodb');
const passwordHash = require('password-hash');
const s3 = require('../s3')
const Constants = require('../constants')
const { compressImage, deleteUploads } = require('../utils/fileManager')

const Landmark = Constants.MONGO.DATABASES.LARNDMARK;
const Users = Constants.MONGO.COLLECTIONS.LANDMARK.USERS;

const methods = {

    // getUsers() {
    //     return mongo.getCollection()
    // },

    registerUser(data) {
        return new Promise(async (resolve, reject) => {
            let isValid = true
            let promises = []
            let results = { emailError: '', usernameError: ''}
            promises.push(mongo.getRecord(Landmark, Users, {'email': data.email}))
            promises.push(mongo.getRecord(Landmark, Users, {'username': data.username}))
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
                 results = {...results, res: await mongo.writeOneToDB(Landmark, Users, {...data, recentSearches : []})}
            }
            resolve({'res': results, 'newUser': data})
        })
       
    },

    loginUser(data) {
        let validPassword = false
        return new Promise(async (resolve, reject) => {
            let results = await mongo.getRecord(Landmark, Users, {'email': data.email})

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

            promises.push(mongo.getRecord(Landmark, Users, {_id : ObjectId(data.uid)}))
            promises.push(mongo.getRecord(Landmark, Users, {'email': data.email}))
            promises.push(mongo.getRecord(Landmark, Users, {'username': data.username}))
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

                if (!newEmail && !newUsername && !newFirst && !newLast) {
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
                 results = {...results, res: await mongo.updateOneToDB(Landmark, Users, {_id : ObjectId(data.uid) }, {$set: 
                    {'username': data.username, 'first': data.first, 'last': data.last }})}
                }
                else if (newEmail && ! newUsername) {
                    results = {...results, res: await mongo.updateOneToDB(Landmark, Users, 
                    {_id : ObjectId(data.uid) }, {$set: {'email': data.email, 'first': data.first, 'last': data.last }})}
                } 
                else if (newEmail && newUsername) {
                    results = {...results, res: await mongo.updateOneToDB(Landmark, Users, {_id : ObjectId(data.uid) }, 
                    {$set: {'username': data.username, 'email': data.email,'first': data.first, 'last': data.last }})}
                } 
                else {
                    results = {...results, res: await mongo.updateOneToDB(Landmark, Users, {_id : ObjectId(data.uid) }, {$set: 
                       { 'first': data.first, 'last': data.last }})}
                }
            }
            resolve({'res': results, 'newUser': data})
        })
       
    },

    pushRecentSearch(data) { 

        return new Promise(async (resolve, reject) => {
            let res = await mongo.updateOneToDB(Landmark, Users, {_id : ObjectId(data.uid) }, {$set: {'recentSearches': data.locations }})
            resolve({'res': res, 'newRecentSearch': data})
        })
    },

    getUserInfo(data) { 

        return new Promise(async (resolve, reject) => {
            let res = await mongo.getRecord(Landmark, Users, {_id : ObjectId(data.uid)})
            resolve({'res': res, 'fetched user info for ': data})
        })
    },

    // profile upload
    async handleProfileUpload(user_id, file)  {
       try {
            if (user_id == undefined) return { error : "no user_id provided"};

            let mimetype;
            switch (file.mimetype.substring(file.mimetype.indexOf('/')+1, file.mimetype.length)) {
                // case "png": mimetype = ".png"; break;
                default: mimetype = ".jpg"; break;
            }

            const compressedStream = await compressImage(file.path, 180, 180)

            const res = await s3.uploadFileStream(compressedStream, "landmarkbucket2", "users/"+user_id + "/profile"+ mimetype)
                    .catch(err => console.log("s3_error", err))

            const mongoRes = await mongo.updateOneToDB(Landmark, Users, { _id : ObjectId(user_id) }, { $set : { hasProfile : true }})

            deleteUploads()
            return ({ success: true, uid : user_id, s3Res : res, mongoRes : mongoRes })

        } catch (err) {
            return { err: err.toString()}
        }
    },
}

module.exports = methods;
