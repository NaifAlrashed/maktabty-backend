const router = require('express').Router()
const responseTypes = require('../controllers/responseTypes')
const authentication = require('../controllers/authentication')
const passport = require('passport')
const sendMail = require('../controllers/sendMail')

router.post('/signup', async (req, res) => {	
	const user = {
		email: req.body.email,
		password: req.body.password,
		contactInfo: req.body.contactInfo
	}

	const userObj = await authentication.signup(user, 'signup')
	console.log('userObj', userObj)
	if (userObj.type === responseTypes.SIGNUP_SUCCESS) {
		const response = await sendMail({
			user,
			templateOptions: {
				email: user.email,
				verificationCode: userObj.user.verificationCode
			},
			subject: "authorize your account",
			fileName: 'verifyEmail'
		})
	}
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

router.post('/verify', passport.authenticate('jwt', { session: false }), async (req, res) => {
	if (req.body.verificationCode !== undefined) {
		const result = await authentication.verify(req.user, req.body.verificationCode)
		if (result === false) {
			return res.status(400).json({ reason: 'the user is already verified or code is not correct'})
		} else {
			return res.status(result.status).json({is_verified: true})
		}
	}
	return res.status(400).json({ reason: "missing paramters"})
})

module.exports = router