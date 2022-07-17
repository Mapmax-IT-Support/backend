const mongo = require('../mongo/mongo')
const Constants = require('../constants')
const citySdk = require('./citysdk-handler')
const tradezone_handler = require('./tradeZone-handler')

const methods = {


    getTradeZoneStats : async (center, bounds) => {
        
        let county = await citySdk.getCounty(center.lat, center.lng)
        console.log("COUNTY_RES_DEMO", county[0].state == '36' && county[0].county == '061', county)

        return new Promise(async (resolve, reject) => {
            let tradeZone_stats = (county[0].state == '36' && county[0].county == '061') ? await methods.getZoneStatsBlockGroups(bounds) : await methods.getZoneStatsZip(bounds)
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


const checkForNestedData = (aggregateSet, keyPair, divisor) => {
    if (Object.entries(aggregateSet[keyPair.key]).length > 1) {
        let keyPairs = Object.entries(keyPair.value).map(([key, value]) => ({key,value}))
        keyPairs.forEach(nestedKeyPair => {
            if (aggregateSet[keyPair.key][nestedKeyPair.key] !== null && nestedKeyPair.value !== null
                && aggregateSet[keyPair.key][nestedKeyPair.key] !== undefined && nestedKeyPair.value !== undefined)
                checkForNestedData(aggregateSet[keyPair.key], nestedKeyPair, divisor)
            })
    } else {
            if (keyPair.value >= 0)
                aggregateSet[keyPair.key] += keyPair.value
    }
}

const aggregateZoneStats = (data) => {
    let aggregateSet = data[0]
    let incomeNegatives = 0 // to handle citysdk erroroneous results in DB
    let ageNegatives = 0
    if (aggregateSet.social.summary.city !== null)
        delete(aggregateSet.social.summary.city)
    for (let i=1; i < data.length; i++) {
        delete(data[i].city)
        let keyPairs = Object.entries(data[i]).map(([key, value]) => ({key,value}))
        keyPairs.forEach(keyPair => {
            if (aggregateSet[keyPair.key] !== null && keyPair.value !== null 
                && aggregateSet[keyPair.key] !== undefined && keyPair.value !== undefined) {
                    if (keyPair.key == 'income') if (keyPair.value.median < 0) 
                        incomeNegatives += 1
                    else if (keyPair.key == 'social' && keyPair.value.summary.median_age < 0) {
                        ageNegatives += 1
                    }
                    checkForNestedData(aggregateSet, keyPair, data.length)
                }
             //   console.log('incomeNEG', incomeNegatives, 'ageNeg', ageNegatives)
            })
    }
  //  console.log('AGGY1', aggregateSet)
    aggregateSet.social.summary.median_age = (aggregateSet.social.summary.median_age / (data.length - ageNegatives)).toFixed(1)
    aggregateSet.income.median = (aggregateSet.income.median / (data.length-incomeNegatives)).toFixed(1)
    aggregateSet.age.median_age = aggregateSet.social.summary.median_age
//    console.log('AGGY2', aggregateSet)
    return aggregateSet
}
 
module.exports = methods;