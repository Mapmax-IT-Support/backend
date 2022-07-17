const sqlite = require('../sqlite/sqlite')
const fs = require('fs');
const path = require("path");
const file = fs.readFileSync(path.resolve(__dirname, "./gson/subway-lines.json"));

let methods = {

    getEntries : async (coords) => {
        let promises = []
        let responses = []
        for (let n of coords) {
            promises.push(sqlite.querySubways(n))
        }
        let results = await Promise.all(promises)
        
        // process results
        let ids = []
        results.forEach((e,i) => {
          //  console.log(e.length, e)
            for (let s of e) {
                if (s != undefined && !ids.includes(JSON.stringify(s))) {
                    responses.push({ name: s.G_STATION, data: s})
                    ids.push(JSON.stringify(s))
                } 
            }
        })
     //   console.log(responses)
        return responses;
    },

    getLines : async (lines) => {
         lines = ['A']

        console.log('RAW_444', file)
        console.log('JSON_444', JSON.parse(file))
    }
}

module.exports = methods;