const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({
	courseNameAR: String,
	courseNameEN: String,
	courseCodeAR: String,
	courseCodeEN: String,
	department: {
		type: Schema.ObjectId,
		ref: 'department',
		required: 'a department is needed for the resource'
	},
	books: [{
		type: Schema.ObjectId,
		ref: 'book'
	}]
})

courseSchema.index({ department: 1, courseNameAR: 1, courseNameEN: 1, courseCodeEN: 1, courseCodeAR: 1}, { unique: true })

const Course = mongoose.model('resource', courseSchema)

module.exports = Course