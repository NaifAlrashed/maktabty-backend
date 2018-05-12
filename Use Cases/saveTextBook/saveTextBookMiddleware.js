const saveTextBookBehavior = require('./saveTextBookInteractor')
const responseTypes = require('../../Entities/responseTypes')

exports.saveUniversityIfNotExist = async (req, res, next) => {
    let universityObj = await saveTextBookBehavior.saveUniversityIfNotExist(req.body.university)
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
    let courseObj = await saveTextBookBehavior.saveCourseIfNotExist(req.body.course, req.department)
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

exports.savePhotoPathToBook = async (req, res) => {

    console.log(req.headers.bookid)
    if(req.headers['bookid'] === undefined) {
        return res.status(400).json({ message: 'bookId is not provided' })
    }
    const result = await saveTextBookBehavior.saveImages(req.files, req.headers['bookid'])
    res.status(result.status).json(result.response())
}

const isResourceSavedOrRetrieved = (resource) => {
    return (resource.type === responseTypes.RESOURCE_CREATED || resource.type === responseTypes.RESOURCE_FOUND)
}