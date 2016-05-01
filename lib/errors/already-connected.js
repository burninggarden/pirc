var
	extend     = require('../../utilities/extend'),
	BaseError  = require('./base'),
	ErrorCodes = require('../../constants/error-codes');

class AlreadyConnectedError extends BaseError { }

extend(AlreadyConnectedError.prototype, {
	code: ErrorCodes.ALREADY_CONNECTED
});

module.exports = AlreadyConnectedError;
