const chai = require('chai')
const assert = chai.assert
const chaiThings = require('chai-things')
const search = require('../Use Cases/Search/search')
const books = require('./booksStub.json').books
const Book = require('../models/book')
const saveTextBook = require('../Use Cases/saveTextBook/saveTextBookInteractor')
const body = require('./saveTextBookStub.json')
const User = require('../models/user')
const Department = require('../models/department')
const University = require('../models/university')
const Course = require('../models/course')
const someUser = require('./userStub.json')
const mongoose = require('mongoose')
const bookmark = require('../Use Cases/Bookmark/bookmark')
const responseType = require('../Entities/responseTypes')
const objectId = mongoose.Types.ObjectId()
chai.should()
chai.use(chaiThings)

mongoose.connect(process.env.MONGO_URI, { promiseLibrary: global.Promise })

describe('bookmark', () => {
	var owner, normalUser
	describe('bookmark(user, bookId)', () => {
		before( async () => {
			let user, course
			const obj = await saveTextBook.saveUniversityIfNotExist(body.university)
			const university = obj.resource
			const departmentObj = await saveTextBook.saveDepartmentIfNotExist(body.department, university)
			const courseObj = await saveTextBook.saveCourseIfNotExist(body.course, departmentObj.resource)
			course = courseObj.resource
			
			user = new User(someUser)
			user.bookmarks.push(objectId)
			await user.save()
			owner = user

			normalUser = new User(someUser)
			normalUser.email = "dhisjadjs@kdjks.com"
			await normalUser.save()

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
				user.books.push(newBook._id)
				await user.save()
			}			
		})

		beforeEach(async () => {
			normalUser.bookmarks = []
			normalUser.books = []
			await normalUser.save()
		})

		it('should bookmark 3 books', async () => {
			const books = await Book.find()
			
			const result0 = await bookmark(normalUser, books[0])
			assert(normalUser.bookmarks.should.include(books[0]._id))
			await bookmark(normalUser, books[1])
			assert(normalUser.bookmarks.should.include(books[1]._id))
			await bookmark(normalUser, books[2])
			assert(normalUser.bookmarks.should.include(books[2]._id))

			assert(normalUser.bookmarks.length === 3)
		})

		it('should not bookmark the same book more than once', async () => {			
			const books = await Book.find()

			await bookmark(normalUser, books[0])
			result = await bookmark(normalUser, books[0])
			assert(result.resource.bookmarks.length === 1)
		})

		it('should not bookmark a book that the user owns', async () => {
			const numberOfBookMarksBeforeBookmarkOperation = owner.bookmarks.length
			const books = await Book.find()
			const result = await bookmark(owner, books[0])

			assert(result.type === responseType.DUPLICATION_ERROR 
				&& result.resource.bookmarks.length === numberOfBookMarksBeforeBookmarkOperation)

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