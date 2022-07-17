const mongo = require('../mongo/mongo')

let methods = {

    getLocation(pid) {
        return new Promise(async (resolve, reject) => {
            let results = await mongo.getRecord('locations', 'locations', {'pid': pid})
            resolve({'res': results })
        })
    },

    getComments(pid) {
        return new Promise(async (resolve, reject) => {
            let results = await mongo.getRecord('locations', 'comments', {'pid': pid})
            resolve({'res': results })
        })
    },

    createComment(pid, uid, body) {
        return new Promise(async (resolve, reject) => {
            let results = await mongo.writeOneToDB('locations', 'comments', {'pid': pid, 'uid': uid, 'body': body})
            resolve({'res': results, 'new comment': {'pid': pid, 'uid': uid, 'body': body}})
        })
    },

    createLocation(pid, location) {
        return new Promise(async (resolve, reject) => {
            let results = await mongo.writeOneToDB('locations', 'locations', {'pid': pid, 'location': location})
            resolve({'res': results, 'new location': {'pid': pid, 'location': location}})
        })
    }
}

module.exports = methods;