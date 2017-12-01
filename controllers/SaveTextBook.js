//Description: this file handles the event of posting a book.
//the flow was designed through the following way: saveIfNotExistUniversity -> saveIfNotExistDepartment -> saveIfNotExistCourse -> saveBook

const University = require('../models/university')
const Department = require('../models/department')
const Book = require('../models/book')
const Course = require('../models/course')
const types = require('./responseTypes')
const save = require('./save')
const resourceFactory = require('./resourceFactory')
var MONGO_DUPLICATION_ERROR = 11000
module.exports = {

    getUniversityByName: async (universityName) => await University.findOne({name: universityName}),

    saveUniversityIfNotExist: async (someUniversity) => {
        var university = new University({name: someUniversity.name})
        const result = await save(university)

        if (result.type === types.DUPLICATION_ERROR) {
            const universitySearched = await module.exports.getUniversityByName(someUniversity.name)
            return resourceFactory(universitySearched, types.RESOURCE_FOUND, null)
        } else {
            return result
        }
    },

    getDepartmentbyName: async (departmentName, universityId) =>
        await Department.findOne({
            name: departmentName,
            university: universityId
        }),

    saveDepartmentIfNotExist: async (department, university) => {
        var newDepartment = new Department({
            name: department.name,
            university: university._id
        })
        const departmentResult = await save(newDepartment)

        if(departmentResult.type === types.DUPLICATION_ERROR) {
            const departmentSearched = await module.exports.getDepartmentbyName(department.name, university._id)
            return resourceFactory(departmentSearched, types.RESOURCE_FOUND, null)
        } else {
            university.departments.push(newDepartment._id)
            await save(university)
            return departmentResult
        }
    },

    getCourse: async (course, departmentId) =>
        await Course.findOne({
            courseCodeAR: course.courseCodeAR,
            courseCodeEN: course.courseCodeEN,
            courseNameAR: course.courseNameAR,
            courseNameEN: course.courseNameEN,
            department: departmentId
        }),

    saveCourseIfNotExist: async (course, department) => {
        const newCourse = new Course({
            courseCodeAR: course.courseCodeAR,
            courseCodeEN: course.courseCodeEN,
            courseNameAR: course.courseNameAR,
            courseNameEN: course.courseNameEN,
            department: department._id
        })

        courseResult = await save(newCourse)
        if (courseResult.type === types.DUPLICATION_ERROR) {
            const courseSearched = await module.exports.getCourse(newCourse, department._id)
            return resourceFactory(courseSearched, types.RESOURCE_FOUND, null)
        } else if (courseResult.type === types.VALIDATION_ERROR) {
            return courseResult
        }
        department.courses.push(newCourse._id)
        departmentResult = await save(department)

        return courseResult
    },

    saveBook: async (book, seller, course) => {
        const newBook = new Book ({
            name: book.name,
            price: book.price,
            pictures: book.pictures,
            description: book.description,
            seller: seller._id,
        })
        newBook.courses.push(course._id)
        bookPromise = save(newBook)

        seller.books.push(newBook._id)
        sellerPromise = save(seller)

        course.books.push(newBook._id)
        coursePromise = save(course)

        const [bookResult, SellerResult, courseResult] = await Promise.all([bookPromise, sellerPromise, coursePromise])
        return bookResult
    }
}