const Department = require('../models/department')

module.exports = {
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
    getDepartment: async (req, res) => {
        try {
            let department = await Department.findById(req.params.idd).populate('courses')
            res.json(department.courses)
        } catch (err) {
            res.status(500).json({err: err.message})
        }
    }
}