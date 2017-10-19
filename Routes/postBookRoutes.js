const router = require('express').Router()
const postABook = require('../controllers/SaveTextBook')

router.post('/books', postABook.saveBook)

module.exports = router