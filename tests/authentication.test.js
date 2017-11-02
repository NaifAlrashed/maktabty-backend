process.env.NODE_ENV = 'test'
require('../config/config')
const chai = require('chai')
var assert = chai.assert
const chaiThings = require('chai-things')
const mongoose = require('mongoose')
const someUser = require('./userStub.json')
const authentication = require('../controllers/authentication')
const User = require('../models/user')

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
			const obj = await authentication.signup(someUser, 'auth')
			assert(!obj.isDuplicate, "the user is duplicate")
			assert(obj.user, "user is null")
			assert(obj.user.tokens[0], "token is not created")
		})

		it('should not return an authenticated user', async () => {
			await authentication.signup(someUser, 'auth')
			const obj = await authentication.signup(someUser, 'auth')
			assert(obj.isDuplicate)
		})
	})
})