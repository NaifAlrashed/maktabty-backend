const Department = require('../models/department')

module.exports = {
    saveDepartment: async (req, res) => {
        var department = new Department()
        department.name = req.body.name
        department.courses.push(req.body.course)
        department.university = req.body.university
        try {
            await department.save()
            req.departmentId = department._id
        } catch (err) {
            res.status(500).json({message: err.message})
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