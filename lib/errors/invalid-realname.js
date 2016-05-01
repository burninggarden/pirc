var req = require('req');

var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class InvalidRealnameError extends BaseError { }

extend(InvalidRealnameError.prototype, {
	code: ErrorCodes.INVALID_REALNAME
});

module.exports = InvalidRealnameError;
