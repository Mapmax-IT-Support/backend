const mongo = require('../mongo/mongo')
const {ObjectId} = require('mongodb');
const passwordHash = require('password-hash');

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
    async handleProfileUpload(user_id, file) => {

    }


}



module.exports = methods;