var req = require('req');

var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class NoServerConnectionError extends BaseError { }

extend(NoServerConnectionError.prototype, {
	code: ErrorCodes.NO_SERVER_CONNECTION
});

module.exports = NoServerConnectionError;
