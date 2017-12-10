const resourceTypes = require('./responseTypes')
const mongooseErrors = require('./mongooseErrors')

class ResourceCreated {	
	constructor(resource) {
		this.resource = resource
		this.type = resourceTypes.RESOURCE_CREATED
		this.status = 201
	}

	response() {
		return this.resource
	}
}

class ResourceFound {
	constructor(resource) {
		this.resource = resource
		this.type = resourceTypes.RESOURCE_FOUND
		this.status = 200
	}

	response() {
		return this.resource
	}
}

class ValidationError {
	constructor(resource, err) {
		this.resource = resource
		this.type = resourceTypes.VALIDATION_ERROR
		this.status = 400
		this.err = err
	}

	response() {
		const errorMessage = mongooseErrors.retrieveValidationErrorMessage(this.err)
		return { error_message: errorMessage }
	}
}

class DuplicationError {
	constructor(resource, err) {
		this.resource = resource
		this.type = resourceTypes.DUPLICATION_ERROR
		this.status = 400
		this.err = err
		this.customMessage = ""
	}

	response() {
		console.log(this.err)
		//TODO: create a better validation message
		if (this.customMessage === "") {
			return { error_message: 'duplication' }
		} else {
			return { error_message: customMessage }
		}
		
	}
}

class SignupSuccess {
	constructor(token) {
		this.type = resourceTypes.SIGNUP_SUCCESS
		this.status = 201
		this.token = token
	}

	response() {
		return { token: this.token }
	}
}

module.exports = (resource, type, err) => {
	switch (type) {
		case resourceTypes.DUPLICATION_ERROR:
			return new DuplicationError(resource, err)
		case resourceTypes.VALIDATION_ERROR:
			return new ValidationError(resource, err)
		case resourceTypes.RESOURCE_CREATED:
			return new ResourceCreated(resource)
		case resourceTypes.RESOURCE_FOUND:
			return new ResourceFound(resource)
		case resourceTypes.SIGNUP_SUCCESS:
			return new SignupSuccess(resource)
		default:
			throw new Error("type not supported")
	}
}