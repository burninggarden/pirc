var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');

class InvalidServerSSLError extends BaseError { }

extend(InvalidServerSSLError.prototype, {
	code: ErrorCodes.INVALID_SERVER_SSL
});

module.exports = InvalidServerSSLError;
