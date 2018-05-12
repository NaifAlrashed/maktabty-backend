const router = require('express').Router()
const search = require('./searchMiddleware')

router.get('/search/book/:bookName/:pageNumber', search.book)

module.exports = router