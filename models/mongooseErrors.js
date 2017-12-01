var MONGO_DUPLICATION_ERROR = 11000
var MONG_ERROR = 'MongoError'

let publicMethods = {}

publicMethods.isValidationError = (err) => {
	return (err.name === 'ValidationError') ? true : false
}

publicMethods.isduplicationError = (err) => {
	return (err.name === MONG_ERROR && err.code === MONGO_DUPLICATION_ERROR) ? true : false
}

publicMethods.retrieveValidationErrorMessage = (err) => {
	if(publicMethods.isValidationError(err)) {
		return err.errors[Object.keys(err.errors)[0]].message
	}
}

module.exports = publicMethods