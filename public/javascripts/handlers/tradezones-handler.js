const citySdk = require('../handlers/citysdk-handler');
const mysql = require('../mysql');
const mongo = require('../mongo/mongo');
const { buildMap, neighboringRegions } = require('../utils/zipcodes');

const zipMap = buildMap();
const neighbors = neighboringRegions();

const methods = {

    getTradezone: async function(state, zip, lat, lng, radius, isnyc, res) {
        try {
        radius = (radius) ? radius : 8.04672; // default 5 miles
        if (isnyc) {
            const bounds = await getNycDataSet(lat, lng);
            res(bounds);
        } else {
            mysql.getNearbyZips(zip, lat, lng, radius,  async (results) => {
         
                    if (results.length > 0) {
                        zipData = await getZipDataSet(zip, state, results)
                        res(zipData);
                    } else {
                        res([]);
                    }
            });
        }  
        } catch (error) {
            res({ error: error.toString()});
        }
    },

    getZipData: async function(state, zip) {
        try {
            return await getZip(state, zip);
        } catch (error) {
            return ({ error: error.toString() })
        }
    }
};

const getNycDataSet = async (lat, lng) => {
    const intCenter = {
        'lat' : Number(lat),
        'lng' : Number(lng)
    }

    let points = [intCenter]
    let outerRing = [];
    let divisor = 4;
    let increment = 0.35 / divisor // 0.2174799
    let counter = 1;
    
    for (let i=1; i <= divisor; i++) {
        points = points.concat(getPoints(intCenter, i*increment, counter*8))
        counter+=1
    }

    // last and second to last ring
    const outerIndex = points.length - (divisor*8 + (divisor-1)*8)
    outerRing = getPoints(intCenter, 0.800, 0) // 0.5 miles 
    // testing with low precision / virtually no filtering
    // can increase performance greatly

    const filteredBlocks = await filterBlockGroups(points, outerRing, outerIndex)
    .catch(err => console.error(err))
    
    
    return await getBlockStats(filteredBlocks, 'nyc');
};

const getBlockStats = async (filterBlockGroups, region) => {
    const tracts = filterBlockGroups.map((blockArr) => blockArr[0].tract);
    const blockGroups = filterBlockGroups.map((blockArr) => blockArr[0]['block-group']);
    const  rawData = await mongo.getRecord('BlockGson', region, { 'properties.TRACTCE': { $in: tracts }, 'properties.BLKGRPCE': { $in: blockGroups }});
    const stats = rawData.map((e) => e.stats);
    if (stats.length <= 0) {
        return { error: 'Empty stat set'}
    }
    return { stats: aggregateZoneStats(stats), collection: rawData };
};

// need to aggregate stats
const getZipDataSet = async (initZip, state, results) => {
    
    const filteredZips = borderCheckZips(initZip, results);
    const zips = filteredZips.map(e => e.zipcode)
    const rawData =  await mongo.getRecord('ZipGson', state, { 'properties.ZCTA5CE10': { $in: zips }});
    const stats = rawData.map((e) => e.stats);
    return { stats: aggregateZoneStats(stats), collection: rawData };
};

const getZip = async (state, zip) => {
    console.log("GET_ZIP", zip)
    return await mongo.getRecord('ZipGson', state, { 'properties.ZCTA5CE10' : zip });
};

// border patrol - [manhattan, bronx], [Brooklyn, Queens], [Staten]
const borderCheckZips = (initZip, rawZips) => {
    const county = zipMap.get(initZip);
    const accepted = neighbors.get(county);

    if (!(county && accepted)) {
        return rawZips;
    };

    const results = [];
    for (let rowRes of rawZips) {
        const { zipcode } = rowRes;
        const region = zipMap.get(zipcode);
        if (accepted.indexOf(region) > -1) {
            results.push(rowRes);
        }; 
    };

    return results;
};

// block groups
const filterBlockGroups = async (points, outerPoints, outerIndex) => {
    let blockPromises = []
    let filteredBlockGroups = []
    let index = 0;
    let counterMap = new Map()
    let hashMap = new Map()
    let geoUnitKey = 'NAME'

    // inner blocks
    for (let point of points) {
        blockPromises.push(citySdk.getBlockGroup(point.lat, point.lng).catch(err => console.error('CITYSDK GEOCODE ERROR', err)))
    };  

    // outer blocks
    for (let point of outerPoints) {
        blockPromises.push(citySdk.getBlockGroup(point.lat, point.lng).catch(err => console.error('CITYSDK GEOCODE ERROR', err)))
    };

    // await promises 
    let fulfilledBlockGroups = await Promise.all(blockPromises)
    let outerBlocks = fulfilledBlockGroups.splice(points.length, outerPoints.length)
    let nameMap = new Map()
    let results = []
    
    // filter outerblocks
    for (let i=0; i < outerBlocks.length; i++) {
        if (outerBlocks[i].error) continue;
        if (!nameMap.has(outerBlocks[i][0][geoUnitKey])) {
            nameMap.set(outerBlocks[i][0][geoUnitKey], true)
            results.push(outerBlocks[i])
        }
    }
    outerBlocks = results
    let coordinates = [] // for cross referencing counties
    let coordIndex = -1;
    for (let blockGroup of fulfilledBlockGroups) {
        coordIndex += 1
            if (blockGroup == undefined) { index +=1; continue; }
            if (blockGroup[0] == undefined) { index +=1; continue; }

            // only add new results 
            if (!hashMap.has(blockGroup[0][geoUnitKey])) {

                // if starts in inner ring, outside of outerIndex and hits outer ring remove result
                if (index >= outerIndex) {
                    let outOfBounds = false
                    for (let i =0; i < outerBlocks.length; i++) {
                        if (outerBlocks[i] == undefined) continue;
                        if (outerBlocks[i][0][geoUnitKey] == blockGroup[0][geoUnitKey]) {
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
                hashMap.set(blockGroup[0][geoUnitKey], true)
                if (index < outerIndex) {
                    counterMap.set(blockGroup[0][geoUnitKey],  1)
                }
            } else {
                if (index < outerIndex) {
                    // add to counter map for geoid
                    counterMap.set(blockGroup[0][geoUnitKey], counterMap.get(blockGroup[0][geoUnitKey]) +1)
                }
            }
        index += 1;
    }

    // filter out of bounds with only one 
    let removals = []
    for (let [NAME, count] of counterMap) {
        if (count > 6) continue;
        for (let i=0; i < outerBlocks.length; i++) {
           if (outerBlocks[i] == undefined) continue;
            if (NAME == outerBlocks[i][0][geoUnitKey]) {
                removals.push(outerBlocks[i][0][geoUnitKey])
            }
        }
    };

    // remove elements
    let finalResults = []
    for (let i=0; i < filteredBlockGroups.length; i++) {
        // out of bounds
        if (removals.includes(filteredBlockGroups[i][0][geoUnitKey])) {
            continue;
        }
        // push to results
        finalResults.push(filteredBlockGroups[i])
    }
    return finalResults;
};


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
};

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
            })
    }
    aggregateSet.social.summary.median_age = (aggregateSet.social.summary.median_age / (data.length - ageNegatives)).toFixed(1)
    aggregateSet.income.median = (aggregateSet.income.median / (data.length-incomeNegatives)).toFixed(1)
    aggregateSet.age.median_age = aggregateSet.social.summary.median_age
    return aggregateSet
};


module.exports = methods