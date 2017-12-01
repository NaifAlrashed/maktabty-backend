const Book = require('../models/book')
const resourceFactory = require('./resourceFactory')
const responseType = require('./responseTypes')

module.exports = {
	book: async (searchTerm, page) => {
		limit = 10
		skip = (page * limit) - limit
		const regExpdSearchedTerm = new RegExp(searchTerm, 'i')
		const result = await Book
			.find({name: regExpdSearchedTerm})
			.skip(skip)
			.limit(limit)
		return resourceFactory(result, responseType.RESOURCE_FOUND, null)
	}
}