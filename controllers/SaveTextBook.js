//Description: this file handles the event of posting a book.
//the flow was designed through the following way: saveIfNotExistUniversity -> saveIfNotExistDepartment -> saveIfNotExistCourse -> saveBook

const University = require('../models/university')
const Department = require('../models/department')
const Book = require('../models/book')
const Course = require('../models/course')

module.exports = {

    getUniversityByName: async (universityName) => await University.findOne({name: universityName}),

    saveUniversityIfNotExist: async (someUniversity) => {
        try {
            var university = new University({name: someUniversity.name})    
            await university.save()
            return {
                university,
                errorCode: null
            }
        } catch (err) {
            if (err.name === 'MongoError' && err.code === 11000) { //for duplicate
                const universitySearched = await module.exports.getUniversityByName(someUniversity.name)
                return {
                    university: universitySearched,
                    errorCode: null
                }
            } else if (err.name === 'ValidationError') {
                return {
                    university: null,
                    errorCode: err.errors[Object.keys(err.errors)[0]].message
                }
            }
            throw err
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
        try {
            await newDepartment.save()
            university.departments.push(newDepartment._id)
            await university.save()
            return {
                department: newDepartment,
                errorCode: null
            }
        } catch(err) {
            if (err.name === 'MongoError' && err.code === 11000) { //for duplicate
                const departmentSearched = await module.exports.getDepartmentbyName(department.name, university._id)
                return {
                    department: departmentSearched,
                    errorCode: null
                }
            } else if (err.name === 'ValidationError') {
                return {
                    department: null,
                    errorCode: err.errors[Object.keys(err.errors)[0]].message
                }
            }
            throw err
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

        try {
            await newCourse.save()
            department.courses.push(newCourse._id)
            await department.save()
            return {
                course: newCourse,
                errorCode: null
            }
        } catch(err) {
            if (err.name === 'MongoError' && err.code === 11000) { //for duplicate
                const courseSearched = await module.exports.getCourse(course, department._id)
                return {
                    course: courseSearched,
                    errorCode: null
                }
            } else if (err.name === 'ValidationError') {
                return {
                    course: null,
                    errorCode: err.errors[Object.keys(err.errors)[0]].message
                }
            }
            throw err
        }

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
        await newBook.save()

        seller.books.push(newBook._id)
        await seller.save()

        course.books.push(newBook._id)
        await course.save()

        return newBook
    }
}