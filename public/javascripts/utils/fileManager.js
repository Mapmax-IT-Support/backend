const fs = require('fs');
const sharp = require('sharp');
const path = require('path')

const methods = {

    deleteFile: function(file) {
        fs.unlink(file.path, (err) => {
            if (err) throw err;

            console.log("File deleted", file.path);
        })
    },

    deleteUploads: function() {
        const directory = 'uploads'
        fs.readdir(directory, (err, files) => {
            if (err) throw err;
          
            for (const file of files) {
              fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
              });
            }
        })
    },

    compressImage: async function(path, width, height) {
        // compress preview image 
        const compressedImageBuffer = await sharp(path)
        .resize({ 
            width, 
            height, 
            fit: 'cover'
        })
        .jpeg({ quality: 100 })
        .toBuffer();
 
        return compressedImageBuffer;
    },



};

module.exports = methods;