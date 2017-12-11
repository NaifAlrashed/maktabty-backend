const bookmark = require('../controllers/bookmark')
const Book = require('../models/book')

module.exports = {
	bookmark: async (req, res) => {
		const book = await Book.findById(req.body.bookId)
		const result = await bookmark(req.user, book)
		res.status(result.status).json(result.response())
	},

	getBookmarks: (req, res) => res.json({ bookmarks: req.user.bookmarks })
}