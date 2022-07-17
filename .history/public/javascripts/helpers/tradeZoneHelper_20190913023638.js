
const methods = {

    // get lat/lng of 5 points in a circle around specified center where radius = distance
    // https://www.movable-type.co.uk/scripts/latlong.html
    getPoints: (center, distance) => {
        let φ1 = toRadians(center.lat)
        let λ1 = toRadians(center.lng) 
        let d = distance
        let R = 6371 // radius of earth in KM
        let points = []
        let divisor = 7
        for (let i = 0; i < divisor; i++) {
            let brng =  toRadians((i * (360/divisor)))
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
}


const toRadians = (num) =>  num * (Math.PI/180)
const toDegrees = (num) =>  num * (180/Math.PI)

module.exports = methods