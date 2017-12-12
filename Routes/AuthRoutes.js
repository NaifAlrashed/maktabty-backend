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
	console.log(req.user)
	const token = await authentication.signin(req.user)
	res.json({ token })
})

module.exports = router