const Book = require('../../models/book')
const resourceFactory = require('../../Entities/resourceFactory')
const responseType = require('../../Entities/responseTypes')

module.exports = {
	book: async (searchTerm, page) => {
		limit = 10
		skip = (page * limit) - limit
		const regExpdSearchedTerm = new RegExp(searchTerm, 'i')
		const result = await Book
			.find({name: regExpdSearchedTerm})
			.skip(skip)
			.limit(limit)
		const structuredResults = { books: result }
		return resourceFactory(structuredResults, responseType.RESOURCE_FOUND, null)
	}
}