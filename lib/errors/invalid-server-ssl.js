var
	extend     = require('../../utilities/extend'),
	BaseError  = require('./base'),
	ErrorCodes = require('../../constants/error-codes');

class InvalidServerSSLError extends BaseError { }

extend(InvalidServerSSLError.prototype, {
	code: ErrorCodes.INVALID_SERVER_SSL
});

module.exports = InvalidServerSSLError;
