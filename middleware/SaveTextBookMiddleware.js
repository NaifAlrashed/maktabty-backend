const saveTextBookBehavior = require('../controllers/saveTextBook')

module.exports = {
    saveUniverityIfNotExist: async (req, res, next) => {
        let university = await saveTextBookBehavior.doesUniversityExist(req.body.university)
        if (!university) {
            university = await saveTextBookBehavior.saveUniversity(req.body.university)
        }
        req.universityId = university._id
        next()
    },

    saveDepartmentIfNotExist: async (req, res, next) => {
        let department = await saveTextBookBehavior.doesDepartmentExist(req.body.department, req.universityId)
        if (!department) {
            department = await saveTextBookBehavior.saveDepartment(req.body.department, req.universityId)
        }
        req.departmentId = department._id
        return next()
    },

    saveCourseIfNotExist: async (req, res, next) => {
        let course = await saveTextBookBehavior.doesCourseExist(req.body.resource, req.departmentId)
        if (!course) {
            course = await saveTextBookBehavior.saveCourse(req.body.resource, req.departmentId)
        }
        req.courseId = course._id
        next()
    },

    saveBook: async (req, res) => {
        const book = await saveTextBookBehavior.saveBook(req.body.book, req.user._id, req.courseId)
        res.status(201)
    }
}