const express = require("express")
const User = require('../models/user')
const router = express.Router()


router
    .post("/users", async (req, res) => {
    	try {
    		var user = new User()
	    	user.email = req.body.email
	    	user.password = req.body.password
			let token = await user.generateAndSaveAuthTokenWithAccess('auth')
			console.log(token)
            res.json({ token })
    	} catch(err) {
    		res.json({ errorMessage: err})
    	}
    })
    .get("/users", async (req, res) => {
        try {
        	const users = await User.find()
        	res.json(users)
        } catch(err) {
        	res.json({err: err})
        }
    })

module.exports = router