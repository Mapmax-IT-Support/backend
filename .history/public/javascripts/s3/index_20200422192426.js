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
// path.join(__dirname, fileName)
     uploadFile : function(file, bucket, directory) {

         return new Promise((res, rej) => {
    
            const params = {
                Bucket: bucket,
                Key: directory,
                Body: fs.createReadStream(file.path)
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
        
    }
}

module.exports = methods;