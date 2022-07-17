const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: "AKIAS3E6IYU2XM377XXX",//process.env.LANDMARK_AWS_ACCESS_KEY,
  secretAccessKey: "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" //process.env.LANDMARK_AWS_SECRET_ACCESS_KEY
});


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
    },


    
    uploadFileStream : function(stream, bucket, directory) {

        return new Promise((res, rej) => {
           const params = {
               Bucket: bucket,
               Key: directory,
               Body: stream
           };

           s3.upload(params, (s3Err, data) => {
               if (s3Err) {
                   console.log("ERROR", s3Err)
                   rej(s3Err)
               //    throw s3Err
               }
               else {
                   console.log(`File uploaded at ${data.Location}`)
                   res({success: true, src : data.Location})
               }
           })
        })
   }, 

    downloadFile : function (bucket, key) {
        return new Promise((res, rej) => {
    
            const params = {
                Bucket: bucket,
                Key: key
            };

            s3.getObject(params, (s3Err, data) => {
                if (s3Err) {
                    rej(s3Err)
                    throw new Error(s3Err)
                }
                else {
                    console.log('file_downloaded_successfully')
                    res(data.Body)
                }
            })
         })
    }
}

module.exports = methods;