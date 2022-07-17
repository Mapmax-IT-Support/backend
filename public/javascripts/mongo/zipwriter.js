const MongoClient = require('mongodb').MongoClient
const Constants = require('../constants')
const url = Constants.MONGO_URL
const GSON = Constants.MONGO.COLLECTIONS.GSON;
const glob = require('glob')

const methods = {

    testURI : () => {
        writeToMongo()
    }, 

    initStatePost : () => {
        var states = []
        glob("server/map-data/*.json", (er, files) => {
            files.forEach(path => {
                var state = (path.split(/[\\/]/)[2]).slice(0, 2)
                states.push(state)
            })

            // post all states
            methods.postData(states, 0)
        })
    },

    postData : (states, ind) => {
        var state = states[ind]
        var data = getStateBounds(state)
        var collection = []
        for(var i = 0; i < data.features.length; i++) {
            var obj = data.features[i];
            collection.push(obj)
        } 
        writeMany(state, collection, (err, res) => {
            var index = ind + 1
            if (index < states.length) {
              methods.postData(states, index)
            }
        })
    },
    
    findZip : (state, zip) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true  }, (err, db) => {
                if (err) throw err;
                var dbo = db.db()
                dbo.collection(state).find({'properties.ZCTA5CE10': zip}).toArray((err, res) => {
                    if (err) reject(err)
                    resolve(res)
                    db.close()
                })
            })
        }) 
    }
}

module.exports = methods