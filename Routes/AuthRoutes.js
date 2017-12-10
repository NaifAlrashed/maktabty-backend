const router = require('express').Router()
const responseTypes = require('../controllers/responseTypes')
const authentication = require('../controllers/authentication')

router.post('/signup', async (req, res) => {	
	const user = {
		email: req.body.email,
		password: req.body.password,
		contactInfo: req.body.contactInfo
	}

	const userObj = await authentication.signup(user, 'signUp')
	res.status(userObj.status).json(userObj.response())
})

module.exports = router