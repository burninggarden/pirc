var
	extend     = req('/lib/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');

class InvalidCallbackError extends BaseError {

	getBody() {
		return 'You must specify a valid callback';
	}

}

extend(InvalidCallbackError.prototype, {
	code: ErrorCodes.INVALID_CALLBACK
});

module.exports = InvalidCallbackError;
