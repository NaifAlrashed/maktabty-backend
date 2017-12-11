const router = require('express').Router()
const passport = require('passport')
const postABook = require('../middleware/saveTextBookMiddleware')

router.post('/books/text-book/post', passport.authenticate('jwt', { session: false }), postABook.saveUniversityIfNotExist,
	postABook.saveDepartmentIfNotExist,	postABook.saveCourseIfNotExist, postABook.saveBook)

module.exports = router