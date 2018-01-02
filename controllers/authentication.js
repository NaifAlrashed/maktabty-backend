const router = require('express').Router()
const User = require('../models/user')
const passport = require('passport')
const resourceFactory = require('./resourceFactory')
const responseTypes = require('./responseTypes')
const mongooseError = require('./mongooseErrors')
const save = require('./save')

module.exports = {
    signup: async (user, access) => {
        const newUser = new User(user)
        try {
            const token = await newUser.generateAndSaveAuthTokenWithAccess(access)
            return resourceFactory({ newUser, token }, responseTypes.SIGNUP_SUCCESS, null)
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
    },

    verify: async (user, code) => {
        if (!user.isVerified && code == user.verificationCode) {
            user.isVerified = true
            await user.save()
            return resourceFactory(user, responseTypes.RESOURCE_UPDATED, null)
        } else {
            return false
        }
    },

    generateNewPassword: async (user) => await user.generateSaveAndReturnUserPassword(),
    
    updatePassword: async (user, newPassword) => {
        user.password = newPassword
        return await save(user)
    }
}