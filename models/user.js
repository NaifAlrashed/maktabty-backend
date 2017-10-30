const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')

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
		required: true,
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
		token: {
			type: String,
			required: true
		}
		//TODO: create iat & exp fields in token obj
	}],
	books: [{
		type: Schema.Types.ObjectId,
		ref: 'book'
	}]
})

userSchema.methods.generateAndSaveAuthTokenWithAccess = async function (access) {
	var token = jwt.sign({
		sub: this._id,
		access,
        iat: Date.now(),
        exp: new Date().setDate(new Date().getDate() + 1)
	}, process.env.JWT_SECRET).toString()
	console.log('token', token)
	this.tokens.push({access, token})
	await this.save()
	return token
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