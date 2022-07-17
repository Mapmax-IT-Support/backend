const sqlite = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path');

//const dbPromise = sqlite.open(path.resolve(__dirname, './subways_2018.sqlite'));

let methods = {

    querySubways : async (coords) => {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await sqlite.open({
                    filename : path.resolve(__dirname, './subways_2018.sqlite'),
                    driver: sqlite3.Database
                })

                // create string
                let lat = coords.lat.toString().substring(0, 5)
                let lng = coords.lng.toString().substring(0, 6)
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