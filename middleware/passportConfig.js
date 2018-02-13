const User = require('../models/user')
const passportLocalStrategy = require('passport-local').Strategy
const passportJWTStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const bcryptjs = require('bcryptjs')

module.exports = (passport) => {
    passport.use(new passportJWTStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
        ignoreExpiration: true,
        passReqToCallback: true
    }, async (req, payload, done) => {
        req.tokenId = payload.tokenId
        try {
            const user = await User.findById(payload.sub)
            if (!user) {
                return done(null, false)
            }
            const tokenIndex = user.findTokenIndex(payload.tokenId)
            if (tokenIndex === -1) {
                return done(null, false)
            }
            done(null, user)
        } catch(err) {
            done(err, false)
        }
    }))

    passport.use(new passportLocalStrategy({ usernameField: 'email'}, async (email, password, done) => {
        try {
            const user = await User.findOne({email})
            if (!user) {
                return done(null, false)
            }
            //check password
            const isSamePassword = await bcryptjs.compareSync(password.toString(), user.password)
            if (!isSamePassword) {
                return done(null, false)
            }
            //return correct user
            return done(null, user)
        } catch (err) {
            done(err, false)
        }

    }))
}