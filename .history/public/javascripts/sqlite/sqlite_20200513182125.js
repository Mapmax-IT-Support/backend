const sqlite = require('sqlite')
const path = require('path');
const dbPromise = sqlite.open(path.resolve(__dirname, './subways_2018.sqlite'));

let methods = {

    querySubways : async (coords) => {
        return 
        return new Promise(async (resolve, reject) => {
            try {
                const db = await dbPromise;
                // create string
                let lat = coords.lat.toString().substring(0, 5)
                let lng = coords.lng.toString().substring(0, 6)
                console.log('coords', coords, lat, lng)
                const [results] = await Promise.all([
                  db.all("select * from totals where CAST(G_LAT as text) like '"+ lat +"%' AND CAST(G_LNG as text) like '"+ lng+"%'")
                ]);
                    resolve(results)
              } catch (err) {
                  console.log(err)
                  reject(error)
              }     
        }) 
    }
}

module.exports = methods;