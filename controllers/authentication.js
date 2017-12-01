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
            await newUser.generateAndSaveAuthTokenWithAccess(access)
            return resourceFactory(newUser, responseTypes.RESOURCE_CREATED, null)
        } catch (err) {
            if (mongooseError.isduplicationError(err)) {
                return resourceFactory(newUser, responseTypes.DUPLICATION_ERROR, err)
            } else if (mongooseError.isValidationError(err)) {
                return resourceFactory(newUser, responseTypes.VALIDATION_ERROR, err)
            } else {
                throw err
            }
        }
    }
}