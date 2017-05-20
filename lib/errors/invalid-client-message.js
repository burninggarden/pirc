
var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');

class InvalidClientMessageError extends BaseError {

	getBody() {
		return 'Invalid client message: ' + this.value;
	}

}

extend(InvalidClientMessageError.prototype, {
	code: ErrorCodes.INVALID_CLIENT_MESSAGE
});

module.exports = InvalidClientMessageError;
