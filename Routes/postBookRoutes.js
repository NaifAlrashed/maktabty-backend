const router = require('express').Router()
const books = require('../controllers/books')

router.post('/books', books.saveBook)

module.exports = router