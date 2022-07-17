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

    createComment(pid, user, body) {
        return new Promise(async (resolve, reject) => {
            let results = await mongo.writeOneToDB('locations', 'comments', {'pid': pid, 'user': user, 'body': body, date: new Date().toString()})
            resolve({'res': results, 'new comment': {'pid': pid, 'user': user, 'body': body, date: new Date().toString()}})
        })
    },

    createLocation(pid, location) {
        return new Promise(async (resolve, reject) => {
            let results = await mongo.writeOneToDB('locations', 'locations', {'pid': pid, 'location': location, date: new Date().toString()})
            resolve({'res': results, 'new location': {'pid': pid, 'location': location, date: new Date().toString()}})
        })
    },

    createTradezoneCartography(pid, cartography) {
        return new Promise(async (resolve, reject) => {
            let results = await mongo.writeOneToDB('locations', 'tradezone_cartography', {'pid': pid, 'cartography': cartography, date: new Date().toString()})
            resolve({'res' :results, 'new tz cartography': {'pid': pid, date: new Date().toString()}})
        })
    },

    createTradezoneStats(pid, stats, range) {
        return new Promise(async (resolve, reject) => {
            let results = await mongo.writeOneToDB('locations', 'tradezone_stats', {'pid': pid, 'stats': stats, 'range': range, date: new Date().toString()})
            resolve({'res' :results, 'new tz stats': {'pid': pid, 'range': range, date: new Date().toString()}})
        })
    }
}

module.exports = methods;