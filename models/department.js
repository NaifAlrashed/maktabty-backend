const mongoose = require('mongoose')
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

departmentSchema.index({name: 1, university: 1}, { unique: true })

module.exports = mongoose.model('department', departmentSchema)