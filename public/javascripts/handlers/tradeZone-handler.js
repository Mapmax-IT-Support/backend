const citySdk = require('../handlers/citysdk-handler')

const methods = {
    
    getTradeZoneBounds : async (isCity, center) => {
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
        let points = [intCenter]
        let outerRing = [];
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
            let outerIndex = points.length / 3.33 
            outerRing = getPoints(center, 8, 80)

            let filteredTracts = await filterBlockGroups(points, outerRing, outerIndex, 'zip', county[0].county)
            .catch(err => console.error(err))
            return filteredTracts;
        }

        // Manhattan 
        if (county[0].state == '36' && county[0].county == '061') {
            let divisor = 4;
            let increment = 0.35 / divisor // 0.2174799
            
            for (let i=1; i <= divisor; i++) {
                points = points.concat(getPoints(center, i*increment, counter*8))
                counter+=1
            }

            // last and second to last ring
            let outerIndex = points.length - (divisor*8 + (divisor-1)*8)
            outerRing = getPoints(center, 0.800, 50) // 0.5 miles

            let filteredTracts = await filterBlockGroups(points, outerRing, outerIndex, 'block', county[0].county)
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
        let outerIndex = points.length - (8*divisor) -24
        outerRing = getPoints(center, 4.828, 80)
        let filteredTracts = await filterBlockGroups(points, outerRing, outerIndex, 'zip', county[0].county)
        .catch(err => console.error(err))
        return filteredTracts;
    },
}

// block groups
const filterBlockGroups = async (points, outerPoints, outerIndex, geoUnit, county) => {
    count = 1
    let blockPromises = []
    let filteredBlockGroups = []
    let index = 0;
    let counterMap = new Map()
    let hashMap = new Map()
    let geoUnitKey = (geoUnit === 'zip') ? 'zip-code-tabulation-area' : 'NAME'

    // inner blocks
    for (let point of points) {
        switch (geoUnit) {
            case 'zip': blockPromises.push(citySdk.getZipHierarchy(point.lat, point.lng).catch(err => console.error('CITYSDK GEOCODE ERROR', err))); break;
            case 'tract': blockPromises.push(citySdk.getTract(point.lat, point.lng).catch(err => console.error('CITYSDK GEOCODE ERROR', err))); break;
            case 'block' : blockPromises.push(citySdk.getBlockGroup(point.lat, point.lng).catch(err => console.error('CITYSDK GEOCODE ERROR', err)))
            default: break;
        }
    }  

    // outer blocks
    for (let point of outerPoints) {
        switch (geoUnit) {
            case 'zip': blockPromises.push(citySdk.getZipHierarchy(point.lat, point.lng).catch(err => console.error('CITYSDK GEOCODE ERROR', err))); break;
            case 'tract': blockPromises.push(citySdk.getTract(point.lat, point.lng).catch(err => console.error('CITYSDK GEOCODE ERROR', err))); break;
            case 'block' : blockPromises.push(citySdk.getBlockGroup(point.lat, point.lng).catch(err => console.error('CITYSDK GEOCODE ERROR', err)))
            default: break;
        }
    }

    console.log("BLOCK_PROMISES", blockPromises.length)

    // await promises 
    let fulfilledBlockGroups = await Promise.all(blockPromises)
    let outerBlocks = fulfilledBlockGroups.splice(points.length, outerPoints.length)
    let nameMap = new Map()
    let results = []

    console.log("outerBlocks", outerBlocks)
    
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
    }

    // remove elements
    let countyPromises = []
    for (let i=0; i < coordinates.length; i++) {
        countyPromises.push(citySdk.getCounty(coordinates[i].lat, coordinates[i].lng))
    }

    let counties = await Promise.all(countyPromises)
    let finalResults = []
    for (let i=0; i < filteredBlockGroups.length; i++) {
        // county filter
            if (county == '061' || county == '085') { // manhattan, staten island
                if (counties[i][0].county != county) {
                    continue;
                }
            }
            else {
                if (counties[i][0].county == '061' || counties[i][0].county == '085') {
                    continue;
                }
            }
            // out of bounds
            if (removals.includes(filteredBlockGroups[i][0][geoUnitKey])) {
                continue;
            }

            // push to results
            finalResults.push(filteredBlockGroups[i])
    }
    return finalResults
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