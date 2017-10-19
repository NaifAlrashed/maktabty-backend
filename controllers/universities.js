const University = require('../models/university')


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
    }
}