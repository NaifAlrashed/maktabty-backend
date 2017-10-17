const mongoose = require('mongoose')
const mongooseErrorHandler = require('mongoose-mongodb-errors')
const Schema = mongoose.Schema

departmentSchema = Schema ({
	name: {
		type: String,
		required: true
	},
	courses: [{
		type: Schema.Types.ObjectId,
		ref: 'user'
	}],
	university: {
		type: Schema.ObjectId,
		ref: 'university',
		required: true
	}
})

departmentSchema.plugin(mongooseErrorHandler)

module.exports = mongoose.model('department', departmentSchema)