const User = require('../../models/user')
const passportLocalStrategy = require('passport-local').Strategy
const passportJWTStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const bcrypt = require('bcryptjs')

module.exports = (passport) => {
    passport.use(new passportJWTStrategy({
        jwtFromRequest: ExtractJwt.fromHeader('Authorization'),
        secretOrKey: process.env.JWT_SECRET
    }, async (payload, done) => {
        try {
            const user = User.findById(payload.sub)
            if (!user) {
                return done(null, false)
            }
            done(null, true)
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
            const isSamePassword = await bcrypt.compareSync(password, user.password)
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