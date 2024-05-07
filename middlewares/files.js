const multer = require('multer');
const path = require('path');
const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, '../images/collections'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-Collection' + file.originalname)
    }
})
const fileUpload = multer({
    storage: diskstorage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).single('imagen');

module.exports = {fileUpload};