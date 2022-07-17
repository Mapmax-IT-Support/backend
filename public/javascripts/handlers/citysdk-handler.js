const census = require('citysdk')
const Constants = require('../constants')
const filter = require('../filters/citySDKFilter')
const KEY = '28a04efd887ab5cf335f99aabcde1978452de2cf'

/*
variable table for acs 2017
https://api.census.gov/data/2017/acs/acs5/variables.html B01001_002E B01001H_001E
*/

const methods = {

  getZipCartography: (lat, lng) => {
    return new Promise((resolve, reject) => {
      census({
        "vintage": '2017',
        "geoHierarchy": {
          "zip code tabulation area": {
            "lat": lat,
            "lng":  lng
          },
        },
        sourcePath: [
          'acs',
          'acs5',
        ],
        values: [
          'B00001_001E',
        ],
        geoResolution: '500k',
      }, (err, json) => {
            if (!err) {
              resolve(json)
            } else {
              reject(err)
            }
        })
      })
  },

  getCityPopulation: (lat, lng) => {
    return new Promise((resolve, reject) => {
      census({
        "vintage" : 2017,             
        "geoHierarchy" : {            
          'place': {
            "lat" : lat, 
            "lng" : lng
          }
        },
        "sourcePath" : ["acs", "acs5"],        
        "values" : 
        ["NAME", Constants.POPULATION.TOTAL],
        "statsKey" : KEY 
      }, (err, json) => {
            if (!err) {
              resolve(json)
            } else {
              reject(err)
            }
        })
      })
  },

  getAge : (lat, lng, range) => {
    return new Promise((resolve, reject) => {
      census({
        "vintage" : 2017,             
        "geoHierarchy" : {            
           [range]: {
            "lat" : lat, 
            "lng" : lng
          }
        },
        "sourcePath" : ["acs", "acs5"],        
        "values" : 
        ["NAME", 
        
        Constants.POPULATION.AGE.MEDIAN.TOTAL,
        // age// must be calculated from totals given in age data not pop. total
        Constants.POPULATION.GENDER.MALE.ZERO_FIVE,
        Constants.POPULATION.GENDER.MALE.FIVE_NINE,
        Constants.POPULATION.GENDER.MALE.TEN_FOURTEEN,
        Constants.POPULATION.GENDER.MALE.FIFTEEN_SEVENTEEN,
        Constants.POPULATION.GENDER.MALE.EIGHTEEN_NINETEEN,
        Constants.POPULATION.GENDER.MALE.TWENTY,
        Constants.POPULATION.GENDER.MALE.TWENTYONE,
        Constants.POPULATION.GENDER.MALE.TWENTYTWO_TWENTYFOUR,
        Constants.POPULATION.GENDER.MALE.TWENTYFIVE_TWENTYNINE,
        Constants.POPULATION.GENDER.MALE.THIRTY_THIRTYFOUR,
        Constants.POPULATION.GENDER.MALE.THIRTYFIVE_THIRTYNINE,
        Constants.POPULATION.GENDER.MALE.FORTY_FORTYFOUR,
        Constants.POPULATION.GENDER.MALE.FORTYFIVE_FORTYNINE,
        Constants.POPULATION.GENDER.MALE.FIFTY_FIFTYFOUR,
        Constants.POPULATION.GENDER.MALE.FIFTYFIVE_FIFTYNINE,
        Constants.POPULATION.GENDER.MALE.SIXTY_SIXTYONE,
        Constants.POPULATION.GENDER.MALE.SIXTYTWO_SIXTYFOUR,
        Constants.POPULATION.GENDER.MALE.SIXTYFIVE_SIXTYSIX,
        Constants.POPULATION.GENDER.MALE.SIXTYSEVEN_SIXTYNINE,
        Constants.POPULATION.GENDER.MALE.SEVENTY_SEVENTYFOUR,
        Constants.POPULATION.GENDER.MALE.SEVENTYFIVE_SEVENTYNINE,
        Constants.POPULATION.GENDER.MALE.EIGHTY_EIGHTYFOUR,
        Constants.POPULATION.GENDER.MALE.EIGHTYFIVE_UP,
 
        // must be calculated from totals given in age data not pop. total
        Constants.POPULATION.GENDER.FEMALE.ZERO_FIVE,
        Constants.POPULATION.GENDER.FEMALE.FIVE_NINE,
        Constants.POPULATION.GENDER.FEMALE.TEN_FOURTEEN,
        Constants.POPULATION.GENDER.FEMALE.FIFTEEN_SEVENTEEN,
        Constants.POPULATION.GENDER.FEMALE.EIGHTEEN_NINETEEN,
        Constants.POPULATION.GENDER.FEMALE.TWENTY,
        Constants.POPULATION.GENDER.FEMALE.TWENTYONE,
        Constants.POPULATION.GENDER.FEMALE.TWENTYTWO_TWENTYFOUR,
        Constants.POPULATION.GENDER.FEMALE.TWENTYFIVE_TWENTYNINE,
        Constants.POPULATION.GENDER.FEMALE.THIRTY_THIRTYFOUR,
        Constants.POPULATION.GENDER.FEMALE.THIRTYFIVE_THIRTYNINE,
        Constants.POPULATION.GENDER.FEMALE.FORTY_FORTYFOUR,
        Constants.POPULATION.GENDER.FEMALE.FORTYFIVE_FORTYNINE,
        Constants.POPULATION.GENDER.FEMALE.FIFTY_FIFTYFOUR,
        Constants.POPULATION.GENDER.FEMALE.FIFTYFIVE_FIFTYNINE,
        Constants.POPULATION.GENDER.FEMALE.SIXTY_SIXTYONE,
        Constants.POPULATION.GENDER.FEMALE.SIXTYTWO_SIXTYFOUR,
        Constants.POPULATION.GENDER.FEMALE.SIXTYFIVE_SIXTYSIX,
        Constants.POPULATION.GENDER.FEMALE.SIXTYSEVEN_SIXTYNINE,
        Constants.POPULATION.GENDER.FEMALE.SEVENTY_SEVENTYFOUR,
        Constants.POPULATION.GENDER.FEMALE.SEVENTYFIVE_SEVENTYNINE,
        Constants.POPULATION.GENDER.FEMALE.EIGHTY_EIGHTYFOUR,
        Constants.POPULATION.GENDER.FEMALE.EIGHTYFIVE_UP
        ],          
        "statsKey" : KEY // required for > 500 calls per day
      }, 
      (err, json) => {
        if (!err) {
          resolve(filter.filterAge(json))
        } else {
          reject(err)
        }
      })
    })
 },

 getIncome : (range, lat, lng)  => {
  return new Promise((resolve, reject) => {
    census({
        "vintage" : 2017,             
        "geoHierarchy" : {            
        //   "zip code tabulation area" : {
        [range] : {
            "lat" : lat, 
            "lng" : lng
          }
        },
        "sourcePath" : ["acs", "acs5"],        
        "values" : 
        ["NAME", 
        
        // income
        Constants.POPULATION.INCOME.HOUSEHOLD.MEDIAN,
        Constants.POPULATION.INCOME.INDIVIDUAL.POVERTY,
        Constants.POPULATION.INCOME.HOUSEHOLD._0_9999,
        Constants.POPULATION.INCOME.HOUSEHOLD._10000_14999,
        Constants.POPULATION.INCOME.HOUSEHOLD._150000_199999,
        Constants.POPULATION.INCOME.HOUSEHOLD._20000_24999,
        Constants.POPULATION.INCOME.HOUSEHOLD._25000_29999,
        Constants.POPULATION.INCOME.HOUSEHOLD._30000_34999,
        Constants.POPULATION.INCOME.HOUSEHOLD._35000_39999,
        Constants.POPULATION.INCOME.HOUSEHOLD._40000_44999,
        Constants.POPULATION.INCOME.HOUSEHOLD._45000_49999,
        Constants.POPULATION.INCOME.HOUSEHOLD._50000_59999,
        Constants.POPULATION.INCOME.HOUSEHOLD._60000_74999,
        Constants.POPULATION.INCOME.HOUSEHOLD._75000_99999,
        Constants.POPULATION.INCOME.HOUSEHOLD._100000_124999,
        Constants.POPULATION.INCOME.HOUSEHOLD._125000_149999,
        Constants.POPULATION.INCOME.HOUSEHOLD._150000_199999,
        Constants.POPULATION.INCOME.HOUSEHOLD._150000_199999, 
        Constants.POPULATION.INCOME.HOUSEHOLD._200000_MORE,

        ],          
        "statsKey" : KEY // required for > 500 calls per day
      }, 
      (err, json) => {
        if (!err) {
          resolve(filter.filterIncome(json))
        } else {
          reject(err)
        }
      })
    })
  },

  getSocial : (range, lat, lng) => {
    return new Promise((resolve, reject) => {
      census({
          "vintage" : 2017,             
          "geoHierarchy" : {            
              [range] : {
              "lat" : lat, //40.8581292, 
              "lng" : lng //-74.2053012
            }
          },
          "sourcePath" : ["acs", "acs5"],        
          "values" : 
          ["NAME", 
          // gender
          Constants.POPULATION.TOTAL, 
          Constants.POPULATION.AGE.MEDIAN.TOTAL, 
          Constants.POPULATION.GENDER.MALE.TOTAL, 
          Constants.POPULATION.GENDER.FEMALE.TOTAL,

          // race
          Constants.POPULATION.RACE.WHITE.TOTAL,
          Constants.POPULATION.RACE.AFRICAN_AMERICAN.TOTAL,
          Constants.POPULATION.RACE.ASIAN.TOTAL,
          Constants.POPULATION.RACE.HISPANIC_OR_LATINO.TOTAL,
          Constants.POPULATION.RACE.TWO_OR_MORE.TOTAL,

          // nativity 
          Constants.POPULATION.NATIVITY.US.TOTAL,
          Constants.POPULATION.NATIVITY.FOREIGN.TOTAL,

          // language
          Constants.POPULATION.LANGUAGE.ENGLISH,
          Constants.POPULATION.LANGUAGE.SPANISH,
          Constants.POPULATION.LANGUAGE.OTHER,

          // marital status
          Constants.POPULATION.RELATIONSHIP.MARRIED,
          Constants.POPULATION.RELATIONSHIP.NEVER_MARRIED,
          Constants.POPULATION.RELATIONSHIP.DIVORCED,
          Constants.POPULATION.RELATIONSHIP.WIDOWED,
          
          // employed
          Constants.POPULATION.WORK.EMPLOYED,
          Constants.POPULATION.WORK.STUDENTS,

          //education
          Constants.POPULATION.EDUCATION.LESS_THAN_HIGHSCHOOL,
          Constants.POPULATION.EDUCATION.HIGHSCHOOL_GRADUATE,
          Constants.POPULATION.EDUCATION.SOME_COLLEGE_OR_ASSOCIATES,
          Constants.POPULATION.EDUCATION.BACHELORS,
          Constants.POPULATION.EDUCATION.GRADUATE,

          // transportation
          Constants.POPULATION.TRANSPORTATION.DRIVE,
          Constants.POPULATION.TRANSPORTATION.PUBLIC_TRANSPORTATION,
          Constants.POPULATION.TRANSPORTATION.WALK,
          Constants.POPULATION.TRANSPORTATION.OTHER

          ],          
          "statsKey" : KEY // required for > 500 calls per day
        }, 
        (err, json) => {
          if (!err) {
            resolve(filter.filterSocial(json))
          } else {
            reject(err)
          }
        })
    })
 },

 getBasic : (range, lat, lng) => {
   return new Promise((resolve, reject) => {
      census({
          "vintage" : 2017,             
          "geoHierarchy" : {            
              [range] : {
              "lat" : lat, //40.8581292, 
              "lng" : lng //-74.2053012
            }
          },
          "sourcePath" : ["acs", "acs5"],        
          "values" : 
          ["NAME", 
          // gender
          Constants.POPULATION.TOTAL, 
          Constants.POPULATION.AGE.MEDIAN.TOTAL, 
          Constants.POPULATION.GENDER.MALE.TOTAL, 
          Constants.POPULATION.GENDER.FEMALE.TOTAL,
          Constants.POPULATION.INCOME.HOUSEHOLD.MEDIAN,
          ],          
          "statsKey" : KEY // required for > 500 calls per day
      }, 
      (err, json) => {
        if (!err) {
          resolve(filter.filterBasic(json))
        } else {
          reject(err)
        }
      })
    })
  },

 getTract : (lat, lng) => {
   return new Promise((resolve, reject) => {
      census({
        "vintage" : 2017,             
        "geoHierarchy" : {            
          "tract" : {
            "lat" : lat, 
            "lng" : lng
          }
        },
        "sourcePath" : ["acs", "acs5"],        
        "values" : 
        ["NAME"],          
        "statsKey" : KEY 
      }, 
      (err, json) => {
        if (!err) {
          resolve(json)
        } else {
          reject(err)
        }
      })
    })
  },

  getBlockGroup : (lat, lng) => {
    return new Promise((resolve, reject) => {
       census({
         "vintage" : 2017,             
         "geoHierarchy" : {            
           "block group" : {
             "lat" : lat, 
             "lng" : lng
           }
         },
         "sourcePath" : ["acs", "acs5"],        
         "values" : 
         ["NAME"],          
         "statsKey" : KEY 
       }, 
       (err, json) => {
         if (!err) {
           resolve(json)
         } else {
           reject(err)
         }
       })
     })
   },

   getCounty : (lat, lng) => {
    return new Promise((resolve, reject) => {
       census({
         "vintage" : 2017,             
         "geoHierarchy" : {            
           "county" : {
             "lat" : lat, 
             "lng" : lng
           }
         },
         "sourcePath" : ["acs", "acs5"],        
         "values" : 
         ["NAME"],          
         "statsKey" : KEY 
       }, 
       (err, json) => {
         if (!err) {
           resolve(json)
         } else {
           reject(err)
         }
       })
     })
   },
 

  getAllData : (lat, lng, range) => {

    return new Promise((resolve, reject) => {
      census({
          "vintage" : 2019,             
          "geoHierarchy" : {    
            [range] : 
            {
              "lat" : lat, //40.8581292, 
              "lng" : lng //-74.2053012
            },
            "state": "36",       
          },
          "sourcePath" : ["acs", "acs5"],        
          "values" : 
          [
          'NAME',
          Constants.POPULATION.TOTAL, 
          Constants.POPULATION.AGE.MEDIAN.TOTAL, 
          Constants.POPULATION.GENDER.MALE.TOTAL, 
          Constants.POPULATION.GENDER.FEMALE.TOTAL,
  
          // race
          Constants.POPULATION.RACE.WHITE_NOT_LATINO.TOTAL,
          Constants.POPULATION.RACE.AFRICAN_AMERICAN.TOTAL,
          Constants.POPULATION.RACE.ASIAN.TOTAL,
          Constants.POPULATION.RACE.HISPANIC_OR_LATINO.TOTAL,
          Constants.POPULATION.RACE.NATIVE_AMERICAN.TOTAL,
          Constants.POPULATION.RACE.PACIFIC_ISLANDER.TOTAL,
          Constants.POPULATION.RACE.OTHER.TOTAL,
  
          // nativity 
          Constants.POPULATION.NATIVITY.US.TOTAL,
          Constants.POPULATION.NATIVITY.FOREIGN.TOTAL,

          // language
          // Constants.POPULATION.LANGUAGE.ENGLISH,
          // Constants.POPULATION.LANGUAGE.SPANISH,
          // Constants.POPULATION.LANGUAGE.OTHER,
//   
//           // marital status
          Constants.POPULATION.RELATIONSHIP.MALE.MARRIED,
          Constants.POPULATION.RELATIONSHIP.MALE.NEVER_MARRIED,
          Constants.POPULATION.RELATIONSHIP.MALE.DIVORCED,
          Constants.POPULATION.RELATIONSHIP.FEMALE.MARRIED,
          Constants.POPULATION.RELATIONSHIP.FEMALE.NEVER_MARRIED,
          Constants.POPULATION.RELATIONSHIP.FEMALE.DIVORCED,
          
//           // employed
          Constants.POPULATION.WORK.EMPLOYED,
          Constants.POPULATION.WORK.STUDENTS,
  
//           //education
          Constants.POPULATION.EDUCATION.LESS_THAN_HIGHSCHOOL,
          Constants.POPULATION.EDUCATION.HIGHSCHOOL_GRADUATE,
          Constants.POPULATION.EDUCATION.SOME_COLLEGE_OR_ASSOCIATES,
          Constants.POPULATION.EDUCATION.BACHELORS,
          Constants.POPULATION.EDUCATION.GRADUATE,
  
//           // transportation
          Constants.POPULATION.TRANSPORTATION.DRIVE,
          Constants.POPULATION.TRANSPORTATION.PUBLIC_TRANSPORTATION,
          Constants.POPULATION.TRANSPORTATION.WALK,
          Constants.POPULATION.TRANSPORTATION.OTHER,
          Constants.POPULATION.TRANSPORTATION.HOME,
  
            // income
            Constants.POPULATION.INCOME.HOUSEHOLD.MEDIAN,
            Constants.POPULATION.INCOME.HOUSEHOLD.TOTAL_HOUSEHOLDS,
            Constants.POPULATION.INCOME.HOUSEHOLD._0_9999,
            Constants.POPULATION.INCOME.HOUSEHOLD._10000_14999,
            Constants.POPULATION.INCOME.HOUSEHOLD._15000_19999,
            Constants.POPULATION.INCOME.HOUSEHOLD._20000_24999,
            Constants.POPULATION.INCOME.HOUSEHOLD._25000_29999,
            Constants.POPULATION.INCOME.HOUSEHOLD._30000_34999,
            Constants.POPULATION.INCOME.HOUSEHOLD._35000_39999,
            Constants.POPULATION.INCOME.HOUSEHOLD._40000_44999,
            Constants.POPULATION.INCOME.HOUSEHOLD._45000_49999,
            Constants.POPULATION.INCOME.HOUSEHOLD._50000_59999,
            Constants.POPULATION.INCOME.HOUSEHOLD._60000_74999,
            Constants.POPULATION.INCOME.HOUSEHOLD._75000_99999,
            Constants.POPULATION.INCOME.HOUSEHOLD._100000_124999,
            Constants.POPULATION.INCOME.HOUSEHOLD._125000_149999,
            Constants.POPULATION.INCOME.HOUSEHOLD._150000_199999,
            Constants.POPULATION.INCOME.HOUSEHOLD._200000_MORE,
        ],          
          
          "statsKey" : KEY // required for > 500 calls per day
        }, 
        (err, json) => {
          console.log('jeru', json)
          if (!err) {
            resolve(filter.filterAll(json))
          } else {
            reject(err)
          }
        })
    })
  },

///////////////////////////////////////////////////     ZIP      /////////////////////////////////////////////////////
  // zip
  // not all stats available for block group
  getZipAllStats : (zip) => {
    return new Promise((resolve, reject) => {
      census({
          "vintage" : 2017,             
          "geoHierarchy" : {     
              "zip code tabulation area" : zip,
          },
          "sourcePath" : ["acs", "acs5"],        
          "values" : 
          [
          // gender
          Constants.POPULATION.TOTAL, 
          Constants.POPULATION.AGE.MEDIAN.TOTAL, 
          Constants.POPULATION.GENDER.MALE.TOTAL, 
          Constants.POPULATION.GENDER.FEMALE.TOTAL,
  
          // race
          Constants.POPULATION.RACE.WHITE_NOT_LATINO.TOTAL,
          Constants.POPULATION.RACE.AFRICAN_AMERICAN.TOTAL,
          Constants.POPULATION.RACE.ASIAN.TOTAL,
          Constants.POPULATION.RACE.HISPANIC_OR_LATINO.TOTAL,
          Constants.POPULATION.RACE.NATIVE_AMERICAN.TOTAL,
          Constants.POPULATION.RACE.PACIFIC_ISLANDER.TOTAL,
          Constants.POPULATION.RACE.OTHER.TOTAL,
  
          // nativity 
          Constants.POPULATION.NATIVITY.US.TOTAL,
          Constants.POPULATION.NATIVITY.FOREIGN.TOTAL,

          // language
      //    Constants.POPULATION.LANGUAGE.ENGLISH,
     //     Constants.POPULATION.LANGUAGE.SPANISH,
      //    Constants.POPULATION.LANGUAGE.OTHER,
 
          // marital status
          Constants.POPULATION.RELATIONSHIP.MALE.MARRIED,
          Constants.POPULATION.RELATIONSHIP.MALE.NEVER_MARRIED,
          Constants.POPULATION.RELATIONSHIP.MALE.DIVORCED,
          Constants.POPULATION.RELATIONSHIP.FEMALE.MARRIED,
          Constants.POPULATION.RELATIONSHIP.FEMALE.NEVER_MARRIED,
          Constants.POPULATION.RELATIONSHIP.FEMALE.DIVORCED,
          
          // employed
          Constants.POPULATION.WORK.EMPLOYED,
          Constants.POPULATION.WORK.STUDENTS,
  
          //education
          Constants.POPULATION.EDUCATION.LESS_THAN_HIGHSCHOOL,
          Constants.POPULATION.EDUCATION.HIGHSCHOOL_GRADUATE,
          Constants.POPULATION.EDUCATION.SOME_COLLEGE_OR_ASSOCIATES,
          Constants.POPULATION.EDUCATION.BACHELORS,
          Constants.POPULATION.EDUCATION.GRADUATE,
  
          // transportation
          Constants.POPULATION.TRANSPORTATION.DRIVE,
          Constants.POPULATION.TRANSPORTATION.PUBLIC_TRANSPORTATION,
          Constants.POPULATION.TRANSPORTATION.WALK,
          Constants.POPULATION.TRANSPORTATION.OTHER,
          Constants.POPULATION.TRANSPORTATION.HOME,
  
           // income
          Constants.POPULATION.INCOME.HOUSEHOLD.MEDIAN,
          Constants.POPULATION.INCOME.HOUSEHOLD.TOTAL_HOUSEHOLDS,
          Constants.POPULATION.INCOME.HOUSEHOLD._0_9999,
          Constants.POPULATION.INCOME.HOUSEHOLD._10000_14999,
          Constants.POPULATION.INCOME.HOUSEHOLD._15000_19999,
          Constants.POPULATION.INCOME.HOUSEHOLD._20000_24999,
          Constants.POPULATION.INCOME.HOUSEHOLD._25000_29999,
          Constants.POPULATION.INCOME.HOUSEHOLD._30000_34999,
          Constants.POPULATION.INCOME.HOUSEHOLD._35000_39999,
          Constants.POPULATION.INCOME.HOUSEHOLD._40000_44999,
          Constants.POPULATION.INCOME.HOUSEHOLD._45000_49999,
          Constants.POPULATION.INCOME.HOUSEHOLD._50000_59999,
          Constants.POPULATION.INCOME.HOUSEHOLD._60000_74999,
          Constants.POPULATION.INCOME.HOUSEHOLD._75000_99999,
          Constants.POPULATION.INCOME.HOUSEHOLD._100000_124999,
          Constants.POPULATION.INCOME.HOUSEHOLD._125000_149999,
          Constants.POPULATION.INCOME.HOUSEHOLD._150000_199999,
          Constants.POPULATION.INCOME.HOUSEHOLD._200000_MORE,
        ],          
          "statsKey" : KEY // required for > 500 calls per day
        }, 
        (err, json) => {
          if (!err) {
            resolve(filter.filterAll(json))
      resolve(json)
          } else {
            reject(err)
          }
        })
    })
  },

  getZipAgeData : (zip) => {
    return new Promise((resolve, reject) => {
      census({
          "vintage" : 2017,             
          "geoHierarchy" : {            
            "zip code tabulation area" : zip,
          },
          "sourcePath" : ["acs", "acs5"],        
          "values" : 
          [
            "NAME", 
          
          // age
          Constants.POPULATION.AGE.MEDIAN.TOTAL,
          Constants.POPULATION.GENDER.MALE.ZERO_FIVE,
          Constants.POPULATION.GENDER.MALE.FIVE_NINE,
          Constants.POPULATION.GENDER.MALE.TEN_FOURTEEN,
          Constants.POPULATION.GENDER.MALE.FIFTEEN_SEVENTEEN,
          Constants.POPULATION.GENDER.MALE.EIGHTEEN_NINETEEN,
          Constants.POPULATION.GENDER.MALE.TWENTY,
          Constants.POPULATION.GENDER.MALE.TWENTYONE,
          Constants.POPULATION.GENDER.MALE.TWENTYTWO_TWENTYFOUR,
          Constants.POPULATION.GENDER.MALE.TWENTYFIVE_TWENTYNINE,
          Constants.POPULATION.GENDER.MALE.THIRTY_THIRTYFOUR,
          Constants.POPULATION.GENDER.MALE.THIRTYFIVE_THIRTYNINE,
          Constants.POPULATION.GENDER.MALE.FORTY_FORTYFOUR,
          Constants.POPULATION.GENDER.MALE.FORTYFIVE_FORTYNINE,
          Constants.POPULATION.GENDER.MALE.FIFTY_FIFTYFOUR,
          Constants.POPULATION.GENDER.MALE.FIFTYFIVE_FIFTYNINE,
          Constants.POPULATION.GENDER.MALE.SIXTY_SIXTYONE,
          Constants.POPULATION.GENDER.MALE.SIXTYTWO_SIXTYFOUR,
          Constants.POPULATION.GENDER.MALE.SIXTYFIVE_SIXTYSIX,
          Constants.POPULATION.GENDER.MALE.SIXTYSEVEN_SIXTYNINE,
          Constants.POPULATION.GENDER.MALE.SEVENTY_SEVENTYFOUR,
          Constants.POPULATION.GENDER.MALE.SEVENTYFIVE_SEVENTYNINE,
          Constants.POPULATION.GENDER.MALE.EIGHTY_EIGHTYFOUR,
          Constants.POPULATION.GENDER.MALE.EIGHTYFIVE_UP,
  
          // must be calculated from totals given in age data not pop. total
          Constants.POPULATION.GENDER.FEMALE.ZERO_FIVE,
          Constants.POPULATION.GENDER.FEMALE.FIVE_NINE,
          Constants.POPULATION.GENDER.FEMALE.TEN_FOURTEEN,
          Constants.POPULATION.GENDER.FEMALE.FIFTEEN_SEVENTEEN,
          Constants.POPULATION.GENDER.FEMALE.EIGHTEEN_NINETEEN,
          Constants.POPULATION.GENDER.FEMALE.TWENTY,
          Constants.POPULATION.GENDER.FEMALE.TWENTYONE,
          Constants.POPULATION.GENDER.FEMALE.TWENTYTWO_TWENTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.TWENTYFIVE_TWENTYNINE,
          Constants.POPULATION.GENDER.FEMALE.THIRTY_THIRTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.THIRTYFIVE_THIRTYNINE,
          Constants.POPULATION.GENDER.FEMALE.FORTY_FORTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.FORTYFIVE_FORTYNINE,
          Constants.POPULATION.GENDER.FEMALE.FIFTY_FIFTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.FIFTYFIVE_FIFTYNINE,
          Constants.POPULATION.GENDER.FEMALE.SIXTY_SIXTYONE,
          Constants.POPULATION.GENDER.FEMALE.SIXTYTWO_SIXTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.SIXTYFIVE_SIXTYSIX,
          Constants.POPULATION.GENDER.FEMALE.SIXTYSEVEN_SIXTYNINE,
          Constants.POPULATION.GENDER.FEMALE.SEVENTY_SEVENTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.SEVENTYFIVE_SEVENTYNINE,
          Constants.POPULATION.GENDER.FEMALE.EIGHTY_EIGHTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.EIGHTYFIVE_UP
        ],          
          
          "statsKey" : KEY // required for > 500 calls per day
        }, 
        (err, json) => {
          if (!err) {
       //     let geoid = state + county + tract + block_group
            resolve(filter.filterAge(json))
        resolve(json)
          } else {
            reject(err)
          }
        })
    })
  },


///////////////////////////////////////////////////     TRACTS      /////////////////////////////////////////////////////
  // tracts
  getTractAllStats : (state, county, tract) => {
    return new Promise((resolve, reject) => {
      census({
          "vintage" : 2017,             
          "geoHierarchy" : {     
              "state" : state, 
              "county" : county,
               "tract" : tract
          },
          "sourcePath" : ["acs", "acs5"],        
          "values" : 
          [
          // gender
          Constants.POPULATION.TOTAL, 
          Constants.POPULATION.AGE.MEDIAN.TOTAL, 
          Constants.POPULATION.GENDER.MALE.TOTAL, 
          Constants.POPULATION.GENDER.FEMALE.TOTAL,
  
          // race
          Constants.POPULATION.RACE.WHITE_NOT_LATINO.TOTAL,
          Constants.POPULATION.RACE.AFRICAN_AMERICAN.TOTAL,
          Constants.POPULATION.RACE.ASIAN.TOTAL,
          Constants.POPULATION.RACE.HISPANIC_OR_LATINO.TOTAL,
          Constants.POPULATION.RACE.NATIVE_AMERICAN.TOTAL,
          Constants.POPULATION.RACE.PACIFIC_ISLANDER.TOTAL,
          Constants.POPULATION.RACE.OTHER.TOTAL,
  
          // nativity 
          Constants.POPULATION.NATIVITY.US.TOTAL,
          Constants.POPULATION.NATIVITY.FOREIGN.TOTAL,
/*
          // language
          Constants.POPULATION.LANGUAGE.ENGLISH,
          Constants.POPULATION.LANGUAGE.SPANISH,
          Constants.POPULATION.LANGUAGE.OTHER,
 */ 
          // marital status
          Constants.POPULATION.RELATIONSHIP.MALE.MARRIED,
          Constants.POPULATION.RELATIONSHIP.MALE.NEVER_MARRIED,
          Constants.POPULATION.RELATIONSHIP.MALE.DIVORCED,
          Constants.POPULATION.RELATIONSHIP.FEMALE.MARRIED,
          Constants.POPULATION.RELATIONSHIP.FEMALE.NEVER_MARRIED,
          Constants.POPULATION.RELATIONSHIP.FEMALE.DIVORCED,
          
          // employed
          Constants.POPULATION.WORK.EMPLOYED,
          Constants.POPULATION.WORK.STUDENTS,
  
          //education
          Constants.POPULATION.EDUCATION.LESS_THAN_HIGHSCHOOL,
          Constants.POPULATION.EDUCATION.HIGHSCHOOL_GRADUATE,
          Constants.POPULATION.EDUCATION.SOME_COLLEGE_OR_ASSOCIATES,
          Constants.POPULATION.EDUCATION.BACHELORS,
          Constants.POPULATION.EDUCATION.GRADUATE,
  
          // transportation
          Constants.POPULATION.TRANSPORTATION.DRIVE,
          Constants.POPULATION.TRANSPORTATION.PUBLIC_TRANSPORTATION,
          Constants.POPULATION.TRANSPORTATION.WALK,
          Constants.POPULATION.TRANSPORTATION.OTHER,
          Constants.POPULATION.TRANSPORTATION.HOME,
  
           // income
          Constants.POPULATION.INCOME.HOUSEHOLD.MEDIAN,
          Constants.POPULATION.INCOME.HOUSEHOLD.TOTAL_HOUSEHOLDS,
          Constants.POPULATION.INCOME.HOUSEHOLD._0_9999,
          Constants.POPULATION.INCOME.HOUSEHOLD._10000_14999,
          Constants.POPULATION.INCOME.HOUSEHOLD._15000_19999,
          Constants.POPULATION.INCOME.HOUSEHOLD._20000_24999,
          Constants.POPULATION.INCOME.HOUSEHOLD._25000_29999,
          Constants.POPULATION.INCOME.HOUSEHOLD._30000_34999,
          Constants.POPULATION.INCOME.HOUSEHOLD._35000_39999,
          Constants.POPULATION.INCOME.HOUSEHOLD._40000_44999,
          Constants.POPULATION.INCOME.HOUSEHOLD._45000_49999,
          Constants.POPULATION.INCOME.HOUSEHOLD._50000_59999,
          Constants.POPULATION.INCOME.HOUSEHOLD._60000_74999,
          Constants.POPULATION.INCOME.HOUSEHOLD._75000_99999,
          Constants.POPULATION.INCOME.HOUSEHOLD._100000_124999,
          Constants.POPULATION.INCOME.HOUSEHOLD._125000_149999,
          Constants.POPULATION.INCOME.HOUSEHOLD._150000_199999,
          Constants.POPULATION.INCOME.HOUSEHOLD._200000_MORE,
        ],          
          "statsKey" : KEY // required for > 500 calls per day
        }, 
        (err, json) => {
          if (!err) {
            resolve(filter.filterAll(json))
      resolve(json)
          } else {
            reject(err)
          }
        })
    })
  },

  getTractAgeData : (state, county, tract) => {
    return new Promise((resolve, reject) => {
      census({
          "vintage" : 2017,             
          "geoHierarchy" : {            
              "state" : state,
              "county" : county,
              "tract" : tract
          },
          "sourcePath" : ["acs", "acs5"],        
          "values" : 
          [
            "NAME", 
          
          // age
          Constants.POPULATION.AGE.MEDIAN.TOTAL,
          Constants.POPULATION.GENDER.MALE.ZERO_FIVE,
          Constants.POPULATION.GENDER.MALE.FIVE_NINE,
          Constants.POPULATION.GENDER.MALE.TEN_FOURTEEN,
          Constants.POPULATION.GENDER.MALE.FIFTEEN_SEVENTEEN,
          Constants.POPULATION.GENDER.MALE.EIGHTEEN_NINETEEN,
          Constants.POPULATION.GENDER.MALE.TWENTY,
          Constants.POPULATION.GENDER.MALE.TWENTYONE,
          Constants.POPULATION.GENDER.MALE.TWENTYTWO_TWENTYFOUR,
          Constants.POPULATION.GENDER.MALE.TWENTYFIVE_TWENTYNINE,
          Constants.POPULATION.GENDER.MALE.THIRTY_THIRTYFOUR,
          Constants.POPULATION.GENDER.MALE.THIRTYFIVE_THIRTYNINE,
          Constants.POPULATION.GENDER.MALE.FORTY_FORTYFOUR,
          Constants.POPULATION.GENDER.MALE.FORTYFIVE_FORTYNINE,
          Constants.POPULATION.GENDER.MALE.FIFTY_FIFTYFOUR,
          Constants.POPULATION.GENDER.MALE.FIFTYFIVE_FIFTYNINE,
          Constants.POPULATION.GENDER.MALE.SIXTY_SIXTYONE,
          Constants.POPULATION.GENDER.MALE.SIXTYTWO_SIXTYFOUR,
          Constants.POPULATION.GENDER.MALE.SIXTYFIVE_SIXTYSIX,
          Constants.POPULATION.GENDER.MALE.SIXTYSEVEN_SIXTYNINE,
          Constants.POPULATION.GENDER.MALE.SEVENTY_SEVENTYFOUR,
          Constants.POPULATION.GENDER.MALE.SEVENTYFIVE_SEVENTYNINE,
          Constants.POPULATION.GENDER.MALE.EIGHTY_EIGHTYFOUR,
          Constants.POPULATION.GENDER.MALE.EIGHTYFIVE_UP,
  
          // must be calculated from totals given in age data not pop. total
          Constants.POPULATION.GENDER.FEMALE.ZERO_FIVE,
          Constants.POPULATION.GENDER.FEMALE.FIVE_NINE,
          Constants.POPULATION.GENDER.FEMALE.TEN_FOURTEEN,
          Constants.POPULATION.GENDER.FEMALE.FIFTEEN_SEVENTEEN,
          Constants.POPULATION.GENDER.FEMALE.EIGHTEEN_NINETEEN,
          Constants.POPULATION.GENDER.FEMALE.TWENTY,
          Constants.POPULATION.GENDER.FEMALE.TWENTYONE,
          Constants.POPULATION.GENDER.FEMALE.TWENTYTWO_TWENTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.TWENTYFIVE_TWENTYNINE,
          Constants.POPULATION.GENDER.FEMALE.THIRTY_THIRTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.THIRTYFIVE_THIRTYNINE,
          Constants.POPULATION.GENDER.FEMALE.FORTY_FORTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.FORTYFIVE_FORTYNINE,
          Constants.POPULATION.GENDER.FEMALE.FIFTY_FIFTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.FIFTYFIVE_FIFTYNINE,
          Constants.POPULATION.GENDER.FEMALE.SIXTY_SIXTYONE,
          Constants.POPULATION.GENDER.FEMALE.SIXTYTWO_SIXTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.SIXTYFIVE_SIXTYSIX,
          Constants.POPULATION.GENDER.FEMALE.SIXTYSEVEN_SIXTYNINE,
          Constants.POPULATION.GENDER.FEMALE.SEVENTY_SEVENTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.SEVENTYFIVE_SEVENTYNINE,
          Constants.POPULATION.GENDER.FEMALE.EIGHTY_EIGHTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.EIGHTYFIVE_UP
        ],          
          
          "statsKey" : KEY // required for > 500 calls per day
        }, 
        (err, json) => {
          if (!err) {
       //     let geoid = state + county + tract + block_group
            resolve(filter.filterAge(json))
        resolve(json)
          } else {
            reject(err)
          }
        })
    })
  },


  ///////////////////////////////////////////////////     BLOCKS      /////////////////////////////////////////////////////
  // not all stats available for block group
  getBlockAllStats : (state, county, tract, block_group) => {
    return new Promise((resolve, reject) => {
      census({
          "vintage" : 2017,             
          "geoHierarchy" : {     
              "state" : state, 
              "county" : county,
               "tract" : tract,
               "block group" : block_group
          },
          "sourcePath" : ["acs", "acs5"],        
          "values" : 
          [
          // gender
          Constants.POPULATION.TOTAL, 
          Constants.POPULATION.AGE.MEDIAN.TOTAL, 
          Constants.POPULATION.GENDER.MALE.TOTAL, 
          Constants.POPULATION.GENDER.FEMALE.TOTAL,
  /*
          // race
          Constants.POPULATION.RACE.WHITE_NOT_LATINO.TOTAL,
          Constants.POPULATION.RACE.AFRICAN_AMERICAN.TOTAL,
          Constants.POPULATION.RACE.ASIAN.TOTAL,
          Constants.POPULATION.RACE.HISPANIC_OR_LATINO.TOTAL,
          Constants.POPULATION.RACE.NATIVE_AMERICAN.TOTAL,
          Constants.POPULATION.RACE.PACIFIC_ISLANDER.TOTAL,
          Constants.POPULATION.RACE.OTHER.TOTAL,
  
          // nativity 
          Constants.POPULATION.NATIVITY.US.TOTAL,
          Constants.POPULATION.NATIVITY.FOREIGN.TOTAL,
*/
          // language
      //    Constants.POPULATION.LANGUAGE.ENGLISH,
     //     Constants.POPULATION.LANGUAGE.SPANISH,
      //    Constants.POPULATION.LANGUAGE.OTHER,
 
          // marital status
          Constants.POPULATION.RELATIONSHIP.MALE.MARRIED,
          Constants.POPULATION.RELATIONSHIP.MALE.NEVER_MARRIED,
          Constants.POPULATION.RELATIONSHIP.MALE.DIVORCED,
          Constants.POPULATION.RELATIONSHIP.FEMALE.MARRIED,
          Constants.POPULATION.RELATIONSHIP.FEMALE.NEVER_MARRIED,
          Constants.POPULATION.RELATIONSHIP.FEMALE.DIVORCED,
     /*     
          // employed
          Constants.POPULATION.WORK.EMPLOYED,
          Constants.POPULATION.WORK.STUDENTS,
  
          //education
          Constants.POPULATION.EDUCATION.LESS_THAN_HIGHSCHOOL,
          Constants.POPULATION.EDUCATION.HIGHSCHOOL_GRADUATE,
          Constants.POPULATION.EDUCATION.SOME_COLLEGE_OR_ASSOCIATES,
          Constants.POPULATION.EDUCATION.BACHELORS,
          Constants.POPULATION.EDUCATION.GRADUATE,
  
          // transportation
          Constants.POPULATION.TRANSPORTATION.DRIVE,
          Constants.POPULATION.TRANSPORTATION.PUBLIC_TRANSPORTATION,
          Constants.POPULATION.TRANSPORTATION.WALK,
          Constants.POPULATION.TRANSPORTATION.OTHER,
          Constants.POPULATION.TRANSPORTATION.HOME,
  */
           // income
          Constants.POPULATION.INCOME.HOUSEHOLD.MEDIAN,
          Constants.POPULATION.INCOME.HOUSEHOLD.TOTAL_HOUSEHOLDS,
          Constants.POPULATION.INCOME.HOUSEHOLD._0_9999,
          Constants.POPULATION.INCOME.HOUSEHOLD._10000_14999,
          Constants.POPULATION.INCOME.HOUSEHOLD._15000_19999,
          Constants.POPULATION.INCOME.HOUSEHOLD._20000_24999,
          Constants.POPULATION.INCOME.HOUSEHOLD._25000_29999,
          Constants.POPULATION.INCOME.HOUSEHOLD._30000_34999,
          Constants.POPULATION.INCOME.HOUSEHOLD._35000_39999,
          Constants.POPULATION.INCOME.HOUSEHOLD._40000_44999,
          Constants.POPULATION.INCOME.HOUSEHOLD._45000_49999,
          Constants.POPULATION.INCOME.HOUSEHOLD._50000_59999,
          Constants.POPULATION.INCOME.HOUSEHOLD._60000_74999,
          Constants.POPULATION.INCOME.HOUSEHOLD._75000_99999,
          Constants.POPULATION.INCOME.HOUSEHOLD._100000_124999,
          Constants.POPULATION.INCOME.HOUSEHOLD._125000_149999,
          Constants.POPULATION.INCOME.HOUSEHOLD._150000_199999,
          Constants.POPULATION.INCOME.HOUSEHOLD._200000_MORE,
        ],          
          "statsKey" : KEY // required for > 500 calls per day
        }, 
        (err, json) => {
          if (!err) {
            resolve(filter.filterAllBlocks(json))
      resolve(json)
          } else {
            reject(err)
          }
        })
    })
  },

  getBlockAgeData : (state, county, tract, block_group) => {
    return new Promise((resolve, reject) => {
      census({
          "vintage" : 2017,             
          "geoHierarchy" : {            
              "state" : state,
              "county" : county,
              "tract" : tract,
              "block group": block_group
          },
          "sourcePath" : ["acs", "acs5"],        
          "values" : 
          [
            "NAME", 
          
          // age
          Constants.POPULATION.AGE.MEDIAN.TOTAL,
          Constants.POPULATION.GENDER.MALE.ZERO_FIVE,
          Constants.POPULATION.GENDER.MALE.FIVE_NINE,
          Constants.POPULATION.GENDER.MALE.TEN_FOURTEEN,
          Constants.POPULATION.GENDER.MALE.FIFTEEN_SEVENTEEN,
          Constants.POPULATION.GENDER.MALE.EIGHTEEN_NINETEEN,
          Constants.POPULATION.GENDER.MALE.TWENTY,
          Constants.POPULATION.GENDER.MALE.TWENTYONE,
          Constants.POPULATION.GENDER.MALE.TWENTYTWO_TWENTYFOUR,
          Constants.POPULATION.GENDER.MALE.TWENTYFIVE_TWENTYNINE,
          Constants.POPULATION.GENDER.MALE.THIRTY_THIRTYFOUR,
          Constants.POPULATION.GENDER.MALE.THIRTYFIVE_THIRTYNINE,
          Constants.POPULATION.GENDER.MALE.FORTY_FORTYFOUR,
          Constants.POPULATION.GENDER.MALE.FORTYFIVE_FORTYNINE,
          Constants.POPULATION.GENDER.MALE.FIFTY_FIFTYFOUR,
          Constants.POPULATION.GENDER.MALE.FIFTYFIVE_FIFTYNINE,
          Constants.POPULATION.GENDER.MALE.SIXTY_SIXTYONE,
          Constants.POPULATION.GENDER.MALE.SIXTYTWO_SIXTYFOUR,
          Constants.POPULATION.GENDER.MALE.SIXTYFIVE_SIXTYSIX,
          Constants.POPULATION.GENDER.MALE.SIXTYSEVEN_SIXTYNINE,
          Constants.POPULATION.GENDER.MALE.SEVENTY_SEVENTYFOUR,
          Constants.POPULATION.GENDER.MALE.SEVENTYFIVE_SEVENTYNINE,
          Constants.POPULATION.GENDER.MALE.EIGHTY_EIGHTYFOUR,
          Constants.POPULATION.GENDER.MALE.EIGHTYFIVE_UP,
  
          // must be calculated from totals given in age data not pop. total
          Constants.POPULATION.GENDER.FEMALE.ZERO_FIVE,
          Constants.POPULATION.GENDER.FEMALE.FIVE_NINE,
          Constants.POPULATION.GENDER.FEMALE.TEN_FOURTEEN,
          Constants.POPULATION.GENDER.FEMALE.FIFTEEN_SEVENTEEN,
          Constants.POPULATION.GENDER.FEMALE.EIGHTEEN_NINETEEN,
          Constants.POPULATION.GENDER.FEMALE.TWENTY,
          Constants.POPULATION.GENDER.FEMALE.TWENTYONE,
          Constants.POPULATION.GENDER.FEMALE.TWENTYTWO_TWENTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.TWENTYFIVE_TWENTYNINE,
          Constants.POPULATION.GENDER.FEMALE.THIRTY_THIRTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.THIRTYFIVE_THIRTYNINE,
          Constants.POPULATION.GENDER.FEMALE.FORTY_FORTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.FORTYFIVE_FORTYNINE,
          Constants.POPULATION.GENDER.FEMALE.FIFTY_FIFTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.FIFTYFIVE_FIFTYNINE,
          Constants.POPULATION.GENDER.FEMALE.SIXTY_SIXTYONE,
          Constants.POPULATION.GENDER.FEMALE.SIXTYTWO_SIXTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.SIXTYFIVE_SIXTYSIX,
          Constants.POPULATION.GENDER.FEMALE.SIXTYSEVEN_SIXTYNINE,
          Constants.POPULATION.GENDER.FEMALE.SEVENTY_SEVENTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.SEVENTYFIVE_SEVENTYNINE,
          Constants.POPULATION.GENDER.FEMALE.EIGHTY_EIGHTYFOUR,
          Constants.POPULATION.GENDER.FEMALE.EIGHTYFIVE_UP
        ],          
          
          "statsKey" : KEY // required for > 500 calls per day
        }, 
        (err, json) => {
          if (!err) {
       //     let geoid = state + county + tract + block_group
            resolve(filter.filterAge(json))
        resolve(json)
          } else {
            reject(err)
          }
        })
    })
  },


  getAllTracts : (state, county) => {
    return new Promise((resolve, reject) => {
      census({
        "vintage" : 2017,             
        "geoHierarchy" : {     
            "state" : state, 
            "county" : county,
            "tract" : '*'
        },
        "sourcePath" : ["acs", "acs5"],        
        "values" : [
          "NAME"
        ],
        "statsKey" : KEY 
      }, (err, json) => {
          if (!err) {
            resolve(json)
          } else {
            reject(err)
          }
      })
    })
  },

  getAllBlocks: (state, county, tract) => {
    return new Promise((resolve, reject) => {
      census({
        "vintage" : 2017,             
        "geoHierarchy" : {     
            "state" : state, 
            "county" : county,
            "tract" : tract,
            "block group": '*'
        },
        "sourcePath" : ["acs", "acs5"],        
        "values" : [
          "NAME"
        ],
        "statsKey" : KEY 
      }, (err, json) => {
          if (!err) {
            resolve(json)
          } else {
            reject(err)
          }
      })
    })
  },

  getZip: (lat, lng) => {
    return new Promise((res, rej) => { 
      census({
        vintage: 2019, 
        geoHierarchy: {
          "zip code tabulation area": {
            lat: lat,
            lng: lng
          }
        }
      },
      (err, data) => {
        if (err) {
          rej({ error : 'Geocoding error', err})
        } else {
          let zip = data.geoHierarchy["zip code tabulation area"]
          res([
            {
              NAME: 'zip',
              ['zip-code-tabulation-area'] : zip
            }
          ]);
        }
    })
    })
},

getZipHierarchy: async (lat, lng) => {
  const { getZip, getCounty } = methods;
  let error;
  try {
    return await getZip(lat, lng)
  } catch (err) {
    return { error: err}
  }

  let promises = await Promise.all([getCounty(lat, lng), getZip(lat, lng)]).catch(err => error = err)

  if (error) return error;

  let county = promises[0][0]
  let zip = promises[1][0]

  return [{
      ...county, 
      ["zip-code-tabulation-area"] : zip["zip-code-tabulation-area"]
    }
  ]
}

}
module.exports = methods
