const User = require('../models/user')
const save = require('./save')
const resourceFactory = require('./resourceFactory')
const responseType = require('./responseTypes')

module.exports = async (user, book) => {
	let result
	if (doesBookmarkExist(user, book._id)) {
		result = resourceFactory(user, responseType.DUPLICATION_ERROR, null)
		result.customMessage = "you already bookmarked this book"
	} else if (isUserSeller(user, book)) {
		result = resourceFactory(user, responseType.DUPLICATION_ERROR, null)
		result.customMessage = "you cannot bookmark your books"
	} else {
		user.bookmarks.push(book._id)
		result = await save(user)
	}
	return result
}

//cannot make bookmark (in the user collection) unique in the database and validate
//whether the bookmark exist from the save
//operation because it throws a duplication exception if any two users exist with empty bookmarks
//so this is the best solution for now
const doesBookmarkExist = (user, bookId) => {
	for (i = 0; i < user.bookmarks.length; i++) {
		if (user.bookmarks[i].equals(bookId))
			return true
	}
	return false
}

const isUserSeller = (user, book) => {
	return user._id.equals(book.seller)
}