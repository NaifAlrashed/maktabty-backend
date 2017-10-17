const University = require('../models/university')


module.exports = {
    saveUniversity: async (req, res, next) => {
        var university = new University()
        university.name = req.body.name
        university.departments.push(req.body.department)
        try {
            await university.save()
            req.universityId = university._id
            next()
        } catch (err) {
            res.status(500).json({message: err.message})
        }
    }
}