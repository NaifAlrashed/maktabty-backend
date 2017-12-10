const saveTextBookBehavior = require('../controllers/saveTextBook')
const responseTypes = require('../controllers/responseTypes')

exports.saveUniverityIfNotExist = async (req, res, next) => {
    let universityObj = await saveTextBookBehavior.saveUniverityIfNotExist(req.body.university)
    if (isResourceSavedOrRetrieved(universityObj)) {
        req.university = universityObj.resource
        return next()
    } else {
        return res.status(universityObj.status).json(universityObj.response())
    }
}

exports.saveDepartmentIfNotExist = async (req, res, next) => {
    let departmentObj = await saveTextBookBehavior.saveDepartmentIfNotExist(req.body.department, req.university)
    if (isResourceSavedOrRetrieved(departmentObj)) {
        req.department = departmentObj.resource
        return next()
    } else {
        return res.status(departmentObj.status).json(departmentObj.response())
    }
}

exports.saveCourseIfNotExist = async (req, res, next) => {
    let courseObj = await saveTextBookBehavior.saveCourseIfNotExist(req.body.resource, req.department)
    if (isResourceSavedOrRetrieved(courseObj)) {
        req.course = courseObj.resource
        return next()
    } else {
        return res.status(courseObj.status).json(courseObj.response())
    }
}

exports.saveBook = async (req, res) => {
    const bookObj = await saveTextBookBehavior.saveBook(req.body.book, req.user, req.course)
    res.status(bookObj.status).json(bookObj.response())
}

const isResourceSavedOrRetrieved = (resource) => {
    return (resource.type === responseTypes.RESOURCE_CREATED || resource.type === responseTypes.RESOURCE_FOUND)
}