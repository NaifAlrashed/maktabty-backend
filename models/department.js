const mongoose = require('mongoose')
const mongooseErrorHandler = require('mongoose-mongodb-errors')
const Schema = mongoose.Schema

departmentSchema = Schema ({
	name: {
		type: String,
		required: 'department name is required'
	},
	courses: [{
		type: Schema.Types.ObjectId,
		ref: 'course'
	}],
	university: {
		type: Schema.Types.ObjectId,
		ref: 'university',
		required: 'university ID is required'
	}
})

departmentSchema.plugin(mongooseErrorHandler)

module.exports = mongoose.model('department', departmentSchema)