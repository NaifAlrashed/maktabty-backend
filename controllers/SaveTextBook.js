//Description: this file handles the event of posting a book.
//the flow was designed through the following way: saveUniversity -> saveDepartment -> saveCourse -> saveBook

const University = require('../models/university')
const Department = require('../models/department')
const Book = require('../models/book')

module.exports = {

    saveUniversity: async (req, res, next) => {
        try {
            const university = await University.findOne({ name: req.body.university.name})
            if (university) {
                req.univerdity = university
                return next()
            }
        } catch(err) {
            res.status(500).json({
                humanMessage: "couldn't load university",
                message: err.message
            })
        }
        var university = new University()
        university.name = req.body.university.name
        req.university = university
        next()
    },

    saveDepartment: async (req, res, next) => {
        try {
            const department = await Department.findOne({name: req.body.department.name})

            if (department && department.university === req.university._id) {
                req.department = department
                return next()
            }

        } catch (err) {
            res.status(500).json({message: err.message})
        }

        try {
            var department = new Department()
            department.name = req.body.department.name
            department.university = req.university._id
            req.university.departments.push(department._id)
            await req.university.save()
            req.department = department
        } catch (err) {
            res.status(500).json({
                humanMessage: "couldn't save university",
                message: err.message
            })
        }

    },

    saveCourse: async (req, res, next) => {
        try {
            const course = await Course.findOne({courseCodeEN: req.body.course.courseCodeEN})

            if (course && course.department === req.department._id) {
                req.course = course
                return next()
            }
        } catch (err) {
            return res.status(500).json({
                humanMessage: "couldn't load courses",
                message: err.message
            })
        }

        try {
            var course = new Course()
            course.courseCodeAR = req.body.course.courseCodeAR
            course.courseCodeEN = req.body.course.courseCodeEN
            course.courseNameAR = req.body.course.courseNameAR
            course.courseNameEN = req.body.course.courseNameEN
            req.department.courses.push(course._id)
            course.department = req.department._id
            await req.department.save()
            await course.save()
            req.course = course
            return next()
        } catch {
            return res.status(500).json({
                humanMessage: "couldn't save either course or department",
                message: err.message
            })
        }
    },

    saveBook: async (req, res) => {
        try {
            var book = new Book()
            book.name = req.body.book.name
            book.price = req.body.book.price
            book.pictures.push(req.body.book.picture)
            book.description = req.body.book.description
            book.contactInfo = req.body.book.contactInfo
            book.seller = req.body.userId
            //TODO: add user id to the book (i don't know how the userid will look like in the request yet)
            book.courses.push(req.course._id)
            req.course.books.push(book._id)
            await req.course.save()
            await book.save()
            res.json(book)
        } catch (err) {
            res.json({err: err.message})
        }
    }
}