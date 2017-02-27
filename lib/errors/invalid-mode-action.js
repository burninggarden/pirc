var req = require('req');

var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class InvalidModeActionError extends BaseError {

	setMessage() {
		this.message = 'Invalid mode action: ' + this.value;
	}

}

extend(InvalidModeActionError.prototype, {
	code: ErrorCodes.INVALID_MODE_ACTION
});

module.exports = InvalidModeActionError;
