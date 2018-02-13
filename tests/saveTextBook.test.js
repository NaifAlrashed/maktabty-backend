process.env.NODE_ENV = 'test'
require('../config/config')
const chai = require('chai')
var assert = chai.assert
const chaiThings = require('chai-things')
const mongoose = require('mongoose')
const body = require('./saveTextBookStub.json')
const saveTextBook = require('../controllers/saveTextBook')
const University = require('../models/university')
const Department = require('../models/department')
const Course = require('../models/course')
const User = require('../models/user')
const someUser = require('./userStub.json')
const Book = require('../models/book')
const responseTyps = require('../controllers/responseTypes')
chai.should()
chai.use(chaiThings)

mongoose.connect(process.env.MONGO_URI, { promiseLibrary: global.Promise })

describe('save text book', () => {
	describe('university operations', () => {

		beforeEach(async () => {
			await University.remove({})
		})

		describe('saveUniversityIfNotExist(university)', () => {			

			it('should save university', async () => {
		    	const result = await saveTextBook.saveUniversityIfNotExist(body.university)
		    	assert(result.resource && (result.type === responseTyps.RESOURCE_CREATED))
			})

			it('should not retrieve university from db, and not save', async () => {			
				const firstUniversity = await saveTextBook.saveUniversityIfNotExist(body.university)
				const result = await saveTextBook.saveUniversityIfNotExist(body.university)

				assert(result.resource && (result.type === responseTyps.RESOURCE_FOUND), "expected to find a university and an error of null")
				assert(firstUniversity.resource._id.equals(result.resource._id), "did not retrieve university from db")

			})

			it('should not save university because of missing attributes', async () => {			
				const result = await saveTextBook.saveUniversityIfNotExist(body)
				assert(result.type === responseTyps.VALIDATION_ERROR && result.err)
			})

		})

		describe('getUniversityByName(universityName)', () => {

			it('should find university', async () => {
				const university = await saveTextBook.saveUniversityIfNotExist(body.university)
				const newUniversity = await saveTextBook.getUniversityByName(body.university.name)
				assert(newUniversity)
			})

			it('should not find university', async () => {
				const university = await saveTextBook.getUniversityByName(body.university.name)
				assert(!university)
			})
		})
		
	})

	describe('department operations', () => {
		
		let university;

		before(async () => {
			const universityy = await saveTextBook.saveUniversityIfNotExist(body.university)
			university = universityy.resource
		})

		beforeEach(async () => {
			await Department.remove({})
		})

		describe('saveDepartmentIfNotExist(department, university)', () => {
			it('should save department and its reference in university', async () => {
				const result = await saveTextBook.saveDepartmentIfNotExist(body.department, university)
				assert(result.resource.university.equals(university._id), 'there is no university reference in department')
				assert(university.departments.should.include(result.resource._id), 'department is not in saved in university')
			})

			it('should retrieve department from db', async () => {
				const result = await saveTextBook.saveDepartmentIfNotExist(body.department, university)
				const departmentObj = await saveTextBook.saveDepartmentIfNotExist(body.department, university)
				assert(result.resource._id.equals(departmentObj.resource._id))
			})

			it('should not save university because of missing attributes', async () => {
				const obj = await saveTextBook.saveUniversityIfNotExist(body)				
				assert(obj.type === responseTyps.VALIDATION_ERROR && obj.err)
			})
		})

		describe('getDepartmentbyName(departmentName, university)', () => {
			it('should find department', async () => {
				await saveTextBook.saveDepartmentIfNotExist(body.department, university)
				const department = await saveTextBook.getDepartmentbyName(body.department.name, university._id)
				assert(department)
			})

			it('should not find department', async () => {
				const department = await saveTextBook.getDepartmentbyName(body.department.name, university._id)
				assert(!department)
			})
		})
	})

	describe('course operations', () => {
		let department;
		before(async () => {
			const university = await University.findOne()
			const someDepartment = await saveTextBook.saveDepartmentIfNotExist(body.department, university)
			department = someDepartment.resource
		})

		beforeEach(async () => {
			await Course.remove()

		})

		describe('saveCourseIfNotExist(course, department)', () => {
			it('should save course', async () => {
				const result = await saveTextBook.saveCourseIfNotExist(body.course, department)
				assert(result.resource && result.type === responseTyps.RESOURCE_CREATED)
			})

			it('should not save course to db, and query it instead', async () => {
				const savedCourseResult = await saveTextBook.saveCourseIfNotExist(body.course, department)
				const retrievedCourseResult = await saveTextBook.saveCourseIfNotExist(body.course, department)

				assert(savedCourseResult.resource._id.equals(retrievedCourseResult.resource._id), 'the course is not retrieved from db')
			})
		})

		describe('getCourse(course, department)', () => {
			it('should find course', async () => {
				await saveTextBook.saveCourseIfNotExist(body.course, department)
				const course = await saveTextBook.getCourse(body.course, department._id)
				assert(course)
			})

			it('should not find course', async () => {
				const course = await saveTextBook.getCourse(body.course, department._id)
				assert(!course)
			})
		})
	})

	describe('book operations', () => {
		let user, course
		before(async () => {
			const university = await University.findOne({})
			const departmentObj = await saveTextBook.saveDepartmentIfNotExist(body.department, university)
			const courseObj = await saveTextBook.saveCourseIfNotExist(body.course, departmentObj.resource)
			course = courseObj.resource
			
			user = new User(someUser)
			await user.save()
		})

		describe('saveBook(book)', () => {
			it('should save book', async () => {
				const result = await saveTextBook.saveBook(body.book, user, course)
				//book and resource relationship checking
				assert(result.resource.courses.should.include(course._id), 'book doesnt include the resource')
				assert(course.books.should.include(result.resource._id), 'resource doesnt include the book')

				//book & user relationship checking
				assert(result.resource.seller == user._id, "book seller id (in book obj) doesn't match the user id")
				assert(user.books.should.include(result.resource._id), 'user doesnt include the book')
			})
		})
	})

	describe('image operations', () => {
		let book
		before(async () => {
			const university = await University.findOne({})
			const departmentObj = await saveTextBook.saveDepartmentIfNotExist(body.department, university)
			const courseObj = await saveTextBook.saveCourseIfNotExist(body.course, departmentObj.resource)
			const user = await User.findOne({ email: 'naif@gmail.com' })
			
			const bookObj = await saveTextBook.saveBook(body.book, user, courseObj.resource)
			book = bookObj.resource
		})

		it('should save image link to book', async () => {
			const images = [{ filename: 'image1' }, { filename: 'image2' }, { filename: 'image3' }]

			const result = await saveTextBook.saveImages(images, book._id)
			console.log(result)
		})

		after(async () => {
			await User.remove()
			await University.remove()
			await Department.remove()
			await Course.remove()
			await Book.remove()
		})
	})
})
