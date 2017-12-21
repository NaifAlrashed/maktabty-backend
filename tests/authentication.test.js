process.env.NODE_ENV = 'test'
require('../config/config')
const chai = require('chai')
var assert = chai.assert
const chaiThings = require('chai-things')
const mongoose = require('mongoose')
const someUser = require('./userStub.json')
const authentication = require('../controllers/authentication')
const User = require('../models/user')
const responseTypes = require('../controllers/responseTypes')

mongoose.connect(process.env.MONGO_URI, { useMongoClient: true, promiseLibrary: global.Promise })
mongoose.Promise = global.Promise

describe('authentication', () => {
	beforeEach(async () => {
		await User.remove()
	})	
	afterEach(async () => {
		await User.remove()
	})

	describe('signup', () => {
		it('should return an authenticated user with token', async () => {
			const result = await authentication.signup(someUser, 'signup')
			assert(result.type === responseTypes.SIGNUP_SUCCESS, "the user is duplicate")
			assert(result.token, "user is null")
		})

		it('should not return an authenticated user', async () => {
			await authentication.signup(someUser, 'signup')
			const result = await authentication.signup(someUser, 'signup')
			assert(result.type === responseTypes.DUPLICATION_ERROR)
		})
	})

	describe('logout', () => {
		it('should logout', async () => {			
			await authentication.signup(someUser, 'signup')
			const user = await User.findOne({ email: someUser.email })

			for(var i = 0; i < user.tokens.length; i++) {
				const tokenId = user.tokens[i].tokenId
				numOfTokensBeforeLogout = user.tokens.length
				const theTokenId = await authentication.logout(user, tokenId)
	
				const numOfTokensAfterLogout = numOfTokensBeforeLogout - 1
				assert(user.tokens.length === (numOfTokensAfterLogout))
			}
		})
	})
})