const router = require('express').Router()
const passport = require('passport')
const postABook = require('../middleware/saveTextBookMiddleware')
const upload = require('../middleware/uploadMiddleware')

router.post('/books/text-book/post', passport.authenticate('jwt', { session: false }), postABook.saveUniversityIfNotExist,
	postABook.saveDepartmentIfNotExist,	postABook.saveCourseIfNotExist, postABook.saveBook)

router.post('/books/upload', upload.array('bookPhotos', 4), postABook.savePhotoPathToBook)

module.exports = router