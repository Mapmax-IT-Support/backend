const sqlite = require('../sqlite/sqlite')
const fs = require('fs');
const path = require("path");
const file = fs.readFileSync(path.resolve(__dirname, "../../gson/subway-lines.json"));

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
        
        let sub_json = JSON.parse(file)

        console.log('json_444', sub_json)
        for (let i=0; i< sub_json; i++) {
            console.log('PROP', sub_json[i].properties.name)
        }
    }
}

module.exports = methods;