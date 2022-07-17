const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const fileName = 'test.txt'

const methods  = {

     uploadFile : function() {
        fs.readFile(fileName, (err, data) => {
            if (err) throw err;

            const params = {
                Bucket: 'landmarkbucket2',
                Key: 'test.txt',
                Body: JSON.stringify(data, null, 2)
            };

            s3.upload(params, (s3Err, data) => {
                if (s3Err) throw s3Err
                console.log(`File uploaded at ${data.Location}`)
            })
        })
    }
}

module.exports = methods;