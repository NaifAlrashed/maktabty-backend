const router = require('express').Router()
const User = require('../models/user')
const passport = require('passport')

module.exports = {
    signup: async (user, access) => {
        const newUser = new User(user)        
        try {
            await newUser.generateAndSaveAuthTokenWithAccess(access)
            return {
                user: newUser,
                doesExist: false
            }
        } catch (err) {
            if (err.code === 11000) {
                return {
                    user: null,
                    isDuplicate: true
                }
            }
            throw err
        }
    }
}