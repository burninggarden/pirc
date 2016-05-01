var
	extend     = require('../../utilities/extend'),
	BaseError  = require('./base'),
	ErrorCodes = require('../../constants/error-codes');

class InvalidServerNameError extends BaseError { }

extend(InvalidServerNameError.prototype, {
	code: ErrorCodes.INVALID_SERVER_NAME
});

module.exports = InvalidServerNameError;
