var
	extend     = require('../../utilities/extend'),
	BaseError  = require('./base'),
	ErrorCodes = require('../../constants/error-codes');

class InvalidParameterError extends BaseError { }

extend(InvalidParameterError.prototype, {
	code: ErrorCodes.INVALID_PARAMETER
});

module.exports = InvalidParameterError;
