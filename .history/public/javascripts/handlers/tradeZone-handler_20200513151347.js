const citySdk = require('../handlers/citysdk-handler')
const demographics = require('./demographics-handler')
const mongo = require('../mongo/mongo')

const methods = {

    
    getTradeZoneBounds : async (isCity, center, geoUnit) => {
            let isCityFlag = isCity == 'true'
            if (isCityFlag) {
                radius = 0.50 // <0.35 mi
                innerRadius = 0.1207008 // 0.075 mi
            } 
            let intCenter = {
                'lat' : Number(center.lat),
                'lng' : Number(center.lng)
            }

            // get county
            let county = await citySdk.getCounty(center.lat, center.lng)
            console.log("COUNTY_RES", county)
            let points = [intCenter]
            let  outerRing = [];
            let counter = 1;

            // if state is nj or Nausau / Suffolk county NY
            if (county[0].state == '34' || (county[0].state == '36' && (county[0].county == '103' || county[0].county == '059'))) {
                
                let divisor = 10;
                let increment = 4.828 / divisor //4.828 = exact 3 miles 0.804672
                
                for (let i=1; i <= divisor; i++) {
                    points = points.concat(getPoints(center, i*increment, counter*8))
                    counter+=1
                }

                // last and second to last ring
                let outerIndex = points.length - (divisor*8 + (divisor-1)*8 + (divisor-2)*8)

                console.log('POINTXX', points.length, outerIndex)
                outerRing = getPoints(center, 8, 80)

                let filteredTracts = await filterBlockGroups(points, outerRing, outerIndex, geoUnit, county[0].county)
                .catch(err => console.error(err))
                return filteredTracts;
            }

            // Manhattan 
            if (isCityFlag) {
                let divisor = 4;
                let increment = 0.35 / divisor // 0.2174799
                
                for (let i=1; i <= divisor; i++) {
                    points = points.concat(getPoints(center, i*increment, counter*8))
                    counter+=1
                }

                // last and second to last ring
                let outerIndex = points.length - (divisor*8 + (divisor-1)*8)
                outerRing = getPoints(center, 0.800, 50) // 0.5 miles

                let filteredTracts = await filterBlockGroups(points, outerRing, outerIndex, geoUnit, county[0].county)
                .catch(err => console.error(err))
                return filteredTracts;
            }

            // Staten Island, BK, Bronx, Queens
            let divisor = 5;
            let increment = 0.8/ divisor //4.828 = exact 3 miles 0.804672
           
            for (let i=1; i <= divisor; i++) {
                points = points.concat(getPoints(center, i*increment, counter*8))
                counter+=1
            }

            // last and second to last ring
            let outerIndex = points.length - (divisor*8 + (divisor-1)*8 + (divisor-2)*8)

            outerRing = getPoints(center, 8, 80)
            let filteredTracts = await filterBlockGroups(points, outerRing, outerIndex, geoUnit, county[0].county)
            .catch(err => console.error(err))
            return filteredTracts;
        
    },

    getTradeZoneStats : async (bounds) => {
        return new Promise(async (resolve, reject) => {
            let tradeZone_stats = await getZoneStats(bounds)
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
}
}

// block groups
const filterBlockGroups = async (points, outerPoints, outerIndex, geoUnit, county) => {
    count = 1
    let blockPromises = []
    let filteredBlockGroups = []
    let index = 0;
    let counterMap = new Map()
    let hashMap = new Map()

    console.log("GEO_UNIT", geoUnit)
    // inner blocks
    for (let point of points) {
        switch (geoUnit) {
            case 'zip': blockPromises.push(citySdk.getZip(point.lat, point.lng).catch(err => console.error('CITYSDK GEOCODE ERROR', err))); break;
            case 'tract': blockPromises.push(citySdk.getTract(point.lat, point.lng).catch(err => console.error('CITYSDK GEOCODE ERROR', err))); break;
            case 'block' : blockPromises.push(citySdk.getBlockGroup(point.lat, point.lng).catch(err => console.error('CITYSDK GEOCODE ERROR', err)))
            default: break;
        }
    }  

    // outer blocks
    for (let point of outerPoints) {
        switch (geoUnit) {
            case 'zip': blockPromises.push(citySdk.getZip(point.lat, point.lng).catch(err => console.error('CITYSDK GEOCODE ERROR', err))); break;
            case 'tract': blockPromises.push(citySdk.getTract(point.lat, point.lng).catch(err => console.error('CITYSDK GEOCODE ERROR', err))); break;
            case 'block' : blockPromises.push(citySdk.getBlockGroup(point.lat, point.lng).catch(err => console.error('CITYSDK GEOCODE ERROR', err)))
            default: break;
        }
    }

    // await promises 
    let fulfilledBlockGroups = await Promise.all(blockPromises)
    let outerBlocks = fulfilledBlockGroups.splice(points.length, outerPoints.length)


    let nameMap = new Map()
    let results = []

    // filter outerblocks
    for (let i=0; i < outerBlocks.length; i++) {
        if (outerBlocks[i] == undefined) continue;
        if (!nameMap.has(outerBlocks[i][0].NAME)) {
            nameMap.set(outerBlocks[i][0].NAME, true)
            results.push(outerBlocks[i])
        }
    }
    outerBlocks = results
    let coordinates = [] // for cross referencing counties
    let coordIndex = -1;
    for (let blockGroup of fulfilledBlockGroups) {
        coordIndex += 1
        if (blockGroup != undefined) {
            if (blockGroup[0] == undefined) continue;

            // only add new results 
            if (!hashMap.has(blockGroup[0].NAME)) {

                // if starts in outer ring and hits outer ring remove result
                if (index >= outerIndex) {
                    let outOfBounds = false
                    for (let i =0; i < outerBlocks.length; i++) {
                        if (outerBlocks[i] == undefined) continue;
                        if (outerBlocks[i][0].NAME == blockGroup[0].NAME) {
                            outOfBounds = true
                            break;
                        }
                    }

                    if (outOfBounds) {
                        index += 1;
                        continue;
                    }
                }

                // push to results
                filteredBlockGroups.push(blockGroup)
                coordinates.push(points[coordIndex])
                hashMap.set(blockGroup[0].NAME, true)
                if (index < outerIndex) {
                    counterMap.set(blockGroup[0].NAME,  1)
                }

            } else {
                if (index < outerIndex) {
                    // add to counter map for geoid
                    counterMap.set(blockGroup[0].NAME, counterMap.get(blockGroup[0].NAME) +1)
                }
            }
        }
        index += 1;
    }

    console.log('COUNTER_MAP', counterMap)
    // filter out of bounds with only one 
    let removals = []
    for (let [NAME, count] of counterMap) {
        if (count > 6) continue;
        for (let i=0; i < outerBlocks.length; i++) {
            if (outerBlocks[i] == undefined) continue;
            if (NAME == outerBlocks[i][0].NAME) {
                removals.push(outerBlocks[i][0].NAME)
            }
        }
    }

    // remove elements
    console.log("coordinatesXXX", coordinates.length, "filtered", filteredBlockGroups.length)
    let countyPromises = []
    for (let i=0; i < coordinates.length; i++) {
        countyPromises.push(citySdk.getCounty(coordinates[i].lat, coordinates[i].lng))
    }
    let counties = await Promise.all(countyPromises)

    for (let i=0; i < filteredBlockGroups.length; i++) {
        console.log("FILTER_INDEX", i, filteredBlockGroups.length)
     //   console.log("IMPORTANT_RN", county, counties[i][0].county, filteredBlockGroups[i]) //county[0].county

            // county filter
            if (county == 061) {
                if (counties[i][0].county != county) {
                    console.log('removed', filteredBlockGroups.splice(i, 1))
                    console.log('from', filteredBlockGroups)
                    i--;
                    continue;
                }
            }
            console.log("COUNTY", county, filteredBlockGroups[i])

        if (removals.includes(filteredBlockGroups[i][0].NAME)) {
            console.log('removed', filteredBlockGroups.splice(i, 1))
            console.log('from', filteredBlockGroups)
            i--;
        }
    }

    return filteredBlockGroups
}


const getZoneStats = async (tracts) => {
    // for all points get stats then aggregate data
    let statsSet = await demographics.getTractStats(tracts)
 //   console.log('STATS', statsSet)
    return aggregateZoneStats(statsSet)
}


// combine all and age data
const getBlockAllStats = async (state, county, tract, block) => {
    return new Promise(async (resolve, reject) => {
        let allData =  citySdk.getBlockAllStats(state, county, tract, block).catch(e => reject(e))
        let ageData =  await citySdk.getBlockAgeData(state, county, tract, block).catch(e => reject(e))

        allData.geoid = state + county + tract + block
        allData.age = Object.values(ageData)[0]
        resolve(allData);
    })
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

const getPoints = (center, distance, precision) => {
    let φ1 = toRadians(center.lat)
    let λ1 = toRadians(center.lng) 
    let d = distance
    let R = 6371 // radius of earth in KM
    let points = []
    for (let i = 0; i < precision; i++) {
        let brng =  toRadians((i * (360/precision)))
        let φ2 = Math.asin(Math.sin(φ1)*Math.cos(d/R) +
            Math.cos(φ1)*Math.sin(d/R)*Math.cos(brng));
        let λ2 = λ1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(φ1),
            Math.cos(d/R)-Math.sin(φ1)*Math.sin(φ2));
        let coords = {}
        coords.lat = toDegrees(φ2)
        coords.lng = toDegrees(λ2)
        points.push(coords)
    }
    return points
}

const toRadians = (num) =>  num * (Math.PI/180)
const toDegrees = (num) =>  num * (180/Math.PI)

module.exports = methods