var
	extend     = require('../../utilities/extend'),
	BaseError  = require('./base'),
	ErrorCodes = require('../../constants/error-codes');

class InvalidCallbackError extends BaseError { }

extend(InvalidCallbackError.prototype, {
	code: ErrorCodes.INVALID_CALLBACK
});

module.exports = InvalidCallbackError;
