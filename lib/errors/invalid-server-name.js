var
	extend     = require('../../utilities/extend'),
	BaseError  = require('./base'),
	ErrorCodes = require('../../constants/error-codes');

class InvalidServerNameError extends BaseError {

	getBody() {
		return 'Invalid server name: ' + this.value;
	}

}

extend(InvalidServerNameError.prototype, {
	code: ErrorCodes.INVALID_SERVER_NAME
});

module.exports = InvalidServerNameError;
