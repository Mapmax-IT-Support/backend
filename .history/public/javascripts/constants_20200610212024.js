const Constants = {
    ORIGIN:  // 'https://rfm7991.github.io',
   'http://localhost:3000',
    MONGO_URL: 'mongodb+srv://RFM7991:%23LincCont98@cluster0-ypmdr.gcp.mongodb.net/test?retryWrites=true&w=majority',
    GOOGLE_KEY: 'AIzaSyCC8oXxa6U55nY-CBmCgQ8PDdYexcpGg3U',
    PLACES_API :'https://maps.googleapis.com/maps/api/place/',

    DB : {
        GSON : {
            TRACT : "tract_gson",
            ZIP : "zip_gson"
        },
        STATS : {
            TRACT : "tract_stats"
        }
    },

    POPULATION : {
        TOTAL : "B01003_001E",
        GENDER : {
            MALE : {
                TOTAL : "B01001_002E",
                ZERO_FIVE : "B01001_003E", // <=5
                FIVE_NINE : "B01001_004E", // 5-9
                TEN_FOURTEEN : "B01001_005E", // 10-14
                FIFTEEN_SEVENTEEN : "B01001_006E", // 15-17
                EIGHTEEN_NINETEEN : "B01001_007E", // 18-19
                TWENTY : "B01001_008E", // 20
                TWENTYONE : "B01001_009E", // 21
                TWENTYTWO_TWENTYFOUR : "B01001_010E", // 22-24
                TWENTYFIVE_TWENTYNINE : "B01001_011E", // 25-29
                THIRTY_THIRTYFOUR : "B01001_012E", // 30-34
                THIRTYFIVE_THIRTYNINE : "B01001_013E", // 35-39
                FORTY_FORTYFOUR : "B01001_014E", // 40-44
                FORTYFIVE_FORTYNINE : "B01001_015E", // 45-49
                FIFTY_FIFTYFOUR : "B01001_016E", // 50-54
                FIFTYFIVE_FIFTYNINE : "B01001_017E", // 55-59
                SIXTY_SIXTYONE : "B01001_018E", // 60-61
                SIXTYTWO_SIXTYFOUR : "B01001_019E", // 62-64
                SIXTYFIVE_SIXTYSIX : "B01001_020E", // 65-66
                SIXTYSEVEN_SIXTYNINE : "B01001_021E", // 67-69
                SEVENTY_SEVENTYFOUR : "B01001_022E", // 70-74
                SEVENTYFIVE_SEVENTYNINE : "B01001_023E", // 75-79
                EIGHTY_EIGHTYFOUR : "B01001_024E",  // 80-84
                EIGHTYFIVE_UP: "B01001_025E" // >=85
            },
            FEMALE : {
                TOTAL : "B01001_026E",
                ZERO_FIVE : "B01001_027E", // <=5
                FIVE_NINE : "B01001_028E", // 5-9
                TEN_FOURTEEN : "B01001_029E", // 10-14
                FIFTEEN_SEVENTEEN : "B01001_030E", // 15-17
                EIGHTEEN_NINETEEN : "B01001_031E", // 18-19
                TWENTY : "B01001_032E", // 20
                TWENTYONE : "B01001_033E", // 21
                TWENTYTWO_TWENTYFOUR : "B01001_034E", // 22-24
                TWENTYFIVE_TWENTYNINE : "B01001_035E", // 25-29
                THIRTY_THIRTYFOUR : "B01001_036E", // 30-34
                THIRTYFIVE_THIRTYNINE : "B01001_037E", // 35-39
                FORTY_FORTYFOUR : "B01001_038E", // 40-44
                FORTYFIVE_FORTYNINE : "B01001_039E", // 45-49
                FIFTY_FIFTYFOUR : "B01001_040E", // 50-54
                FIFTYFIVE_FIFTYNINE : "B01001_041E", // 55-59
                SIXTY_SIXTYONE : "B01001_042E", // 60-61
                SIXTYTWO_SIXTYFOUR : "B01001_043E", // 62-64
                SIXTYFIVE_SIXTYSIX : "B01001_044E", // 65-66
                SIXTYSEVEN_SIXTYNINE : "B01001_045E", // 67-69
                SEVENTY_SEVENTYFOUR : "B01001_046E", // 70-74
                SEVENTYFIVE_SEVENTYNINE : "B01001_047E", // 75-79
                EIGHTY_EIGHTYFOUR : "B01001_048E",  // 80-84
                EIGHTYFIVE_UP: "B01001_049E" // >=85
            }
        },
        RACE : {
            WHITE : {
                TOTAL : "B01001A_001E"
            },
            AFRICAN_AMERICAN : {
                TOTAL : "B01001B_001E"
            },
            NATIVE_AMERICAN : {
                TOTAL : "B01001C_001E"
            },
            ASIAN : {
                TOTAL : "B01001D_001E"
            },
            PACIFIC_ISLANDER : {
                TOTAL : "B01001E_001E"
            },
            OTHER : {
                TOTAL : "B01001F_001E"
            },
            TWO_OR_MORE : {
                TOTAL : "B01001G_001E"
            },
            WHITE_NOT_LATINO : {
                TOTAL : "B01001H_001E"
            },
            HISPANIC_OR_LATINO : {
                TOTAL : "B01001I_001E"
            },
         },
         AGE : {
             MEDIAN : {
                TOTAL : "B01002_001E",
                MALE : "B01002_002E",
                FEMALE : "B01002_003E",
                WHITE : "B01002A_001E",
                AFRICAN_AMERICAN : "B01002B_001E",
                NATIVE_AMERICAN : "B01002C_001E",
                ASIAN : "B01002D_001E",
                PACIFIC_ISLANDER : "B01002E_001E",
                OTHER : "B01002F_001E",
                TWO_OR_MORE : "B01002G_001E",
                WHITE_NOT_LATINO : "B01002H_001E"
            }
         },

         NATIVITY : {
             US : {
                 TOTAL : "B05012_002E"
             },
             FOREIGN : {
                TOTAL : "B05012_003E"
             }
         },
         LANGUAGE : {
            ENGLISH : "B06007_002E",
            SPANISH : "B06007_003E",
            OTHER : "B06007_006E"
        },
         EDUCATION : {
             LESS_THAN_HIGHSCHOOL: "B06009_002E",
             HIGHSCHOOL_GRADUATE: "B06009_003E",
             SOME_COLLEGE_OR_ASSOCIATES: "B06009_004E",
             BACHELORS: "B06009_005E",
             GRADUATE: "B06009_006E",
         },
         INCOME: {
             INDIVIDUAL : {
                MEDIAN: "B06011_001E",
                POVERTY: "B16009_002E",
                ZERO_9999 : "B06010_004E",
                TEN_14999 : "B06010_005E",
                FIFTEEN_24999 : "B06010_006E",
                TWENTYFIVE_34999: "B06010_007E",
                THIRTYFIVE_49999: "B06010_008E",
                FIFTY_64999: "B06010_009E",
                SIXTYFIVE_74999: "B06010_010E",
                SEVENTYFIVE_UP: "B06010_011E"
             },
             HOUSEHOLD : {
                 TOTAL_HOUSEHOLDS : "B19001_001E",
                 MEDIAN: "B19013_001E",
                _0_9999 : "B19001_002E",
                _10000_14999 : "B19001_003E",
                _15000_19999 : "B19001_004E",
                _20000_24999: "B19001_005E",
                _25000_29999: "B19001_006E",
                _30000_34999: "B19001_007E",
                _35000_39999: "B19001_008E",
                _40000_44999: "B19001_009E",
                _45000_49999: "B19001_010E",
                _50000_59999: "B19001_011E",
                _60000_74999: "B19001_012E",
                _75000_99999: "B19001_013E",
                _100000_124999: "B19001_014E",
                _125000_149999: "B19001_015E",
                _150000_199999: "B19001_016E",
                _200000_MORE: "B19001_017E",
             }
         },
         TRANSPORTATION: {
             DRIVE: "B08006_002E",
             PUBLIC_TRANSPORTATION: "B08006_008E",
             BICYCLE: "B08006_014E",
             WALK: "B08006_015E",
             OTHER: "B08006_016E",
             HOME: "B08006_017E"
             
         },
         WORK: { // TO-DO
            EMPLOYED: "B24011_001E",
            WORK_FROM_HOME: "B08006_017E",
            STUDENTS: "B08006_017E"

         },
         HOUSEHOLD : {
             TOTAL: "B11001_001E",
             FAMILY: "B11001_002E",
             MARRIED_FAMILY: "B11001_003E",
             NON_FAMILY: "B11001_007E"
         },
         RELATIONSHIP: {
             MALE : {
                MARRIED: "B12001_004E",
                NEVER_MARRIED: "B12001_003E",
                DIVORCED: "B12001_010E",
             },
             FEMALE : {
                MARRIED: "B12001_013E",
                NEVER_MARRIED: "B12001_012E",
                DIVORCED: "B12001_019E",
             }
            
         }
    }
}

module.exports = Constants