const mongo = require('../mongo/mongo')
const Constants = require('../constants')
const citySdk = require('./citysdk-handler')

const methods = {


    getTradeZoneStats : async (center, bounds) => {
        console.log("COUNTY_RES_DEMO", center)
        let county = await citySdk.getCounty(center.lat, center.lng)
       

        return new Promise(async (resolve, reject) => {
            let tradeZone_stats = (county[0].state == '36' && county[0].county == '061') ? await getZoneStatsBlockGroups(bounds) : await getZoneStatsZip(bounds)
            resolve(tradeZone_stats)
        }) 
    },

    getLoadedTradeZoneStats : async (pid, range) => {
        let res = await mongo.getRecord('locations', 'tradezone_stats', {'pid': pid, 'range': range})
        return res
    },

    // fetch live stats for block groups in bounds
    getZoneStatsBlockGroups : async (bounds) => {
    // for all points get stats then aggregate data
    let statPromises = []
    
    for (let i=0; i < bounds.length; i++) {
        statPromises.push(citySdk.getBlockAllStats(bounds[i][0].state, bounds[i][0].county, bounds[i][0].tract, bounds[i][0]['block-group']))
        statPromises.push(citySdk.getBlockAgeData(bounds[i][0].state, bounds[i][0].county, bounds[i][0].tract, bounds[i][0]['block-group']))
    }

    let stats = await Promise.all(statPromises)
    // merge data
    let mergedStats = []
    for (let i=0; i < stats.length-1; i+=2) {
        mergedStats.push(
            {...stats[i], age : Object.values(stats[i+1])[0]}
        )
    }
    return aggregateZoneStats(mergedStats)
},

// fetch live stats for block groups in bounds
getZoneStatsTracts : async (bounds) => {
    // for all points get stats then aggregate data
    let statPromises = []
    
    for (let i=0; i < bounds.length; i++) {
        statPromises.push(citySdk.getTractAllStats(bounds[i][0].state, bounds[i][0].county, bounds[i][0].tract, bounds[i][0]['block-group']))
        statPromises.push(citySdk.getTractAgeData(bounds[i][0].state, bounds[i][0].county, bounds[i][0].tract, bounds[i][0]['block-group']))
    }

    let stats = await Promise.all(statPromises)
    // merge data
    let mergedStats = []
    for (let i=0; i < stats.length-1; i+=2) {
        mergedStats.push(
            {...stats[i], age : Object.values(stats[i+1])[0]}
        )
    }
    return aggregateZoneStats(mergedStats)
},

    // fetch live stats for block groups in bounds
    getZoneStatsZip : async (bounds) => {
        // for all points get stats then aggregate data
        let statPromises = []
        
        for (let i=0; i < bounds.length; i++) {
            statPromises.push(citySdk.getZipAllStats(bounds[i][0]['zip-code-tabulation-area']))
            statPromises.push(citySdk.getZipAgeData(bounds[i][0]['zip-code-tabulation-area']))
        }

        let stats = await Promise.all(statPromises)
        // merge data
        let mergedStats = []
        for (let i=0; i < stats.length-1; i+=2) {
            mergedStats.push(
                {...stats[i], age : Object.values(stats[i+1])[0]}
            )
        }
        return aggregateZoneStats(mergedStats)
},

    getTractStats : async (tracts) => {
        let collections = new Map()
        tracts.forEach(tract => {
            if (tract != undefined) {
                let tract_data = tract[0]
                let geoid = tract_data.state + tract_data.county + tract_data.tract
                // set collection if not yet defined
                if (!collections.has(tract_data.state)) {
                    collections.set(tract_data.state, [geoid])
                } else {
                    collections.get(tract_data.state).push(geoid)
                }
    
            }
        });
        let stats = []
        for (let [collection, geoids] of collections) {
               let res = await mongo.getRecord(Constants.DB.STATS.TRACT, collection, {'geoid' : {$in : geoids}})
                .catch(err => console.error('Mongo Error', err))

            if (res.length > 0) {
                res.forEach(e => {
                    delete e._id
                    delete e.geoid
                    stats.push(e)
                })
            }
        }
        return stats;
    },

    getBlockGroupStats : async (blockGroups) => {
        let collections = new Map()
        blockGroups.forEach(blockGroups => {
            if (blockGroups != undefined) {
                let block_data = blockGroups[0]
                let geoid = block_data.state + block_data.county + block_data.tract + block_data['block-group']
                
                // set collection if not yet defined
                if (!collections.has(block_data.state)) {
                    collections.set(block_data.state, [geoid])
                } else {
                    collections.get(block_data.state).push(geoid)
                }
    
            }
        });
        let stats = []
        /*
        for (let [collection, geoids] of collections) {
               let res = await mongo.getRecord(Constants.DB.STATS.TRACT, collection, {'geoid' : {$in : geoids}})
                .catch(err => console.error('Mongo Error', err))

            if (res.length > 0) {
                res.forEach(e => {
                    delete e._id
                    delete e.geoid
                    stats.push(e)
                })
            }
        }
        */
        return stats;
    },

    getZipStats : async (lat, lng, range) => {
        return await citySdk.getAllData(lat, lng, range)
            .catch(err => console.error('City SDK Error', err))
    },

    getZipAgeStats : async (lat, lng, range) => {
        return await citySdk.getAge(lat, lng, range)
            .catch(err => console.error('City SDK Error', err))
    }
}
 
module.exports = methods;