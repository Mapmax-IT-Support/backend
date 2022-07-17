const MongoClient = require('mongodb').MongoClient
const url = 'mongodb+srv://RFM7991:%23LincCont98@cluster0-ypmdr.gcp.mongodb.net/test?retryWrites=true&w=majority'
// "mongodb://localhost:27017/"
const fs = require('fs')
var glob = require('glob')

const methods = {

    initTractPost : () => {
        console.log('glob')
        var states = []
        var exclude = ['ny']
        glob("server/map-data/*.json", (er, files) => {
            files.forEach(path => {
                var state = (path.split(/[\\/]/)[2]).slice(0, 2)
                if (!exclude.includes(state))
                    states.push(state)
            })
            console.log('states:', states)
            // post all states
            methods.postData(states, 0)
        })
    },

    postData : (states, ind) => {
        console.log('index', ind)
        var state = states[ind]
        var data = getStateBounds(state)
        var collection = []
        for(var i = 0; i < data.features.length; i++) {
            var obj = data.features[i];
            collection.push(obj)
        } 
        console.log('input length', collection.length)
        writeMany(state, collection, (err, res) => {
            var index = ind + 1
            if (index < states.length) {
              methods.postData(states, index)
            }
        })
    },
    findTract : (state, tract, callback) => {
        MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
            if (err) throw err;
            var dbo = db.db("tract_gson")
            dbo.collection(state).find({'properties.GEOID': tract}).toArray((err, res) => {
                if (err) throw err;
                callback(res)
                db.close()
            })
        })
    }
}

function writeMany(state, data, callback) {
    MongoClient.connect(url, { useNewUrlParser: true}, (err, db) => {
        var dbo = db.db("tract_gson")

        dbo.collection(state).insertMany(data, (err, res) => {
            if (err) throw err;
            console.log("Number of docs inserted: ", res.insertedCount)
            db.close();
            callback(err, res)
        })
    })
}

function getStateBounds(state) {
    var data = require('../map-data/'+ state.toString() +'_tracts.json'); 
    return data
}

function writeGson(data) {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        var dbo = db.db("gsonDb")
        dbo.collection("tract_gson").insertOne(data, (err, res) => {
            if (err) throw err;
            console.log(data.id, data.zip, "inserted")
            db.close();
        })
    })
}

function writeToMongo() {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        var dbo = db.db("mydb")
        var myobj = { name: "Company Inc", address: "Highway 37" };
        dbo.collection("customers").insertOne(myobj, (err, res) => {
            if (err) throw err;
            console.log("1 doc inserted")
            db.close();
        })
    })
}

module.exports = methods