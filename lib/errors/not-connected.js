var
	extend     = require('../../utilities/extend'),
	BaseError  = require('./base'),
	ErrorCodes = require('../../constants/error-codes');

class NotConnectedError extends BaseError { }

extend(NotConnectedError.prototype, {
	code: ErrorCodes.NOT_CONNECTED
});

module.exports = NotConnectedError;
