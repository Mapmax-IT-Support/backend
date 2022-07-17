const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const methods  = {

     uploadFile : function() {
        fs.readFile(fileName, (err, data) => {
            if (err) throw err;

            const params = {
                Bucket: 'landmarkbucket2',
                Key: 'contacts.csv',
                Body: JSON.stringify(data, null, 2)
            }
        })
    }
}

module.exports = methods;