var req = require('req');

var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class InvalidModeChangeError extends BaseError {

	setMessage() {
		this.message = 'Invalid mode change: ' + this.value;
	}

}

extend(InvalidModeChangeError.prototype, {
	code: ErrorCodes.INVALID_MODE_CHANGE
});

module.exports = InvalidModeChangeError;
