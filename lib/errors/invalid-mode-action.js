
var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');

class InvalidModeActionError extends BaseError {

	getBody() {
		return 'Invalid mode action: ' + this.value;
	}

}

extend(InvalidModeActionError.prototype, {
	code: ErrorCodes.INVALID_MODE_ACTION
});

module.exports = InvalidModeActionError;
