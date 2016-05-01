var req = require('req');

var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class InvalidClientMessageError extends BaseError { }

extend(InvalidClientMessageError.prototype, {
	code: ErrorCodes.INVALID_CLIENT_MESSAGE
});

module.exports = InvalidClientMessageError;
