const mongo = require('./mongo')
const census = require('./census')
const citysdk = require('../handlers/citysdk-handler')

const methods = {


    cleanUpZeroValueZone : async () => {
  //      let res = await mongo.deleteRecord('tract_stats', '34', {"social.summary.population": 0})
    //     console.log('DELETE', res)


         let res3 = await mongo.getRecord('tract_stats', '36', {"social.summary.population": 0})
         console.log('STATS RESULTS', res3.length)
         let geoids = []
         res3.forEach((e, i) => {
             geoids.push(e.geoid)
             console.log(i, e.geoid)
         })

        let res2 = await mongo.deleteRecord('tract_stats', '36', {"social.summary.population": 0})
         console.log('STATS RESULTS', res2)
        
    },

    updateDB : async () => {
        let res = await mongo.updateManyDB('tract_stats', '34', {}, { $rename: {"age.FIFTY_FIFTYNINE":"age.FIFTYFIVE_FIFTYNINE"}})
        console.log(res)

    },

    runTractBuilder : async (state, counties) => {
        console.log(state, counties)
        for(let county of counties) {
            await methods.buildTractCollection(state, county)
        }
    },

    // to do remove duplicates
    runFromDB : async (state, county) => {
        let records = await mongo.getCollection(state, county)
        for (let [i, record] of records.entries()) {
            let tract = record.tract
            let all_stats = await getTractAgeStatsCitySDK(state, county, tract) 
            if (all_stats === undefined) {
                methods.runFromDB(state, county)
                return;
            } else {
                let updateRes = await mongo.updateOneToDB('tract_stats', state, {geoid: all_stats.geoid}, { $set: {age: all_stats.age}})
                console.log(i+1, 'of', records.length, all_stats.geoid)
                let deleteRes = await mongo.deleteRecord(state, county, 'tract', [tract])
                let num =Number(county)
                console.log('db', county, 'next', '0'+ (num+2), 'deleted count', deleteRes.deletedCount)
                // up county count by 2 for nj
                if (i == records.length-1 && Number(county) < 41) {
                //    methods.runFromDB(state, '0'+ (num+2))
                }
            }
        }
    },

    buildBlockStats : async (state, county) => {
        let records = await citysdk.getAllTracts(state, county) // get all tracts 
        console.log('ALL_TRACTS', records)
        let promises = []
        for (let [i, record] of records.entries()) {
            let tract = record.tract
            console.log(i+1)
            promises.push(getTractAllStats(state, county, tract))
        }
        let allStats = await Promise.all(promises)
        console.log('All STATS', allStats.length)
        let dbResults = await mongo.writeMany('tract_stats', state, allStats)
        console.log('Mongo Results', dbResults)
    },

    buildTractStats : async (state, county) => {
        let records = await mongo.getCollection(state, county)
        let promises = []
        for (let [i, record] of records.entries()) {
            let tract = record.tract
            console.log(i+1)
            promises.push(getTractAllStats(state, county, tract))
        }
        let allStats = await Promise.all(promises)
        console.log('All STATS', allStats.length)
        let dbResults = await mongo.writeMany('tract_stats', state, allStats)
        console.log('Mongo Results', dbResults)
    },

    buildTractCollection : async (state, county) => {
        let tracts = await getTracts(state, county)
        let tractsCollection = []
        for (let [i, tract] of tracts.entries()) {
            console.log(i, tract)
            let json = { id: i, tract: tract }
            tractsCollection.push(json)
        }
        let dbResults = await mongo.writeToDB(state, county, tractsCollection)
        console.log('db', dbResults)
    },
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const getTractAllStats = async (state, county, tract) => {
    let allData = await citysdk.getTractAllStats(state, county, tract)
    let ageData = await citysdk.getTractAgeData(state, county, tract)
 //   let mappedData = mapToHeaders(allData)
    allData.geoid = state + county + tract
    allData.age = Object.values(ageData)[0]
    return allData;
   // return filter.filterAll(geoid, mappedData);
}

const getTractAgeStatsCitySDK = async (state, county, tract) => {
    return citysdk.getTractAgeData(state, county, tract)
    .catch(err => {
        console.log(err, 'restart buildDB')
    })
}


const getTracts = async (state, county) => {
    let tractData = await census.getAllTracts(state, county)
    let tracts = []
    let mappedData = mapToHeaders(tractData)
    for (let item of mappedData) {
        tracts.push(item.tract)
    }
    return tracts;
}

const mapToHeaders = (data) => {
    let headers = data.shift()
    let jsonList = []
    for (let item of data) {
        let jsonObj = {}
        // append headers to json object
        for (let [i, header] of headers.entries()) {
            jsonObj[header] = item[i]
        }
        jsonList.push(jsonObj)
    }
    return jsonList;
}
module.exports = methods