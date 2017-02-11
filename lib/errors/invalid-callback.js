var
	extend     = require('../../utilities/extend'),
	BaseError  = require('./base'),
	ErrorCodes = require('../../constants/error-codes');

class InvalidCallbackError extends BaseError {
	setMessage() {
		this.message = 'You must specify a valid callback';
	}
}

extend(InvalidCallbackError.prototype, {
	code: ErrorCodes.INVALID_CALLBACK
});

module.exports = InvalidCallbackError;
