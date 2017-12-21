const router = require('express').Router()
const User = require('../models/user')
const passport = require('passport')
const resourceFactory = require('./resourceFactory')
const responseTypes = require('./responseTypes')
const mongooseError = require('./mongooseErrors')

module.exports = {
    signup: async (user, access) => {
        const newUser = new User(user)
        try {
            const token = await newUser.generateAndSaveAuthTokenWithAccess(access)
            return resourceFactory(token, responseTypes.SIGNUP_SUCCESS, null)
        } catch (err) {
            if (mongooseError.isduplicationError(err)) {                
                return resourceFactory(newUser, responseTypes.DUPLICATION_ERROR, err)
            } else if (mongooseError.isValidationError(err)) {
                return resourceFactory(newUser, responseTypes.VALIDATION_ERROR, err)
            } else {
                throw err
            }
        }
    },

    signin: async (user) => await user.generateAndSaveAuthTokenWithAccess('login'),

    logout: async (user, tokenToBeDeletedId) => {
        const index = user.findTokenIndex(tokenToBeDeletedId)
        if(index !== -1) {
            user.tokens.splice(index, 1)
            await user.save()
            return tokenToBeDeletedId
        }        
        return false
    }
}