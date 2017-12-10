const chai = require('chai')
const assert = chai.assert
const chaiThings = require('chai-things')
const search = require('../controllers/search')
const books = require('./booksStub.json').books
const Book = require('../models/book')
const saveTextBook = require('../controllers/saveTextBook')
const body = require('./saveTextBookStub.json')
const User = require('../models/user')
const Department = require('../models/department')
const University = require('../models/university')
const Course = require('../models/course')
const someUser = require('./userStub.json')
const mongoose = require('mongoose')
const objectId = mongoose.Types.ObjectId()
chai.should()
chai.use(chaiThings)

mongoose.connect(process.env.MONGO_URI, { useMongoClient: true, promiseLibrary: global.Promise })
mongoose.Promise = global.Promise

describe('search', () => {
	describe('bookSearch(searchTerm)', () => {
		before( async () => {
			let user, course
			const obj = await saveTextBook.saveUniversityIfNotExist(body.university)			
			const university = obj.resource
			const departmentObj = await saveTextBook.saveDepartmentIfNotExist(body.department, university)
			const courseObj = await saveTextBook.saveCourseIfNotExist(body.course, departmentObj.resource)
			course = courseObj.resource
			
			user = new User(someUser)
			await user.save()

			for (i = 0; i < books.length; i++) {
				const book = books[i]
				newBook = new Book({
					name: book.name,
		            price: book.price,
		            pictures: book.pictures,
		            description: book.description,
		            seller: user._id,
				})
				newBook.courses.push(course._id)
				await newBook.save()
			}
		})

		it('should have three results, all of which include introduction as the name of the book', async () => {
			const result = await search.book('introduction', 1)
			const resource = result.resource
			assert(resource.length === 3)
			assert(resource[0].name.match(/introduction/i))
			assert(resource[1].name.match(/introduction/i))
			assert(resource[2].name.match(/introduction/i))
		})

		it('should have 10 in first page & 2 in second page', async () => {
			const firstResult = await search.book('design', 1)
			const secondResult = await search.book('design', 2)

			assert(firstResult.resource.length === 10)
			assert(secondResult.resource.length === 1)
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