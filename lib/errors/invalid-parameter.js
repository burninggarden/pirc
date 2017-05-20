var
	extend     = req('/lib/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');

class InvalidParameterError extends BaseError { }

extend(InvalidParameterError.prototype, {
	code: ErrorCodes.INVALID_PARAMETER
});

module.exports = InvalidParameterError;
