var
	extend     = require('../../utilities/extend'),
	BaseError  = require('./base'),
	ErrorCodes = require('../../constants/error-codes');

class InvalidServerPortError extends BaseError {
}

extend(InvalidServerPortError.prototype, {
	code: ErrorCodes.INVALID_SERVER_PORT,

	setMessage() {
		this.message = `
			Invalid server port: ${this.value}
		`;
	}

});

module.exports = InvalidServerPortError;
