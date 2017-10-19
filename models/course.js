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
		required: 'a department is needed for the course'
	},
	books: [{
		type: Schema.ObjectId,
		ref: 'book'
	}]
})

const Course = mongoose.model('course', courseSchema)

module.exports = Course