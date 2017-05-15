var
	extend     = require('../../utilities/extend'),
	BaseError  = require('./base'),
	ErrorCodes = require('../../constants/error-codes');

class InvalidServerPortError extends BaseError {

	getMessage() {
		return 'Invalid server port: ' + this.value;
	}

}

extend(InvalidServerPortError.prototype, {
	code: ErrorCodes.INVALID_SERVER_PORT,
});

module.exports = InvalidServerPortError;
