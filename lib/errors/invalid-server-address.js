var
	extend     = req('/lib/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');

class InvalidServerAddressError extends BaseError { }

extend(InvalidServerAddressError.prototype, {
	code: ErrorCodes.INVALID_SERVER_ADDRESS
});

module.exports = InvalidServerAddressError;
