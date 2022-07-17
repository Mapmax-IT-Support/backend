const mongo = require('../mongo/mongo')

let methods = {

    getLocation(pid) {
        return new Promise(async (resolve, reject) => {
            let results = await mongo.getRecord('locations', 'locations', {'email': data.email, 'password': data.password})
            resolve({'res': results })
        })
       
    },

    loginUser(data) {
        console.log({'email': data.email, 'password': data.password})
        return new Promise(async (resolve, reject) => {
            let results = await mongo.getRecord('users', 'users', {'email': data.email, 'password': data.password})
     //       console.log("Search Res", results)
            resolve({'res': results})
        })
    }
}

module.exports = methods;