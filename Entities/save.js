const mongooseErrors = require('./mongooseErrors')
const resourceFactory = require('./resourceFactory')
const responseTypes = require('./responseTypes')

module.exports = async (resource) => {
	try {
		await resource.save()
		return resourceFactory(resource, responseTypes.RESOURCE_CREATED, null)
	} catch (err) {
		if (mongooseErrors.isValidationError(err)) {
			return resourceFactory(resource, responseTypes.VALIDATION_ERROR, err)
		} else if (mongooseErrors.isduplicationError(err)) {
			return resourceFactory(resource, responseTypes.DUPLICATION_ERROR, err)
		} else {
			throw err
		}
	}
}