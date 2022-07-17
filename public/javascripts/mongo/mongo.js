const MongoClient = require('mongodb').MongoClient
const Constants = require('../constants')
const url = Constants.MONGO_URL

const methods = {

    testDB: () => {
        return new Promise((res, rej) => {
            MongoClient.connect(url, { useNewUrlParser : true, useUnifiedTopology: true }, (err, db) => {
                if (err) {
                    console.log("Mongo Connection Error", err)
                    rej(err)
                } else {
                    console.log("Connected to Mongo Successfully")
                    return ({ success: true })
                }
            })
        })
    },

    writeToDB : (database, collection, data) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
                let dbo = db.db(database)
                dbo.collection(collection).insertMany(data, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res)
                    }
                    db.close();
                })
            })
        })
    },

    push : (database, collection, query, data) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
                let dbo = db.db(database)
                dbo.collection(collection).updateOne(query, { $push: data}, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res)
                    }
                    db.close();
                })
            })
        })
    },

    writeMany : (database, tract, data) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
                let dbo = db.db(database)
                dbo.collection(tract).insertMany(data, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res)
                    }
                    db.close();
                })
            })
        })
    },

    updateOneToDB : (database, collection, query, data) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
                let dbo = db.db(database)
                dbo.collection(collection).updateOne(query, data, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res)
                    }
                    db.close();
                })
            })
        })
    },

    updateManyDB : (database, collection, query, data) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
                let dbo = db.db(database)
                dbo.collection(collection).updateMany(query, data, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res)
                    }
                    db.close();
                })
            })
        })
    },

    writeOneToDB : (database, collection, data) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
                let dbo = db.db(database)
                dbo.collection(collection).insertOne(data, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res)
                    }
                    db.close();
                })
            })
        })
    },

    getRecord : (database, collection, query) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
                if (err) throw err;
                var dbo = db.db(database)
                dbo.collection(collection).find(query).toArray((err, res) => {
                    if (err) {
                        reject(err)
                        throw err;
                    } else {
                        resolve(res)
                    }
                    db.close()
                })
            })
        })   
    },

    getSortedRecord : (database, collection, query, sortQuery, limit) => {


        return new Promise((resolve, reject) => {
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
                if (err) {
                    throw err;
                }
                var dbo = db.db(database)
                dbo.collection(collection).find(query).sort(sortQuery).limit(limit).toArray((err, res) => {
                    if (err) {
                        reject(err)
                        throw err;
                    } else {
                        resolve(res)
                    }
                    db.close()
                })
            })
        })   
    },

    getSortedInterval : (database, collection, query, sortQuery, start, limit) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
                if (err) throw err;
                var dbo = db.db(database)
                dbo.collection(collection).find(query).sort(sortQuery).skip(start).limit(limit).toArray((err, res) => {
                    if (err) {
                        reject(err)
                        throw err;
                    } else {
                        resolve(res)
                    }
                    db.close()
                })
            })
        })   
    },
    
    getCollection :(database, collection) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
                if (err) throw err;
                var dbo = db.db(database)
                dbo.collection(collection).find({}).toArray((err, res) => {
                    if (err) {
                        reject(err)
                        throw err;
                    } else {
                        resolve(res)
                    }
                    db.close()
                })
            })
        })   
    },

    deleteRecord : (database, collection, query) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
                let dbo = db.db(database)
                dbo.collection(collection).deleteMany(query, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res)
                    }
                    db.close();
                })
            })
        })
    },


    renameCollection : (database, collection, name) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true}, (err, db) => {
                let dbo = db.db(database)
                dbo.collection(collection).rename(name, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res)
                    }
                    db.close();
                })
            })
        })
    }

}

module.exports = methods;