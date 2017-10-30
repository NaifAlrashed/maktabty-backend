//Description: this file handles the event of posting a book.
//the flow was designed through the following way: saveUniversity -> saveDepartment -> saveCourse -> saveBook

const University = require('../models/university')
const Department = require('../models/department')
const Book = require('../models/book')
const Course = require('../models/course')

module.exports = {

    doesUniversityExist: async (university) => await University.findOne({name: university.name}),

    saveUniversity: async (university) => {        
        try {
            var university = new University({name: university.name})    
            await university.save()
            return university
        } catch (err) {
            return null
        }
    },

    doesDepartmentExist: async (department, universityId) =>
        await Department.findOne({
            name: department.name,
            university: universityId
        }),

    saveDepartment: async (department, universityId) => {
        var newDepartment = new Department({
            name: department.name,
            university: universityId
        })
        await newDepartment.save()
        return newDepartment
    },

    doesCourseExist: async (course, departmentId) =>
        await Course.findOne({
            courseCodeAR: course.courseCodeAR,
            courseCodeEN: course.courseCodeEN,
            courseNameAR: course.courseNameAR,
            courseNameEN: course.courseNameEN,
            department: departmentId
        }),

    saveCourse: async (course, departmentId) => {
        const newCourse = new Course({
            courseCodeAR: course.courseCodeAR,
            courseCodeEN: course.courseCodeEN,
            courseNameAR: course.courseNameAR,
            courseNameEN: course.courseNameEN,
            department: departmentId
        })
        await newCourse.save()
        return newCourse
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