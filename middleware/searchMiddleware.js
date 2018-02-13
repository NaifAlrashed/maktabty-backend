const responseTypes = require('../controllers/responseTypes')
const search = require('../controllers/search')

exports.book = async (req, res) => {
    const result = await search.book(req.params.bookName, req.params.pageNumber)

    res.status(result.status).json(result.response())
}