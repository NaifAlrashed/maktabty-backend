const mongoose = require('mongoose')
const mongooseErrorHandler = require('mongoose-mongodb-errors')

const Schema = mongoose.Schema

const universitySchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: 'the university name is needed'
	},
	departments: [{
		type: Schema.ObjectId,
		ref: 'department'
	}]
})

universitySchema.plugin(mongooseErrorHandler)

module.exports = mongoose.model('university', universitySchema)