const responseTypes = require('../../Entities/responseTypes')
const search = require('./search')

exports.book = async (req, res) => {
    const result = await search.book(req.params.bookName, req.params.pageNumber)

    res.status(result.status).json(result.response())
}