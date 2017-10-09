const router = require('express').Router()
const User = require('../models/user')
const passport = require('passport')

router
    .post('/signin', passport.authenticate('local', { session: false }), async(req, res) => {
        try {
            var user = req.user
            const token = await user.generateAndSaveAuthTokenWithAccess('auth')
            res.json({token})
        } catch (err) {
            res.json({err: err.message})
        }
    })
    .post('/signup', async(req, res) => {
        try {
            const user = await User.findOne({email: req.body.email})
            if (user) {
                return res.status(401).json({message: "this user already exists"})
            }
            newUser = new User()
            newUser.email = req.body.email
            newUser.password = req.body.password
            const token = await newUser.generateAndSaveAuthTokenWithAccess('auth')
            res.json({
                message:"success!",
                token
            })
        } catch (err) {
            res.json({err: err.message})
        }
    })

module.exports = router