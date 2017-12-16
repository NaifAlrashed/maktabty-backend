const router = require('express').Router()
const responseTypes = require('../controllers/responseTypes')
const authentication = require('../controllers/authentication')
const passport = require('passport')

router.post('/signup', async (req, res) => {	
	const user = {
		email: req.body.email,
		password: req.body.password,
		contactInfo: req.body.contactInfo
	}

	const userObj = await authentication.signup(user, 'signUp')
	res.status(userObj.status).json(userObj.response())
})

router.post('/login', passport.authenticate('local', { session: false }), async (req, res) => {
	const token = await authentication.signin(req.user)
	res.json({ token })
})

router.post('/logout', passport.authenticate('jwt', { session: false}), async (req, res) => {
	const token = authentication.logout(req.user, req.tokenId)
	if (!token) {
		throw Error('something went wrong with auth')
	}
	return res.end()
})

module.exports = router