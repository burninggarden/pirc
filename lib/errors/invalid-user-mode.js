
var req = require('req');

var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class InvalidUserModeError extends BaseError { }

extend(InvalidUserModeError.prototype, {
	code: ErrorCodes.INVALID_USER_MODE
});

module.exports = InvalidUserModeError;
