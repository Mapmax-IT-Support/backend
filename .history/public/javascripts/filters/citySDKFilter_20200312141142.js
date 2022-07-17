const Constants = require('../constants')
const ERROR = "Error, Results not found"

const methods = {

    filterCityPopulation(data) {
        if (data == null) {
            return ERROR
        }

        const r = data[0]
        const response = {

            city: r.NAME,
            population : r.B01003_001E
        }
        return (response)
    },


    filterBasic: function(data) {
        if (data == null) {
            return ERROR
        }

        const r = data[0]
        const response = {

            city: r.NAME,
            population : r.B01003_001E,
            median_age: r.B01002_001E,
            males : r.B01001_002E,
            females : r.B01001_026E,
            median_income :  r.B19013_001E
        }
        //  console.log(response)
        return (response)
    },

    filterAll: function(data) {
        if (data == null) {
            return ERROR
        }

        const r = data[0]
        const response = {
            
            social : {
                summary : {
                    city: r.NAME,
                    population : r.B01003_001E,
                    median_age: r.B01002_001E,
                    gender : {
                        males : r.B01001_002E,
                        females : r.B01001_026E
                    },
                },
                race : { // 23
                    sample_total: calculateTotal([r.B01001H_001E, r.B01001B_001E, r.B01001D_001E, r.B01001I_001E, r.B01001E_001E, r.B01001C_001E, r.B01001F_001E]),
                    white : r.B01001H_001E,
                    african_american : r.B01001B_001E,
                    asian : r.B01001D_001E,
                    hispanic_or_latino: r.B01001I_001E,
                    other : r.B01001E_001E 
                    + r.B01001C_001E
                    + r.B01001F_001E,
                },

                nativity : {
                    sample_total: calculateTotal([r.B05012_002E, r.B05012_003E]),
                    united_states_native: r.B05012_002E,
                    foreign_born: r.B05012_003E
                },
    
                marital_status : {
                    sample_total: calculateTotal([r.B12001_004E, r.B12001_013E, r.B12001_003E, r.B12001_012E, r.B12001_010E, r.B12001_019E]),
                    married: r.B12001_004E + r.B12001_013E,
                    never_married: r.B12001_003E + r.B12001_012E,
                    divorced: r.B12001_010E + r.B12001_019E,
                },

                employment : {
                    sample_total: calculateTotal([r.B24011_001E, r.B14007_002E, r.B08006_017E]),
                    employed : r.B24011_001E,
                    students : r.B14007_002E,
                    work_from_home: r.B08006_017E  
                },
    
                education : {
                    sample_total: calculateTotal([r.B06009_002E, r.B06009_003E, r.B06009_003E, r.B06009_004E, r.B06009_005E, r.B06009_006E]),
                    less_than_high_school : r.B06009_002E,
                    highschool_graduate : r.B06009_003E,
                    some_college_or_associates : r.B06009_004E,
                    bachelors : r.B06009_005E,
                    graduate : r.B06009_006E
                },
    
                transportation : {
                    sample_total: calculateTotal([r.B08006_002E, r.B08006_008E, r.B08006_014E, r.B08006_015E, r.B08006_016E, r.B08006_017E]),
                    drive : r.B08006_002E,
                    public_transportation : r.B08006_008E,
                    bicycle : r.B08006_014E,
                    walk : r.B08006_015E,
                    other : r.B08006_016E,
                    home : r.B08006_017E

                }
             },
             income : {
                sample_total : r[Constants.POPULATION.INCOME.HOUSEHOLD.TOTAL_HOUSEHOLDS],
                median: r[Constants.POPULATION.INCOME.HOUSEHOLD.MEDIAN],
               _0_9999 : r[Constants.POPULATION.INCOME.HOUSEHOLD._0_9999],
               _10000_14999 : r[Constants.POPULATION.INCOME.HOUSEHOLD._10000_14999],
               _15000_19999 : r[Constants.POPULATION.INCOME.HOUSEHOLD._15000_19999],
               _20000_24999: r[Constants.POPULATION.INCOME.HOUSEHOLD._20000_24999],
               _25000_29999: r[Constants.POPULATION.INCOME.HOUSEHOLD._25000_29999],
               _30000_34999: r[Constants.POPULATION.INCOME.HOUSEHOLD._30000_34999],
               _35000_39999: r[Constants.POPULATION.INCOME.HOUSEHOLD._35000_39999],
               _40000_44999: r[Constants.POPULATION.INCOME.HOUSEHOLD._40000_44999],
               _45000_49999: r[Constants.POPULATION.INCOME.HOUSEHOLD._45000_49999],
               _50000_59999: r[Constants.POPULATION.INCOME.HOUSEHOLD._50000_59999],
               _60000_74999: r[Constants.POPULATION.INCOME.HOUSEHOLD._60000_74999],
               _75000_99999: r[Constants.POPULATION.INCOME.HOUSEHOLD._75000_99999],
               _100000_124999:r[Constants.POPULATION.INCOME.HOUSEHOLD._100000_124999],
               _125000_149999:r[Constants.POPULATION.INCOME.HOUSEHOLD._125000_149999],
               _150000_199999:r[Constants.POPULATION.INCOME.HOUSEHOLD._150000_199999],
               _200000_MORE: r[Constants.POPULATION.INCOME.HOUSEHOLD._200000_MORE]
             }
        }
        zeroUndefined(response)
        return (response)
    },

    

    filterAge : (data) => {
        if (data == null) {
            return ERROR
        }
        let r = data[0]
        let built = {}
        let gt = 0

        // set median age
        built['median_age'] = r[Constants.POPULATION.AGE.MEDIAN.TOTAL]

        // add male and female and map census api codes back to label : value format
        for (let [key, value] of Object.entries(r)) {
            let label = getKeyByValue(Constants.POPULATION.GENDER.FEMALE, key)
            if (label != undefined) {
                if (built[label]  == undefined) built[label] = value 
                else built[label] += value // if not undefined add to value
                if (!isNaN(value))
                    gt += value
            } else {
                label = getKeyByValue(Constants.POPULATION.GENDER.MALE, key)
                if (label != undefined) {
                    if (built[label] == undefined) built[label] = value
                    else built[label] += value // if not undefined add to value
                    if (!isNaN(value))
                        gt+= value
                }
            }
        }
        // set sample total from grand total M and F
        built.sample_total = gt

        let response = { 'age' : built }
        return(response)
    },

    }
 
    // https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
      }

    function zeroUndefined(obj) {
       Object.keys(obj).forEach(key => {
           if (typeof obj[key] == 'object') {
            zeroUndefined(obj[key])
           } else if (obj[key] == undefined) {
               obj[key] = 0
           }
       })
    }

    function calculateTotal(vals) {
        let total = 0
        vals.forEach(e => {
            let val = e
            if (isNaN(val)) {
                val = 0
            }
            total += val
        })
        return total;
    }

module.exports = methods