const mysql = require('mysql');

const connection = mysql.createPool({
    host     : 'landmark-zip-database-1.csuzeu6cbjsh.us-east-1.rds.amazonaws.com',
    port: '3306',
    user     : 'admin',
    password : '#LincCont98',
    database: 'ZipCodes'
});



const methods = {

    getNearbyZips : function() {
        return new Promise((res, rej) => {
            connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
                if (error) {
                    rej(error)
                } else {
                    res({ success: true })
                }        
        
              });
        });
    },

    getNearbyZips: function(zip, lat, lng, radius, callback) {
        const distance = `SQRT(POWER((${lat}-latitude)*110.7,2)+POWER((${lng}-longitude)*75.6,2))`;
        const sql = "SELECT `city`, `longitude`, `latitude`, `zipcode`, "+distance+" AS distance FROM us WHERE zipcode="+zip+" OR "+distance+" <= "+radius+" ORDER BY distance ASC"
        console.log(sql)
        connection.query(sql, (error, results, fields) => {
            if (error) {
                throw (error)
            } else {
                callback(results);
            }        
        })
    }
};

module.exports = methods;
 

 
