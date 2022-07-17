const fetch = require('node-fetch')
const API = 'https://api.census.gov/data/2017/acs/acs5'
const KEY = '28a04efd887ab5cf335f99aabcde1978452de2cf'

const methods = {

   getAllCounties : (state) => {
        let URL = API 
        + '?get=NAME' 
        + '&in=state:' + state + '' 
        + '&for=county:*' 
        + '&key=' + KEY

        return fetch(URL,
            {
                methods: 'GET'
            })
            .then(res => {
                return res.json()
            })
            .catch(err => console.error('Census API error:', err))
    },

    getAllTracts : (state, county) => {
        let URL = API 
            + '?get=NAME' 
            + '&in=state:' + state + '%20' 
            + 'county:' + county 
            + '&for=tract:*' 
            + '&key=' + KEY

        return fetch(URL,
            {
                methods: 'GET'
            })
            .then(res => {
                return res.json()
            })
            .catch(err => console.error('Census API error:', err))
    },

    getTractSocialData : (state, county, tract) => {
        let URL = API + '?get=NAME,B01003_001E,B01002_001E,B01001_002E,B01001_026E,B01001A_001E,B01001B_001E,B01001D_001E,B01001I_001E,B01001G_001E,B05012_001E,B05014_001E,B06007_002E,B06007_003E,B06007_006E,B12001_001E,B12001_003E,B12001_010E,B12001_009E,B24011_001E,B08006_017E,B06009_002E,B06009_003E,B06009_004E,B06009_005E,B06009_006E,B08006_002E,B08006_008E,B08006_015E,B08006_016E'
            + '&in=state:' + state + '%20' 
            + 'county:' + county
            + '&for=tract:' + tract
            + '&key=' + KEY

        return fetch(URL,
            {
                methods: 'GET'
            })
            .then(res => {
                return res.json()
            })
            .catch(err => console.error('Census API error', err))
    },

    getTractIncomeData : (state, county, tract) => {
        let URL = API + '?get=NAME,B19013_001E,B16009_002E,B19001_002E,B19001_003E,B19001_016E,B19001_005E,B19001_006E,B19001_007E,B19001_008E,B19001_009E,B19001_010E,B19001_011E,B19001_012E,B19001_013E,B19001_014E,B19001_015E,B19001_016E,B19001_016E,B19001_017E' 
            + '&in=state:' + state + '%20' 
            + 'county:' + county
            + '&for=tract:' + tract
            + '&key=' + KEY

        return fetch(URL,
            {
                methods: 'GET'
            })
            .then(res => {
                return res.json()
            })
            .catch(err => console.error('Census API error', err))
    },

   getTractAgeData : (state, county, tract) => {
        let URL = API + '?get=NAME,B01002_001E,B01001_002E,B01001_003E,B01001_005E,B01001_006E,B01001_007E,B01001_010E,B01001_011E,B01001_012E,B01001_014E,B01001_015E,B01001_016E,B01001_018E,B01001_019E,B01001_020E,B01001_021E,B01001_022E,B01001_023E,B01001_024E,B01001_025E,B01001_026E,B01001_027E,B01001_029E,B01001_030E,B01001_031E,B01001_034E,B01001_035E,B01001_036E,B01001_038E,B01001_015E,B01001_040E,B01001_042E,B01001_043E,B01001_044E,B01001_045E,B01001_046E,B01001_047E,B01001_048E,B01001_049E' 
        + '&in=state:' + state + '%20' 
        + 'county:' + county
        + '&for=tract:' + tract
        + '&key=' + KEY

        return fetch(URL,
            {
                methods: 'GET'
            })
            .then(res => {
                return res.json()
            })
            .catch(err => console.error('Census API error', err))
    },

    getTractBasicData : (state, county, tract) => {
        let URL = API + '?get=NAME,B01003_001E,B01002_001E,B01001_002E,B01001_026E,B19013_001E'
        + '&in=state:' + state + '%20' 
        + 'county:' + county
        + '&for=tract:' + tract
        + '&key=' + KEY

        return fetch(URL,
            {
                methods: 'GET'
            })
            .then(res => {
                return res.json()
            })
            .catch(err => console.error('Census API error', err))
    },

    getTractAllData : (state, county, tract) => {

        let URL = API + '?get=NAME,B01003_001E,B01002_001E,B01001_002E,B01001_026E,B01001A_001E,B01001B_001E,B01001D_001E,B01001I_001E,B01001G_001E,B05012_001E,B05014_001E,B06007_002E,B06007_003E,B06007_006E,B12001_001E,B12001_003E,B12001_010E,B12001_009E,B24011_001E,B08006_017E,B06009_002E,B06009_003E,B06009_004E,B06009_005E,B06009_006E,B08006_002E,B08006_008E,B08006_015E,B08006_016E,'
        + 'B19013_001E,B16009_002E,B19001_002E,B19001_003E,B19001_016E,B19001_005E,B19001_006E,B19001_007E,B19001_008E,B19001_009E,B19001_010E,B19001_011E,B19001_012E,B19001_013E,B19001_014E,B19001_015E,B19001_016E,B19001_016E,B19001_017E'
        + '&in=state:' + state + '%20' 
        + 'county:' + county
        + '&for=tract:' + tract
        + '&key=' + KEY

        return fetch(URL,
            {
                methods: 'GET'
            })
            .then(res => {
                console.log(res.status)
                return res.json()
            })
            .catch(err => console.error('Census API error', err))
    },

    getAllBlockData : (state, county, tract, block) => {
        let URL = API + ' ?get=B01003_001E,B01002_001E,B01001_002E,B01001_026E,B01001H_001E,B01001B_001E,B01001D_001E,B01001I_001E,B01001C_001E,B01001E_001E,B01001F_001E,B05012_002E,B05012_003E,B12001_004E,B12001_003E,B12001_010E,B12001_013E,B12001_012E,B12001_019E,B24011_001E,B08006_017E,B06009_002E,B06009_003E,B06009_004E,B06009_005E,B06009_006E,B08006_002E,B08006_008E,B08006_015E,B08006_016E,B08006_017E,B19013_001E,B19001_001E,B19001_002E,B19001_003E,B19001_004E,B19001_005E,B19001_006E,B19001_007E,B19001_008E,B19001_009E,B19001_010E,B19001_011E,B19001_012E,B19001_013E,B19001_014E,B19001_015E,B19001_016E,B19001_017E'
        + '&in=state:' + state + '%20' 
        + 'county:' + county + '%20' 
        + 'tract:' + tract
        + '&for=block%20group:'+block
        + '&key=' + KEY
        //&in=state:36%20county:061%20tract:001001&for=block%20group:1&key=28a04efd887ab5cf335f99aabcde1978452de2cf
        //&in=state:36%20county:061%20tract:010300&for=block%20group:1&key=28a04efd887ab5cf335f99aabcde1978452de2cf

        return fetch(URL,
            {
                methods: 'GET'
            })
            .then(res => {
                return res
            })
            .catch(err => console.error('Census API error', err))
    },
}

module.exports = methods;