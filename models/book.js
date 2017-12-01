const mongoose = require('mongoose')
const mongooseErrorHandler = require('mongoose-mongodb-errors')
const Schema = mongoose.Schema

bookSchema = new Schema({
	name: {
		type: String,
		required: 'book name is is needed'
	},
	price: {
		type: Number,
		required: 'price is required',
	},
	pictures: [{
		type: String,
		required: 'at least one picture is required'
	}],
	description: {
		type: String,
		required: 'the description is needed'
	},
	seller: {
		type: Schema.ObjectId,
		ref: 'user',
		required: 'the seller info is required'
	},
	courses: [{
		type: Schema.ObjectId,
		ref: 'resource'
	}]

})

module.exports = mongoose.model('book', bookSchema)