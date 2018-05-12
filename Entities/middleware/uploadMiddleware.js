const multer = require('multer')
const uuid = require('uuid')

// set storage engine for multer
const storage = multer.diskStorage({
    destination: './public',
    filename: function(req, file, cb) {
        const extension = file.mimetype.split('/')[1]
        const newFileName = `${uuid.v4()}.${extension}`
        cb(null, newFileName)
    }
})

const multerOptions = {
    storage,
    fileFilter(req, file, cb) {
        const isPhoto = file.mimetype.startsWith('image/')
        if (isPhoto) {
            cb(null, true)
        } else {
            cb({msg: 'that file is not an image'}, false)
        }
    }
}

module.exports = multer(multerOptions)

