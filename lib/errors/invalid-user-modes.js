
var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');

class InvalidUserModesError extends BaseError { }

extend(InvalidUserModesError.prototype, {
	code: ErrorCodes.INVALID_USER_MODES
});

module.exports = InvalidUserModesError;
