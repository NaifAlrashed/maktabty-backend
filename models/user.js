const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const crypto = require('crypto')

const Schema = mongoose.Schema

userSchema = new Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minLength: 1,
		unique: true,
		validator: [validator.isEmail, 'invalid email address'],
		message: '{VALUE} is not an email'
	},
	password: {
		type: String,
		required: 'password with minimum length of 6 characters is needed',
		minLength: 6
	},
    contactInfo: {
        type: String,
        required: 'contact info is needed'
    },
	tokens: [{
		access: {
			type: String,
			required: true
		},
		tokenId: {
			type: String,
			required: true
		}
		//TODO: create iat & exp fields in token obj
	}],
	books: [{
		type: Schema.Types.ObjectId,
		ref: 'book'
	}],
	bookmarks: [{
		type: Schema.Types.ObjectId,
		ref: 'book'
	}],
	isVerified: {
		type: Boolean,
		default: false
	},
	verificationCode: {
		type: Number,
		min: 1000,
		max: 9999
	}
})

userSchema.methods.findTokenIndex = function (tokenId) {
    for (var i = 0; i < this.tokens.length; i++) {
	    if (this.tokens[i].tokenId == tokenId) {
	        return i
	    }
	}
	return -1
}

userSchema.methods.generateAndSaveAuthTokenWithAccess = async function (access) {
	if (access == 'signup') {
		this.generateVerificationCode()
	}
	const tokenId = (new mongoose.Types.ObjectId()).toString()
	var token = jwt.sign({
		sub: this._id,
		access,
        iat: Date.now(),
		exp: new Date().setDate(new Date().getDate() + 1),
		tokenId
	}, process.env.JWT_SECRET).toString()
	this.tokens.push({access, tokenId})
	await this.save()
	return token
}

userSchema.methods.generateVerificationCode = function () {
	this.verificationCode = Math.floor(Math.random() * (9999 - 1001) + 1001)
}

userSchema.methods.generateSaveAndReturnUserPassword = async function () {
	const passwordLength = 10
	this.password = crypto.randomBytes(Math.ceil(passwordLength / 2))
		.toString('hex')
		.slice(0, passwordLength)
	const password = this.password
	await this.save()
	return password
}

userSchema.pre('save', async function(next) {
	if (!this.isModified('password')) {
		return next()
	}

	const salt = await bcryptjs.genSaltSync(10)
	this.password = await bcryptjs.hashSync(this.password, salt)
	next()
})

const User = mongoose.model('user', userSchema)

module.exports = User