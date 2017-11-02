process.env.NODE_ENV = 'test'
require('../config/config')
const chai = require('chai')
var assert = chai.assert
const chaiThings = require('chai-things')
const mongoose = require('mongoose')
const body = require('./saveTextBookStub.json')
const saveTextBook = require('../controllers/SaveTextBook')
const University = require('../models/university')
const Department = require('../models/department')
const Course = require('../models/course')
const User = require('../models/user')
const someUser = require('./userStub.json')
const Book = require('../models/book')
chai.should()
chai.use(chaiThings)

mongoose.connect(process.env.MONGO_URI, { useMongoClient: true, promiseLibrary: global.Promise })
mongoose.Promise = global.Promise

describe('save text book', () => {
	describe('university operations', () => {

		beforeEach(async () => {
			await University.remove({})
		})

		describe('saveUniversityIfNotExist(university)', () => {			

			it('should save university', async () => {
		    	const obj = await saveTextBook.saveUniversityIfNotExist(body.university)
		    	assert(obj.university && !obj.errorCode)
			})

			it('should not retrieve university from db, and not save', async () => {			
				const firstUniversity = await saveTextBook.saveUniversityIfNotExist(body.university)
				const obj = await saveTextBook.saveUniversityIfNotExist(body.university)

				assert(obj.university && !obj.errorCode, "expected to find a university and an error of null")
				assert(firstUniversity.university._id.equals(obj.university._id), "did not retrieve university from db")

			})

			it('should not save university because of missing attributes', async () => {			
				const obj = await saveTextBook.saveUniversityIfNotExist(body)
				assert(obj.errorCode == 1 && !obj.university)
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
			university = universityy.university
		})

		beforeEach(async () => {
			await Department.remove({})
		})

		describe('saveDepartmentIfNotExist(department, university)', () => {
			it('should save department and its reference in university', async () => {
				const obj = await saveTextBook.saveDepartmentIfNotExist(body.department, university)
				assert(obj.department.university.equals(university._id), 'there is no university reference in department')
				assert(university.departments.should.include(obj.department._id), 'department is not in saved in university')
			})

			it('should retrieve department from db', async () => {
				const obj = await saveTextBook.saveDepartmentIfNotExist(body.department, university)
				const departmentObj = await saveTextBook.saveDepartmentIfNotExist(body.department, university)
				assert(obj.department._id.equals(departmentObj.department._id))
			})

			it('should not save university because of missing attributes', async () => {
				const obj = await saveTextBook.saveUniversityIfNotExist(body)				
				assert(obj.errorCode == 1 && !obj.university)
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
			const university = await University.findOne({})
			const someDepartment = await saveTextBook.saveDepartmentIfNotExist(body.department, university)
			department = someDepartment.department
		})

		beforeEach(async () => {
			await Course.remove({})
		})

		describe('saveCourseIfNotExist(course, department)', () => {
			it('should save course', async () => {
				const course = await saveTextBook.saveCourseIfNotExist(body.course, department)
				assert(course.course && !course.errCode)
			})

			it('should not save course to db, and query it instead', async () => {
				const savedCourse = await saveTextBook.saveCourseIfNotExist(body.course, department)
				const retrievedCourse = await saveTextBook.saveCourseIfNotExist(body.course, department)
				assert(savedCourse.course._id.equals(retrievedCourse.course._id), 'the course is not retrieved from db')
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
			const courseObj = await saveTextBook.saveCourseIfNotExist(body.course, departmentObj.department)
			course = courseObj.course
			
			user = new User(someUser)
			await user.save()
		})

		describe('saveBook(book)', () => {
			it('should save book', async () => {
				const book = await saveTextBook.saveBook(body.book, user, course)
				//book and course relationship checking
				assert(book.courses.should.include(course._id), 'book doesnt include the course')
				assert(course.books.should.include(book._id), 'course doesnt include the book')

				//book & user relationship checking
				assert(book.seller == user._id, "book seller id (in book obj) doesn't match the user id")
				assert(user.books.should.include(book._id), 'user doesnt include the book')
			})
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
