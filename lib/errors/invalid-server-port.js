var
	extend     = require('../../utilities/extend'),
	BaseError  = require('./base'),
	ErrorCodes = require('../../constants/error-codes');

class InvalidServerPortError extends BaseError { }

extend(InvalidServerPortError.prototype, {
	code: ErrorCodes.INVALID_SERVER_PORT
});

module.exports = InvalidServerPortError;
