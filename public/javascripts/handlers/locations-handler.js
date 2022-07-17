const mongo = require('../mongo/mongo')
const { MONGO } = require('../constants')
const Landmark = MONGO.DATABASES.LARNDMARK;
const Locations = MONGO.COLLECTIONS.LANDMARK.LOCATIONS;
const Comments = MONGO.COLLECTIONS.LANDMARK.COMMENTS;

const methods = {

    getLocation(pid) {
        return new Promise(async (resolve, reject) => {
            let results = await mongo.getRecord(Landmark, Locations, {'pid': pid})
            resolve({'res': results })
        })
    },

    getComments(pid) {
        return new Promise(async (resolve, reject) => {
            let results = await mongo.getRecord(Landmark, Comments, {'pid': pid})
            resolve({'res': results })
        })
    },

    createComment(pid, user, body) {
        return new Promise(async (resolve, reject) => {
            let results = await mongo.writeOneToDB(Landmark, Comments, {'pid': pid, 'user': user, 'body': body, date: new Date().toString()})
            resolve({'res': results, 'new comment': {'pid': pid, 'user': user, 'body': body, date: new Date().toString()}})
        })
    },

    createLocation(pid, location) {
        return new Promise(async (resolve, reject) => {
            let results = await mongo.writeOneToDB(Landmark, Locations, {'pid': pid, 'location': location, date: new Date().toString()})
            resolve({'res': results, 'new location': {'pid': pid, 'location': location, date: new Date().toString()}})
        })
    },

    // to-Do write to locations directly 
    createTradezoneCartography(pid, cartography, range) {
        return new Promise(async (resolve, reject) => {
            let results = await mongo.writeOneToDB('locations', 'tradezone_cartography', {'pid': pid,  'range': range, 'cartography': cartography, date: new Date().toString()})
            resolve({'res' :results, 'new tz cartography': {'pid': pid, 'range': range, date: new Date().toString()}})
        })
    },

    // to-Do write to locations directly 
    createTradezoneStats(pid, stats, range) {
        return new Promise(async (resolve, reject) => {
            let results = await mongo.writeOneToDB('locations', 'tradezone_stats', {'pid': pid, 'stats': stats, 'range': range, date: new Date().toString()})
            resolve({'res' :results, 'new tz stats': {'pid': pid, 'range': range, date: new Date().toString()}})
        })
    }
}

module.exports = methods;