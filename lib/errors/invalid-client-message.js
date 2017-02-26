var req = require('req');

var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class InvalidClientMessageError extends BaseError {

	setMessage() {
		this.message = 'Invalid client message: ' + this.value;
	}

}

extend(InvalidClientMessageError.prototype, {
	code: ErrorCodes.INVALID_CLIENT_MESSAGE
});

module.exports = InvalidClientMessageError;
