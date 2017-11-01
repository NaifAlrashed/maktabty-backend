const mongoose = require('mongoose')
const mongooseErrorHandler = require('mongoose-mongodb-errors')

const Schema = mongoose.Schema

const universitySchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: '1'//'the university name is needed'
	},
	departments: [{
		type: Schema.ObjectId,
		ref: 'department'
	}]
})

module.exports = mongoose.model('university', universitySchema)