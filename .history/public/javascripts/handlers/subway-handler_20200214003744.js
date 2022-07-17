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
        
        let sub_json = JSON.parse(file)
        let res = new Map()
        //
 /*       for (let i=0; i< lines.length; i++) {
            res.set(lines[i], [])
        }
        console.log('json_444', sub_json.features.length)
        for (let i=0; i< sub_json.features.length; i++) {
            let name = sub_json.features[i].properties.name
            if (lines.indexOf(name) != -1) {
                res.get(name).push(sub_json.features[i].properties)
            }
        }
        */
       for (let i=0; i< sub_json.features.length; i++) {
            let name = sub_json.features[i].properties.name
         if (!res.has(name)) {
            res.set(name, sub_json.features[i].name)
            }
        }     
        let arr = res.keys().sort(a < b)
        console.log(arr)
    }
    
}

module.exports = methods;