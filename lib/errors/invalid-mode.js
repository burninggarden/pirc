
var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');


class InvalidModeError extends BaseError {

	getBody() {
		return 'Invalid mode: ' + this.value;
	}

}

extend(InvalidModeError.prototype, {
	code: ErrorCodes.INVALID_MODE
});

module.exports = InvalidModeError;
