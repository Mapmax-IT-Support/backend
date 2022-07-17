const fetch = require('node-fetch')
const Constants = require("../constants")
const filter = require("../filters/citySDKFilter")

const getValues = category => {
    switch (category) {
        case "all": return allValues.toString();
        case "age": return ageValues.toString();
        default: return allValues.toString();
    }
}

const getFilter = category => {
    switch (category) {
        case "all": return filter.filterAll;
        case "age": return filter.filterAge;
        default: return filter.filterAll;
    }
}

const methods = {
    getZipData: async (state, zip, category) => {

        let res = await fetch(Constants.CENSUS_API
            + '&for=zip%20code%20tabulation%20area:' + zip
            + '&in=state:' + state
            + '&get=' + getValues(category)
        )
            .then(res => {
                return res.json()
            })
            .catch(err => console.error('Census API error:', err))

        // if success, map keys to values 
        if (res.length === 2) {
            let keys = res[0]
            let vals = res[1]
            let keyPairs = {}
            keys.forEach((key, i) => {
                keyPairs = { ...keyPairs, [key]: Number(vals[i]) }
            });
            let filter = getFilter(category)
            return filter([keyPairs]); // array is just to match original citySDK for now
        } else {
            return { error: 'Census API error, could not map requested values' }
        }
    }
}

const allValues = [
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
]


const ageValues = [
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
]

module.exports = methods