const router = require('express').Router()
const postABook = require('../controllers/saveTextBook')

router.post('/books', postABook.saveBook)

module.exports = router