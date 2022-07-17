
const methods = {

    // https://www.movable-type.co.uk/scripts/latlong.html
    getTradeZoneBounds : (isCity, center) => {
        let radius; 
        let innerRadius; 
        let precision = 12
        let innerPrecision = 5
        if (isCity) {
          radius = 0.440 
          innerRadius = 0.110
        } else {
          radius = 1.0
          innerRadius = 0.5
        }
        console.log('isCity:', isCity, radius, innerRadius)
        let points = tradeZonehelper.getPoints(precision, center, radius)
          .concat(tradeZonehelper.getPoints(innerPrecision, center, innerRadius))
        
        return points;
    }
}

const getPoints = (precision, center, distance) => {
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