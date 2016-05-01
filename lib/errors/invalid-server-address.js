var
	extend     = require('../../utilities/extend'),
	BaseError  = require('./base'),
	ErrorCodes = require('../../constants/error-codes');

class InvalidServerAddressError extends BaseError { }

extend(InvalidServerAddressError.prototype, {
	code: ErrorCodes.INVALID_SERVER_ADDRESS
});

module.exports = InvalidServerAddressError;
