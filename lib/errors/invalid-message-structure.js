var req = require('req');

var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class InvalidMessageStructureError extends BaseError {

	setMessage() {
		this.message = 'Invalid message structure: ' + this.value;
	}

}

extend(InvalidMessageStructureError.prototype, {
	code: ErrorCodes.INVALID_MESSAGE_STRUCTURE,
	reason: false
});

module.exports = InvalidMessageStructureError;
