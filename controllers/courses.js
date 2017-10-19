const Course = require('../models/course')

module.exports = {
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
    }
}