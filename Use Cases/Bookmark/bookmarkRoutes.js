const router = require('express').Router()
const passport = require('passport')
const bookmarkMiddleware = require('./bookmarkMiddleware')

router.post('/bookmark', passport.authenticate('jwt', { session: false }), bookmarkMiddleware.bookmark)
router.get('/bookmark', passport.authenticate('jwt', { session: false }), bookmarkMiddleware.getBookmarks)

module.exports = router