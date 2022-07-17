const fs = require('fs');
const AWS = require('aws-sdk');
const path = require('path')
const s3 = new AWS.S3({
  accessKeyId: "AKIAJEQXFNOTPWQ6GATQ", //process.env.AWS_ACCESS_KEY,
  secretAccessKey: "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" //process.env.AWS_SECRET_ACCESS_KEY
});
/**
 * AWS_ACCESS_KEY="AKIAJEQXFNOTPWQ6GATQ"
AWS_SECRET_ACCESS_KEY="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"
 */



const methods  = {

     uploadFile : function(fileName) {

         return new Promise((res, rej) => {
            fs.readFile(path.join(__dirname, fileName), (err, data) => {
                if (err) throw err;
    
                const params = {
                    Bucket: 'landmarkbucket2',
                    Key: 'newFolder/test1.txt',
                    Body: JSON.stringify(data, null, 2)
                };
    
                s3.upload(params, (s3Err, data) => {
                    if (s3Err) {
                        rej(s3Err)
                    //    throw s3Err
                    }
                    else {
                        console.log(`File uploaded at ${data.Location}`)
                        res({res : `File uploaded at ${data.Location}`})
                    }
                    
                })
            })
         })
        
    }
}

module.exports = methods;