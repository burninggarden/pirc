var req = require('req');

var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class InvalidUsernameError extends BaseError { }

extend(InvalidUsernameError.prototype, {
	code: ErrorCodes.INVALID_USERNAME
});

module.exports = InvalidUsernameError;
