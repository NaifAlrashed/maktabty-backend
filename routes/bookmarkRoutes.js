const router = require('express').Router()
const passport = require('passport')
const bookmarkMiddleware = require('../middleware/bookmarkMiddleware')

router.post('/bookmark', passport.authenticate('jwt', { session: false }), bookmarkMiddleware.bookmark)

module.exports = router