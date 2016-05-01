var
	extend     = require('../../utilities/extend'),
	BaseError  = require('./base'),
	ErrorCodes = require('../../constants/error-codes');

class NoServerError extends BaseError { }

extend(NoServerError.prototype, {
	code: ErrorCodes.NO_SERVER
});

module.exports = NoServerError;
