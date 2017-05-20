var
	extend     = require('/lib/utilities/extend'),
	BaseError  = require('/lib/errors/base'),
	ErrorCodes = require('/lib/constants/error-codes');

class InvalidCallbackError extends BaseError {

	getBody() {
		return 'You must specify a valid callback';
	}

}

extend(InvalidCallbackError.prototype, {
	code: ErrorCodes.INVALID_CALLBACK
});

module.exports = InvalidCallbackError;
