const Book = require('../models/book')

module.exports = {
	bookSearch: async (searchTerm) => {
		const regExpdSearchedTerm = new RegExp(searchTerm, 'i')
		const result = await Book.find({name: regExpdSearchedTerm})
		return result
	}
}